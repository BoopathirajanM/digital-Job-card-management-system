import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JobCardList from "./pages/JobCardList";
import JobCardForm from "./pages/JobCardForm";
import JobCardDetail from "./pages/JobCardDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobcards" element={<JobCardList />} />
          <Route path="/jobcards/new" element={<JobCardForm />} />
          <Route path="/jobcards/:id" element={<JobCardDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
