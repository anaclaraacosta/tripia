import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import MyTrips from "./pages/MyTrips";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import { Login, Register } from "./pages/Auth";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { TripsProvider } from "./contexts/TripsContext";

export default function App() {
  return (
    <AuthProvider>
      <TripsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="trips" element={<MyTrips />} />
                <Route path="trips/create" element={<CreateTrip />} />
                <Route path="trips/ai" element={<CreateTrip isAI={true} />} />
                <Route path="trip/:id" element={<TripDetails />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TripsProvider>
    </AuthProvider>
  );
}
