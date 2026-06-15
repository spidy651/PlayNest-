import { api } from "./api"; 

export const registerUser = (data) =>
  api.upload("/users/register", data);
export const loginUser = (data) => api.post("/users/login", data);
export const logoutUser = () => api.post("/users/logout");
export const getCurrentUser = () => api.get("/users/current-user").then((r) => r.data);
export const updateProfile = (data) => api.patch("/users/update-account", data).then((r) => r.data);
export const changePassword = (data) => api.post("/users/change-password", data);
export const getUserChannel = (username) => api.get(`/users/c/${username}`).then((r) => r.data);
export const getWatchHistory = async () => {
  const response = await api.get("/users/history");

  console.log("History API Response:", response);

  return response.data;
};
export const updateAvatar = (formData) => api.upload("/users/avatar", formData).then((r) => r.data);
export const updateCoverImage = (formData) => api.upload("/users/cover-image", formData).then((r) => r.data);
export const getChannelSubscribers = (channelId) =>
  api.get(`/subscriptions/c/${channelId}`).then((r) => r.data);

export const toggleSubscription = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`).then((r) => r.data);

export const getSubscribedChannels = (userId) =>
  api.get(`/subscriptions/u/${userId}`)
     .then((r) => r.data.data); 

export const getSubscriptionStatus = (channelId) =>
  api.get(`/subscriptions/c/${channelId}`).then((r) => r.data);