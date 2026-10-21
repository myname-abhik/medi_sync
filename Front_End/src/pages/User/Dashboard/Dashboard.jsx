import React, { useEffect, useRef, useState } from "react";
import Style from "../../../css/dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { FiUploadCloud } from "react-icons/fi";
import { updateProfile, ALLOWED_IMAGE_TYPES, DEFAULT_AVATAR } from "../../../services/auth";
import { startSession } from "../../../services/session";
import { COOKIE_OPTS } from "../../../config";

const FIELDS = ["name", "email", "phone", "address"];
const MAX_IMAGE_MB = 4; // Vercel rejects request bodies over 4.5 MB

const Dashboard = () => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["user"]);
  const current = useSelector((state) => state.user.userData?.user);
  const fileInput = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { ok, text }

  // Load (and re-load after a save) the saved profile into the form.
  useEffect(() => {
    if (!current) return;
    setForm({ name: current.name || "", email: current.email || "", phone: current.phone || "", address: current.address || "" });
    setPreview(current.Image || DEFAULT_AVATAR);
    setFile(null);
  }, [current]);

  const dirty = !!current && (!!file || FIELDS.some((f) => (form[f] || "") !== (current[f] || "")));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (!ALLOWED_IMAGE_TYPES.includes(picked.type)) {
      setMessage({ ok: false, text: "Invalid file type. Please select a .png, .jpg or .jpeg file." });
      return;
    }
    if (picked.size > MAX_IMAGE_MB * 1024 * 1024) {
      setMessage({ ok: false, text: `Image is too large. Maximum size is ${MAX_IMAGE_MB} MB.` });
      return;
    }
    setFile(picked);
    setMessage(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(picked);
  };

  const save = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = await updateProfile(current._id, { ...form, file }, cookies.user);
      setCookie("user", token, COOKIE_OPTS);
      startSession(dispatch, token);
      setMessage({ ok: true, text: "Profile updated." });
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!current) return null;

  return (
    <section className={Style.dashboard}>
      <div className={Style.dashbaordCard}>
        <div className={Style.top}>
          <div className={`${Style.edit} ${dirty ? Style.active : ""}`} onClick={save} role="button" aria-disabled={!dirty}>
            {saving ? "Saving..." : "Update Profile"} <FiUploadCloud />
          </div>
        </div>
        {message && <div className={`${Style.status} ${message.ok ? Style.ok : Style.bad}`} role="status">{message.text}</div>}
        <div className={Style.bottom}>
          <div className={Style.left}>
            <div className={Style.profilePic} onClick={() => fileInput.current?.click()}>
              <div className={Style.avatar}>Change Avatar</div>
              <img className={Style.img} src={preview} alt="Your avatar" onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)} />
            </div>
            <input ref={fileInput} id="fileUpload" type="file" accept="image/png,image/jpeg" className={Style.profilePicFile} onChange={handleFileChange} style={{ display: "none" }} />
          </div>
          <div className={Style.right}>
            <div className={Style.inputSection}>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className={Style.inputSection}>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className={Style.inputSection}>
              <label htmlFor="phone">Phone:</label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className={Style.inputSection}>
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className={Style.inputSection}>
              <label htmlFor="post">Post:</label>
              <input type="text" id="post" name="post" value={current.post || "Patient"} readOnly />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
