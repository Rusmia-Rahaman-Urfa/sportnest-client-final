import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";
import FacilityCard from "../../components/Cards/FacilityCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const fadeUp = {
  hidden:  { opacity:0, y:24 },
  visible: (i=0) => ({ opacity:1, y:0, transition:{ delay:i*.1, duration:.45 } }),
};

const HomePage = () => {
  const { data: featured, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn:  () => api.get("/facilities/featured").then(r => r.data.facilities),
  });

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-overlay"/>
        <div className="hero-content">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <p className="hero-eyebrow">Why Choose Us</p>
            <h1 className="hero-title">Book Your Favorite Sports Facility Anytime</h1>
            <p className="hero-desc">Find and reserve football turfs, cricket nets, badminton courts, tennis courts, and more with a simple online booking experience.</p>
            <Link to="/facilities" className="btn-hero">Explore Facilities <ArrowRight size={17}/></Link>
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="why-section">
        <div className="container">
          <motion.div className="section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
            Why Choose Us
          </motion.div>
          <motion.h2 className="section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={1}>
            Built for Easy Sports Booking
          </motion.h2>
          <motion.p className="section-desc" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={2}>
            SportNest helps players quickly discover, compare, and book sports facilities from a simple online platform.
          </motion.p>
          <div className="why-grid">
            {[
              { icon:<CheckCircle size={28}/>, title:"Multiple Sports Options", desc:"Find football turfs, cricket nets, badminton courts, tennis courts, and more in one place." },
              { icon:<Clock size={28}/>,       title:"Easy Booking Experience", desc:"Check available facilities and choose your preferred time slot without any hassle." },
              { icon:<Star size={28}/>,        title:"Reliable Facility Details", desc:"View location, price, capacity, and facility information before making a booking decision." },
            ].map((w,i) => (
              <motion.div key={w.title} className="why-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                <div className="why-icon">{w.icon}</div>
                <h3 className="why-title">{w.title}</h3>
                <p className="why-desc">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="container">
          <motion.div className="section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
            How It Works
          </motion.div>
          <motion.h2 className="section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={1}>
            Book in Three Simple Steps
          </motion.h2>
          <motion.p className="section-desc" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={2}>
            A simple process to help users find and reserve sports facilities faster.
          </motion.p>
          <div className="steps-grid">
            {[
              { n:"01", title:"Browse Facilities",  desc:"Explore available sports facilities with price, capacity, location, and facility type." },
              { n:"02", title:"Choose a Time Slot", desc:"Open a facility details page and select an available time slot that matches your schedule." },
              { n:"03", title:"Confirm Booking",    desc:"Book your preferred facility and manage your bookings from your account dashboard." },
            ].map((s,i) => (
              <motion.div key={s.n} className="step-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED FACILITIES ── */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <motion.div className="section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                Featured Facilities
              </motion.div>
              <motion.h2 className="section-title left" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={1}>
                Popular Facilities
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}} custom={2}>
              <Link to="/facilities" className="btn-view-all">View All Facilities <ArrowRight size={15}/></Link>
            </motion.div>
          </div>

          {isLoading ? <LoadingSpinner full={false}/> : (
            <div className="facilities-grid">
              {(featured||[]).map((f,i) => (
                <motion.div key={f._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{once:true}}>
                  <FacilityCard facility={f}/>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default HomePage;
