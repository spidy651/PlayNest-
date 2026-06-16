import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

function PlaylistCard({ playlist, onDelete }) {
  const videoCount = playlist.videos?.length || 0;
  const thumb = playlist.videos?.[0]?.thumbnail;

  return (
    <div className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors">
      <Link to={`/playlist/${playlist._id}`}>
        <div className="relative aspect-video bg-[#272727]">
          {thumb ? (
            <img src={thumb} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🎵</div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
            </svg>
            {videoCount}
          </div>
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/playlist/${playlist._id}`}>
          <h3 className="text-sm font-medium text-white hover:text-gray-300 line-clamp-1">{playlist.name}</h3>
        </Link>
        {playlist.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{playlist.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600">{videoCount} video{videoCount !== 1 ? "s" : ""}</span>
          <button
            onClick={() => onDelete(playlist._id)}
            className="text-xs text-red-400 opacity-0 group-hover:opacity-100 hover:underline transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Playlist() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) return setLoading(false);
      setLoading(true);
      try {
        const res = await api.get(`/playlist/user/${user._id}`);
        console.log("Playlist API Response:", res.data);
        setPlaylists(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    setCreating(true);
    setError("");

    try {
      const pendingVideo = localStorage.getItem("pendingVideo");

      const payload = {
        name: form.name,
        description: form.description,
      };

      if (pendingVideo) {
        payload.videoId = pendingVideo;
      }
      console.log("Pending Video:", pendingVideo);
    console.log("Payload:", payload);
      const res = await api.post("/playlist", payload);

      localStorage.removeItem("pendingVideo");

      // setPlaylists((prev) => [res.data.data, ...prev]);
console.log(res.data);
      setForm({
        name: "",
        description: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this playlist?")) return;
    try {
      await api.delete(`/playlist/${id}`);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch { }
  };





  if (loading) return <Loader fullscreen />;
   
  console.log("playlists =", playlists);

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 pt-14">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Playlists</h1>
            <p className="text-gray-400 text-sm mt-1">{playlists.length} playlist{playlists.length !== 1 ? "s" : ""}</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>}
          >
            New Playlist
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
            <h2 className="text-sm font-medium text-white mb-4">Create New Playlist</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="flex flex-col gap-4">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Playlist name"
                required
                className="w-full bg-blue-50 border border-[#2a2a2a] focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none placeholder-gray-600 transition-colors"
              />
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
                className="w-full bg-blue-50 border border-[#2a2a2a] focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none placeholder-gray-600 transition-colors"
              />
              <div className="flex gap-3">
                <Button type="submit" loading={creating}>Create</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </form>
        )}

        {!user ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Sign in to manage your playlists.</p>
            <Link to="/login" className="text-blue-400 hover:underline text-sm">Sign in</Link>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-3">You haven't created any playlists yet.</p>
            <button onClick={() => setShowForm(true)} className="text-blue-400 hover:underline text-sm">
              Create your first playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlists
              .filter((pl) => pl && pl._id)
              .map((pl) => (
                <PlaylistCard
                  key={pl._id}
                  playlist={pl}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}