import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const STATUS = {
  pending:   { bg:"#FFF3CD", color:"#856404", label:"Pending" },
  confirmed: { bg:"#D1E7DD", color:"#0A3622", label:"Confirmed" },
  cancelled: { bg:"#F8D7DA", color:"#58151C", label:"Cancelled" },
};

const CancelModal = ({ booking, onConfirm, onCancel, loading }) => (
  <div className="modal-backdrop" onClick={onCancel}>
    <motion.div className="modal-box" initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}}
      exit={{scale:.85,opacity:0}} onClick={e=>e.stopPropagation()}>
      <div className="modal-warn-icon"><AlertTriangle size={28}/></div>
      <h3 className="modal-title">Cancel Booking?</h3>
      <p className="modal-body">
        Are you sure you want to cancel your booking for <strong>{booking.facility_name}</strong> on <strong>{booking.booking_date}</strong>?
      </p>
      <div className="modal-btns">
        <button className="btn-modal-cancel" onClick={onCancel}>Keep Booking</button>
        <button className="btn-modal-danger" onClick={onConfirm} disabled={loading}>
          {loading?"Cancelling…":"Yes, Cancel"}
        </button>
      </div>
    </motion.div>
  </div>
);

const MyBookingsPage = () => {
  const qc = useQueryClient();
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling,   setCancelling]   = useState(false);
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn:  () => api.get("/bookings/my-bookings").then(r=>r.data.bookings),
  });

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/bookings/${cancelTarget._id}/cancel`);
      toast.success("Booking cancelled.");
      qc.invalidateQueries(["my-bookings"]);
      setCancelTarget(null);
    } catch (err) { toast.error(err.response?.data?.message||"Failed to cancel."); }
    finally { setCancelling(false); }
  };

  const filtered = filter==="all" ? data : data?.filter(b=>b.status===filter);
  const count = s => s==="all" ? data?.length||0 : data?.filter(b=>b.status===s).length||0;

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="page-hero-title" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            My Bookings
          </motion.h1>
          <p className="page-hero-sub">{data?.length||0} total bookings · {count("pending")} pending</p>
        </div>
      </div>

      <div className="container page-body">
        {/* Filter tabs */}
        <div className="booking-filter-tabs">
          {["all","pending","confirmed","cancelled"].map(f=>(
            <button key={f} className={`booking-filter-tab${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
              <span className="tab-count">{count(f)}</span>
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner full={false}/> : !filtered?.length ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>{filter==="all"?"You haven't made any bookings yet.":"No "+filter+" bookings."}</p>
          </div>
        ) : (
          <div className="bookings-table-wrap">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Booking Date</th>
                  <th>Time Slot</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b,i)=>{
                  const s = STATUS[b.status]||STATUS.pending;
                  return (
                    <motion.tr key={b._id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*.05}}>
                      <td>
                        <div className="booking-facility-cell">
                          <img src={b.facility_image||"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=80&q=80"}
                            alt={b.facility_name} className="booking-facility-img"
                            onError={e=>{e.target.src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=80&q=80";}}/>
                          <div>
                            <p className="booking-facility-name">{b.facility_name}</p>
                            <p className="booking-facility-type">{b.facility_type}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="td-with-icon"><Calendar size={13}/>{b.booking_date}</span></td>
                      <td><span className="td-with-icon"><Clock size={13}/>{b.time_slot}</span></td>
                      <td><strong>৳{b.total_price}</strong></td>
                      <td>
                        <span className="status-pill" style={{background:s.bg,color:s.color}}>
                          {s.label}
                        </span>
                      </td>
                      <td>
                        {b.status!=="cancelled" ? (
                          <button className="btn-cancel-booking" onClick={()=>setCancelTarget(b)}>Cancel</button>
                        ) : (
                          <span className="cancelled-text">Cancelled</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelTarget && <CancelModal booking={cancelTarget} onConfirm={handleCancel} onCancel={()=>setCancelTarget(null)} loading={cancelling}/>}
      </AnimatePresence>
    </div>
  );
};
export default MyBookingsPage;
