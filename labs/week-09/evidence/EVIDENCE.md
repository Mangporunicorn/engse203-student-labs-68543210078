# ENGSE203 Week 09 — SQL Fundamentals: Evidence

เก็บผลตรวจจากงานใน `labs/week-09/starter/` วันที่ 27 กันยายน 2026 โดยใช้ `campus.db` ที่มีอยู่จริง เปิด `PRAGMA foreign_keys = ON;` ก่อนคำสั่ง SQLite ทุกชุด ไฟล์ `.txt` เป็นผลลัพธ์จากการรันคำสั่งจริง ไม่ใช่ภาพหน้าจอ

| CP | หลักฐาน | ผลที่ตรวจได้ |
| --- | --- | --- |
| CP17 | [`cp17-cp19-cp21-sql.txt`](cp17-cp19-cp21-sql.txt) | `SELECT` ร่วมกับ `WHERE priority = 'urgent'` และ `ORDER BY id` ได้ 3 แถว |
| CP18 | [`../starter/DATA_MODEL.md`](../starter/DATA_MODEL.md) และ `cp17-cp19-cp21-sql.txt` | เอกสารอธิบาย `users` หนึ่งคนต่อ `requests` หลายรายการ; FK คือ `requests.requester_id → users.id` ไม่สร้างหลักฐานแยก |
| CP19 | `cp17-cp19-cp21-sql.txt` | `users = 4`, `requests = 8`; `PRAGMA foreign_key_list(requests)` ชี้ `requester_id` ไป `users.id`; `foreign_key_check` ไม่พบแถวผิด |
| CP20 | [`cp20-constraints.txt`](cp20-constraints.txt) | SQLite ปฏิเสธอีเมลซ้ำ, FK ที่ไม่มีจริง, `priority`/`status` ที่ไม่อนุญาต และ `NULL` ใน `location`; หลัง `ROLLBACK` ยังเป็น 4/8 |
| CP21 | `cp17-cp19-cp21-sql.txt` | `JOIN` ดึงชื่อผู้แจ้งจาก `users` ได้ครบ 8 คำร้อง |
| CP22 | [`cp22-queries.txt`](cp22-queries.txt), [`../starter/queries.sql`](../starter/queries.sql) | `.read queries.sql` รันครบ 8 `SELECT` โดยไม่มี SQL error; มี `WHERE`, `JOIN`, `ORDER BY`, `DISTINCT`, `LIMIT` |
| CP23 | [`cp23-schema-rerun.txt`](cp23-schema-rerun.txt) | `.read schema.sql` บนฐานข้อมูลชั่วคราวใหม่ แล้วรันซ้ำอีกครั้ง ทั้งสองครั้งได้ 4/8 และไม่มี SQL error |
| CP24 | `../starter/DATA_MODEL.md` | มีครบ 6 หัวข้อ: ภาพรวม; เหตุผลที่แยก 2 ตาราง; รายละเอียดตาราง; เหตุผลของชนิด/ข้อกำหนด; ตัวอย่าง JOIN; ข้อสังเกต Week 10 ไม่สร้างหลักฐานแยก |
| CP25 | [`cp25-inclass-checker.txt`](cp25-inclass-checker.txt), [`cp25-full-checker.txt`](cp25-full-checker.txt) | checker: ในห้อง 11/11 และที่บ้าน 16/16 ผ่าน รวมงานบังคับ 27/27 |

## วิธีตรวจและขอบเขต

- CP17, CP19, CP21 และ CP22 อ่าน `starter/campus.db` โดยเปิดแบบ read-only พร้อมเปิด foreign key
- CP20 ใช้สำเนาชั่วคราวของ `campus.db` เริ่ม `BEGIN` ก่อนทดสอบค่าผิด แล้ว `ROLLBACK` หลังทดสอบ ข้อความ `Runtime error` ทั้ง 5 จุดคือผลที่คาดจาก constraint จึงทำให้ SQLite CLI ชุดนี้คืน exit code 1; ไม่ใช่ความเสียหายของข้อมูล
- CP23 ใช้ฐานข้อมูลชั่วคราวใหม่ ไม่รัน `schema.sql` บน `starter/campus.db`
- CP25 รันจาก `starter/` ด้วย `node --disable-warning=ExperimentalWarning check-week09.mjs --inclass` และ `node --disable-warning=ExperimentalWarning check-week09.mjs` ผลตรวจแสดง Challenge เพิ่มเติม 0/3 จึงเป็น 27/30 เมื่อรวม Challenge ซึ่งไม่ได้อยู่ใน 27 รายการบังคับ
- ตรวจ SHA-256 ของ `campus.db`, `schema.sql`, `queries.sql`, `DATA_MODEL.md`, `playground-seed.sql`, `check-week09.mjs` ก่อนและหลัง: ตรงกันทุกไฟล์; `campus.db` = `7cb95de84fffb7e3325199624c9427298a9976856d52c3011baf242aadfde1cd`

ไม่มีการแก้ source, ฐานข้อมูลหลัก หรือไฟล์เดิม และไม่มีการ commit, push หรือ tag
