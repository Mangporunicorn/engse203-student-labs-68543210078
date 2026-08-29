# ENGSE203 LAB05 — AI / Resource Usage

| Tool / Resource | Purpose                                       | Used portion                                                                                            | How I verified                                                                                                                          | My final decision                                  |
| --------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| ChatGPT         | ช่วยอธิบายโจทย์และตรวจสอบการ Refactor ใน CP01 | การย้าย state, handlers และ Dashboard UI จาก `App.jsx` ไป `DashboardPage.jsx` รวมถึงตรวจสอบ import path | ตรวจ source code ด้วยตนเอง, ทดสอบ Add / Filter / Delete / Validation ใน browser, รัน `npm run check -- --session=1` และ `npm run build` | นำแนวทางที่เข้าใจและตรวจสอบแล้วมาแก้โค้ดในโปรเจกต์ |
| ChatGPT | ช่วยอธิบายและตรวจสอบ CP02 Routing | AppLayout, nested Routes, Outlet และ NavLink | ทดสอบ route ใน browser, รัน checker และ build | ใช้แนวทางหลังตรวจสอบว่าตรงกับเอกสาร LAB05 |
| ChatGPT | ช่วยอธิบายและตรวจสอบ CP05a Dynamic Detail | getRequestById, useParams, useEffect และสถานะ found/not found | ตรวจ source, รัน checker, manual test REQ-001/REQ-999 และ npm run build | ใช้แนวทางหลังตรวจสอบกับเอกสาร LAB05 และทดสอบด้วยตนเอง |
| ChatGPT | ช่วยอธิบายและตรวจสอบ CP04b Recovery | schemaVersion validation, duplicate ID validation และ recovery callback | รัน npm run check, ทดสอบ Local Storage เสียใน browser และ npm run build | ใช้แนวทางหลังตรวจสอบกับ LAB05 และทดสอบด้วยตนเอง |

คำรับรอง:

* [x] ไม่ส่ง token, password, secret หรือข้อมูลส่วนบุคคลจริงให้เครื่องมือ
* [x] ตรวจ source และรัน test ด้วยตนเอง
* [ ] อธิบาย Route, Effect, Service Layer และ persistence ของ final code ได้
