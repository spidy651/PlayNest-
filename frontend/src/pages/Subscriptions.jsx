import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getChannelSubscribers } from "../services/userService";

export default function Subscriptions() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    
    const fetchSubs = async () => {
      try {
        const data = await getChannelSubscribers(user._id);
        console.log("API response:", data);
        setChannels(data);
      } catch (err) {
        console.error(err);
      }
    };
      
    if (user) fetchSubs();
    
  }, [user]);

  return (
    <div className="text-white p-6">
      <h1 className="text-xl font-bold mb-4">Subscriptions</h1>

      {channels.length === 0 ? (
        <p className="text-gray-400">No subscriptions yet.</p>
      ) : (
        <div className="space-y-3">
          {channels.map((sub) => (
            <div key={sub._id} className="flex items-center gap-3 bg-blue-100 p-3 rounded-lg">
              <img
                src={sub.channel?.avatar}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{sub.channel?.username}</p>
                <p className="text-sm text-gray-400">{sub.channel?.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}