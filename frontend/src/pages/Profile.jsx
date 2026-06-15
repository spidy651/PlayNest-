import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannel, toggleSubscription } from "../services/userService";
import { getUserVideos } from "../services/videoService";
import VideoCard from "../components/video/VideoCard";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { getUserPlaylists } from "../services/playlistService";
export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [tab, setTab] = useState("videos");
  const [playlists, setPlaylists] = useState([]);
  const isOwn = user?.username === username;

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const ch = await getUserChannel(username);

        console.log("Channel:", ch);

        setChannel(ch);
        setSubscribed(ch.isSubscribed || false);

        const vids = await getUserVideos(ch._id);

        console.log("Videos response:", vids);

        setVideos(vids.videos || []);

        const pls = await getUserPlaylists(ch._id);

        console.log("Playlists:", pls);

        setPlaylists(pls);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  const handleSubscribe = async () => {
    if (!user || !channel?._id) return;
    setSubscribed(!subscribed);
    try { await toggleSubscription(channel._id); } catch { setSubscribed(subscribed); }
  };

  const formatCount = (n = 0) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  if (loading) return <Loader fullscreen />;
  if (!channel) return <div className="min-h-screen bg-blue-50 flex items-center justify-center text-gray-400">Channel not found.</div>;

  return (
    <div className="min-h-screen bg-blue-50 text-white pt-14">
      {/* Cover */}
      <div className="w-full h-40 md:h-56 bg-[#1a1a1a] overflow-hidden">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-violet-900 to-pink-900" />
        )}
      </div>

      {/* Channel info */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-end gap-4 -mt-10 mb-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 border-4 border-[#0f0f0f] flex items-center justify-center text-2xl font-bold text-white overflow-hidden flex-shrink-0">
            {channel.avatar
              ? <img src={channel.avatar} alt={channel.username} className="w-full h-full object-cover" />
              : channel.username?.[0]?.toUpperCase()}
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{channel.fullName}</h1>
            <p className="text-sm text-gray-400">@{channel.username}</p>
            <div className="flex gap-4 text-xs text-gray-500 mt-1">
              <span>{formatCount(channel.subscribersCount)} subscribers</span>
              <span>{videos.length} videos</span>
            </div>
          </div>
          {!isOwn && user && (
            <button
              onClick={handleSubscribe}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${subscribed ? "bg-[#272727] text-white hover:bg-[#3a3a3a]" : "bg-white text-black hover:bg-gray-200"
                }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
          {["videos", "playlists", "about"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-white text-white font-medium" : "border-transparent text-gray-400 hover:text-white"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "videos" && (
          videos.length === 0
            ? <p className="text-gray-500 text-sm py-8">No videos uploaded yet.</p>
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pb-10">
              {videos.map((v) => <VideoCard key={v._id} video={v} />)}
            </div>
        )}
        {tab === "about" && (
          <div className="py-6 max-w-xl">
            <h3 className="text-sm font-medium text-white mb-2">Description</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{channel.description || "No description provided."}</p>
          </div>
        )}
       {tab === "playlists" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
    {playlists.map((playlist) => (
      <div
        key={playlist._id}
        className="flex gap-4 bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#222] cursor-pointer"
      >
        <div className="w-40 h-24 bg-[#2a2a2a] flex items-center justify-center">
          <span className="text-3xl">📂</span>
        </div>

        <div className="p-3 flex-1">
          <h3 className="font-medium text-white">
            {playlist.name}
          </h3>

          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {playlist.description}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {playlist.totalVideos} videos
          </p>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}