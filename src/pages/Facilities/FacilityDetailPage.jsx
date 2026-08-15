import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, Clock, ChevronLeft, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { useSession } from "../../lib/auth-client";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const ALL_SLOTS = [
  "06:00 AM - 07:00 AM","07:00 AM - 08:00 AM","08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM","10:00 AM - 11:00 AM","11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM","02:00 PM - 03:00 PM","03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM","05:00 PM - 06:00 PM","06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM","08:00 PM - 09:00 PM",
];

const FacilityDetailPage = () => {
  const { id }            = useParams();
  const navigate          = useNavigate();
  const { data: session } = useSession();
  const user              = session?.user;
  const [date,   setDate]   = useState("");
  const [slot,   setSlot]   = useState("");
  const [hours,  setHours]  = useState(1);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const { data: facility, isLoading } = useQuery({
    queryKey: ["facility", id],
    queryFn:  () => api.get(`/facilities/${id}`).then(r => r.data.facility),
  });

  const { data: slotsData } = useQuery({
    queryKey: ["slots", id, date],
    queryFn:  () => api.get(`/bookings/slots/${id}`, { params:{ date } }).then(r => r.data.bookedSlots),
    enabled:  !!date,
  });
  const bookedSlots = slotsData || [];
  const totalPrice  = facility ? facility.price_per_hour * hours : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!date || !slot) { toast.error("Please select a date and time slot."); return; }
    setSaving(true);
    try {
      await api.post("/bookings", { facility_id:id, booking_date:date, time_slot:slot, hours });
      toast.success("Booking confirmed successfully!");
      navigate("/my-bookings");
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed."); }
    finally { setSaving(false); }
  };

  if (isLoading) return <LoadingSpinner/>;
  if (!facility) return (
    <div className="page-shell">
      <div className="container">
        <div className="empty-state"><h3>Facility not found</h3></div>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <button className="back-btn" onClick={()=>navigate(-1)}>
            <ChevronLeft size={16}/>Back to Facilities
          </button>
          <h1 className="page-hero-title">{facility.name}</h1>
          <p className="page-hero-sub">{facility.location}</p>
        </div>
      </div>

      <div className="container page-body">
        <div className="detail-grid">
          {/* Left */}
          <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}>
            <div className="detail-img-wrap">
              <img src={facility.image} alt={facility.name} className="detail-img"
                onError={e=>{e.target.src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80";}}/>
              <span className="detail-type-tag">{facility.facility_type}</span>
            </div>

            <div className="detail-info-card">
              <h2 className="detail-info-title">Facility Details</h2>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <MapPin size={16} className="detail-info-icon"/>
                  <div><p className="detail-info-label">Location</p><p className="detail-info-val">{facility.location}</p></div>
                </div>
                <div className="detail-info-item">
                  <Users size={16} className="detail-info-icon"/>
                  <div><p className="detail-info-label">Capacity</p><p className="detail-info-val">{facility.capacity} people</p></div>
                </div>
                <div className="detail-info-item">
                  <Clock size={16} className="detail-info-icon"/>
                  <div><p className="detail-info-label">Available Slots</p><p className="detail-info-val">{facility.available_slots?.join(", ") || "Multiple slots"}</p></div>
                </div>
                <div className="detail-info-item">
                  <Calendar size={16} className="detail-info-icon"/>
                  <div><p className="detail-info-label">Price</p><p className="detail-info-val">৳{facility.price_per_hour} / hour</p></div>
                </div>
              </div>
            </div>

            <div className="detail-desc-card">
              <h2 className="detail-info-title">About this Facility</h2>
              <p className="detail-desc-text">{facility.description}</p>
            </div>

            {facility.amenities?.length > 0 && (
              <div className="detail-amenities-card">
                <h2 className="detail-info-title">Amenities</h2>
                <div className="amenities-wrap">
                  {facility.amenities.map(a => <span key={a} className="amenity-chip">✓ {a}</span>)}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right — Booking Form */}
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:.1}}>
            <div className="booking-form-card">
              <div className="booking-form-header">
                <h2 className="booking-form-title">Book This Facility</h2>
                <p className="booking-form-price">৳{facility.price_per_hour}<span>/hour</span></p>
              </div>

              <form onSubmit={handleBook} className="booking-form">
                <div className="form-group">
                  <label className="form-label">Facility Name</label>
                  <input className="form-input" value={facility.name} readOnly/>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Date *</label>
                  <input className="form-input" type="date" min={today}
                    value={date} onChange={e=>{setDate(e.target.value);setSlot("");}} required/>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Time Slot *</label>
                  <div className="slots-grid">
                    {ALL_SLOTS.map(s => {
                      const taken = bookedSlots.includes(s);
                      return (
                        <button key={s} type="button"
                          className={`slot-chip${slot===s?" selected":""}${taken?" taken":""}`}
                          onClick={()=>!taken&&setSlot(s)} disabled={taken}>
                          {s.split(" - ")[0]}
                          {taken && <span className="slot-taken-label">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <div className="hours-row">
                    <button type="button" className="hours-btn" onClick={()=>setHours(h=>Math.max(1,h-1))}>−</button>
                    <span className="hours-display">{hours} {hours===1?"hour":"hours"}</span>
                    <button type="button" className="hours-btn" onClick={()=>setHours(h=>Math.min(8,h+1))}>+</button>
                  </div>
                </div>

                <div className="booking-price-row">
                  <span>৳{facility.price_per_hour} × {hours} {hours===1?"hour":"hours"}</span>
                  <span className="booking-price-total">৳{totalPrice}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input className="form-input" value={user?.email||""} readOnly/>
                </div>

                <button type="submit" className="btn-confirm-booking" disabled={saving||!slot||!date}>
                  {saving ? "Confirming…" : `Confirm Booking — ৳${totalPrice}`}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default FacilityDetailPage;
