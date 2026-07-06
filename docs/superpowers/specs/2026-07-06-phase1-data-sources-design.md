# เฟส 1: ขยายแหล่งข้อมูล + คุณภาพการค้น (Data Sources & Quality)

**โปรเจกต์:** Research AI Team (`app.html`)
**วันที่:** 2026-07-06
**ผู้พัฒนา:** Apiwit Prakat
**ขอบเขต:** เฟส 1 จาก 4 เฟส (ดู "แผนภาพรวม" ท้ายเอกสาร)

---

## 1. เป้าหมายและบริบท

เว็บปัจจุบันเป็น **static HTML ไฟล์เดียว** (`app.html`, ~947 บรรทัด) ไม่มี backend
รันในเบราว์เซอร์ล้วน ใช้ public API และ `localStorage` deploy บน GitHub Pages

ผู้ใช้หลัก: **นักศึกษา (ป.ตรี/โท/เอก) + นักวิจัย สายแพทย์/ชีวการแพทย์**
ทำ literature review / งานวิจัย

จุดอ่อนที่เฟสนี้แก้: ปัจจุบันค้นจากแหล่งเดียว (Europe PMC) ทำให้บางเปเปอร์
ตกหล่น, ยอดอ้างอิงไม่แม่น, บางชิ้นไม่มีบทคัดย่อ, และหาไฟล์อ่านฟรีได้จำกัด

**เป้าหมายเฟส 1:**
1. เพิ่ม **OpenAlex** เป็นแหล่งข้อมูลที่สอง (ฟรี ไม่ต้อง API key)
2. **ค้นด้วยรหัสตรง** (DOI / PMID) — วางรหัสแล้วดึงเปเปอร์นั้นทันที
3. **รวม + กันซ้ำข้ามแหล่ง** ให้เหลือระเบียนสมบูรณ์สุดต่อเปเปอร์
4. เพิ่มลิงก์ **PDF อ่านฟรี** จาก `best_oa_location` ของ OpenAlex
5. คงฟีเจอร์เดิมทั้งหมด (คัดกรอง/PRISMA/สกัด/สังเคราะห์/แปล/export) ให้ทำงานต่อได้

**ข้อจำกัดบังคับ:** ทุกอย่างต้องทำฝั่ง client ได้โดยไม่มี backend, ไม่ต้องใช้ API key
หรืออีเมล, และไม่พังฟีเจอร์เดิม

---

## 2. สถาปัตยกรรม — Source Adapter Pattern

### ปัญหาปัจจุบัน
`searchEuropePMC(query, limit, oaOnly, sortMode, minYear)` (บรรทัด ~429) ผูกติดกับ
Europe PMC โดยตรง และ `run()` เรียกมันตรงๆ ในขั้น Scout (บรรทัด ~766) — เพิ่มแหล่งใหม่
ไม่ได้โดยไม่แก้หลายที่

### ดีไซน์
แยกเป็น 3 ชั้น:

1. **ชั้น Adapter** — ฟังก์ชันต่อแหล่ง แต่ละตัวรับ `(query, opts)` แล้วคืน
   `Promise<Paper[]>` ที่ normalize เป็นรูปแบบมาตรฐานเดียวกัน
   - `adapterEuropePMC(query, opts)` — ปรับจาก `searchEuropePMC` เดิม
   - `adapterOpenAlex(query, opts)` — ใหม่
   - แต่ละ adapter **จับ error ในตัว** และคืน `[]` เมื่อล้ม (ไม่ throw ออกมา)

2. **ชั้น Orchestrator** — `gatherPapers(query, opts)`
   - ตรวจว่า query เป็นรหัสตรง (DOI/PMID) หรือไม่ (ดูข้อ 4)
   - เรียก adapter ตามแหล่งที่ผู้ใช้เลือก (ดูข้อ 6) แบบ `Promise.allSettled`
   - รวมผล → ส่งเข้า merge & dedup (ดูข้อ 5)
   - คืน `{ papers, sourceStats, errors }` โดย `sourceStats` = จำนวนที่ได้จากแต่ละแหล่ง,
     `errors` = รายชื่อแหล่งที่ล้ม

3. **ชั้น Pipeline** — `run()` เรียก `gatherPapers()` แทน `searchEuropePMC()`
   ที่ขั้น Scout ส่วนที่เหลือของ pipeline (Validator/Analyst/Checker/Writer/Translator)
   ไม่เปลี่ยน logic หลัก

