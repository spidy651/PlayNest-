import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ HANDLE FILES
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCover(file);
    if (file) setPreviewCover(URL.createObjectURL(file));
  };

  // ✅ SUBMIT WITH FORM DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // text fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // files
      if (avatar) formData.append("avatar", avatar);
      if (cover) formData.append("coverImage", cover);

      await registerUser(formData);

      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      login(res.data.user, res.data.accessToken);
      navigate("/");
    } catch (err) {
      console.log(err);
  console.log(err.response?.data);

  setError(
    err.response?.data?.message || "Registration failed."
  );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">
            Create account
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* TEXT INPUTS */}
            {["fullName", "username", "email", "password"].map((field) => (
              <input
                key={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="bg-blue-50 border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white"
              />
            ))}

            {/* AVATAR */}
            <div>
              <label className="text-xs text-gray-400">Avatar</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              {previewAvatar && (
                <img
                  src={previewAvatar}
                  className="w-16 h-16 rounded-full mt-2 object-cover"
                />
              )}
            </div>

            {/* COVER IMAGE */}
            <div>
              <label className="text-xs text-gray-400">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleCoverChange} />
              {previewCover && (
                <img
                  src={previewCover}
                  className="w-full h-24 mt-2 object-cover rounded-lg"
                />
              )}
            </div>

            <Button type="submit" loading={loading}>
              Create account
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}