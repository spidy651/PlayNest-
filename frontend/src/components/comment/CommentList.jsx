import { useEffect, useState } from "react";
import { getComments, deleteComment, likeComment } from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

function CommentItem({ comment, currentUser, onDelete }) {
const [liked, setLiked] = useState(comment.isLiked || false);

const [likes, setLikes] = useState(comment.likesCount || 0);
  const [deleting, setDeleting] = useState(false);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const handleLike = async () => {
    setLiked(!liked);
    setLikes((l) => liked ? l - 1 : l + 1);
    try { await likeComment(comment._id); } catch {}
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } catch {
      setDeleting(false);
    }
  };

  const isOwner = currentUser?._id === comment.owner?._id;

  return (
    <div className="flex gap-3 py-3 group">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
        {comment.owner?.avatar ? (
          <img src={comment.owner.avatar} alt={comment.owner.username} className="w-full h-full object-cover" />
        ) : (
          comment.owner?.username?.[0]?.toUpperCase() || "U"
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium text-slate-700">{comment.owner?.username || "User"}</span>
          <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed break-words">{comment.content}</p>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? "text-blue-400" : "text-gray-500 hover:text-white"}`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            {likes > 0 && likes}
          </button>

          <button className="text-xs text-gray-500 hover:text-white transition-colors">Reply</button>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentList({ videoId, newComment }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await getComments(videoId);

console.log("COMMENTS RESPONSE:", res);

setComments(
  Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res)
    ? res
    : []
);
      } catch {
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  useEffect(() => {
    if (newComment) setComments((prev) => [newComment, ...prev]);
  }, [newComment]);

  const handleDelete = (id) => setComments((prev) => prev.filter((c) => c._id !== id));

  if (loading) return <div className="py-6"><Loader /></div>;
  if (error) return <p className="text-sm text-red-400 py-4">{error}</p>;
  if (!comments.length) return <p className="text-sm text-gray-500 py-4">No comments yet. Be the first!</p>;

  return (
    <div>
      <h3 className="text-base font-medium text-white mb-2">{comments.length} Comments</h3>
      <div className="divide-y divide-[#1f1f1f]">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={user}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}