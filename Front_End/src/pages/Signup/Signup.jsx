import React, { useState } from "react";
import Style from "../../css/signup.module.css";
import AuthStyle from "../../css/auth.module.css";
import { Button } from "../../Components";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { signup } from "../../services/auth";
import { startSession } from "../../services/session";
import { COOKIE_OPTS } from "../../config";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["user"]);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (cookies.user) return <Navigate to="/user/dashboard" replace />;

  const handleInputChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const token = await signup(data);
      setCookie("user", token, COOKIE_OPTS);
      startSession(dispatch, token);
      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={Style.signup}>
      <form className={Style.signupForm} onSubmit={handleSubmit}>
        <div className={Style.signupTitle}>Signup Page</div>
        <div className={Style.inputSection}>
          {error && <div className={AuthStyle.error} role="alert">{error}</div>}
          <input type="text" name="name" placeholder="Name" required autoComplete="name" className={Style.input} value={data.name} onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" required autoComplete="email" className={Style.input} value={data.email} onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password (min. 6 characters)" required minLength={6} autoComplete="new-password" className={Style.input} value={data.password} onChange={handleInputChange} />
          <Button text={busy ? "Creating account..." : "Signup"} type="button" disabled={busy} />
        </div>
        <div className={Style.signupFormText}>
          Already have an account ? <Link to="/login" className={Style.register}>Login</Link>
        </div>
      </form>
    </section>
  );
};

export default Signup;
