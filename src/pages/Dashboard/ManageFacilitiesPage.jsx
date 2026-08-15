import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Plus, MapPin, Users, AlertTriangle, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const TYPES = [
  "Football Turf","Cricket Net","Cricket Ground","Badminton Court","Tennis Court",
  "Swimming Lane","Basketball Court","Volleyball Court","Table Tennis","Futsal Court",
];
const SLOTS = [
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM",
];

const DeleteModal = ({ facility, onConfirm, onCancel, loading }) => (
  <div className="modal-backdrop" onClick={onCancel}>
    <motion.div className="modal-box" initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}}
      exit={{scale:.85,opacity:0}} onClick={e=>e.stopPropagation()}>
      <div className="modal-warn-icon"><AlertTriangle size={28}/></div>
      <h3 className="modal-title">Delete Facility?</h3>
      <p className="modal-body">You are about to permanently delete <strong>{facility.name}</strong>. This action cannot be undone.</p>
      <div className="modal-btns">
        <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-modal-danger" onClick={onConfirm} disabled={loading}>
          {loading?"Deleting…":"Yes, Delete"}
        </button>
      </div>
    </motion.div>
  </div>
);

const EditModal = ({ facility, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: facility.name, facility_type: facility.facility_type,
    location: facility.location, price_per_hour: facility.price_per_hour,
    capacity: facility.capacity, description: facility.description,
    image: facility.image, available_slots: facility.available_slots||[],
    amenities: facility.amenities||[],
  });
  const [saving, setSaving] = useState(false);
  const ch  = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const tog = (key,val) => setForm(f=>({...f,[key]:f[key].includes(val)?f[key].filter(x=>x!==val):[...f[key],val]}));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    await onSave({...form,price_per_hour:parseFloat(form.price_per_hour),capacity:parseInt(form.capacity)});
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal-box modal-lg" initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}}
        exit={{scale:.9,opacity:0}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Facility</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18}/></button>
        </div>
        <form onSubmit={handleSave} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" name="name" value={form.name} onChange={ch} required/></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" name="facility_type" value={form.facility_type} onChange={ch}>
                {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" name="location" value={form.location} onChange={ch} required/></div>
            <div className="form-group"><label className="form-label">Price/hr (৳)</label><input className="form-input" type="number" name="price_per_hour" value={form.price_per_hour} onChange={ch} required/></div>
            <div className="form-group"><label className="form-label">Capacity</label><input className="form-input" type="number" name="capacity" value={form.capacity} onChange={ch} required/></div>
            <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" name="image" value={form.image} onChange={ch}/></div>
          </div>
          <div className="form-group">
            <label className="form-label">Available Slots</label>
            <div className="slots-pick-grid">
              {SLOTS.map(s=><button key={s} type="button" className={`slot-pick-btn${form.available_slots.includes(s)?" selected":""}`} onClick={()=>tog("available_slots",s)}>{s}</button>)}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" name="description" value={form.description} onChange={ch} rows={3}/>
          </div>
          <div className="modal-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-primary" disabled={saving}>{saving?"Saving…":"Save Changes"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ManageFacilitiesPage = () => {
  const qc = useQueryClient();
  const [delTarget,  setDelTarget]  = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["my-facilities"],
    queryFn:  () => api.get("/facilities/owner/mine").then(r=>r.data.facilities),
  });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/facilities/${delTarget._id}`);
      toast.success("Facility deleted.");
      qc.invalidateQueries(["my-facilities"]);
      setDelTarget(null);
    } catch (err) { toast.error(err.response?.data?.message||"Delete failed."); }
    finally { setDeleting(false); }
  };

  const handleUpdate = async (updated) => {
    try {
      await api.put(`/facilities/${editTarget._id}`, updated);
      toast.success("Facility updated!");
      qc.invalidateQueries(["my-facilities"]);
      setEditTarget(null);
    } catch (err) { toast.error(err.response?.data?.message||"Update failed."); }
  };

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container page-hero-row">
          <div>
            <motion.h1 className="page-hero-title" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
              Manage My Facilities
            </motion.h1>
            <p className="page-hero-sub">Update or remove your listed facilities</p>
          </div>
          <Link to="/add-facility" className="btn-green"><Plus size={15}/>Add New Facility</Link>
        </div>
      </div>

      <div className="container page-body">
        {isLoading ? <LoadingSpinner full={false}/> : !data?.length ? (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h3>No facilities listed yet</h3>
            <p>Start by adding your first sports venue.</p>
            <Link to="/add-facility" className="btn-outline-green"><Plus size={14}/>Add Facility</Link>
          </div>
        ) : (
          <div className="manage-grid">
            {data.map((f,i) => (
              <motion.div key={f._id} className="manage-card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}>
                <div className="manage-img-wrap">
                  <img src={f.image} alt={f.name} className="manage-img"
                    onError={e=>{e.target.src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80";}}/>
                  <span className="manage-type-chip">{f.facility_type}</span>
                </div>
                <div className="manage-card-body">
                  <h3 className="manage-card-name">{f.name}</h3>
                  <div className="manage-card-meta">
                    <span><MapPin size={12}/>{f.location}</span>
                    <span><Users size={12}/>{f.capacity} people</span>
                  </div>
                  <div className="manage-card-stats">
                    <span className="manage-price">৳{f.price_per_hour}/hr</span>
                    <span className="manage-bookings">{f.booking_count||0} bookings</span>
                  </div>
                  <div className="manage-card-btns">
                    <button className="btn-manage-edit" onClick={()=>setEditTarget(f)}><Edit2 size={13}/>Edit</button>
                    <button className="btn-manage-del"  onClick={()=>setDelTarget(f)}><Trash2 size={13}/>Delete</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {delTarget  && <DeleteModal facility={delTarget}  onConfirm={handleDelete} onCancel={()=>setDelTarget(null)}  loading={deleting}/>}
        {editTarget && <EditModal   facility={editTarget} onClose={()=>setEditTarget(null)} onSave={handleUpdate}/>}
      </AnimatePresence>
    </div>
  );
};
export default ManageFacilitiesPage;
