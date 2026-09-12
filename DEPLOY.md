# วิธีเอาเว็บขึ้นออนไลน์ถาวร (ฟรี)

เว็บนี้เป็น static site (HTML ล้วน) — ทุกคนเปิดใช้ได้ ไม่กิน token Claude
มี 2 วิธี เลือกวิธีใดวิธีหนึ่ง

---

## ✅ วิธี A — Netlify Drop (ง่ายสุด ไม่ต้องใช้ git)

1. เปิด https://app.netlify.com/drop
2. ลากทั้งโฟลเดอร์ `research-ai-tools` ไปวาง
3. ได้ลิงก์ทันที เช่น `https://ชื่อสุ่ม.netlify.app`
4. อยากให้ถาวร → กด "Sign up to keep this site" → Sign up with Google
5. ตั้งชื่อลิงก์เองได้ที่ Site settings → Change site name

---

## ✅ วิธี B — GitHub Pages (ลิงก์ถาวร ผูกกับบัญชี GitHub)

repo ถูกเตรียม + commit ไว้ให้แล้ว เหลือแค่ push

### ขั้นที่ 1 — สร้าง repo บนเว็บ GitHub
- ไปที่ https://github.com/new
- ตั้งชื่อ repo เช่น `research-ai-team`
- เลือก Public → กด "Create repository"
- **อย่า** ติ๊ก add README / .gitignore (เพราะเรามีแล้ว)

### ขั้นที่ 2 — push โค้ดขึ้นไป (รันใน Git Bash ที่โฟลเดอร์นี้)
แทน USERNAME และ REPO ด้วยของจริง:

```bash
cd /d/research-ai-tools
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```
(ครั้งแรก git จะให้ล็อกอิน GitHub — ทำตามหน้าจอ)

### ขั้นที่ 3 — เปิด GitHub Pages
- ในหน้า repo → Settings → Pages
- Source: เลือก branch `main` โฟลเดอร์ `/ (root)` → Save
- รอ 1–2 นาที จะได้ลิงก์: `https://USERNAME.github.io/REPO/`

เสร็จ! ลิงก์นี้อยู่ถาวร ทุกคนเปิดได้ตลอดไป

---

## อัปเดตเว็บภายหลัง (เฉพาะวิธี B)

repo นี้ตั้งค่าเสร็จแล้ว — ตอนนี้อยู่ที่
`https://github.com/kraugelzz/research-ai-team` → เว็บจริง
`https://kraugelzz.github.io/research-ai-team/app.html`

แก้ไฟล์แล้วรันใน Git Bash ที่โฟลเดอร์นี้:

```bash
cd "/d/Claude Code/ความรู้/research-ai-tools"
git add -A
git commit -m "อธิบายสั้นๆ ว่าแก้อะไร"
git push
```

เว็บจะอัปเดตเองใน 1–2 นาที เช็กว่าขึ้นแล้วจริงด้วย:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://kraugelzz.github.io/research-ai-team/app.html
```

### ⚠️ ถ้าแก้ `i18n.js` ต้องเปลี่ยนเลขเวอร์ชันด้วย

ไฟล์ HTML มี `<meta http-equiv="Cache-Control" content="no-store">` อยู่แล้ว
แต่ `i18n.js` เป็นไฟล์แยก เบราว์เซอร์จะ cache ไว้ ถ้าไม่เปลี่ยนเลข
ผู้ใช้เก่าจะยังเห็นคำแปลชุดเดิม

แก้เลขท้าย `?v=` ให้เป็นวันที่วันนี้ ทั้ง 3 หน้าในครั้งเดียว:

```bash
cd "/d/Claude Code/ความรู้/research-ai-tools"
sed -i "s|i18n.js?v=[0-9]*|i18n.js?v=$(date +%Y%m%d)|" app.html office.html guide.html
```

### เช็กก่อน push (ไม่บังคับ แต่กันพลาด)

เปิดเซิร์ฟเวอร์ในเครื่องดูก่อนได้:

```bash
cd "/d/Claude Code/ความรู้/research-ai-tools"
py -m http.server 8020
```

แล้วเปิด `http://localhost:8020/app.html` — กดปุ่ม ไทย/EN มุมขวาบนดูว่าสลับครบ
ถ้าเห็นคำแปลเก่า ให้กด Ctrl+Shift+R (hard reload) เพราะเป็น cache ของ `i18n.js`
