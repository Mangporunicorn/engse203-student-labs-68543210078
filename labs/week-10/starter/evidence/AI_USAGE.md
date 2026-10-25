# AI_USAGE.md

## การใช้ AI ในงาน

ใช้ ChatGPT ช่วยอธิบายขั้นตอนการทำ LAB Week 10 และช่วยตรวจสอบความเข้าใจเกี่ยวกับการเชื่อม Node.js กับ SQLite

### สิ่งที่ใช้ AI ช่วย

- อธิบายการใช้ `node:sqlite` และ `DatabaseSync`
- อธิบายการกำหนด path ของ `campus.db` ด้วย `fileURLToPath(import.meta.url)`
- ช่วยอธิบายการใช้ `JOIN` ระหว่างตาราง `requests` และ `users`
- ช่วยอธิบายการใช้ `AS` เพื่อแปลงชื่อคอลัมน์จากฐานข้อมูลให้ตรงกับรูปแบบที่ frontend ใช้
- ช่วยอธิบายการแปลง `requesterName` เป็น `requester_id` ตอนสร้างคำร้อง
- ช่วยอธิบายการทำ `UPDATE` และ `DELETE` ด้วย SQLite
- ช่วยตรวจสอบและทดสอบ SQL Injection
- ช่วยอธิบายการใช้ parameterized query ด้วย `?`
- ช่วยอธิบายการจัดการ error จากฐานข้อมูลด้วย `AppError`
- ช่วยตรวจสอบผลจาก `check-week10.mjs` และ `check-week07.mjs`

### ส่วนที่ทำและตรวจสอบด้วยตนเอง

เป็นผู้แก้ไขโค้ดในโปรเจกต์ รัน API และ frontend ทดสอบ endpoint ด้วย curl รัน checker และ automated test ด้วยตนเอง รวมถึงตรวจสอบผลลัพธ์ของ Dashboard และจัดเก็บ evidence ก่อนส่งงาน

ได้อ่านและทำความเข้าใจโค้ดที่นำมาใช้ โดยเฉพาะส่วนของ `JOIN`, parameterized query, การแปลงชื่อผู้แจ้งเป็น id และการทำงานของ service ที่เชื่อมกับ SQLite