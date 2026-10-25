# หลักฐานการสาธิต (A4)

> รอบนี้ตั้งใจข้ามขั้นตอนอัดวิดีโอก่อน จึงยังไม่มีลิงก์วิดีโอ

## ช่วง A — สาธิตระบบ

- [ ] เปิดระบบ 3 ชั้น
- [ ] CRUD
- [ ] health check
- [ ] production mode พอร์ตเดียว

## ช่วง B — อธิบาย source

- [ ] frontend → API → controller → service → database
- [ ] config และ environment variables
- [ ] health check
- [ ] production vs development

## Production Test

หลัง `npm run build` ให้ทดสอบด้วย `NODE_ENV=production` และ `PORT=10000` แล้วตรวจ `/`, `/about` และ `/api/health`
