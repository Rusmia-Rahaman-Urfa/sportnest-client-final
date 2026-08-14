import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, Calendar, Plus, Settings, Sun, Moon } from "lucide-react";
import { useSession, signOut } from "../../lib/auth-client";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { data: session }      = useSession();
  const user                   = session?.user;
  const { theme, toggleTheme } = useTheme();
  const navigate               = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    navigate("/");
    setDropOpen(false); setMobileOpen(false);
  };

  const publicLinks  = [
    { to:"/",           label:"Home",          end:true },
    { to:"/facilities", label:"All Facilities" },
  ];
  const privateLinks = [
    { to:"/my-bookings",       label:"My Bookings",       icon:<Calendar size={14}/> },
    { to:"/add-facility",      label:"Add Facility",      icon:<Plus size={14}/> },
    { to:"/manage-facilities", label:"Manage My Facilities", icon:<Settings size={14}/> },
  ];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">⚽</span>
          <div className="logo-text-wrap">
            <span className="logo-main">SportNest</span>
            <span className="logo-sub">Sports Booking</span>
          </div>
        </Link>

        <div className="nav-center">
          {publicLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>{l.label}</NavLink>
          ))}
          {user && privateLinks.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>{l.label}</NavLink>
          ))}
        </div>

        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16}/> : <Sun size={16}/>}
          </button>

          {user ? (
            <div className="user-menu" ref={dropRef}>
              <button className="user-btn" onClick={() => setDropOpen(o => !o)}>
                <img src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=fff&bold=true`}
                  alt={user.name} className="user-avatar"/>
                <span className="user-name">{user.name?.split(" ")[0]}</span>
                <ChevronDown size={13} className={dropOpen ? "chevron open" : "chevron"}/>
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div className="user-dropdown"
                    initial={{opacity:0,y:-6,scale:.96}} animate={{opacity:1,y:0,scale:1}}
                    exit={{opacity:0,y:-6,scale:.96}} transition={{duration:.15}}>
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"/>
                    {privateLinks.map(l => (
                      <Link key={l.to} to={l.to} className="dropdown-link" onClick={() => setDropOpen(false)}>
                        {l.icon}{l.label}
                      </Link>
                    ))}
                    <div className="dropdown-divider"/>
                    <button className="dropdown-link logout" onClick={handleLogout}>
                      <LogOut size={14}/>Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login"    className="btn-nav-login">Login</Link>
              <Link to="/register" className="btn-nav-register">Register</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-nav"
            initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}} transition={{duration:.2}}>
            {publicLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}>{l.label}</NavLink>
            ))}
            {user && privateLinks.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}>{l.icon}{l.label}</NavLink>
            ))}
            {user
              ? <button className="mobile-nav-link logout" onClick={handleLogout}><LogOut size={14}/>Logout</button>
              : <>
                  <Link to="/login"    className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
