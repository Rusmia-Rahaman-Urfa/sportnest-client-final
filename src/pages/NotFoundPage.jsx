import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
const NotFoundPage = () => (
  <div className="notfound-page">
    <motion.div className="notfound-content" initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
      <div className="notfound-num">404</div>
      <div className="notfound-emoji">🏟️</div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <div className="notfound-btns">
        <Link to="/" className="btn-green"><Home size={16}/>Back to Home</Link>
        <button className="btn-outline-green" onClick={()=>window.history.back()}><ArrowLeft size={16}/>Go Back</button>
      </div>
    </motion.div>
  </div>
);
export default NotFoundPage;
