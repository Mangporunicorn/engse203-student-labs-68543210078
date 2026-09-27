# SECURITY_TEST.md — SQL Injection Test

## การทดสอบ SQL Injection

ทดสอบการส่งค่าที่มีคำสั่ง SQL ผ่าน `status` เพื่อดูว่าระบบสามารถป้องกัน SQL Injection ได้หรือไม่

### 1. ทดสอบเงื่อนไขที่เป็นจริงเสมอ

คำสั่งที่ใช้

```bash
curl "http://localhost:3001/api/requests?status=x'%20OR%20'1'='1"
```

ผลที่ได้

```text
[]
```

ระบบไม่คืนข้อมูลออกมาทั้งหมด แสดงว่าค่าที่ส่งเข้าไปถูกมองเป็นข้อความของ `status` และไม่ได้ถูกนำไปต่อเป็นคำสั่ง SQL

### 2. ทดสอบคำสั่ง DROP TABLE

คำสั่งที่ใช้

```bash
curl "http://localhost:3001/api/requests?status='%3B%20DROP%20TABLE%20requests%3B%20--"
```

ผลที่ได้

```text
[]
```

จากนั้นลองเรียกข้อมูลตามปกติอีกครั้ง

```bash
curl http://localhost:3001/api/requests
```

ยังสามารถดึงข้อมูลคำร้องได้ตามปกติ แสดงว่าตาราง `requests` ไม่ได้ถูกลบ

### 3. ทดสอบการต่อเงื่อนไขเพิ่ม

คำสั่งที่ใช้

```bash
curl "http://localhost:3001/api/requests?status=pending'%20OR%20status='completed"
```

ผลที่ได้

```text
[]
```

ระบบไม่ได้คืนรายการที่มีสถานะ `pending` หรือ `completed` ออกมา

## สรุป

จากการทดสอบทั้ง 3 แบบ ระบบสามารถป้องกัน SQL Injection ในส่วนของ `status` ได้ เพราะ query ใช้ parameterized query ด้วย `?` แทนการนำค่าจากผู้ใช้ไปต่อกับ SQL โดยตรง