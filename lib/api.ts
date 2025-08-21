// lib/api.ts
export const API_URL = "https://jaja-render-api.onrender.com";

// ===== Token Helpers =====
const getToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ===== Auth APIs =====

// 🔑 Login
export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();

  // Save tokens
  setTokens(data.token, data.refreshToken);

  return data; // contains { message, token, refreshToken, user }
};

// 🔄 Refresh access token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};

// ===== Authenticated Fetch Wrapper =====
const authFetch = async (url: string, options: RequestInit = {}) => {
  let token = getToken();
  if (!token) throw new Error("No access token found, please login first");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, options);

  // if expired, refresh and retry
  if (res.status === 401 || res.status === 403) {
    token = await refreshAccessToken();
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
    res = await fetch(url, options);
  }

  return res;
};

// ===== Parent APIs =====
export const createParentApi = async (data: {
  full_name: string;
  email: string;
  phone?: string;
  occupation?: string;
  address?: string;
}) => {
  const res = await authFetch(`${API_URL}/parents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create parent: ${errorText}`);
  }

  return res.json();
};


// ✅ Get All Active Parents
export const getParentsApi = async () => {
  const res = await authFetch(`${API_URL}/parentlist`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch parents: ${errorText}`);
  }

  return res.json(); // returns array of parents
};



  export const addTeacherApi = async (teacherData: {
    teacher_id: string;
    name: string;
    phone: string;
    address: string;
    qualification: string;
    experience_years: number;
    salary: number;
    join_date: string; // YYYY-MM-DD
    profile_image: string;
    is_active: number;
  }) => {
    const res = await authFetch(`${API_URL}/addteachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacherData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to add teacher: ${errorText}`);
    }

    return res.json();
  };


  export const getTeachersApi = async () => {
    const res = await authFetch(`${API_URL}/teacherlist`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch teachers: ${errorText}`);
    }
  
    return res.json(); // array of teachers
  };
  
