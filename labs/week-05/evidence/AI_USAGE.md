# ENGSE203 LAB05 — AI / Resource Usage

| Tool / Resource | Purpose                                       | Used portion                                                                                            | How I verified                                                                                                                          | My final decision                                  |
| --------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| ChatGPT         | ช่วยอธิบายโจทย์และตรวจสอบการ Refactor ใน CP01 | การย้าย state, handlers และ Dashboard UI จาก `App.jsx` ไป `DashboardPage.jsx` รวมถึงตรวจสอบ import path | ตรวจ source code ด้วยตนเอง, ทดสอบ Add / Filter / Delete / Validation ใน browser, รัน `npm run check -- --session=1` และ `npm run build` | นำแนวทางที่เข้าใจและตรวจสอบแล้วมาแก้โค้ดในโปรเจกต์ |

คำรับรอง:

* [x] ไม่ส่ง token, password, secret หรือข้อมูลส่วนบุคคลจริงให้เครื่องมือ
* [x] ตรวจ source และรัน test ด้วยตนเอง
* [ ] อธิบาย Route, Effect, Service Layer และ persistence ของ final code ได้
