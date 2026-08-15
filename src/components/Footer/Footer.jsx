import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Facebook, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon">⚽</span>
            <div>
              <span className="logo-main">SportNest</span>
              <span className="logo-sub">Sports Booking</span>
            </div>
          </Link>
          <p className="footer-about">SportNest helps players discover, compare, and book sports facilities with a simple and reliable online booking experience.</p>
          <div className="footer-socials">
            <a href="https://github.com/your-github-username"   target="_blank" rel="noreferrer"><Github size={17}/></a>
            <a href="https://linkedin.com/in/your-linkedin-username" target="_blank" rel="noreferrer"><Linkedin size={17}/></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={17}/></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17}/></a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-col-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/facilities">All Facilities</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/add-facility">Add Facility</Link></li>
            <li><Link to="/manage-facilities">Manage Facilities</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Facility Types</h4>
          <ul className="footer-col-links">
            {["Football Turf","Badminton Court","Swimming Lane","Tennis Court","Cricket Net"].map(t => (
              <li key={t}><Link to={`/facilities?type=${t}`}>{t}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Contact Us</h4>
          <ul className="footer-contact-list">
            <li><Mail size={14}/><a href="mailto:support@sportnest.com">support@sportnest.com</a></li>
            <li><Phone size={14}/><a href="tel:+8801234567890">+880 1234 567890</a></li>
            <li><MapPin size={14}/><span>Dhaka, Bangladesh</span></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer-cta-band">
      <div className="footer-inner footer-cta-inner">
        <div>
          <p className="footer-cta-title">Ready to play?</p>
          <p className="footer-cta-sub">Find your preferred facility and book your next game easily.</p>
        </div>
        <Link to="/facilities" className="btn-footer-cta">Explore Facilities</Link>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-inner footer-bottom-inner">
        <p>© {new Date().getFullYear()} SportNest. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
