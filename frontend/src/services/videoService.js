import { api } from "./api"; 

export const getAllVideos = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/videos?${query}`).then((r) => r.data);
};

export const getVideoById = (id) => api.get(`/videos/${id}`).then((r) => r.data);

export const uploadVideo = (formData) => api.upload("/videos", formData).then((r) => r.data);

export const updateVideo = (id, data) => api.patch(`/videos/${id}`, data).then((r) => r.data);

export const deleteVideo = (id) => api.delete(`/videos/${id}`);

export const togglePublish = (id) => api.patch(`/videos/toggle/publish/${id}`).then((r) => r.data);

export const toggleVideoLike = (id) => api.post(`/likes/toggle/v/${id}`).then((r) => r.data);

export const getLikeStatus = (id) => api.get(`/likes/v/${id}`).then((r) => r.data);

export const incrementView = (id) =>
  api.patch(`/videos/${id}/views`);



export const getWatchHistory = () => api.get("/users/history");

export const getUserVideos = async (userId) => {
  const res = await api.get(`/videos?userId=${userId}`);

  console.log("RAW RESPONSE:", res);
  console.log("RAW RESPONSE DATA:", res?.data);

  return res.data;
};

export const addView = (videoId) =>
  api.patch(`/videos/${videoId}/views`);