### รูปแบบ Paper object มาตรฐาน (คงของเดิม + เพิ่มฟิลด์)
ของเดิมมีอยู่แล้ว (บรรทัด ~452): `id, source, pmid, pmcid, doi, title, authors,
journal, year, cc, oa, abstract, pubTypes, isPreprint, isRetracted, isReview,
pdfUrl, meta, tldr, _rank`

**ฟิลด์ที่เพิ่ม:**
- `sources: string[]` — แหล่งที่พบเปเปอร์นี้ เช่น `["EuropePMC","OpenAlex"]`
  (หลัง merge อาจมีหลายค่า)
- `oaPdfUrl: string` — ลิงก์ PDF ฟรีจาก OpenAlex `best_oa_location` (ถ้ามี)

> หมายเหตุ: ฟิลด์ `source` เดิม (เอกพจน์) ใช้ตรวจ preprint (`source==="PPR"`)
> ต้องคงไว้ไม่แตะ ส่วน `sources` (พหูพจน์) เป็นฟิลด์ใหม่สำหรับ badge/merge

---

## 3. OpenAlex Adapter

**Endpoint ค้นหา:**
`https://api.openalex.org/works?search=<query>&per_page=<n>&filter=...`
- CORS: รองรับ (เรียกจากเบราว์เซอร์ได้)
- ควรใส่ `mailto` ใน query param เพื่อเข้า "polite pool" ของ OpenAlex
  (ไม่บังคับ ไม่ใช่ API key) — ใช้ค่าคงที่ในโค้ดได้ เช่น `mailto=research-ai-team`
  **ไม่ต้องใช้อีเมลจริงของผู้ใช้**

**การ map ฟิลด์ OpenAlex → Paper มาตรฐาน:**
| Paper field | OpenAlex source |
|-------------|-----------------|
| `doi` | `work.doi` (ตัด prefix `https://doi.org/`) |
| `pmid` | `work.ids.pmid` (ตัด prefix URL เหลือเลข) |
| `title` | `work.title` หรือ `work.display_name` |
| `authors` | join `authorships[].author.display_name` |
| `journal` | `work.primary_location.source.display_name` |
| `year` | `work.publication_year` |
| `cc` | `work.cited_by_count` |
| `oa` | `work.open_access.is_oa` |
| `abstract` | ประกอบจาก `work.abstract_inverted_index` (ดูล่าง) |
| `isPreprint` | `work.type === "preprint"` |
| `isReview` | `work.type === "review"` |
| `isRetracted` | `work.is_retracted === true` |
| `oaPdfUrl` | `work.best_oa_location.pdf_url` (ถ้ามี) |

**ประกอบ abstract จาก inverted index:**
OpenAlex เก็บ abstract เป็น `{ "word": [pos1, pos2], ... }` ต้องมีฟังก์ชัน
`abstractFromInverted(idx)` ที่:
1. หาความยาวสูงสุดของ position
2. วางแต่ละคำลงตำแหน่งของมัน
3. join ด้วยช่องว่าง
ถ้า `idx` เป็น null/undefined → คืน `""`

**การกรองสาย biomed:** เนื่องจากผู้ใช้เน้นสายแพทย์ อาจใส่ filter
`filter=concepts.id:...` ระดับ Medicine/Biology **เป็นตัวเลือกเสริมเท่านั้น** —
ค่าเริ่มต้นไม่กรอง เพื่อไม่ตัดผลมากเกิน (YAGNI: ไม่ทำ concept filter ในเฟสนี้
เว้นแต่ทดสอบแล้วผลนอกสายเยอะจนรบกวน)

---

## 4. ค้นด้วยรหัสตรง (DOI / PMID)

**ตรวจจับใน Orchestrator ก่อนค้นปกติ:**
- **DOI:** regex `/^(https?:\/\/(dx\.)?doi\.org\/)?10\.\d{4,9}\/\S+$/i`
  → ดึงส่วน `10.x/...`
- **PMID:** regex `/^\d{6,9}$/` (ตัวเลขล้วน 6–9 หลัก)

**ถ้าตรงรูปแบบรหัส:**
- ข้ามการค้นแบบ keyword — เรียก lookup ตรง:
  - DOI → OpenAlex `https://api.openalex.org/works/doi:<doi>` **และ**
    Europe PMC `query=DOI:"<doi>"`
  - PMID → OpenAlex `https://api.openalex.org/works/pmid:<pmid>` **และ**
    Europe PMC `query=EXT_ID:<pmid> AND SRC:MED`
