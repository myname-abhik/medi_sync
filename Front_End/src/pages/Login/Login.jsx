import React, { useState } from "react";
import Style from "../../css/login.module.css";
import AuthStyle from "../../css/auth.module.css";
import { Button } from "../../Components";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { login, DEMO_ACCOUNT } from "../../services/auth";
import { startSession } from "../../services/session";
import { COOKIE_OPTS } from "../../config";
import { useApiAvailable } from "../../services/mode";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["user"]);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const apiAvailable = useApiAvailable();

  if (cookies.user) return <Navigate to="/user/dashboard" replace />;

  const handleInputChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const token = await login(data);
      setCookie("user", token, COOKIE_OPTS);
      startSession(dispatch, token);
      navigate(location.state?.from || "/user/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={Style.login}>
      <form className={Style.loginForm} onSubmit={handleSubmit}>
        <div className={Style.loginTitle}>Login Page</div>
        <div className={Style.inputSection}>
          {error && <div className={AuthStyle.error} role="alert">{error}</div>}
          <input type="email" name="email" placeholder="Email" required autoComplete="email" className={Style.input} value={data.email} onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" required autoComplete="current-password" className={Style.input} value={data.password} onChange={handleInputChange} />
          <Button text={busy ? "Logging in..." : "Login"} type="button" disabled={busy} />
        </div>
        <div className={Style.loginFormText}>
          Don&apos;t have an account yet ? <Link to="/signup" className={Style.register}>Register</Link>
        </div>
        {apiAvailable === false && (
          <div className={AuthStyle.hint}>
            Just exploring?{" "}
            <button type="button" onClick={() => setData({ ...DEMO_ACCOUNT })}>
              Fill in the demo account
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default Login;
