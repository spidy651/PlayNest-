import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  const {
    _id,
    title = "Untitled Video",
    thumbnail,
    duration,
    views = 0,
    createdAt,
    owner = {},
    isLive = false,
  } = video;

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    return `${months} months ago`;
  };

  const formatViews = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <Link to={`/watch/${_id}`} className="group block cursor-pointer">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-[#1a1a2e]">
            🎬
          </div>
        )}
        {isLive ? (
          <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide">
            LIVE
          </span>
        ) : duration ? (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        ) : null}
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-2.5 px-0.5">
        {/* Channel Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
          {owner.avatar ? (
            <img src={owner.avatar} alt={owner.username} className="w-full h-full object-cover" />
          ) : (
            owner.username?.[0]?.toUpperCase() || "C"
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-xs text-gray-400 hover:text-white transition-colors">
            {owner.username || "Unknown Channel"}
          </p>
          <p className="text-xs text-gray-500">
            {formatViews(views)} views{createdAt ? ` · ${timeAgo(createdAt)}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}