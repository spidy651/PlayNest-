import { api } from "./api"; 

export const getComments = (videoId) =>
  api.get(`/comments/${videoId}`).then((r) => r.data);

export const createComment = (videoId, content) =>
  api.post(`/comments/${videoId}`, { content }).then((r) => r.data);

export const updateComment = (commentId, content) =>
  api.patch(`/comments/c/${commentId}`, { content }).then((r) => r.data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/c/${commentId}`);

export const likeComment = (commentId) =>
  api.post(`/likes/toggle/c/${commentId}`).then((r) => r.data);