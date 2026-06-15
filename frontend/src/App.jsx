import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Playlist from "./pages/Playlist";
import Loader from "./components/common/Loader";
import Subscriptions from "./pages/Subscriptions";
import History from "./pages/History";
import Shorts from "./pages/Shorts"
import Library from "./pages/Library"
import Search from "./pages/Search";
import PlaylistDetails from "./pages/PlaylistDetails";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullscreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useAuth();

  if (loading) return <Loader fullscreen />;

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} />
      <main
        className="transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? "220px" : "0px", paddingTop: "0px" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/channel/:username" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute><Upload /></ProtectedRoute>
          } />
          <Route path="/playlist" element={
            <ProtectedRoute><Playlist /></ProtectedRoute>
          } />


          <Route path="/subscriptions" element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          } />

          <Route
            path="/playlist/:playlistId"
            element={
              <ProtectedRoute>
                <PlaylistDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          <Route path="/library" element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          } />

          <Route path="/Shorts" element={
            <ProtectedRoute>
              <Shorts />
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center text-white gap-4">
              <p className="text-6xl font-mono font-bold text-gray-800">404</p>
              <p className="text-gray-400">Page not found.</p>
              <a href="/" className="text-blue-400 hover:underline text-sm">Go home</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}