import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserVideos, deleteVideo, togglePublish } from "../services/videoService";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

export default function Dashboard() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalVideos: 0 });

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const vids = await getUserVideos(user._id);

        const arr = vids?.videos || [];

        console.log("arr:", arr);

        setVideos(arr);
        console.log(videos[0]);

        setStats({
          totalVideos: arr.length,
          totalViews: arr.reduce((a, v) => a + (v.views || 0), 0),
          totalLikes: arr.reduce((a, v) => a + (v.likesCount || 0), 0),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch { }
  };

  const handleTogglePublish = async (id, current) => {
    try {
      await togglePublish(id);
      setVideos((prev) => prev.map((v) => v._id === id ? { ...v, isPublished: !current } : v));
    } catch { }
  };

  const formatNum = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };
  console.log("videos state:", videos);
  console.log("videos length:", videos.length);
  if (loading) return <Loader fullscreen />;

  return (
    <div className="min-h-screen bg-blue-50 text-slate-400 pt-14">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Channel Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.fullName}</p>
          </div>
          <Link to="/upload">
            <Button icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 5v14M5 12h14" />
              </svg>
            }>
              Upload
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Videos", value: stats.totalVideos },
            { label: "Total Views", value: formatNum(stats.totalViews) },
            { label: "Total Likes", value: formatNum(stats.totalLikes) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Videos table */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-sm font-medium text-white">Your Videos</h2>
          </div>
          {videos.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No videos yet.{" "}
              <Link to="/upload" className="text-blue-400 hover:underline">Upload your first video</Link>
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {videos.map((video) => (
                <div key={video._id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#212121] transition-colors">
                  <div className="w-24 aspect-video bg-[#272727] rounded-lg overflow-hidden flex-shrink-0">
                    {video.thumbnail
                      ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white line-clamp-1">{video.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatNum(video.views || 0)} views · {formatNum(video.likesCount || 0)} likes
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(video._id, video.isPublished)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${video.isPublished
                        ? "border-green-600 text-green-400 hover:bg-green-600/10"
                        : "border-gray-600 text-gray-400 hover:bg-gray-600/10"
                        }`}
                    >
                      {video.isPublished ? "Published" : "Private"}
                    </button>
                    <Link to={`/watch/${video._id}`} className="text-xs text-blue-400 hover:underline px-2">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}