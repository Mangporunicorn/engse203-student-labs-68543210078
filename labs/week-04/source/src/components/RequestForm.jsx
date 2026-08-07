import { useState } from "react";

// ค่าเริ่มต้นของฟอร์ม
const initialFormData = {
  requesterName: "",
  requestType: "",
  location: "",
  details: "",
  priority: "normal",
};

function RequestForm({ onAddRequest }) {
  // Controlled Form State
  const [formData, setFormData] = useState(initialFormData);

  // เก็บข้อความ error ของแต่ละ field
  const [errors, setErrors] = useState({});

  // ข้อความแจ้งผลหลังเพิ่มคำร้องสำเร็จ
  const [statusMessage, setStatusMessage] = useState("");

  // ตรวจสอบข้อมูลในฟอร์ม
  function validate(data) {
    const nextErrors = {};

    // ชื่อต้องมีอย่างน้อย 2 ตัวอักษร
    if (data.requesterName.trim().length < 2) {
      nextErrors.requesterName = "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร";
    }

    // ต้องเลือกประเภทคำร้อง
    if (!data.requestType) {
      nextErrors.requestType = "กรุณาเลือกประเภทคำร้อง";
    }

    // สถานที่ห้ามว่าง
    if (!data.location.trim()) {
      nextErrors.location = "กรุณากรอกสถานที่";
    }

    // รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร
    if (data.details.trim().length < 10) {
      nextErrors.details = "กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร";
    }

    // priority ต้องเป็น normal หรือ urgent เท่านั้น
    if (!["normal", "urgent"].includes(data.priority)) {
      nextErrors.priority = "กรุณาเลือกความเร่งด่วน";
    }

    return nextErrors;
  }

  // ทำงานทุกครั้งที่ผู้ใช้เปลี่ยนค่าภายใน form
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    // ถ้าผู้ใช้กลับมาแก้ field ให้ล้าง error ของ field นั้น
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    // ล้างข้อความ success เมื่อเริ่มแก้ form ใหม่
    setStatusMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    // TODO LAB4-R05–R07: validate controlled state แล้วเรียก onAddRequest
    const nextErrors = validate(formData);

    setErrors(nextErrors);

    // ถ้ามี error ไม่ให้เพิ่มคำร้อง
    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("");
      return;
    }

    // ส่งข้อมูลกลับไปยัง App.jsx
    onAddRequest({
      ...formData,
      requesterName: formData.requesterName.trim(),
      location: formData.location.trim(),
      details: formData.details.trim(),
    });

    // reset form หลังเพิ่มสำเร็จ
    setFormData(initialFormData);

    // ล้าง error
    setErrors({});

    // แจ้งผลสำเร็จ
    setStatusMessage("เพิ่มคำร้องเรียบร้อยแล้ว");
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>

      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* =========================
            ชื่อผู้แจ้ง
        ========================== */}
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>

          <input
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requesterName)}
            aria-describedby="requesterName-error"
          />

          <small className="error" id="requesterName-error">
            {errors.requesterName}
          </small>
        </div>

        {/* =========================
            ประเภทคำร้อง
        ========================== */}
        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>

          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requestType)}
            aria-describedby="requestType-error"
          >
            <option value="">-- เลือกประเภท --</option>

            <option value="แจ้งซ่อม">แจ้งซ่อม</option>

            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>

            <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
          </select>

          <small className="error" id="requestType-error">
            {errors.requestType}
          </small>
        </div>

        {/* =========================
            สถานที่
        ========================== */}
        <div className="field">
          <label htmlFor="location">สถานที่</label>

          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            aria-invalid={Boolean(errors.location)}
            aria-describedby="location-error"
          />

          <small className="error" id="location-error">
            {errors.location}
          </small>
        </div>

        {/* =========================
            รายละเอียด
        ========================== */}
        <div className="field">
          <label htmlFor="details">รายละเอียด</label>

          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
            aria-invalid={Boolean(errors.details)}
            aria-describedby="details-error"
          ></textarea>

          <small className="error" id="details-error">
            {errors.details}
          </small>
        </div>

        {/* =========================
    ความเร่งด่วน
========================== */}
        <div className="field">
          <label htmlFor="priority">ความเร่งด่วน</label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby="priority-error"
          >
            <option value="normal">ปกติ</option>

            <option value="urgent">เร่งด่วน</option>
          </select>

          <small className="error" id="priority-error">
            {errors.priority}
          </small>
        </div>

        {/* =========================
            Submit
        ========================== */}
        <button type="submit">เพิ่มคำร้อง</button>

        <p className="status" role="status">
          {statusMessage}
        </p>
      </form>
    </section>
  );
}

export default RequestForm;
