import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { useSession } from "../../lib/auth-client";

const TYPES = [
  "Football Turf","Cricket Net","Cricket Ground","Badminton Court","Tennis Court",
  "Swimming Lane","Basketball Court","Volleyball Court","Table Tennis","Futsal Court",
];
const SLOTS = [
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM",
];
const AMENITIES = [
  "Parking","Changing Rooms","Showers","Floodlights","Cafeteria",
  "First Aid","Equipment Rental","Scoreboard","Wi-Fi","AC","Drinking Water",
];

const AddFacilityPage = () => {
  const { data: session }  = useSession();
  const user               = session?.user;
  const navigate           = useNavigate();
  const [uploading,  setUploading]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name:"", facility_type:"", image:"", location:"",
    price_per_hour:"", capacity:"", description:"",
    available_slots:[], amenities:[],
  });

  const ch  = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const tog = (key,val) => setForm(f=>({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x=>x!==val) : [...f[key],val],
  }));

  const handleImg = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5*1024*1024) { toast.error("Image must be under 5MB."); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res  = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,{ method:"POST", body:fd });
      const data = await res.json();
      if (data.success) { setForm(f=>({...f,image:data.data.url})); toast.success("Image uploaded!"); }
      else throw new Error();
    } catch { toast.error("Upload failed. Paste an image URL instead."); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image)                 { toast.error("Please add a facility image.");    return; }
    if (!form.available_slots.length){ toast.error("Select at least one time slot."); return; }
    setSubmitting(true);
    try {
      await api.post("/facilities", {
        ...form,
        price_per_hour: parseFloat(form.price_per_hour),
        capacity:       parseInt(form.capacity),
        owner_email:    user.email,
      });
      toast.success("Facility added successfully!");
      navigate("/manage-facilities");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add facility."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="page-hero-title" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            Add New Facility
          </motion.h1>
          <p className="page-hero-sub">List your sports facility and start receiving bookings</p>
        </div>
      </div>

      <div className="container page-body">
        <motion.div className="form-card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
          <form onSubmit={handleSubmit} className="add-facility-form">

            <div className="form-section-title">Basic Information</div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Facility Name *</label>
                <input className="form-input" name="name" placeholder="e.g. Green Arena Football Turf"
                  value={form.name} onChange={ch} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Facility Type *</label>
                <select className="form-input" name="facility_type" value={form.facility_type} onChange={ch} required>
                  <option value="">Select facility type</option>
                  {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" name="location" placeholder="e.g. Mirpur, Dhaka"
                  value={form.location} onChange={ch} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Price Per Hour (৳) *</label>
                <input className="form-input" type="number" name="price_per_hour" placeholder="e.g. 1200"
                  min="0" value={form.price_per_hour} onChange={ch} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Capacity (people) *</label>
                <input className="form-input" type="number" name="capacity" placeholder="e.g. 20"
                  min="1" value={form.capacity} onChange={ch} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Owner Email</label>
                <input className="form-input" value={user?.email||""} readOnly/>
              </div>
            </div>

            <div className="form-section-title">Facility Image *</div>
            {form.image ? (
              <div className="img-preview-box">
                <img src={form.image} alt="preview" className="img-preview"/>
                <button type="button" className="img-remove-btn" onClick={()=>setForm(f=>({...f,image:""}))}>
                  <X size={14}/> Remove
                </button>
              </div>
            ) : (
              <label className="upload-zone">
                <input type="file" accept="image/*" className="hidden-input" onChange={handleImg}/>
                <Upload size={28}/>
                <span>{uploading?"Uploading…":"Click to upload image"}</span>
                <span className="upload-sub">PNG, JPG up to 5MB</span>
              </label>
            )}
            <div className="or-text">— or paste image URL directly —</div>
            <input className="form-input" placeholder="https://example.com/image.jpg"
              value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))}/>

            <div className="form-section-title">Available Time Slots *</div>
            <div className="slots-pick-grid">
              {SLOTS.map(s=>(
                <button key={s} type="button"
                  className={`slot-pick-btn${form.available_slots.includes(s)?" selected":""}`}
                  onClick={()=>tog("available_slots",s)}>{s}</button>
              ))}
            </div>

            <div className="form-section-title">Amenities</div>
            <div className="amenity-pick-wrap">
              {AMENITIES.map(a=>(
                <button key={a} type="button"
                  className={`amenity-pick-btn${form.amenities.includes(a)?" selected":""}`}
                  onClick={()=>tog("amenities",a)}>
                  {form.amenities.includes(a)?"✓ ":"+ "}{a}
                </button>
              ))}
            </div>

            <div className="form-section-title">Description *</div>
            <div className="form-group">
              <textarea className="form-input form-textarea" name="description" rows={4}
                placeholder="Describe your facility — surface type, rules, nearby landmarks…"
                value={form.description} onChange={ch} required/>
            </div>

            <button type="submit" className="btn-submit-form" disabled={submitting||uploading}>
              <Plus size={16}/>{submitting ? "Publishing…" : "Publish Facility"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
export default AddFacilityPage;
