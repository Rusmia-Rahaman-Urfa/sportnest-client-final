import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar        from "./components/Navbar/Navbar";
import Footer        from "./components/Footer/Footer";
import PrivateRoute  from "./components/PrivateRoute";
import LoadingSpinner from "./components/UI/LoadingSpinner";

const HomePage             = lazy(() => import("./pages/Home/HomePage"));
const AllFacilitiesPage    = lazy(() => import("./pages/Facilities/AllFacilitiesPage"));
const FacilityDetailPage   = lazy(() => import("./pages/Facilities/FacilityDetailPage"));
const AddFacilityPage      = lazy(() => import("./pages/Dashboard/AddFacilityPage"));
const ManageFacilitiesPage = lazy(() => import("./pages/Dashboard/ManageFacilitiesPage"));
const MyBookingsPage       = lazy(() => import("./pages/Bookings/MyBookingsPage"));
const LoginPage            = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage         = lazy(() => import("./pages/Auth/RegisterPage"));
const NotFoundPage         = lazy(() => import("./pages/NotFoundPage"));

const App = () => (
  <div className="app-root">
    <Navbar/>
    <main className="main-content">
      <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
          <Route path="/"            element={<HomePage/>}/>
          <Route path="/facilities"  element={<AllFacilitiesPage/>}/>
          <Route path="/login"       element={<LoginPage/>}/>
          <Route path="/register"    element={<RegisterPage/>}/>
          <Route path="/facilities/:id" element={<PrivateRoute><FacilityDetailPage/></PrivateRoute>}/>
          <Route path="/add-facility"   element={<PrivateRoute><AddFacilityPage/></PrivateRoute>}/>
          <Route path="/manage-facilities" element={<PrivateRoute><ManageFacilitiesPage/></PrivateRoute>}/>
          <Route path="/my-bookings"    element={<PrivateRoute><MyBookingsPage/></PrivateRoute>}/>
          <Route path="*"            element={<NotFoundPage/>}/>
        </Routes>
      </Suspense>
    </main>
    <Footer/>
  </div>
);
export default App;