- ผลจาก lookup เข้าสู่ merge & dedup ตามปกติ (จะได้ระเบียนเดียวที่รวมข้อมูลสองแหล่ง)
- แสดงข้อความใน scout sub ว่า "ค้นด้วยรหัส: <doi/pmid>"

**Edge case:** ถ้า lookup ไม่เจอ → แจ้ง error ที่เข้าใจง่าย
("ไม่พบเปเปอร์จากรหัสนี้ — ตรวจรหัสอีกครั้ง หรือลองค้นด้วยคำ")

---

## 5. Merge & Dedup Engine

แทนที่ dedup แบบง่ายเดิมใน `run()` (บรรทัด ~774:
`const k=(p.doi||p.title).toLowerCase()`) ด้วยฟังก์ชัน `mergeDedup(papers)`:

**คีย์จับคู่ (ตามลำดับความน่าเชื่อถือ):**
1. DOI (normalize: lowercase, ตัด prefix URL)
2. PMID
3. ชื่อเรื่อง normalize (lowercase, ตัดอักขระไม่ใช่ตัวอักษร/เลข, ตัดช่องว่างซ้ำ)

**อัลกอริทึม:**
- วนทีละเปเปอร์ หา "กลุ่มซ้ำ" ด้วยคีย์ข้างต้น (คีย์ใดคีย์หนึ่งตรงถือว่าซ้ำ)
- เมื่อเจอซ้ำ **รวมเป็นระเบียนเดียว** โดยเลือกค่าที่ดีที่สุดต่อฟิลด์:
  - `abstract` → เลือกอันที่ยาวกว่า (ข้อมูลมากกว่า)
  - `cc` → เลือกค่าสูงสุด
  - `doi/pmid/pmcid/pdfUrl/oaPdfUrl` → เติมจากอันที่มีค่า (ไม่ทับค่าที่มีด้วยค่าว่าง)
  - `oa` → OR (แหล่งใดบอกว่า OA ถือว่า OA)
  - `sources` → รวม unique
  - `meta` → คำนวณใหม่จาก title+abstract ที่ merge แล้ว (เรียก `extractMeta`)
- คงเงื่อนไขเดิม: ทิ้งระเบียนที่ไม่มีทั้ง pmid และ doi (บรรทัด ~775 เดิม
  `return (p.pmid||p.doi)`)

**ตำแหน่งแก้:** logic นี้ย้ายมาอยู่ในชั้น Orchestrator (หลังรวมผลทุกแหล่ง)
ส่วน `run()` ขั้น Validator ยังรายงานตัวเลข `retrieved / afterDedup / afterFilter`
เหมือนเดิม แต่ `afterDedup` มาจาก `mergeDedup` ตัวใหม่

---

## 6. การเปลี่ยน UI (คงสไตล์เดิมทั้งหมด)

**a) ตัวเลือกแหล่งข้อมูล** — เพิ่มใน `.opts` row (ใกล้บรรทัด ~190):
```html
<label>แหล่งข้อมูล:
  <select id="sources">
    <option value="both">ทั้งสอง (แนะนำ)</option>
    <option value="epmc">Europe PMC</option>
    <option value="openalex">OpenAlex</option>
  </select>
</label>
```

**b) Badge แหล่งที่มาต่อแถว** — ในคอลัมน์ชื่อเรื่องของ `renderTable()`
(ใกล้บรรทัด ~599) เพิ่ม chip เล็กบอก `p.sources` เช่น `EuropePMC` / `OpenAlex`
ใช้สไตล์คล้าย `.mchip` เดิม (เพิ่ม class `.schip`)

**c) ลิงก์ PDF ฟรี** — ในคอลัมน์ลิงก์ (บรรทัด ~567) ถ้ามี `p.oaPdfUrl`
เพิ่มลิงก์ `PDF-OA↗` (นอกเหนือจาก `pdfUrl` เดิม); ถ้าซ้ำกับ `pdfUrl` ให้แสดงอันเดียว

**d) Search log บันทึกแหล่ง** — จุดที่ hardcode "Europe PMC" ต้องปรับให้สะท้อน
แหล่งจริงที่ใช้:
- `renderSearchLog()` (บรรทัด ~675): `<b>ฐานข้อมูล:</b> ...`
- `SEARCH_LOG` object (บรรทัด ~788): เพิ่มฟิลด์ `sources`
- `exportPrisma()` (บรรทัด ~914, ~925): `Database` + ประโยค Methods
- `$("#scoutSub")` (บรรทัด ~809): "จาก Europe PMC" → สะท้อนแหล่งที่เลือก

