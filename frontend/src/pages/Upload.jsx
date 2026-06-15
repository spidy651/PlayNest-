import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../services/videoService";
import Button from "../components/common/Button";

export default function Upload() {
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const [form, setForm] = useState({ title: "", description: "", isPublished: true });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState("All");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) setVideoFile(file);
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError("Please select a video file.");
    if (!form.title.trim()) return setError("Title is required.");

    setLoading(true);
    setError("");
    setProgress(10);

    const fd = new FormData();
    fd.append("videoFile", videoFile);
    fd.append("title", form.title);
    fd.append("category", category);
    fd.append("description", form.description);
    fd.append("isPublished", form.isPublished);
    if (thumbFile) fd.append("thumbnail", thumbFile);

    try {
      setProgress(40);
      const res = await uploadVideo(fd);
      setProgress(100);
      navigate(`/watch/${res._id}`);
    } catch (err) {
      setError(err.message || "Upload failed.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 pt-14">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">Upload Video</h1>
        <p className="text-gray-400 text-sm mb-8">Share your content with the world</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Video drop zone */}
          <div
            onDrop={handleVideoDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => videoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors
              ${dragOver ? "border-blue-500 bg-blue-500/5" : "border-[#2a2a2a] hover:border-[#3a3a3a]"}
              ${videoFile ? "border-green-600 bg-green-600/5" : ""}`}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
            {videoFile ? (
              <div>
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-white">{videoFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                  className="text-xs text-red-400 hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-white mb-1">Drag and drop your video</p>
                <p className="text-xs text-gray-500">or click to browse · MP4, MOV, AVI up to 2GB</p>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-sm font-medium text-slate-800 mb-2 block">Thumbnail</label>
            <div
              onClick={() => thumbInputRef.current?.click()}
              className="relative w-full aspect-video max-w-xs bg-blue-50 border border-blue-200 focus:border-blue-500 rounded-xl overflow-hidden cursor-pointer hover:border-[#3a3a3a] transition-colors flex items-center justify-center"
            >
              <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbChange} />
              {thumbPreview ? (
                <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="text-xs text-gray-500">Upload thumbnail</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-800 mb-2 block">Title <span className="text-red-400">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Give your video a title"
              className="w-full bg-blue-50 border border-blue-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none placeholder-slate-400 transition-colors"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{form.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-800 mb-2 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell viewers about your video"
             className="w-full bg-blue-50 border border-blue-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none placeholder-slate-400 transition-colors"
            />
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? "bg-blue-600" : "bg-[#2a2a2a]"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.isPublished ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <label className="text-sm text-gray-300">
              {form.isPublished ? "Public — visible to everyone" : "Private — only you can see"}
            </label>
          </div>
          
         {/* Category */}
<div>
  <label className="text-sm font-medium text-white mb-2 block">Category</label>
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white"
  >
    <option>All</option>
    <option>Music</option>
    <option>Gaming</option>
    <option>Live</option>
    <option>Tech</option>
    <option>Cooking</option>
    <option>Science</option>
    <option>Sports</option>
    <option>News</option>
    <option>Podcasts</option>
  </select>
</div>



<div className="flex gap-3 pt-2"></div>

          {/* Progress bar */}
          {loading && progress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} disabled={!videoFile || loading} className="px-8 py-2.5 rounded-xl">
              {loading ? "Uploading…" : "Publish Video"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}