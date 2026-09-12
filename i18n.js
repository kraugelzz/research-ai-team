/* ============================================================
   i18n.js — ปุ่มสลับภาษา ไทย / English (ใช้ร่วมกัน app / office / guide)
   Thai ⇄ English switcher shared by app.html, office.html, guide.html

   วิธีใช้ในหน้า HTML:
     <script src="i18n.js"></script>      ← ใส่ใน <head> (ไม่ต้อง defer)
     <p data-i18n="key">…</p>             → textContent
     <p data-i18n-html="key">…</p>        → innerHTML (ข้อความที่มีแท็ก)
     <input data-i18n-ph="key">           → placeholder
     <span data-i18n-title="key">         → title (tooltip)
     <svg data-i18n-aria="key">           → aria-label
   ใน JS: t("key", {n:5}) → คืนสตริงตามภาษาปัจจุบัน
   เมื่อผู้ใช้กดสลับภาษา จะยิง event "langchange" ที่ document
   ============================================================ */
(function () {
  "use strict";

  var STORE_KEY = "rai_lang";

  var DICT = {

    /* =====================================================
       ==================== ไทย (th) =======================
       ===================================================== */
    th: {
      "lang.aria": "สลับภาษา",
      "lang.th": "ไทย",
      "lang.en": "EN",

      /* ---------- เมนูร่วม ---------- */
      "nav.app": "🔬 หน้าใช้งาน",
      "nav.team": "👥 แนะนำทีม",
      "nav.teamLong": "👥 หน้าตัวละคร (แนะนำทีม)",
      "nav.guide": "📖 คู่มือใช้งาน",

      /* ============== app.html : ส่วนหัว ============== */
      "app.docTitle": "ทีมวิจัย AI — เวอร์ชันทำงานจริง",
      "app.h1": "🔬 ทีมวิจัย AI — เวอร์ชันทำงานจริง",
      "app.leadHtml": "พิมพ์คำถามวิจัย (ภาษาอังกฤษได้ผลดีสุด) หรือ<b>ลากไฟล์ .txt มาวาง</b> แล้วกด Run — เอเจนต์ทั้ง 6 จะทำงานต่อกันเป็นสายพาน ดึงเปเปอร์จริงจาก Europe PMC + Semantic Scholar พร้อมลิงก์และอ้างอิงจริง แล้ว<b>แปลเป็นไทย + สรุปคร่าวๆ ว่าแต่ละเปเปอร์ทำอะไร</b> ไม่มีการกุข้อมูล",

      /* ============== app.html : คอนโซลค้นหา ============== */
      "app.qPh": "เช่น: EGFR knockdown effects on MAPK signaling in triple-negative breast cancer",
      "app.runBtn": "▶ Run ทีม",
      "app.sortBy": "เรียงตาม:",
      "app.sort.smart": "✨ อัจฉริยะ (ตรงคีย์เวิร์ด + ปีล่าสุด) — แนะนำ",
      "app.sort.relevance": "🎯 ความเกี่ยวข้องล้วน",
      "app.sort.newest": "🆕 ใหม่สุดก่อน",
      "app.sort.cited": "⭐ อ้างอิงมากสุด",
      "app.sortShort.smart": "อัจฉริยะ",
      "app.sortShort.relevance": "ความเกี่ยวข้อง",
      "app.sortShort.newest": "ใหม่สุด",
      "app.sortShort.cited": "อ้างอิงมาก",
      "app.minYear": "ตั้งแต่ปี:",
      "app.minYearPh": "ทุกปี",
      "app.limit": "จำนวนเปเปอร์:",
      "app.oaOnly": "เฉพาะ Open Access",
      "app.s2": "เสริม TLDR",
      "app.thai": "🌐 แปลไทย",
      "app.qualityFilters": "ตัวกรองคุณภาพ:",
      "app.hideRet": "⛔ ซ่อนงานที่ถูกถอน (retracted)",
      "app.noReview": "📄 เฉพาะงานทดลองต้นฉบับ (ตัด review)",
      "app.noPre": "ตัด preprint ออก",
      "app.hint": "💡 ลากไฟล์ .txt (คำถามหรือรายการคีย์เวิร์ด) มาวางในกล่องด้านบนได้เลย · ข้อมูลทั้งหมดประมวลผลในเบราว์เซอร์ ไม่มีการส่งออกนอกจากเรียก API งานวิจัยสาธารณะ",

      /* ============== app.html : ออฟฟิศ / เอเจนต์ ============== */
      "app.stageTitle": "🏢 ทีมกำลังทำงานในออฟฟิศ",
      "app.agent.scout.nm": "สกาวต์",
      "app.agent.scout.role": "ค้นหา",
      "app.agent.validator.nm": "วาลิดา",
      "app.agent.validator.role": "ตรวจสอบ",
      "app.agent.analyst.nm": "แอนนา",
      "app.agent.analyst.role": "สกัดข้อมูล",
      "app.agent.checker.nm": "เชค",
      "app.agent.checker.role": "เช็กหลักฐาน",
      "app.agent.writer.nm": "ไรเตอร์",
      "app.agent.writer.role": "เขียนสรุป",
      "app.agent.translator.nm": "ทรานส์",
      "app.agent.translator.role": "แปลไทย",
      "app.stepNo": "ขั้นที่ {n}",

      /* สถานะของเอเจนต์ */
      "app.st.idle": "รอเริ่ม…",
      "app.st.stopped": "หยุด",
      "app.st.scout.run": "กำลังค้นหา…",
      "app.st.scout.done": "พบ {n} ชิ้น ({sort})",
      "app.st.validator.run": "ตรวจสอบ & กันซ้ำ…",
      "app.st.validator.done": "เหลือ {n} ชิ้น (กันซ้ำ+กรองแล้ว)",
      "app.st.analyst.run": "สกัดเป็นตาราง…",
      "app.st.analyst.done": "สร้างตาราง {n} แถว",
      "app.st.checker.run": "ตรวจหลักฐาน…",
      "app.st.checker.done": "จัดลำดับ ({sort}) · OA {pct}%",
      "app.st.writer.run": "สังเคราะห์สรุป…",
      "app.st.writer.done": "สรุปเสร็จ ✔",
      "app.st.translator.run": "แปลเป็นไทย…",
      "app.st.translator.prog": "แปลแล้ว {done}/{total} เปเปอร์",
      "app.st.translator.done": "แปลไทยครบ {total} เปเปอร์ ✔",
      "app.st.translator.off": "ปิดการแปล",

      /* ============== app.html : หัวข้อผลลัพธ์ ============== */
      "app.sec.scout.hHtml": "🔍 สกาวต์ + ✅ วาลิดา <span style=\"font-size:.8rem;color:var(--muted);font-weight:400\">— ค้นหา &amp; ตรวจสอบ</span>",
      "app.sec.log.h": "🧾 บันทึกการค้นหา (ทำซ้ำได้) + คัดกรอง PRISMA",
      "app.sec.log.sub": "คัดลอกไปใส่ Methods/Supplementary ได้ · สถานะคัดกรองถูกบันทึกในเครื่องอัตโนมัติ (localStorage)",
      "app.sec.analyst.hHtml": "📊 แอนนา <span style=\"font-size:.8rem;color:var(--muted);font-weight:400\">— ตารางสกัดข้อมูล (คลิกหัวคอลัมน์เพื่อเรียง)</span>",
      "app.sec.analyst.sub": "แต่ละแถว = เปเปอร์จริงหนึ่งชิ้น · 🧪 = ข้อมูลสกัด (cell line / วิธี / สิ่งมีชีวิต) · ✅ = คัดกรอง include/exclude/maybe",
      "app.sec.writer.hHtml": "✍️ ไรเตอร์ <span style=\"font-size:.8rem;color:var(--muted);font-weight:400\">— สังเคราะห์เชิงสกัด (ทุกประโยคมาจากบทคัดย่อจริง)</span>",
      "app.sec.writer.sub": "⚖️ เชค: เรียงตามจำนวนอ้างอิง + ธีมที่พบบ่อย — สรุปนี้ดึงประโยคจากบทคัดย่อจริงเท่านั้น จึงไม่มีการกุ ควรเปิดอ่านต้นฉบับก่อนอ้างอิงจริงเสมอ",

      /* ปุ่ม export */
      "app.btn.prisma": "⬇ PRISMA / search log",
      "app.btn.screenCsv": "⬇ ผลคัดกรอง (CSV)",
      "app.btn.clearScreen": "🗑 ล้างสถานะคัดกรองทั้งหมด",
      "app.btn.csv": "⬇ CSV (ตาราง)",
      "app.btn.bib": "⬇ BibTeX",
      "app.btn.ris": "⬇ RIS (EndNote/Zotero)",
      "app.btn.md": "⬇ Markdown (สรุป)",
      "app.btn.copyMd": "📋 คัดลอกสรุป",
      "app.btn.copied": "✓ คัดลอกแล้ว",

      /* หัวตาราง */
      "app.th.year": "ปี",
      "app.th.title": "ชื่อเรื่อง / วารสาร / ธง",
      "app.th.thai": "🌐 สรุปไทย",
      "app.th.extract": "🧪 สกัด",
      "app.th.screen": "✅ คัดกรอง",
      "app.th.cites": "อ้างอิง",
      "app.th.links": "ลิงก์",

      /* สถิติ */
      "app.stat.count": "จำนวนเปเปอร์",
      "app.stat.oa": "Open Access",
      "app.stat.years": "ช่วงปี",
      "app.stat.totalCites": "อ้างอิงรวม",
      "app.stat.maxCites": "อ้างอิงสูงสุด",

      /* ตาราง : เนื้อหาในเซลล์ */
      "app.tbl.noTitle": "(ไม่มีชื่อ)",
      "app.tbl.needThai": "— (เปิด \"แปลไทย\" แล้วกด Run)",
      "app.tbl.fullAbs": "🌐 บทคัดย่อไทยเต็ม",
      "app.tbl.fullAbsToggle": "🌐 ซ่อน/แสดงบทคัดย่อไทย",
      "app.tbl.translating": "กำลังแปล…",
      "app.tbl.absHeadHtml": "<b>บทคัดย่อ (ไทย):</b><br>",
      "app.tbl.noAbs": "(เปเปอร์นี้ไม่มีบทคัดย่อให้แปล)",
      "app.tbl.notePh": "เหตุผล/โน้ต…",
      "app.tbl.inc": "รับเข้า",
      "app.tbl.may": "รอพิจารณา",
      "app.tbl.exc": "ตัดออก",

      /* ธง */
      "app.flag.retTitle": "งานนี้ถูกถอน (retracted) — อย่าอ้างอิง",
      "app.flag.preTitle": "preprint ยังไม่ผ่าน peer review",
      "app.flag.revTitle": "เป็นบทความรีวิว ไม่ใช่งานทดลองต้นฉบับ",

      /* PRISMA */
      "app.prisma.inc": "✓ รับเข้า {n}",
      "app.prisma.may": "? รอพิจารณา {n}",
      "app.prisma.exc": "✗ ตัดออก {n}",
      "app.prisma.un": "ยังไม่คัด {n}",

      /* บันทึกการค้นหา */
      "app.log.query": "คำค้น (query ที่ส่งจริง):",
      "app.log.db": "ฐานข้อมูล:",
      "app.log.date": "วันที่ค้น:",
      "app.log.sort": "เรียงตาม:",
      "app.log.filters": "ตัวกรอง:",
      "app.log.hits": "ผลตรงทั้งหมดในฐาน (hitCount):",
      "app.log.retrieved": "ดึงมา:",
      "app.log.afterDedup": "หลังกันซ้ำ:",
      "app.log.afterFilter": "หลังกรอง:",
      "app.log.none": "—",
      "app.filter.hideRet": "ซ่อน retracted",
      "app.filter.noReview": "ตัด review",
      "app.filter.noPre": "ตัด preprint",
      "app.filter.oa": "เฉพาะ OA",
      "app.filter.minYear": "ตั้งแต่ปี {y}",

      /* สังเคราะห์ */
      "app.synth.headHtml": "<b>ข้อค้นพบสำคัญจากบทคัดย่อ (เรียงตามความเกี่ยวข้อง):</b>",
      "app.synth.empty": "ไม่พบประโยคที่ตรงเกณฑ์พอ — ลองปรับคำค้นให้เจาะจงขึ้น หรือดูตารางด้านบนโดยตรง",
      "app.synth.up": "⬆️ ทิศทาง \"เพิ่ม/ส่งเสริม\" ({n})",
      "app.synth.down": "⬇️ ทิศทาง \"ลด/ยับยั้ง\" ({n})",
      "app.synth.conflictNote": "⚠️ พบผลทั้งสองทิศทาง — อาจเป็นเพราะบริบทต่างกัน (cell line/วิธี) ควรอ่านต้นฉบับเทียบก่อนสรุป",
      "app.synth.themes": "🏷️ ธีม/คำที่พบบ่อยในชุดเปเปอร์นี้",
      "app.synth.themeItem": "พบใน {n} เปเปอร์",
      "app.scoutSub": "ค้นด้วย: “{q}” — จาก Europe PMC{s2}",
      "app.scoutSub.s2": " + Semantic Scholar (TLDR)",

      /* ข้อความแจ้งเตือน */
      "app.err.needQuery": "พิมพ์คำถามวิจัยก่อนนะครับ",
      "app.err.noPapers": "ไม่พบเปเปอร์ — ลองปรับคำค้น หรือลดปีกรอง/ปิด Open Access",
      "app.err.allFiltered": "ผลถูกกรองออกหมด — ลองปิดตัวกรองบางตัว",
      "app.err.generic": "เกิดข้อผิดพลาด",
      "app.err.epmc": "Europe PMC ตอบกลับ {code}",
      "app.err.translate": "⚠️ แปลไม่สำเร็จ (ต่ออินเทอร์เน็ตแล้วลองใหม่)",
      "app.alert.noRun": "ยังไม่มีข้อมูล — กด Run ก่อน",
      "app.confirm.clearScreen": "ล้างสถานะคัดกรองทั้งหมดที่บันทึกไว้? (ย้อนกลับไม่ได้)",

      /* export markdown */
      "app.md.summary": "สรุป",
      "app.md.topCited": "Top-cited papers (พร้อมสรุปไทย)",

      /* footer */
      "app.footerHtml": "ข้อมูลจริงจาก <a href=\"https://europepmc.org\" target=\"_blank\">Europe PMC</a> &amp; <a href=\"https://www.semanticscholar.org\" target=\"_blank\">Semantic Scholar</a> · เครื่องมือนี้ช่วย<b>ค้นและจัดระเบียบ</b> — การตัดสินทางวิทยาศาสตร์ยังต้องเปิดอ่านต้นฉบับเอง<br>\n    <span style=\"display:inline-block;margin-top:10px;font-size:.92rem;color:var(--ink)\">พัฒนาโดย <b>Apiwit Prakat</b> · Research AI Team © 2026</span>",

      /* ============== office.html ============== */
      "office.docTitle": "ทีมวิจัย AI — The Research Office",
      "office.eyebrow": "The Research Office",
      "office.h1": "👩‍🔬 ทีม AI นักวิจัยของคุณ",
      "office.subHtml": "เครื่องมือ AI แต่ละตัวคือ \"พนักงานออฟฟิส\" ที่มีหน้าที่ต่างกัน — ทำงานส่งต่อกันเป็นสายพานงานวิจัย ตั้งแต่ค้นหา → ตรวจสอบ → สกัดข้อมูล → เช็กหลักฐาน → เขียนสรุป <br>คลิกที่ตัวละครแต่ละคนเพื่อดูรายละเอียดเครื่องมือจริง",
      "office.pipeline.h": "🔄 สายพานงานวิจัย (Research Pipeline)",
      "office.pipeline.lead": "แต่ละคนส่งงานต่อให้คนถัดไป — ผลลัพธ์สุดท้ายคือรีวิววรรณกรรมที่อ้างอิงได้จริง",
      "office.stepPill": "ขั้นที่ {n}",
      "office.footerHtml": "ราคาตรวจสอบ ณ ก.ค. 2026 — โปรดยืนยันที่เว็บไซต์จริงก่อนสมัคร · หลักการสำคัญ: ให้ AI <b>ค้นและจัดระเบียบ</b> แต่ทุกข้อสรุปต้องกลับไปเปิดอ่านแหล่งอ้างอิงจริงเสมอ<br>\n    ลองใช้งานจริงได้ที่ <a href=\"app.html\">app.html</a>",

      "office.t.scout.name": "สกาวต์ (Scout)",
      "office.t.scout.role": "Retriever · นักค้นหา",
      "office.t.scout.bubble": "เดี๋ยวไปกวาดหาเปเปอร์ที่เกี่ยวข้องมาให้หมดเลย!",
      "office.t.scout.job": "ออกไปสำรวจงานวิจัยทั้งโลกแบบ agentic — ค้นซ้ำ ปรับคำค้นเอง จนได้ครบ",
      "office.t.scout.desc": "รับผิดชอบการค้นหาเชิงลึกแบบอัตโนมัติ ครอบคลุมทั้งงานตีพิมพ์และ preprint เหมาะกับคำถามเชิงกลไกที่ต้องการความครบถ้วนสูง",
      "office.t.scout.label": "ค้นหา",

      "office.t.validator.name": "วาลิดา (Valida)",
      "office.t.validator.role": "Validator · ผู้ตรวจสอบ",
      "office.t.validator.bubble": "เปเปอร์นี้มีอยู่จริงไหม? ขอเช็กใน PubMed ก่อนนะ",
      "office.t.validator.job": "ด่านกันข้อมูลมั่ว — ยืนยันว่าเปเปอร์มีอยู่จริงและดึง metadata ที่สะอาด",
      "office.t.validator.desc": "จุดตรวจกันการ hallucination ที่สำคัญที่สุด ยืนยันการมีอยู่ของงานวิจัยจากฐานข้อมูลที่เชื่อถือได้ พร้อม metadata และ MeSH",
      "office.t.validator.label": "ตรวจสอบ",

      "office.t.analyst.name": "แอนนา (Anna)",
      "office.t.analyst.role": "Analyst · นักสกัดข้อมูล",
      "office.t.analyst.bubble": "จัดเป็นตารางให้เลย — cell line, วิธี knockdown, ผลลัพธ์",
      "office.t.analyst.job": "อ่านทุกเปเปอร์แล้วสกัดออกมาเป็นตาราง หนึ่งแถวต่อหนึ่งงาน แต่ละช่องลิงก์กลับแหล่ง",
      "office.t.analyst.desc": "หัวใจของการรีวิวเชิงระบบ สร้างตารางสกัดข้อมูลตามคอลัมน์สาย wet-lab: cell line, วิธี knockdown (siRNA/shRNA/CRISPR), ประสิทธิภาพ, readout, ข้อค้นพบ, ข้อจำกัด",
      "office.t.analyst.label": "สกัดข้อมูล",

      "office.t.checker.name": "เชค (Check)",
      "office.t.checker.role": "Fact-Checker · ผู้ตรวจหลักฐาน",
      "office.t.checker.bubble": "งานนี้มีคนทำซ้ำได้ไหม? หรือมีคนแย้ง?",
      "office.t.checker.job": "ดูทิศทางโดยรวมของหลักฐาน และเช็กว่าผลถูกยืนยันหรือถูกโต้แย้งภายหลัง",
      "office.t.checker.desc": "ใช้ Consensus Meter สรุปทิศทางของหลักฐาน และ Smart Citations ของ scite เพื่อดูว่างานสำคัญถูก support หรือ contrast ก่อนจะเอาไปวางแผนการทดลอง",
      "office.t.checker.label": "เช็กหลักฐาน",

      "office.t.writer.name": "ไรเตอร์ (Writer)",
      "office.t.writer.role": "Synthesizer · นักเขียนสรุป",
      "office.t.writer.bubble": "อัปโหลด PDF มา เดี๋ยวเขียนสรุปพร้อมอ้างอิงทุกประโยค",
      "office.t.writer.job": "รวมทุกอย่างเป็นเรื่องเล่าเดียว โดยตอบจากไฟล์ที่อัปโหลดเท่านั้น — อ้างอิงระดับประโยค",
      "office.t.writer.desc": "ขั้นสังเคราะห์สุดท้าย อัปโหลด PDF ~10–20 ไฟล์ที่คัดแล้ว ระบบตอบจากแหล่งเหล่านั้นเท่านั้น จึงแทบไม่มีการกุอ้างอิง",
      "office.t.writer.label": "เขียนสรุป",

      "office.t.translator.name": "ทรานส์ (Trans)",
      "office.t.translator.role": "Translator · นักแปลไทย",
      "office.t.translator.bubble": "เดี๋ยวแปลอังกฤษเป็นไทยให้ครบทุกตัวอักษร พร้อมสรุปว่าเปเปอร์นี้ทำอะไร!",
      "office.t.translator.job": "แปลผลลัพธ์ทั้งหมดเป็นไทยแบบไม่ตกหล่น และสรุปคร่าวๆ ว่าแต่ละเปเปอร์ทำอะไร",
      "office.t.translator.desc": "ด่านสุดท้ายเพื่อคนไทย — แปลชื่อเรื่องและบทคัดย่ออังกฤษเป็นไทยครบทุกตัวอักษร พร้อมสรุปสั้นๆ ว่าเปเปอร์นี้ศึกษาอะไร ทำให้อ่านเข้าใจเร็วโดยไม่ต้องแปลเอง",
      "office.t.translator.label": "แปลไทย",

      /* ============== guide.html ============== */
      "guide.docTitle": "คู่มือใช้งาน — ทีมวิจัย AI",
      "guide.h1": "📖 คู่มือใช้งานเบื้องต้น",
      "guide.sub": "วิธีใช้งาน + ความหมายของไอคอนทุกตัวในเว็บ",

      "guide.quick.h": "🚀 เริ่มใช้งานใน 4 ขั้น",
      "guide.quick.1.t": "พิมพ์คำค้นเป็นภาษาอังกฤษ",
      "guide.quick.1.dHtml": "เช่น <code>ANK3 renal cell carcinoma</code> — หรือคลิกตัวอย่างใต้ช่อง หรือลากไฟล์ .txt มาวาง",
      "guide.quick.2.t": "ตั้งค่า (ถ้าต้องการ)",
      "guide.quick.2.dHtml": "เลือกวิธีเรียง / ตั้งแต่ปี / จำนวนเปเปอร์ / ตัวกรองคุณภาพ",
      "guide.quick.3.t": "กดปุ่ม ▶ Run ทีม",
      "guide.quick.3.dHtml": "ทีมงาน 6 คนทำงานต่อกัน: ค้นหา → ตรวจสอบ → สกัด → เช็ก → สรุป → แปลไทย",
      "guide.quick.4.t": "อ่านผล + คัดกรอง + ดาวน์โหลด",
      "guide.quick.4.dHtml": "กดปุ่มคัดกรองแต่ละเปเปอร์ (บันทึกอัตโนมัติ) แล้ว export เป็น CSV / RIS / PRISMA",

      "guide.sort.h": "🔀 โหมดการเรียงผลลัพธ์",
      "guide.sort.smart.ic": "✨ อัจฉริยะ",
      "guide.sort.smart.dHtml": "ตรงคีย์เวิร์ดเป็นหลัก + ดันเปเปอร์ปีล่าสุดขึ้นมา <small>(แนะนำ — ค่าเริ่มต้น)</small>",
      "guide.sort.rel.ic": "🎯 ความเกี่ยวข้อง",
      "guide.sort.rel.dHtml": "ตรงคีย์เวิร์ดที่สุด ไม่สนใจปี",
      "guide.sort.new.ic": "🆕 ใหม่สุดก่อน",
      "guide.sort.new.dHtml": "เรียงตามวันที่ตีพิมพ์ล้วน <small>(อาจมีนอกเรื่องปนบ้าง)</small>",
      "guide.sort.cited.ic": "⭐ อ้างอิงมากสุด",
      "guide.sort.cited.dHtml": "งานคลาสสิกที่ถูกอ้างอิงเยอะ <small>(มักเป็นงานเก่า)</small>",

      "guide.flags.h": "🚩 ธงเตือนคุณภาพงาน",
      "guide.flags.ret.dHtml": "<b>งานถูกถอน</b> — ห้ามอ้างอิง! (ระบบซ่อนให้อัตโนมัติ เปิดดูได้ในตัวกรอง)",
      "guide.flags.pre.dHtml": "ยังไม่ผ่าน peer review — ใช้อย่างระวัง ยังไม่ถือว่าตรวจสอบแล้ว",
      "guide.flags.rev.dHtml": "บทความรีวิว ไม่ใช่งานทดลองต้นฉบับ <small>(ตัดออกได้ในตัวกรอง)</small>",

      "guide.chips.h": "🧪 ชิปข้อมูลสกัด (คอลัมน์ \"สกัด\")",
      "guide.chips.lead": "ระบบดึงข้อมูลสาย wet-lab จากบทคัดย่ออัตโนมัติ แยกด้วยสี",
      "guide.chips.method.dHtml": "<b>สีน้ำเงิน = วิธีทดลอง</b> — siRNA / shRNA / CRISPR / knockout / overexpression",
      "guide.chips.cell.dHtml": "<b>สีเขียว = cell line</b> — เซลล์ที่ใช้ในงาน (คลังกว่า 90 สาย)",
      "guide.chips.org.dHtml": "<b>สีส้ม = สิ่งมีชีวิต</b> — human / mouse / rat / zebrafish",

      "guide.screen.h": "✅ ปุ่มคัดกรอง (คอลัมน์ \"คัดกรอง\")",
      "guide.screen.lead": "กดเพื่อจัดสถานะแต่ละเปเปอร์ — บันทึกในเครื่องอัตโนมัติ เปิดใหม่ก็ยังอยู่",
      "guide.screen.inc.dHtml": "<b>รับเข้า (include)</b> — เปเปอร์ที่เข้าเกณฑ์ ใช้ในรีวิว (แถวขึ้นสีเขียว)",
      "guide.screen.may.dHtml": "<b>รอพิจารณา (maybe)</b> — ยังไม่แน่ใจ ไว้กลับมาดู",
      "guide.screen.exc.dHtml": "<b>ตัดออก (exclude)</b> — ไม่เข้าเกณฑ์ (แถวจางลง) · ใส่เหตุผลในช่องโน้ตได้",

      "guide.links.h": "🔗 ลิงก์แหล่งข้อมูล (คอลัมน์ \"ลิงก์\")",
      "guide.links.doi.d": "ไปหน้าทางการของเปเปอร์ (สำนักพิมพ์)",
      "guide.links.pubmed.d": "หน้า PubMed พร้อมบทคัดย่อและข้อมูลอ้างอิง",
      "guide.links.ft.d": "ฉบับเต็มบน Europe PMC (ถ้ามี)",
      "guide.links.pdf.dHtml": "<b>โหลด PDF ฉบับเต็มฟรี</b> — เฉพาะงาน open access",
      "guide.links.oa.d": "Open Access — อ่านฉบับเต็มได้ฟรี ไม่ติดค่าสมาชิก",

      "guide.team.h": "👥 ทีมงาน 6 คน (แต่ละขั้นของสายพาน)",
      "guide.team.scout.ic": "🔍 สกาวต์",
      "guide.team.scout.d": "ค้นหาเปเปอร์จาก Europe PMC",
      "guide.team.validator.ic": "✅ วาลิดา",
      "guide.team.validator.d": "ตรวจสอบ กันซ้ำ กรองคุณภาพ (retracted/review)",
      "guide.team.analyst.ic": "📊 แอนนา",
      "guide.team.analyst.d": "สกัดเป็นตาราง + ดึงข้อมูล wet-lab",
      "guide.team.checker.ic": "⚖️ เชค",
      "guide.team.checker.d": "จัดลำดับหลักฐาน + หาผลที่ขัดแย้งกัน",
      "guide.team.writer.ic": "✍️ ไรเตอร์",
      "guide.team.writer.d": "สังเคราะห์สรุปจากบทคัดย่อจริง (ไม่กุ)",
      "guide.team.translator.ic": "🌐 ทรานส์",
      "guide.team.translator.d": "แปลอังกฤษ→ไทย + สรุปว่าเปเปอร์ทำอะไร",
      "guide.team.moreHtml": "ดูรายละเอียดตัวละครแต่ละคน + เครื่องมือจริงได้ที่ <a href=\"office.html\">หน้าแนะนำทีม →</a>",

      "guide.export.h": "⬇️ ปุ่มดาวน์โหลด (Export)",
      "guide.export.csv.d": "ตารางเปเปอร์ — เปิดใน Excel",
      "guide.export.bib.d": "นำเข้า Zotero / EndNote / Mendeley ได้เลย",
      "guide.export.md.d": "สรุปสังเคราะห์ พร้อมลิงก์อ้างอิง",
      "guide.export.prisma.ic": "PRISMA log",
      "guide.export.prisma.dHtml": "<b>บันทึกการค้นหาแบบทำซ้ำได้</b> + ประโยค Methods สำเร็จรูป ใส่ paper ได้",
      "guide.export.screen.ic": "ผลคัดกรอง",
      "guide.export.screen.d": "CSV รวมสถานะ include/exclude + เหตุผล + ข้อมูลสกัด",

      "guide.tips.h": "💡 เคล็ดลับ",
      "guide.tips.1Html": "<b>พิมพ์ภาษาอังกฤษ</b> — ฐานข้อมูลงานวิจัยเป็นอังกฤษเกือบทั้งหมด พิมพ์ไทยจะหาไม่ค่อยเจอ",
      "guide.tips.2Html": "<b>เจอน้อยไป?</b> ตัดคำให้กว้างขึ้น เช่น <code>ANK3 renal cell carcinoma</code> → <code>ANK3 kidney cancer</code>",
      "guide.tips.3Html": "<b>อยากได้ทั้งใหม่ทั้งตรง</b> ใช้โหมด \"✨ อัจฉริยะ\" + ใส่ช่อง \"ตั้งแต่ปี 2023\"",
      "guide.tips.4Html": "<b>โควตาแปลหมด?</b> รอวันถัดไป หรือปิด \"🌐 แปลไทย\" แล้วยังค้นได้ปกติ (การแปลใช้บริการฟรีที่มีลิมิตรายวัน ไม่กิน token ใดๆ)",
      "guide.tips.5Html": "<b>สรุปเป็นแบบสกัด</b> — ทุกประโยคดึงจากบทคัดย่อจริง ไม่มีการกุ แต่ควรเปิดอ่านต้นฉบับก่อนอ้างอิงเสมอ",

      "guide.cta": "🔬 เริ่มใช้งานเลย →",
      "guide.footerHtml": "ข้อมูลจริงจาก Europe PMC &amp; Semantic Scholar · เครื่องมือช่วยค้นและจัดระเบียบ การตัดสินทางวิทยาศาสตร์ยังต้องอ่านต้นฉบับเอง<br>\n    <span style=\"display:inline-block;margin-top:8px\">พัฒนาโดย <b>Apiwit Prakat</b> · Research AI Team © 2026</span>"
    },

    /* =====================================================
       ================== English (en) =====================
       ===================================================== */
    en: {
      "lang.aria": "Switch language",
      "lang.th": "ไทย",
      "lang.en": "EN",

      /* ---------- shared nav ---------- */
      "nav.app": "🔬 The app",
      "nav.team": "👥 Meet the team",
      "nav.teamLong": "👥 Character page (meet the team)",
      "nav.guide": "📖 User guide",

      /* ============== app.html : header ============== */
      "app.docTitle": "AI Research Team — working build",
      "app.h1": "🔬 AI Research Team — working build",
      "app.leadHtml": "Type a research question (English works best) or <b>drop a .txt file</b>, then hit Run — six agents work as a pipeline, pulling real papers from Europe PMC + Semantic Scholar with genuine links and citation counts, then <b>translating to Thai + summarizing what each paper actually did</b>. Nothing is invented.",

      /* ============== app.html : search console ============== */
      "app.qPh": "e.g. EGFR knockdown effects on MAPK signaling in triple-negative breast cancer",
      "app.runBtn": "▶ Run the team",
      "app.sortBy": "Sort by:",
      "app.sort.smart": "✨ Smart (keyword match + recency) — recommended",
      "app.sort.relevance": "🎯 Pure relevance",
      "app.sort.newest": "🆕 Newest first",
      "app.sort.cited": "⭐ Most cited",
      "app.sortShort.smart": "smart",
      "app.sortShort.relevance": "relevance",
      "app.sortShort.newest": "newest",
      "app.sortShort.cited": "most cited",
      "app.minYear": "From year:",
      "app.minYearPh": "any",
      "app.limit": "Papers:",
      "app.oaOnly": "Open Access only",
      "app.s2": "Add TLDR",
      "app.thai": "🌐 Thai translation",
      "app.qualityFilters": "Quality filters:",
      "app.hideRet": "⛔ Hide retracted work",
      "app.noReview": "📄 Primary research only (drop reviews)",
      "app.noPre": "Drop preprints",
      "app.hint": "💡 Drop a .txt file (a question or a keyword list) straight into the box above · everything runs in your browser — nothing leaves it except calls to public research APIs",

      /* ============== app.html : office / agents ============== */
      "app.stageTitle": "🏢 The team at work",
      "app.agent.scout.nm": "Scout",
      "app.agent.scout.role": "search",
      "app.agent.validator.nm": "Valida",
      "app.agent.validator.role": "verify",
      "app.agent.analyst.nm": "Anna",
      "app.agent.analyst.role": "extract",
      "app.agent.checker.nm": "Check",
      "app.agent.checker.role": "weigh evidence",
      "app.agent.writer.nm": "Writer",
      "app.agent.writer.role": "synthesize",
      "app.agent.translator.nm": "Trans",
      "app.agent.translator.role": "translate",
      "app.stepNo": "Step {n}",

      /* agent status */
      "app.st.idle": "Waiting…",
      "app.st.stopped": "Stopped",
      "app.st.scout.run": "Searching…",
      "app.st.scout.done": "Found {n} ({sort})",
      "app.st.validator.run": "Verifying & de-duplicating…",
      "app.st.validator.done": "{n} left (deduped + filtered)",
      "app.st.analyst.run": "Extracting to a table…",
      "app.st.analyst.done": "Built a {n}-row table",
      "app.st.checker.run": "Weighing the evidence…",
      "app.st.checker.done": "Ranked ({sort}) · OA {pct}%",
      "app.st.writer.run": "Synthesizing…",
      "app.st.writer.done": "Synthesis done ✔",
      "app.st.translator.run": "Translating to Thai…",
      "app.st.translator.prog": "Translated {done}/{total} papers",
      "app.st.translator.done": "All {total} papers translated ✔",
      "app.st.translator.off": "Translation off",

      /* ============== app.html : result sections ============== */
      "app.sec.scout.hHtml": "🔍 Scout + ✅ Valida <span style=\"font-size:.8rem;color:var(--muted);font-weight:400\">— search &amp; verify</span>",
      "app.sec.log.h": "🧾 Search log (reproducible) + PRISMA screening",
      "app.sec.log.sub": "Paste it into your Methods/Supplementary · screening status is saved on this device automatically (localStorage)",
      "app.sec.analyst.hHtml": "📊 Anna <span style=\"font-size:.8rem;color:var(--muted);font-weight:400\">— extraction table (click a column header to sort)</span>",
      "app.sec.analyst.sub": "Each row = one real paper · 🧪 = extracted data (cell line / method / organism) · ✅ = include/exclude/maybe screening",
      "app.sec.writer.hHtml": "✍️ Writer <span style=\"font-size:.8rem;color:var(--muted);font-weight:400\">— extractive synthesis (every sentence comes from a real abstract)</span>",
      "app.sec.writer.sub": "⚖️ Check: ranked by citation count + recurring themes — this summary only lifts sentences from real abstracts, so nothing is invented; always open the original before you cite it",

      /* export buttons */
      "app.btn.prisma": "⬇ PRISMA / search log",
      "app.btn.screenCsv": "⬇ Screening results (CSV)",
      "app.btn.clearScreen": "🗑 Clear all screening status",
      "app.btn.csv": "⬇ CSV (table)",
      "app.btn.bib": "⬇ BibTeX",
      "app.btn.ris": "⬇ RIS (EndNote/Zotero)",
      "app.btn.md": "⬇ Markdown (synthesis)",
      "app.btn.copyMd": "📋 Copy synthesis",
      "app.btn.copied": "✓ Copied",

      /* table headers */
      "app.th.year": "Year",
      "app.th.title": "Title / journal / flags",
      "app.th.thai": "🌐 Thai summary",
      "app.th.extract": "🧪 Extracted",
      "app.th.screen": "✅ Screening",
      "app.th.cites": "Cites",
      "app.th.links": "Links",

      /* stats */
      "app.stat.count": "Papers",
      "app.stat.oa": "Open Access",
      "app.stat.years": "Year range",
      "app.stat.totalCites": "Total citations",
      "app.stat.maxCites": "Most cited",

      /* table cells */
      "app.tbl.noTitle": "(untitled)",
      "app.tbl.needThai": "— (tick \"Thai translation\" and press Run)",
      "app.tbl.fullAbs": "🌐 Full Thai abstract",
      "app.tbl.fullAbsToggle": "🌐 Show/hide Thai abstract",
      "app.tbl.translating": "Translating…",
      "app.tbl.absHeadHtml": "<b>Abstract (Thai):</b><br>",
      "app.tbl.noAbs": "(this paper has no abstract to translate)",
      "app.tbl.notePh": "Reason / note…",
      "app.tbl.inc": "Include",
      "app.tbl.may": "Maybe",
      "app.tbl.exc": "Exclude",

      /* flags */
      "app.flag.retTitle": "This work has been retracted — do not cite it",
      "app.flag.preTitle": "Preprint — not yet peer reviewed",
      "app.flag.revTitle": "A review article, not primary research",

      /* PRISMA */
      "app.prisma.inc": "✓ Included {n}",
      "app.prisma.may": "? Maybe {n}",
      "app.prisma.exc": "✗ Excluded {n}",
      "app.prisma.un": "Unscreened {n}",

      /* search log */
      "app.log.query": "Query (as sent):",
      "app.log.db": "Database:",
      "app.log.date": "Date of search:",
      "app.log.sort": "Sort:",
      "app.log.filters": "Filters:",
      "app.log.hits": "Records identified (hitCount):",
      "app.log.retrieved": "Retrieved:",
      "app.log.afterDedup": "After de-duplication:",
      "app.log.afterFilter": "After filters:",
      "app.log.none": "—",
      "app.filter.hideRet": "hide retracted",
      "app.filter.noReview": "drop reviews",
      "app.filter.noPre": "drop preprints",
      "app.filter.oa": "Open Access only",
      "app.filter.minYear": "from {y}",

      /* synthesis */
      "app.synth.headHtml": "<b>Key findings from the abstracts (most relevant first):</b>",
      "app.synth.empty": "No sentence cleared the bar — try a more specific query, or read the table above directly",
      "app.synth.up": "⬆️ \"Increases / promotes\" ({n})",
      "app.synth.down": "⬇️ \"Decreases / inhibits\" ({n})",
      "app.synth.conflictNote": "⚠️ Findings point both ways — often because the context differs (cell line/method). Compare the originals before concluding.",
      "app.synth.themes": "🏷️ Recurring themes across this set",
      "app.synth.themeItem": "in {n} papers",
      "app.scoutSub": "Searched for: “{q}” — via Europe PMC{s2}",
      "app.scoutSub.s2": " + Semantic Scholar (TLDR)",

      /* messages */
      "app.err.needQuery": "Type a research question first",
      "app.err.noPapers": "No papers found — try different terms, a looser year filter, or turn off Open Access",
      "app.err.allFiltered": "Everything was filtered out — try switching some filters off",
      "app.err.generic": "Something went wrong",
      "app.err.epmc": "Europe PMC returned {code}",
      "app.err.translate": "⚠️ Translation failed (check your connection and retry)",
      "app.alert.noRun": "Nothing to export yet — press Run first",
      "app.confirm.clearScreen": "Clear every saved screening status? (this cannot be undone)",

      /* markdown export */
      "app.md.summary": "Summary",
      "app.md.topCited": "Top-cited papers (with Thai summary)",

      /* footer */
      "app.footerHtml": "Real data from <a href=\"https://europepmc.org\" target=\"_blank\">Europe PMC</a> &amp; <a href=\"https://www.semanticscholar.org\" target=\"_blank\">Semantic Scholar</a> · this tool <b>finds and organizes</b> — the scientific judgement still means reading the originals yourself<br>\n    <span style=\"display:inline-block;margin-top:10px;font-size:.92rem;color:var(--ink)\">Built by <b>Apiwit Prakat</b> · Research AI Team © 2026</span>",

      /* ============== office.html ============== */
      "office.docTitle": "AI Research Team — The Research Office",
      "office.eyebrow": "The Research Office",
      "office.h1": "👩‍🔬 Your AI research team",
      "office.subHtml": "Each AI tool is an \"office worker\" with its own job — they hand work down a research pipeline: search → verify → extract → weigh evidence → write. <br>Click a character to see the real tools behind them.",
      "office.pipeline.h": "🔄 The research pipeline",
      "office.pipeline.lead": "Each one hands off to the next — the end product is a literature review you can actually cite",
      "office.stepPill": "Step {n}",
      "office.footerHtml": "Prices checked Jul 2026 — please confirm on the vendor's own site before subscribing · The core principle: let AI <b>find and organize</b>, but every conclusion means going back and reading the real source<br>\n    Try it for real at <a href=\"app.html\">app.html</a>",

      "office.t.scout.name": "Scout",
      "office.t.scout.role": "Retriever · the finder",
      "office.t.scout.bubble": "I'll sweep up every relevant paper out there!",
      "office.t.scout.job": "Explores the world's research agentically — re-searching and rewriting its own queries until the set is complete",
      "office.t.scout.desc": "Handles automated deep search across both published work and preprints. Best for mechanistic questions where you need high recall.",
      "office.t.scout.label": "search",

      "office.t.validator.name": "Valida",
      "office.t.validator.role": "Validator · the checker",
      "office.t.validator.bubble": "Does this paper actually exist? Let me check PubMed first.",
      "office.t.validator.job": "The gate against made-up data — confirms each paper is real and pulls clean metadata",
      "office.t.validator.desc": "The single most important anti-hallucination checkpoint: confirms a paper exists in a trusted database, with metadata and MeSH terms.",
      "office.t.validator.label": "verify",

      "office.t.analyst.name": "Anna",
      "office.t.analyst.role": "Analyst · the extractor",
      "office.t.analyst.bubble": "I'll lay it out as a table — cell line, knockdown method, results.",
      "office.t.analyst.job": "Reads every paper and extracts it into a table, one row per study, each cell linking back to its source",
      "office.t.analyst.desc": "The heart of a systematic review: builds an extraction table along wet-lab columns — cell line, knockdown method (siRNA/shRNA/CRISPR), efficiency, readout, findings, limitations.",
      "office.t.analyst.label": "extract",

      "office.t.checker.name": "Check",
      "office.t.checker.role": "Fact-Checker · the evidence auditor",
      "office.t.checker.bubble": "Has anyone replicated this? Or contradicted it?",
      "office.t.checker.job": "Reads the overall direction of the evidence and checks whether findings were later supported or disputed",
      "office.t.checker.desc": "Uses the Consensus Meter to summarize which way the evidence points, plus scite's Smart Citations to see whether key work was supported or contrasted — before you plan experiments on it.",
      "office.t.checker.label": "weigh evidence",

      "office.t.writer.name": "Writer",
      "office.t.writer.role": "Synthesizer · the summarizer",
      "office.t.writer.bubble": "Upload the PDFs and I'll write it up with a citation on every sentence.",
      "office.t.writer.job": "Pulls it all into one narrative, answering only from the uploaded files — cited sentence by sentence",
      "office.t.writer.desc": "The final synthesis step: upload ~10–20 screened PDFs and the system answers from those sources alone, so fabricated citations are almost impossible.",
      "office.t.writer.label": "synthesize",

      "office.t.translator.name": "Trans",
      "office.t.translator.role": "Translator · Thai translation",
      "office.t.translator.bubble": "I'll translate every last character into Thai — plus a summary of what the paper did!",
      "office.t.translator.job": "Translates all results into Thai without dropping anything, and summarizes what each paper actually did",
      "office.t.translator.desc": "The last stop for Thai readers — translates titles and English abstracts into Thai in full, with a short note on what the paper studied, so you can read fast without translating it yourself.",
      "office.t.translator.label": "translate",

      /* ============== guide.html ============== */
      "guide.docTitle": "User guide — AI Research Team",
      "guide.h1": "📖 Getting started",
      "guide.sub": "How to use it + what every icon on the site means",

      "guide.quick.h": "🚀 Four steps to start",
      "guide.quick.1.t": "Type your query in English",
      "guide.quick.1.dHtml": "e.g. <code>ANK3 renal cell carcinoma</code> — or click an example below the box, or drop in a .txt file",
      "guide.quick.2.t": "Adjust the settings (optional)",
      "guide.quick.2.dHtml": "Pick a sort order / from-year / number of papers / quality filters",
      "guide.quick.3.t": "Press ▶ Run the team",
      "guide.quick.3.dHtml": "Six agents run in sequence: search → verify → extract → check → synthesize → translate",
      "guide.quick.4.t": "Read, screen, download",
      "guide.quick.4.dHtml": "Screen each paper with the buttons (saved automatically), then export as CSV / RIS / PRISMA",

      "guide.sort.h": "🔀 Sort modes",
      "guide.sort.smart.ic": "✨ Smart",
      "guide.sort.smart.dHtml": "Keyword match first, with recent papers pushed up <small>(recommended — the default)</small>",
      "guide.sort.rel.ic": "🎯 Relevance",
      "guide.sort.rel.dHtml": "Closest keyword match, year ignored",
      "guide.sort.new.ic": "🆕 Newest first",
      "guide.sort.new.dHtml": "Purely by publication date <small>(some off-topic hits creep in)</small>",
      "guide.sort.cited.ic": "⭐ Most cited",
      "guide.sort.cited.dHtml": "The classics everyone cites <small>(usually older work)</small>",

      "guide.flags.h": "🚩 Quality warning flags",
      "guide.flags.ret.dHtml": "<b>Retracted</b> — never cite it! (hidden automatically; you can unhide it in the filters)",
      "guide.flags.pre.dHtml": "Not peer reviewed yet — use with care, treat it as unverified",
      "guide.flags.rev.dHtml": "A review article, not primary research <small>(can be filtered out)</small>",

      "guide.chips.h": "🧪 Extraction chips (the \"Extracted\" column)",
      "guide.chips.lead": "Wet-lab details are pulled from the abstract automatically, colour-coded",
      "guide.chips.method.dHtml": "<b>Blue = method</b> — siRNA / shRNA / CRISPR / knockout / overexpression",
      "guide.chips.cell.dHtml": "<b>Green = cell line</b> — the cells used in the study (a library of 90+ lines)",
      "guide.chips.org.dHtml": "<b>Orange = organism</b> — human / mouse / rat / zebrafish",

      "guide.screen.h": "✅ Screening buttons (the \"Screening\" column)",
      "guide.screen.lead": "Click to set each paper's status — saved on this device, still there when you come back",
      "guide.screen.inc.dHtml": "<b>Include</b> — the paper meets your criteria and goes into the review (row turns green)",
      "guide.screen.may.dHtml": "<b>Maybe</b> — undecided, come back to it",
      "guide.screen.exc.dHtml": "<b>Exclude</b> — doesn't meet the criteria (row dims) · you can type the reason in the note box",

      "guide.links.h": "🔗 Source links (the \"Links\" column)",
      "guide.links.doi.d": "The publisher's official page for the paper",
      "guide.links.pubmed.d": "The PubMed record, with abstract and citation data",
      "guide.links.ft.d": "Full text on Europe PMC (where available)",
      "guide.links.pdf.dHtml": "<b>Download the full PDF free</b> — open access papers only",
      "guide.links.oa.d": "Open Access — read the full text free, no subscription",

      "guide.team.h": "👥 The six agents (one per pipeline stage)",
      "guide.team.scout.ic": "🔍 Scout",
      "guide.team.scout.d": "Finds papers on Europe PMC",
      "guide.team.validator.ic": "✅ Valida",
      "guide.team.validator.d": "Verifies, de-duplicates, filters on quality (retracted/review)",
      "guide.team.analyst.ic": "📊 Anna",
      "guide.team.analyst.d": "Extracts into a table + pulls wet-lab details",
      "guide.team.checker.ic": "⚖️ Check",
      "guide.team.checker.d": "Ranks the evidence + surfaces contradictory findings",
      "guide.team.writer.ic": "✍️ Writer",
      "guide.team.writer.d": "Synthesizes from real abstracts (nothing invented)",
      "guide.team.translator.ic": "🌐 Trans",
      "guide.team.translator.d": "Translates English→Thai + summarizes what each paper did",
      "guide.team.moreHtml": "See each character and the real tools behind them on the <a href=\"office.html\">team page →</a>",

      "guide.export.h": "⬇️ Export buttons",
      "guide.export.csv.d": "The paper table — opens in Excel",
      "guide.export.bib.d": "Import straight into Zotero / EndNote / Mendeley",
      "guide.export.md.d": "The synthesis, with citation links",
      "guide.export.prisma.ic": "PRISMA log",
      "guide.export.prisma.dHtml": "<b>A reproducible search log</b> + a ready-made Methods sentence you can paste into a paper",
      "guide.export.screen.ic": "Screening",
      "guide.export.screen.d": "CSV with include/exclude status + reasons + extracted data",

      "guide.tips.h": "💡 Tips",
      "guide.tips.1Html": "<b>Search in English</b> — research databases are almost entirely English, Thai queries find very little",
      "guide.tips.2Html": "<b>Too few hits?</b> Broaden the terms, e.g. <code>ANK3 renal cell carcinoma</code> → <code>ANK3 kidney cancer</code>",
      "guide.tips.3Html": "<b>Want recent AND relevant?</b> Use \"✨ Smart\" and set \"From year 2023\"",
      "guide.tips.4Html": "<b>Translation quota used up?</b> Wait until tomorrow, or untick \"🌐 Thai translation\" — searching still works normally (translation uses free services with daily limits; it costs no tokens)",
      "guide.tips.5Html": "<b>The summary is extractive</b> — every sentence is lifted from a real abstract, so nothing is invented, but always open the original before citing it",

      "guide.cta": "🔬 Start using it →",
      "guide.footerHtml": "Real data from Europe PMC &amp; Semantic Scholar · the tool finds and organizes; the scientific judgement still means reading the originals<br>\n    <span style=\"display:inline-block;margin-top:8px\">Built by <b>Apiwit Prakat</b> · Research AI Team © 2026</span>"
    }
  };

  /* ================= state ================= */
  function readStored() {
    try {
      var s = localStorage.getItem(STORE_KEY);
      if (s === "th" || s === "en") return s;
    } catch (e) {}
    return "th";
  }
  var lang = readStored();

  /* t("key", {n:5}) — {placeholder} ในสตริงจะถูกแทนด้วยค่าใน vars
     ถ้า value เป็น {i18n:"key"} จะถูกแปลซ้อนอีกชั้น (ใช้กับ label ที่ต้องเปลี่ยนภาษาด้วย) */
  function t(key, vars) {
    var pack = DICT[lang] || DICT.th;
    var s = pack[key];
    if (s == null) s = DICT.th[key];
    if (s == null) return key;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) {
        var v = vars[k];
        if (v == null) return m;
        if (typeof v === "object" && v.i18n) return t(v.i18n);
        return String(v);
      });
    }
    return s;
  }

  /* ============ ใส่คำแปลลงใน markup ที่มีอยู่แล้ว ============ */
  function applyI18n(root) {
    root = root || document;
    var each = function (sel, fn) {
      Array.prototype.forEach.call(root.querySelectorAll(sel), fn);
    };
    each("[data-i18n]", function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    each("[data-i18n-html]", function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    each("[data-i18n-ph]", function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    each("[data-i18n-title]", function (el) { el.setAttribute("title", t(el.getAttribute("data-i18n-title"))); });
    each("[data-i18n-aria]", function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    var dt = document.querySelector("meta[name='i18n-title']");
    if (dt) document.title = t(dt.getAttribute("content"));
    document.documentElement.setAttribute("lang", lang);
  }

  /* ================= ปุ่มสลับภาษา ================= */
  var STYLE = [
    ".lang-switch{position:fixed;top:14px;right:14px;z-index:9999;display:inline-flex;gap:2px;padding:3px;",
    "  border-radius:999px;border:1px solid rgba(90,110,160,.28);background:rgba(255,255,255,.9);",
    "  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);",
    "  box-shadow:0 6px 20px -10px rgba(30,45,90,.45);font-size:.78rem;font-family:inherit}",
    ".lang-switch button{border:0;background:transparent;cursor:pointer;border-radius:999px;padding:5px 12px;",
    "  font:inherit;font-weight:700;color:#5a6480;line-height:1.4;transition:.15s}",
    ".lang-switch button:hover{color:#1c2740}",
    ".lang-switch button[aria-pressed=true]{background:linear-gradient(120deg,#6d4bf0,#0e93b0);color:#fff;",
    "  box-shadow:0 3px 10px -3px rgba(80,70,200,.6)}",
    ".lang-switch button:focus-visible{outline:2px solid #6d4bf0;outline-offset:2px}",
    "@media (max-width:640px){.lang-switch{top:8px;right:8px;font-size:.72rem}",
    "  .lang-switch button{padding:4px 10px}",
    /* จอแคบ: ดันเนื้อหาลงนิดหน่อย ปุ่มจะได้ไม่ทับหัวเรื่อง */
    "  body{padding-top:44px}}"
  ].join("\n");

  function injectStyle() {
    if (document.getElementById("lang-switch-style")) return;
    var st = document.createElement("style");
    st.id = "lang-switch-style";
    st.textContent = STYLE;
    document.head.appendChild(st);
  }

  function buildSwitch() {
    if (document.querySelector(".lang-switch")) return;
    injectStyle();
    var box = document.createElement("div");
    box.className = "lang-switch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", t("lang.aria"));
    ["th", "en"].forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-l", l);
      b.textContent = t(l === "th" ? "lang.th" : "lang.en");
      b.addEventListener("click", function () { setLang(l); });
      box.appendChild(b);
    });
    document.body.appendChild(box);
    syncSwitch();
  }

  function syncSwitch() {
    Array.prototype.forEach.call(document.querySelectorAll(".lang-switch button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-l") === lang));
    });
    var box = document.querySelector(".lang-switch");
    if (box) box.setAttribute("aria-label", t("lang.aria"));
  }

  function setLang(l) {
    if (l !== "th" && l !== "en") return;
    if (l === lang) return;
    lang = l;
    window.LANG = lang;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    applyI18n();
    syncSwitch();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  /* ================= exports ================= */
  window.t = t;
  window.LANG = lang;
  window.getLang = function () { return lang; };
  window.setLang = setLang;
  window.applyI18n = applyI18n;
  window.i18nLocale = function () { return lang === "th" ? "th-TH" : "en-GB"; };

  document.documentElement.setAttribute("lang", lang);

  function init() { applyI18n(); buildSwitch(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
