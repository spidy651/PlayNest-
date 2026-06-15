import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserPlaylists } from "../services/playlistService";
import { getWatchHistory } from "../services/userService";
import { Link } from "react-router-dom";

const tabs = ["History", "Playlists"];

export default function Library() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("History");
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        if (!user?._id) return;

        const historyData = await getWatchHistory();

        console.log("History Response:", historyData);

        setHistory(historyData || []);

        const playlistData = await getUserPlaylists(user._id);
        setPlaylists(playlistData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#2a2a2a] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 ${activeTab === tab
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* HISTORY */}
      {activeTab === "History" && (
        <div>
          {history.length === 0 ? (
            <p className="text-gray-500">
              No watch history found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((video) => (
                <Link
                  key={video._id}
                  to={`/watch/${video._id}`}
                  className="bg-white rounded-xl overflow-hidden border border-blue-200 hover:border-blue-400 transition-colors"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-44 object-cover"
                  />

                  <div className="p-3">
                    <h3 className="font-medium text-slate-800 line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PLAYLISTS */}
      {activeTab === "Playlists" && (
        <div>
          {playlists.length === 0 ? (
            <p className="text-gray-500">
              No playlists found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]"
                >
                  <h3 className="text-lg font-semibold">
                    {playlist.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2">
                    {playlist.description}
                  </p>

                  <div className="mt-3 text-xs text-gray-500">
                    {playlist.totalVideos || 0} videos
                  </div>

                  <div className="mt-2 text-xs text-gray-600">
                    Created{" "}
                    {new Date(
                      playlist.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}