import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createComment } from "../../services/commentService";
import Button from "../common/Button";

export default function CommentBox({ videoId, onCommentAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const comment = await createComment(videoId, text.trim());
      setText("");
      setFocused(false);
      onCommentAdded?.(comment);
    } catch (err) {
      setError(err.message || "Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3 py-3 border-b border-[#2a2a2a]">
        <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <p className="text-sm text-gray-400">
          <a href="/login" className="text-blue-400 hover:underline">Sign in</a> to comment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex-shrink-0 flex items-center justify-center text-slate-700 text-sm font-semibold overflow-hidden">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          user.name?.[0]?.toUpperCase() || "U"
        )}
      </div>

      {/* Input area */}
      <div className="flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Add a comment..."
          className="w-full bg-transparent border-b border-[#2a2a2a] focus:border-white outline-none text-sm text-slate-800 placeholder-gray-500 pb-2 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

        {focused && (
          <div className="flex justify-end gap-2 mt-3">
            <Button
              variant="ghost"
              onClick={() => { setText(""); setFocused(false); }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              loading={loading}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}