import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { useSession } from "../../lib/auth-client";

const FacilityCard = ({ facility }) => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!session) navigate("/login", { state: { from: `/facilities/${facility._id}` } });
    else          navigate(`/facilities/${facility._id}`);
  };

  return (
    <motion.div className="facility-card" whileHover={{ y:-4 }} transition={{ duration:.2 }}>
      <div className="fc-img-wrap">
        <img src={facility.image} alt={facility.name} className="fc-img" loading="lazy"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80"; }}/>
        <span className="fc-type-badge">{facility.facility_type}</span>
      </div>
      <div className="fc-body">
        <h3 className="fc-name">{facility.name}</h3>
        <div className="fc-meta">
          <span className="fc-meta-item"><MapPin size={13}/>{facility.location}</span>
          <span className="fc-meta-item"><Users size={13}/>Capacity: {facility.capacity} people</span>
        </div>
        <div className="fc-footer">
          <div className="fc-price">
            <span className="fc-price-val">৳{facility.price_per_hour}</span>
            <span className="fc-price-unit"> / hour</span>
          </div>
          <button className="btn-book-now" onClick={handleBook}>Book Now</button>
        </div>
      </div>
    </motion.div>
  );
};
export default FacilityCard;
