// import { useEffect, useState } from "react";
// import { getAllVideos } from "../services/videoService";
// import VideoCard from "../components/video/VideoCard";
// import Loader from "../components/common/Loader";

// const chips = ["All", "Music", "Gaming", "Live", "Tech", "Cooking", "Science", "Sports", "News", "Podcasts"];

// export default function Home() {
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [activeChip, setActiveChip] = useState("All");

// useEffect(() => {
//   const fetch = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await getAllVideos({
//         limit: 24,
//         category: activeChip // ✅ filter based on chip
//       });

//       setVideos(data?.videos || []);
//     } catch (err) {
//       setError(err.message || "Failed to load videos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetch();
// }, [activeChip]); 

//     return (
//         <div className="min-h-screen bg-blue-50 text-white">
//             {/* Chips */}
//             <div className="sticky top-14 z-30 bg-blue-50 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#1a1a1a]">
//                 {chips.map((chip) => (
//                     <button
//                         key={chip}
//                         onClick={() => setActiveChip(chip)}
//                         className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-lg transition-colors ${activeChip === chip
//                                 ? "bg-white text-black font-medium"
//                                 : "bg-[#272727] text-white hover:bg-[#3a3a3a]"
//                             }`}
//                     >
//                         {chip}
//                     </button>
//                 ))}
//             </div>

//             <div className="p-4 md:p-6">
//                 {loading ? (
//                     <Loader />
//                 ) : error ? (
//                     <div className="text-center py-20">
//                         <p className="text-red-400 mb-4">{error}</p>
//                         <button
//                             onClick={() => window.location.reload()}
//                             className="text-sm text-blue-400 hover:underline"
//                         >
//                             Try again
//                         </button>
//                     </div>
//                 ) : videos.length === 0 ? (
//                     <div className="text-center py-20 text-gray-500">No videos found.</div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
//                         {videos.map((video) => (
//                             <VideoCard key={video._id} video={video} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { getAllVideos } from "../services/videoService";
import VideoCard from "../components/video/VideoCard";
import Loader from "../components/common/Loader";

const chips = ["All","Music","Gaming","Live","Tech","Cooking","Science","Sports","News","Podcasts"];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChip, setActiveChip] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true); setError("");
      try {
        const data = await getAllVideos({ limit: 24, category: activeChip });
        setVideos(data?.videos || []);
      } catch (err) {
        setError(err.message || "Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeChip]);

  return (
    <div className="min-h-screen bg-blue-50/40 text-slate-800">
      <div className="sticky top-14 z-30 bg-white px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-blue-100">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-lg transition-colors font-medium
              ${activeChip === chip
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-slate-600 hover:bg-blue-100 border border-blue-200"}`}
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="p-4 md:p-6">
        {loading ? <Loader /> : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-sm text-blue-500 hover:underline">Try again</button>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No videos found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map((video) => <VideoCard key={video._id} video={video} />)}
          </div>
        )}
      </div>
    </div>
  );
}