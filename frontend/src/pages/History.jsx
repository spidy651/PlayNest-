import { useEffect, useState } from "react";
import { getWatchHistory } from "../services/videoService";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await getWatchHistory();
      setVideos(res?.data || []);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 pt-16 px-6">
      
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>

      {/* Empty state */}
      {videos.length === 0 ? (
        <div className="text-gray-400 text-center mt-20">
          No history yet.
        </div>
      ) : (

        /* Grid Layout */
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          
          {videos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/watch/${v._id}`)}
              className="group cursor-pointer"
            >
              
              {/* Thumbnail container */}
              <div className="relative overflow-hidden rounded-xl">
                
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300" />

              </div>

              {/* Title */}
              <p className="mt-2 text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-blue-400 transition">
                {v.title}
              </p>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}