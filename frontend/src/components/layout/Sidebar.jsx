// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useEffect, useState } from "react";
// import { getChannelSubscribers } from "../../services/userService";

// const navItems = [
//   { label: "Home", to: "/" },
//   { label: "Shorts", to: "/shorts" },
//   { label: "Subscriptions", to: "/subscriptions" },
// ];

// const libraryItems = [
//   { label: "Library", to: "/library" },
//   { label: "History", to: "/history" },
//   { label: "Playlists", to: "/playlist" },
// ];

// export default function Sidebar({ open }) {
//   const location = useLocation();
//   const { user } = useAuth();

//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const isActive = (to) => location.pathname === to;

  
// useEffect(() => {
//   const fetchSubs = async () => {
//     try {
//       setLoading(true);

//       const res = await getChannelSubscribers(user._id);

//       console.log("API RESPONSE:", res);

//       // ✅ handle different backend formats safely
//       if (Array.isArray(res)) {
//         setSubscriptions(res);
//       } else if (Array.isArray(res.data)) {
//         setSubscriptions(res.data);
//       } else {
//         setSubscriptions([]);
//       }

//     } catch (err) {
//       console.error("Sidebar subscriptions error:", err);
//       setSubscriptions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (user?._id) fetchSubs();
// }, [user]);

//   const Item = ({ label, to }) => (
//     <Link
//       to={to}
//       className={`flex items-center gap-4 px-4 py-2.5 rounded-lg mx-2 text-sm transition-colors
//       ${
//         isActive(to)
//           ? "bg-[#272727] text-white"
//           : "text-gray-300 hover:bg-[#1f1f1f] hover:text-white"
//       }`}
//     >
//       {label}
//     </Link>
//   );

//   return (
//     <aside
//       className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-blue-50 overflow-y-auto z-40 transition-all duration-200
//       ${open ? "w-56" : "w-0 overflow-hidden"}`}
//     >
//       <div className="py-2">
//         {/* NAV */}
//         {navItems.map((item) => (
//           <Item key={item.label} {...item} />
//         ))}

//         <hr className="border-[#2a2a2a] my-2" />

//         {/* LIBRARY */}
//         {libraryItems.map((item) => (
//           <Item key={item.label} {...item} />
//         ))}

//         {/* SUBSCRIPTIONS */}
//         {user && (
//           <>
//             <hr className="border-[#2a2a2a] my-2" />
//             <p className="text-xs text-gray-500 px-5 py-1 uppercase">
//               Subscriptions
//             </p>

//             {loading ? (
//               <p className="px-4 py-2 text-gray-400 text-sm">
//                 Loading...
//               </p>
//             ) : subscriptions.length === 0 ? (
//               <p className="px-4 py-2 text-gray-400 text-sm">
//                 No subscriptions
//               </p>
//             ) : (
//               subscriptions.slice(0, 7).map((sub) => {
//                 const channel = sub.channel || sub;

//                 return (
//                   <Link
//                     key={channel._id}
//                     to={`/channel/${channel.username}`}
//                     className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm text-gray-300 hover:bg-[#1f1f1f] hover:text-white"
//                   >
//                     <img
//                       src={channel.avatar || "/default-avatar.png"}
//                       alt="avatar"
//                       className="w-6 h-6 rounded-full object-cover"
//                     />
//                     <span className="truncate">
//                       {channel.username}
//                     </span>
//                   </Link>
//                 );
//               })
//             )}

//             {/* VIEW ALL */}
//             {subscriptions.length > 7 && (
//               <Link
//                 to="/subscriptions"
//                 className="block px-4 py-2 text-sm text-blue-400 hover:underline"
//               >
//                 Show more
//               </Link>
//             )}
//           </>
//         )}
//       </div>
//     </aside>
//   );
// }


import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getChannelSubscribers } from "../../services/userService";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shorts", to: "/shorts" },
  { label: "Subscriptions", to: "/subscriptions" },
];

const libraryItems = [
  { label: "Library", to: "/library" },
  { label: "History", to: "/history" },
  { label: "Playlists", to: "/playlist" },
];

export default function Sidebar({ open }) {
  const location = useLocation();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const isActive = (to) => location.pathname === to;

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true);
        const res = await getChannelSubscribers(user._id);
        if (Array.isArray(res)) setSubscriptions(res);
        else if (Array.isArray(res.data)) setSubscriptions(res.data);
        else setSubscriptions([]);
      } catch (err) {
        console.error(err);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchSubs();
  }, [user]);

  const Item = ({ label, to }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm transition-colors
      ${isActive(to)
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-slate-600 hover:bg-blue-50 hover:text-slate-800"}`}
    >
      {label}
    </Link>
  );

  return (
    <aside
      className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-white border-r border-blue-100 overflow-y-auto z-40 transition-all duration-200
      ${open ? "w-56" : "w-0 overflow-hidden"}`}
    >
      <div className="py-2">
        {navItems.map((item) => <Item key={item.label} {...item} />)}
        <hr className="border-blue-100 my-2" />
        {libraryItems.map((item) => <Item key={item.label} {...item} />)}

        {user && (
          <>
            <hr className="border-blue-100 my-2" />
            <p className="text-xs text-slate-400 px-5 py-1 uppercase tracking-wide">Subscriptions</p>
            {loading ? (
              <p className="px-4 py-2 text-slate-400 text-sm">Loading...</p>
            ) : subscriptions.length === 0 ? (
              <p className="px-4 py-2 text-slate-400 text-sm">No subscriptions</p>
            ) : (
              subscriptions.slice(0, 7).map((sub) => {
                const channel = sub.channel || sub;
                return (
                  <Link
                    key={channel._id}
                    to={`/channel/${channel.username}`}
                    className="flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm text-slate-600 hover:bg-blue-50 hover:text-slate-800"
                  >
                    <img src={channel.avatar || "/default-avatar.png"} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-blue-100" />
                    <span className="truncate">{channel.username}</span>
                  </Link>
                );
              })
            )}
            {subscriptions.length > 7 && (
              <Link to="/subscriptions" className="block px-4 py-2 text-sm text-blue-500 hover:underline">Show more</Link>
            )}
          </>
        )}
      </div>
    </aside>
  );
}