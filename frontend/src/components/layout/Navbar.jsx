// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function Navbar({ onMenuClick }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
  
//   const [notificationOpen, setNotificationOpen] = useState(false);

// const notifications = [
//   {
//     id: 1,
//     message: "Tech Channel uploaded a new video",
//     time: "5 min ago",
//     read: false,
//   },
//   {
//     id: 2,
//     message: "Someone liked your comment",
//     time: "1 hour ago",
//     read: true,
//   },
//   {
//     id: 3,
//     message: "You gained a new subscriber",
//     time: "3 hours ago",
//     read: false,
//   },
// ];

// const unreadCount = notifications.filter(n => !n.read).length;



// const handleSearch = (e) => {
//   e.preventDefault();

//   if (query.trim()) {
//     navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//   }
// };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-50 border-b border-[#2a2a2a] h-14 flex items-center px-4 gap-4">
//       {/* Left */}
//       <div className="flex items-center gap-2 min-w-[200px]">
//         <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-[#272727] flex flex-col gap-1">
//           <span className="block w-4.5 h-[1.5px] bg-white" />
//           <span className="block w-4.5 h-[1.5px] bg-white" />
//           <span className="block w-4.5 h-[1.5px] bg-white" />
//         </button>
//         <Link to="/" className="flex items-center gap-1">
//           <div className="w-7 h-5 bg-red-600 rounded-[5px] flex items-center justify-center">
//             <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" />
//           </div>
//           <span className="font-mono text-base font-bold text-white tracking-tight">
//             You<span className="text-gray-400 font-normal">Tube</span>
//           </span>
//         </Link>
//       </div>

//       {/* Search */}
//       <form onSubmit={handleSearch} className="flex flex-1 max-w-xl items-center">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           type="text"
//           placeholder="Search"
//           className="flex-1 bg-[#121212] border border-[#2a2a2a] border-r-0 rounded-l-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           className="bg-[#222] border border-[#2a2a2a] border-l-0 rounded-r-full px-4 py-2 text-gray-400 hover:bg-[#333]"
//         >
//           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//           </svg>
//         </button>
//       </form>

//       {/* Right */}
//       <div className="flex items-center gap-3 ml-auto">
//         {user ? (
//           <>
//             <Link to="/upload" className="p-2 rounded-full hover:bg-[#272727] text-white">
//               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M15 10l4.553-2.277A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
//               </svg>
//             </Link>
//             {/* <button className="p-2 rounded-full hover:bg-[#272727] text-white relative">
//               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
//               </svg>
//             </button> */}
//             <div className="relative">
//   <button
//     onClick={() => setNotificationOpen(!notificationOpen)}
//     className="p-2 rounded-full hover:bg-[#272727] text-white relative"
//   >
//     <svg
//       className="w-5 h-5"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
//     </svg>

//     {unreadCount > 0 && (
//       <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
//         {unreadCount}
//       </span>
//     )}
//   </button>

//   {notificationOpen && (
//     <div className="absolute right-0 top-12 w-96 bg-[#212121] border border-[#3a3a3a] rounded-xl shadow-xl overflow-hidden">
//       <div className="p-4 border-b border-[#3a3a3a]">
//         <h3 className="text-white font-medium">
//           Notifications
//         </h3>
//       </div>

//       <div className="max-h-[400px] overflow-y-auto">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`p-4 border-b border-[#2a2a2a] hover:bg-[#2f2f2f] cursor-pointer ${
//               !notification.read ? "bg-[#181818]" : ""
//             }`}
//           >
//             <div className="flex gap-3">
//               <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
//                 ▶
//               </div>

//               <div className="flex-1">
//                 <p className="text-sm text-white">
//                   {notification.message}
//                 </p>

//                 <p className="text-xs text-gray-400 mt-1">
//                   {notification.time}
//                 </p>
//               </div>

//               {!notification.read && (
//                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="p-3 text-center border-t border-[#3a3a3a]">
//         <Link
//           to="/notifications"
//           className="text-blue-400 text-sm hover:text-blue-300"
//         >
//           View all
//         </Link>
//       </div>
//     </div>
//   )}
// </div>
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-sm font-medium"
//               >
//                 {user.name?.[0]?.toUpperCase() || "U"}
//               </button>
//               {dropdownOpen && (
//                 <div className="absolute right-0 top-10 w-48 bg-[#212121] border border-[#3a3a3a] rounded-xl shadow-xl z-50 overflow-hidden">
//                   <Link to={`/channel/${user.username}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#3a3a3a]">
//                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
//                     {user.name}
//                   </Link>
//                   <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#3a3a3a]">
//                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
//                     Dashboard
//                   </Link>
//                   <hr className="border-[#3a3a3a]" />
//                   <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#3a3a3a]">
//                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
//                     Sign out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <Link to="/login" className="flex items-center gap-2 border border-blue-500 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-blue-500/10 transition">
//             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
//             Sign in
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notifications = [
    { id: 1, message: "Tech Channel uploaded a new video", time: "5 min ago", read: false },
    { id: 2, message: "Someone liked your comment", time: "1 hour ago", read: true },
    { id: 3, message: "You gained a new subscriber", time: "3 hours ago", read: false },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-100 h-14 flex items-center px-4 gap-4 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-blue-50 flex flex-col gap-1">
          <span className="block w-4.5 h-[1.5px] bg-slate-700" />
          <span className="block w-4.5 h-[1.5px] bg-slate-700" />
          <span className="block w-4.5 h-[1.5px] bg-slate-700" />
        </button>
        <Link to="/" className="flex items-center gap-1.5">
          <div className="w-7 h-5 bg-blue-600 rounded-[5px] flex items-center justify-center">
            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" />
          </div>
          <span className="font-bold text-base text-slate-800 tracking-tight">
            Play<span className="text-blue-600">Nest</span>
          </span>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-xl items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search"
          className="flex-1 bg-blue-50 border border-blue-200 border-r-0 rounded-l-full px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
        />
        <button
          type="submit"
          className="bg-blue-50 border border-blue-200 border-l-0 rounded-r-full px-4 py-2 text-slate-500 hover:bg-blue-100 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </form>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        {user ? (
          <>
            <Link to="/upload" className="p-2 rounded-full hover:bg-blue-50 text-slate-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 10l4.553-2.277A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
              </svg>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-full hover:bg-blue-50 text-slate-600 relative"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-12 w-96 bg-white border border-blue-100 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-blue-100 bg-blue-50">
                    <h3 className="text-slate-800 font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer ${!n.read ? "bg-blue-50/60" : ""}`}>
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">▶</div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-800">{n.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-blue-100">
                    <Link to="/notifications" className="text-blue-500 text-sm hover:text-blue-700">View all</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium"
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-blue-100 rounded-xl shadow-lg z-50 overflow-hidden">
                  <Link to={`/channel/${user.username}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    {user.name}
                  </Link>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    Dashboard
                  </Link>
                  <hr className="border-blue-100" />
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 border border-blue-500 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-blue-50 transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}