**e) footer** (บรรทัด ~282): เพิ่ม OpenAlex ในเครดิตแหล่งข้อมูล

---

## 7. Error Handling & Graceful Degradation

- แต่ละ adapter จับ error เอง คืน `[]` — แหล่งหนึ่งล่ม อีกแหล่งยังทำงาน
- `gatherPapers` รวม `errors[]` ของแหล่งที่ล้ม
- ถ้า **ทุกแหล่งคืน 0 ผล** → throw error เดิม ("ไม่พบเปเปอร์...")
- ถ้า **บางแหล่งล่มแต่ยังมีผล** → แสดงผลปกติ + เตือนเบาๆ ใน scout sub
  ("⚠️ OpenAlex ไม่ตอบ ใช้ผลจาก Europe PMC")
- คง `try/catch` รอบ pipeline เดิมใน `run()`

---

## 8. แผนการทดสอบ (Manual, ในเบราว์เซอร์)

ทดสอบด้วย preview (dev server) แล้วดูผลจริง:

1. **ค้น keyword ปกติ + "ทั้งสอง"** → ได้ผลจากทั้งสองแหล่ง, ไม่มีแถวซ้ำ,
   badge แสดงถูก
2. **เลือก "Europe PMC" อย่างเดียว** → ผลเหมือนพฤติกรรมเดิมก่อนเปลี่ยน (regression)
3. **เลือก "OpenAlex" อย่างเดียว** → ได้ผลจาก OpenAlex, abstract ประกอบถูกต้อง
   (อ่านรู้เรื่อง)
4. **วาง DOI ตรง** (เช่น `10.1038/nature12373`) → ดึงเปเปอร์นั้นชิ้นเดียว
5. **วาง PMID ตรง** (เช่น `23851394`) → ดึงเปเปอร์นั้นชิ้นเดียว
6. **เปเปอร์ซ้ำข้ามแหล่ง** → ยุบเหลือใบเดียว, `cc` = ค่าสูงสุด, abstract = อันยาวกว่า,
   `sources` มีสองค่า
7. **ผลว่าง** (query มั่ว) → error message เข้าใจง่าย ไม่ค้าง
8. **จำลอง API ล่ม** (เช่น block openalex.org ใน devtools) → ยังได้ผลจากอีกแหล่ง +
   เตือน
9. **Regression ฟีเจอร์เดิม:** คัดกรอง/PRISMA/export CSV·BibTeX·RIS·MD/แปลไทย
   ยังทำงานครบ, PRISMA search log สะท้อนแหล่งที่ใช้

**เกณฑ์ผ่าน:** ทั้ง 9 ข้อทำงานตามคาด และไม่มี error ใน console

---

## 9. สิ่งที่ *ไม่* ทำในเฟสนี้ (YAGNI / ไว้เฟสหลัง)

- ❌ Unpaywall (ตัดออกตามที่ตกลง — ได้ OA PDF จาก OpenAlex พออยู่แล้ว)
- ❌ PubMed E-utilities แยก (ซ้ำ Europe PMC)
- ❌ arXiv (นอกสายแพทย์ + มีปัญหา CORS)
- ❌ Crossref (ซ้ำ OpenAlex เป็นส่วนใหญ่)
- ❌ Concept/field filter ของ OpenAlex (ทำเมื่อจำเป็นจริง)
- ❌ บันทึกโปรเจกต์/library (เป็นเฟส 2)
- ❌ reference list APA/Vancouver, literature matrix (เป็นเฟส 3)
- ❌ citation graph / timeline / theme map (เป็นเฟส 4)

---

## แผนภาพรวม 4 เฟส (อ้างอิง)

| เฟส | กลุ่มฟีเจอร์ | สถานะ |
|-----|------------|-------|
| **1** | แหล่งข้อมูล + คุณภาพ (OpenAlex, ค้นด้วยรหัส, กันซ้ำ, OA PDF) | **← เอกสารนี้** |
| 2 | จัดการ/บันทึกงาน (save โปรเจกต์, library, โน้ต, แท็ก) | ภายหลัง |
| 3 | ช่วยเขียน/อ้างอิง (APA/Vancouver, literature matrix, ร่างโครง) | ภายหลัง |
| 4 | วิเคราะห์เชิงลึก/เห็นภาพ (citation graph, timeline, theme map) | ภายหลัง |

แต่ละเฟสมี spec → plan → implement เป็นรอบของตัวเอง
