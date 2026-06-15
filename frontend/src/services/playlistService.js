import { api } from "./api";

export const getUserPlaylists = async (userId) => {
  const res = await api.get(`/playlist/user/${userId}`);
  return res.data;
};