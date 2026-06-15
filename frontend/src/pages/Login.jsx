// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { loginUser } from "../services/userService";
// import { useAuth } from "../context/AuthContext";
// import Button from "../components/common/Button";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await loginUser(form);
//       localStorage.setItem("accessToken", res.data.accessToken);
//       login(res.data.user, res.data.accessToken);
//       navigate("/");
//     } catch (err) {
//       setError(err.message || "Invalid credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         {/* Logo */}
//         <div className="flex items-center justify-center gap-2 mb-10">
//           <div className="w-8 h-6 bg-red-600 rounded-[5px] flex items-center justify-center">
//             <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" />
//           </div>
//           <span className="font-mono text-xl font-bold text-white">
//             You<span className="text-gray-400 font-normal">Tube</span>
//           </span>
//         </div>

//         <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
//           <h1 className="text-xl font-semibold text-white mb-1">Sign in</h1>
//           <p className="text-sm text-gray-400 mb-6">to continue to YouTube</p>

//           {error && (
//             <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <div>
//               <label className="text-xs text-gray-400 mb-1.5 block">Email or username</label>
//               <input
//                 name="email"
//                 type="text"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="you@example.com"
//                 className="w-full bg-blue-50 border border-[#2a2a2a] focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-white outline-none placeholder-gray-600 transition-colors"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="••••••••"
//                 className="w-full bg-blue-50 border border-[#2a2a2a] focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-white outline-none placeholder-gray-600 transition-colors"
//               />
//             </div>

//             <Button type="submit" loading={loading} className="w-full mt-2 py-2.5 rounded-lg">
//               Sign in
//             </Button>
//           </form>

//           <p className="text-sm text-gray-500 text-center mt-6">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-blue-400 hover:underline">
//               Create account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await loginUser(form);
      localStorage.setItem("accessToken", res.data.accessToken);
      login(res.data.user, res.data.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-6 bg-blue-600 rounded-[5px] flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">Play<span className="text-blue-600">Nest</span></span>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800 mb-1">Sign in</h1>
          <p className="text-sm text-slate-400 mb-6">to continue to PlayNest</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Email or username</label>
              <input name="email" type="text" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                className="w-full bg-blue-50 border border-blue-200 focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none placeholder-slate-400 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
                className="w-full bg-blue-50 border border-blue-200 focus:border-blue-500 focus:bg-white rounded-lg px-4 py-2.5 text-sm text-slate-800 outline-none placeholder-slate-400 transition-colors" />
            </div>
            <Button type="submit" loading={loading} className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-slate-800">
              Sign in
            </Button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}