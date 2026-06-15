import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import Loader from "../components/common/Loader";

export default function PlaylistDetails() {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const res = await api.get(`/playlist/${playlistId}`);

        console.log("Playlist Details:", res.data);
        
        setPlaylist(res.data);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [playlistId]);

  if (loading) return <Loader fullscreen />;

  if (!playlist) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-gray-500">Playlist not found.</p>
      </div>
    );
  }

  const videos = playlist.videos || [];
  console.log("Playlist object:", playlist);
        console.log("Videos:", playlist.videos);
  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 pt-14">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold">
            {playlist.name}
          </h1>

          {playlist.description && (
            <p className="text-gray-600 mt-2">
              {playlist.description}
            </p>
          )}

          <p className="text-sm text-gray-500 mt-3">
            {videos.length} video{videos.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Videos */}
        {videos.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <p className="text-gray-500">
              No videos in this playlist.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {videos.map((video) => (
              <Link
                key={video._id}
                to={`/watch/${video._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-64 h-36 object-cover"
                  />

                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {video.title}
                    </h3>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="text-xs text-gray-500 mt-3">
                      {video.views || 0} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}