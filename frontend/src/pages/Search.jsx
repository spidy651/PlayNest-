import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAllVideos } from "../services/videoService";
import Loader from "../components/common/Loader";

export default function Search() {
  const location = useLocation();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await getAllVideos({ query });

        setVideos(res.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <Loader fullscreen />;

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 pt-20 px-6">
      <h1 className="text-xl font-semibold mb-6">
        Search results for "{query}"
      </h1>

      {videos.length === 0 ? (
        <p className="text-gray-400">No videos found.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="flex gap-4 hover:bg-[#1a1a1a] p-3 rounded-xl transition"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-80 aspect-video rounded-lg object-cover"
              />

              <div className="flex-1">
                <h2 className="text-lg font-medium mb-2">
                  {video.title}
                </h2>

                <p className="text-sm text-gray-400 mb-1">
                  {video.owner?.username}
                </p>

                <p className="text-sm text-gray-500">
                  {video.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}