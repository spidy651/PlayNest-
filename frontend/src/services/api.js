const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/v1";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...(token && {
      Authorization: `Bearer ${token}`,
    }),

    ...options.headers,
  };

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({
        message: "Request failed",
      }));

    throw new Error(
      error.message || `HTTP ${response.status}`
    );
  }

  return response.json();
}

export const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body:
        body instanceof FormData
          ? body
          : JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, { method: "DELETE" }),

  upload: (endpoint, formData) => {
    const token =
      localStorage.getItem("accessToken");

    return fetch(
      `${BASE_URL}${endpoint}`,
      {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
        body: formData,
      }
    ).then(async (res) => {
      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({
            message: "Upload failed",
          }));

        throw new Error(
          err.message || `HTTP ${res.status}`
        );
      }

      return res.json();
    });
  },
};