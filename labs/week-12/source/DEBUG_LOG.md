# บันทึกการ Debug — Week 12

## BUG #0 · รายละเอียด 10 ตัวอักษรพอดีถูกปฏิเสธ

- **อาการ:** รายละเอียด 10 ตัวอักษรพอดีถูกปฏิเสธ ทั้งที่กำหนดขั้นต่ำ 10 ตัวอักษร
- **วิธีทำซ้ำ:** รัน unit test ด้วย `details: '1234567890'`
- **เครื่องมือ:** Vitest และ Boundary Value Testing
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/validators/requestValidator.js` ใช้เงื่อนไข `length <= MIN_DETAILS` ทำให้ค่า 10 ถูกปฏิเสธ
- **วิธีแก้:** เปลี่ยน `<= MIN_DETAILS` เป็น `< MIN_DETAILS`
- **test ที่กัน:** unit test `10 ตัวอักษร → ผ่าน (ตรงขอบพอดี)`

## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ได้ 500

- **อาการ:** เมื่อลบคำร้องตรงกลางแล้วสร้างคำร้องใหม่ ระบบตอบ 500
- **วิธีทำซ้ำ:** ลบ `REQ-002` แล้ว POST คำร้องใหม่
- **เครื่องมือ:** Log และ breakpoint ที่ฟังก์ชัน `nextId()`
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/services/requestService.js` ใช้ `COUNT(*) + 1` สร้าง ID ทำให้หลังลบรายการกลางสามารถสร้าง ID ที่มีอยู่แล้ว
- **วิธีแก้:** หารหัส `REQ-xxx` ล่าสุด แล้วนำเลขท้ายมาบวก 1
- **test ที่กัน:** integration test ลบรายการกลางแล้วเพิ่มใหม่ต้องตอบ 201 และ ID ไม่ซ้ำ

## BUG #2 · Dashboard นับกำลังดำเนินการเป็น 0

- **อาการ:** Dashboard แสดงกำลังดำเนินการ 0 ทั้งที่มีคำร้องสถานะ `in-progress`
- **วิธีทำซ้ำ:** ตรวจ GET `/api/requests` แล้วเทียบค่ากับ Dashboard
- **เครื่องมือ:** Browser DevTools Network และ frontend unit test
- **สาเหตุ (ไฟล์:บรรทัด):** `frontend/src/utils/requestSummary.js` ใช้ `in progress` แต่ API ส่ง `in-progress`
- **วิธีแก้:** เปลี่ยนค่าที่ใช้ในการนับเป็น `in-progress`
- **test ที่กัน:** `frontend/src/utils/requestSummary.test.js` → test นับสถานะ `in-progress` ได้ถูกต้อง

## BUG #3 · PUT คำร้องที่ไม่มีอยู่ได้ 500

- **อาการ:** `PUT /api/requests/REQ-999` ตอบ 500 แทน 404
- **วิธีทำซ้ำ:** PUT `/api/requests/REQ-999` พร้อม `{"status":"completed"}`
- **เครื่องมือ:** Stack trace และ integration test
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/controllers/requestController.js` เรียก `updated.id` ก่อนตรวจว่า `updated` เป็น null
- **วิธีแก้:** ตรวจ `if (!updated)` และตอบ 404 ก่อน แล้วจึงเรียก `console.log`
- **test ที่กัน:** integration test `คำร้องที่ไม่มีอยู่ → 404 (ไม่ใช่ 500)`