# Campus Service — Full-Stack Integration

โปรเจกต์นี้เป็นระบบแจ้งคำร้องบริการภายในมหาวิทยาลัย พัฒนาด้วย React, Express และ SQLite โดย Week 11 นำงานจากสัปดาห์ก่อนมาประกอบเป็นระบบ full-stack ที่พร้อมรันในรูปแบบ production มากขึ้น ทั้งการแยก config ผ่าน environment variables, health check, logging และการเสิร์ฟ frontend กับ API ผ่านพอร์ตเดียว

## สถาปัตยกรรม 3 ชั้น

```text
React Frontend  --HTTP/JSON-->  Express API  --SQL-->  SQLite Database
 frontend/                      api/src/               api/data/
```

| ชั้น | หน้าที่ | ตำแหน่ง |
|---|---|---|
| Frontend | แสดงผล รับข้อมูลจากผู้ใช้ และเรียก API | `frontend/` |
| API | จัดการ route, validation, controller, service และ error | `api/src/` |
| Database | เก็บผู้ใช้และคำร้องอย่างถาวรในเครื่อง | `api/data/campus.db` |

การแยกเป็น 3 ชั้นช่วยให้แต่ละส่วนมีหน้าที่ชัดเจน ถ้าปรับหน้าเว็บไม่จำเป็นต้องแก้ SQL โดยตรง และถ้าเปลี่ยนวิธีเก็บข้อมูลก็สามารถจำกัดผลกระทบไว้ที่ชั้น service ได้มากที่สุด

## วิธีรันแบบ Development

ต้องใช้ Node.js 22.13 ขึ้นไป

Terminal 1:

```bash
cd api
npm install
npm run db:setup
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

จากนั้นเปิด `http://localhost:5173` และตรวจ API ได้ที่ `http://localhost:3001/api/health`

## วิธีรันแบบ Production

ที่โฟลเดอร์ `labs/week-11/source`:

```bash
npm install
npm run build
```

บน macOS/Linux:

```bash
NODE_ENV=production PORT=10000 npm start
```

บน Windows PowerShell:

```powershell
$env:NODE_ENV="production"
$env:PORT="10000"
npm start
```

เมื่อรัน production แล้ว หน้า React และ API จะอยู่ที่ origin เดียวกัน เช่น `http://localhost:10000/` และ `http://localhost:10000/api/health`

## Environment Variables

| ตัวแปร | ค่าเริ่มต้น | ใช้ทำอะไร |
|---|---|---|
| `NODE_ENV` | `development` | แยกพฤติกรรม dev/production |
| `PORT` | `3001` | พอร์ตของ Express |
| `CORS_ORIGIN` | `http://localhost:5173` | origin ที่อนุญาตในโหมดพัฒนา |
| `DB_FILE` | `api/data/campus.db` | path ของ SQLite |
| `STATIC_DIR` | `frontend/dist` | ตำแหน่ง production build |

ไฟล์ `.env` เป็นค่าของเครื่องแต่ละคนและไม่ควร commit ส่วน `.env.example` ใช้บอกว่าระบบรองรับตัวแปรอะไรบ้าง

## Health Check

`GET /api/health` ตรวจทั้งตัว API และการเชื่อมต่อฐานข้อมูล หากฐานข้อมูลพร้อมจะตอบ `200` พร้อม `status: "ok"` แต่ถ้าฐานข้อมูลใช้งานไม่ได้จะตอบ `503` เพื่อไม่ให้ระบบภายนอกเข้าใจผิดว่า service พร้อมใช้งาน

## การตัดสินใจออกแบบ

เลือก SQLite เพราะข้อมูลของระบบมีโครงสร้างชัด มีความสัมพันธ์ระหว่าง `users` กับ `requests` และขนาดงานยังไม่จำเป็นต้องมี database server แยกเครื่อง SQLite จึงติดตั้งง่ายและเหมาะกับการเรียนเรื่อง SQL และ full-stack integration

ใน production frontend ถูก build เป็น static files แล้วให้ Express เสิร์ฟไฟล์เหล่านั้น ทำให้ผู้ใช้เปิดเว็บและเรียก API ผ่านพอร์ตเดียวกัน ส่วน development ยังแยก Vite กับ Express เพื่อให้แก้ frontend แล้วเห็นผลได้เร็ว
