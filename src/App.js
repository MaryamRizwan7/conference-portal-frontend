import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ConferenceRequests from "./pages/Admin/ConferenceRequests";
import RejectedConferences from "./pages/Admin/RejectedConferences";
import AllConferences from "./pages/Admin/AllConferences";
import UpdateConference from "./pages/Admin/UpdateConference";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminPrivateRoute from "./routes/adminAuth";
import Pagenotfound from "./pages/Pagenotfound";

axios.defaults.baseURL = process.env.REACT_APP_API;

function App() {
  return (
    <>
      <Toaster toastOptions={{ duration: 5000 }} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Pagenotfound />} />

        <Route path="/admindashboard/*" element={<AdminPrivateRoute />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="all-conferences" element={<AllConferences />} />
          <Route path="update-conference" element={<UpdateConference />} />
          <Route path="pending-requests" element={<ConferenceRequests />} />
          <Route path="rejected-conferences" element={<RejectedConferences />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
