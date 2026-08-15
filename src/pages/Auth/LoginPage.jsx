import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "../../lib/auth-client";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || window.location.origin;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || "/";
  const [form,    setForm]    = useState({ email:"", password:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoad,   setGLoad]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { error } = await signIn.email({ email: form.email, password: form.password });
      if (error) throw new Error(error.message);
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } catch (err) { toast.error(err.message || "Invalid email or password."); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoad(true);
    try {
      await signIn.social({
        provider:    "google",
        callbackURL: `${CLIENT_URL}${from === "/" ? "" : from}`,
      });
    } catch { toast.error("Google sign-in failed."); setGLoad(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">⚽</span>
            <div><span className="logo-main">SportNest</span><span className="logo-sub">Sports Booking</span></div>
          </Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>
        </div>

        <button className="btn-google-auth" onClick={handleGoogle} disabled={gLoad}>
          <GoogleIcon/>{gLoad ? "Redirecting to Google…" : "Continue with Google"}
        </button>

        <div className="auth-divider"><span>or sign in with email</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required autoComplete="email"/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <input className="form-input" type={showPw?"text":"password"} placeholder="Enter your password"
                value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required autoComplete="current-password"/>
              <button type="button" className="input-icon-btn" onClick={()=>setShowPw(s=>!s)}>
                {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">Don&apos;t have an account? <Link to="/register" className="auth-link">Register here</Link></p>
      </div>
    </div>
  );
};
export default LoginPage;
