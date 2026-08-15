import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { signIn, signUp } from "../../lib/auth-client";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || window.location.origin;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:"", email:"", password:"", photoURL:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoad,   setGLoad]   = useState(false);

  const rules = {
    length:    form.password.length >= 6,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
  };
  const pwValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwValid) { toast.error("Password does not meet requirements."); return; }
    setLoading(true);
    try {
      const { error } = await signUp.email({
        email:    form.email,
        password: form.password,
        name:     form.name,
        image:    form.photoURL || undefined,
      });
      if (error) throw new Error(error.message);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) { toast.error(err.message || "Registration failed."); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGLoad(true);
    try {
      await signIn.social({ provider:"google", callbackURL: CLIENT_URL });
    } catch { toast.error("Google sign-up failed."); setGLoad(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">⚽</span>
            <div><span className="logo-main">SportNest</span><span className="logo-sub">Sports Booking</span></div>
          </Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join SportNest to book sports facilities</p>
        </div>

        <button className="btn-google-auth" onClick={handleGoogle} disabled={gLoad}>
          <GoogleIcon/>{gLoad ? "Redirecting to Google…" : "Continue with Google"}
        </button>

        <div className="auth-divider"><span>or register with email</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="John Doe"
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required autoComplete="email"/>
          </div>
          <div className="form-group">
            <label className="form-label">Photo URL <span className="label-optional">(optional)</span></label>
            <input className="form-input" type="url" placeholder="https://example.com/photo.jpg"
              value={form.photoURL} onChange={e=>setForm(f=>({...f,photoURL:e.target.value}))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <input className="form-input" type={showPw?"text":"password"} placeholder="Create a strong password"
                value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required autoComplete="new-password"/>
              <button type="button" className="input-icon-btn" onClick={()=>setShowPw(s=>!s)}>
                {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
            {form.password && (
              <div className="pw-rules">
                {[
                  { k:"length",    l:"At least 6 characters" },
                  { k:"uppercase", l:"One uppercase letter" },
                  { k:"lowercase", l:"One lowercase letter" },
                ].map(r => (
                  <div key={r.k} className={`pw-rule ${rules[r.k]?"valid":"invalid"}`}>
                    {rules[r.k] ? <Check size={11}/> : <X size={11}/>} {r.l}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
      </div>
    </div>
  );
};
export default RegisterPage;
