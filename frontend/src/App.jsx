import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JobCardList from "./pages/JobCardList";
import JobCardForm from "./pages/JobCardForm";
import JobCardDetail from "./pages/JobCardDetail";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobcards" element={<JobCardList />} />
        <Route path="/jobcards/new" element={<JobCardForm />} />
        <Route path="/jobcards/:id" element={<JobCardDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
