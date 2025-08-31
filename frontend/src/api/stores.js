
import api from "./client";

export const fetchStores = (params) => api.get("/stores", { params }).then(r => r.data);
export const fetchStore = (id) => api.get(`/stores/${id}`).then(r => r.data);
export const createStore = (payload) => api.post("/stores", payload).then(r => r.data);

export const submitRating = (payload) => api.post("/ratings", payload).then(r => r.data);
export const updateRating = (id, payload) => api.put(`/ratings/${id}`, payload).then(r => r.data);
export const getRatingsForStore = (storeId) => api.get(`/stores/${storeId}/ratings`).then(r => r.data);
