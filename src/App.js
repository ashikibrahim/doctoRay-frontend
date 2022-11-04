import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notifications from "./pages/Notifications";
import UserList from "./pages/Admin/UserList";
import DoctorList from "./pages/Admin/DoctorList";
import DoctorProfile from "./pages/Doctor/Profile";
import BookAppointment from "./pages/User/BookAppointment";
import DoctorDetails from "./pages/Doctor/DoctorDetails";
import Checkout from "./pages/User/Checkout";
import DoctorAppointments from "./pages/Doctor/Appointments";
import UserAppointments from  "./pages/User/UserAppointments"

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      <BrowserRouter>
        {loading && (
          <div className="spinner-parent">
            <div className="spinner-border" role="status"></div>
          </div>
        )}

        <Toaster position="top-center" reverseOrder={false} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/apply-doctor"
              element={
                <ProtectedRoutes>
                  <ApplyDoctor />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/doctor/profile/:userId"
              element={
                <ProtectedRoutes>
                  <DoctorProfile />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/doctor-details/:doctorId"
              element={
                <ProtectedRoutes>
                  <DoctorDetails />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/book-appointment/:doctorId"
              element={
                <ProtectedRoutes>
                  <BookAppointment />
                </ProtectedRoutes>
              }
            />
         
            <Route
              path="/checkout/:appointmentId"
              element={
                <ProtectedRoutes>
                  <Checkout />
                </ProtectedRoutes>
              }
            />
             <Route
          path="/appointments"
          element={
            <ProtectedRoutes>
              <UserAppointments />
            </ProtectedRoutes>
          }
        />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoutes>
                  <DoctorAppointments />
                </ProtectedRoutes>
              }
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/userslist" element={<UserList />} />
            <Route path="/admin/doctorslist" element={<DoctorList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
export function ProtectedRoutes({ children }) {
  const user = localStorage.getItem("token");
  if (user !== "" && user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export function PublicRoutes({ children }) {
  const user = localStorage.getItem("token");
  if (user !== "" && user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default App;
