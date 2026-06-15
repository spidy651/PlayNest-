import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVideoById, toggleVideoLike, getLikeStatus, getAllVideos } from "../services/videoService";
import { toggleSubscription, getSubscriptionStatus } from "../services/userService";
import VideoPlayer from "../components/video/VideoPlayer";
import CommentBox from "../components/comment/CommentBox";
import CommentList from "../components/comment/CommentList";
import VideoCard from "../components/video/VideoCard";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { addView } from "../services/videoService";
import { api } from "../services/api";

export default function Watch() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [newComment, setNewComment] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [v, rel] = await Promise.all([
          getVideoById(id),
          getAllVideos({ limit: 10 }),
        ]);

        setVideo(v);
        setLikes(v.likesCount || 0);

        setRelated(
          Array.isArray(rel)
            ? rel.filter((r) => r._id !== id)
            : (rel.docs || []).filter((r) => r._id !== id)
        );

        if (user) {
          const ss = await getSubscriptionStatus(v.owner?._id);

          setLiked(v.isLiked || false);
          setSubscribed(ss?.isSubscribed || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const viewed = sessionStorage.getItem(`viewed-${id}`);

    if (!viewed) {
      addView(id);
      sessionStorage.setItem(`viewed-${id}`, "true");
    }

    load();
  }, [id, user]);

  // useEffect(() => {
  // const load = async () => {
  //   setLoading(true);

  //   try {
  //     const [v, rel] = await Promise.all([
  //       getVideoById(id),
  //       getAllVideos({ limit: 10 }),
  //     ]);

  //     setVideo(v);
  //     // rest of your code...
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const viewed = sessionStorage.getItem(`viewed-${id}`);

  if (!viewed) {
    addView(id);
    sessionStorage.setItem(`viewed-${id}`, "true");
  }




  // useEffect(() => {
  //   const viewed = sessionStorage.getItem(`viewed-${id}`);

  //   if (!viewed) {
  //     addView(id);
  //     sessionStorage.setItem(`viewed-${id}`, "true");
  //   }

  //   load();
  // }, [id]);

  const handleLike = async () => {

    if (!user) return;

    const prevLiked = liked;
    const prevLikes = likes;

    // optimistic update
    setLiked(!prevLiked);
    setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

    try {

      await toggleVideoLike(id);

    } catch (err) {

      console.log(err);

      // rollback
      setLiked(prevLiked);
      setLikes(prevLikes);
    }
  };

 const openPlaylistModal = async () => {
  try {
    const res = await api.get(`/playlist/user/${user._id}`);
    console.log("Playlist Response:", res.data);

    setPlaylists(res.data || []);

    setShowPlaylistModal(true);
  } catch (err) {
    console.error(err);
  }
};

  const addToPlaylist = async (playlistId) => {
  alert(`Adding to playlist: ${playlistId}`);

  console.log("Video ID:", video?._id);
  console.log("Playlist ID:", playlistId);

  try {
    const res = await api.patch(
      `/playlist/add/${video._id}/${playlistId}`
    );

    console.log("Add response:", res.data);
  } catch (err) {
    console.error("Add failed:", err.response?.data || err);
  }
};
  const handleSubscribe = async () => {
    if (!user || !video?.owner?._id) return;
    setSubscribed(!subscribed);
    try { await toggleSubscription(video.owner._id); } catch { setSubscribed(subscribed); }
  };

  const formatViews = (n = 0) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  if (loading) return <Loader fullscreen />;
  if (!video) return <div className="min-h-screen bg-blue-50 flex items-center justify-center text-gray-400">Video not found.</div>;

  return (
    <div className="min-h-screen bg-blue-50 text-white pt-14">
      <div className="max-w-[1600px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          <VideoPlayer src={video.videoFile} poster={video.thumbnail} title={video.title} />

          {/* Title */}
          <h1 className="text-lg font-semibold mt-4 mb-3 leading-snug">{video.title}</h1>

          {/* Channel row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link to={`/channel/${video.owner?.username}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                {video.owner?.avatar
                  ? <img src={video.owner.avatar} alt={video.owner.username} className="w-full h-full object-cover" />
                  : video.owner?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{video.owner?.username}</p>
                <p className="text-xs text-gray-400">{formatViews(video.owner?.subscribersCount)} subscribers</p>
              </div>
            </Link>
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${subscribed
                ? "bg-[#272727] text-white hover:bg-[#3a3a3a]"
                : "bg-white text-black hover:bg-gray-200"
                }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${liked ? "bg-white text-black" : "bg-[#272727] text-white hover:bg-[#3a3a3a]"
                  }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                {likes > 0 ? formatViews(likes) : "Like"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#272727] text-white hover:bg-[#3a3a3a]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
              <button
                onClick={openPlaylistModal}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#272727] text-white hover:bg-[#3a3a3a]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-300 mb-1">
              <span className="font-medium text-white">{formatViews(video.views)} views</span>
              {video.createdAt && (
                <span className="ml-2 text-gray-500">
                  {new Date(video.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </p>
            <p className={`text-sm text-gray-300 whitespace-pre-wrap leading-relaxed ${!descExpanded ? "line-clamp-3" : ""}`}>
              {video.description || "No description provided."}
            </p>
            {video.description?.length > 200 && (
              <button onClick={() => setDescExpanded(!descExpanded)} className="text-sm font-medium text-white mt-2">
                {descExpanded ? "Show less" : "...more"}
              </button>
            )}
          </div>

          {/* Comments */}
          <div>
            <CommentBox videoId={id} onCommentAdded={(c) => setNewComment(c)} />
            <CommentList videoId={id} newComment={newComment} />
          </div>
        </div>

        {/* Related sidebar */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Up next</h3>
          <div className="flex flex-col gap-3">
            {related.map((v) => (
              <Link key={v._id} to={`/watch/${v._id}`} className="flex gap-2 group">
                <div className="relative w-40 aspect-video flex-shrink-0 bg-[#1a1a1a] rounded-lg overflow-hidden">
                  {v.thumbnail
                    ? <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">{v.title}</p>
                  <p className="text-xs text-gray-400">{v.owner?.username}</p>
                  <p className="text-xs text-gray-500">{formatViews(v.views)} views</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Save to Playlist
              </h2>
              <p className="text-red-400">
  playlists length = {playlists.length}
</p>

              <button
                onClick={() => setShowPlaylistModal(false)}
              >
                ✕
              </button>
            </div>

            {playlists.length === 0 ? (
              <div>
                <p className="text-gray-400 mb-4">
                  You don't have any playlists.
                </p>

                <Link
                  to="/playlist"
                  onClick={() => {
                    console.log("Saving video:", video._id);
                    localStorage.setItem("pendingVideo", video._id);
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Create Playlist
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() => {
                      console.log("Clicked playlist:", playlist);
                      addToPlaylist(playlist._id);
                    }}
                    className="w-full text-left bg-[#272727] hover:bg-[#333] rounded-lg px-4 py-3"
                  >
                    {playlist.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}