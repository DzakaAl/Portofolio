// ==========================================
// Backend API Client — single source of truth
// ==========================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// ---------- helpers ----------

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach JWT token for admin routes
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || errorBody.message || res.statusText);
  }

  return res.json();
}

// ---------- Public API ----------

export const api = {
  // Hero
  getHero: () => request<import("@/types").HeroContent>("/hero"),

  // About
  getAbout: () => request<import("@/types").AboutContent>("/about"),

  // Projects
  getProjects: () => request<import("@/types").Project[]>("/projects"),
  getProject: (id: number) =>
    request<import("@/types").Project>(`/projects/${id}`),

  // Certificates
  getCertificates: () =>
    request<import("@/types").Certificate[]>("/certificates"),

  // Tech Stack
  getTechStack: () => request<import("@/types").TechStack[]>("/tech-stack"),

  // Contact Info
  getContactInfo: () =>
    request<import("@/types").ContactInfo>("/contact-info"),

  // Messages (public: send)
  sendMessage: (data: { name: string; email: string; message: string }) =>
    request<{ id: number; message: string }>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Visitor Stats (public: record)
  recordVisit: (data: {
    component_name: string;
    session_id: string;
    is_admin?: boolean;
  }) =>
    request<{ message: string }>("/visitor-stats", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---------- Admin API ----------

export const adminApi = {
  // Auth
  login: (data: import("@/types").LoginRequest) =>
    request<import("@/types").LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    }),

  // Hero
  updateHero: (data: Partial<import("@/types").HeroContent>) =>
    request<{ message: string }>("/hero", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // About
  updateAbout: (id: number, data: Partial<import("@/types").AboutContent>) =>
    request<{ message: string }>(`/about/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Projects
  createProject: (data: Partial<import("@/types").Project>) =>
    request<{ id: number; message: string }>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: number, data: Partial<import("@/types").Project>) =>
    request<{ message: string }>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<{ message: string }>(`/projects/${id}`, { method: "DELETE" }),
  reorderProjects: (order: { id: number; display_order: number }[]) =>
    request<{ message: string }>("/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({ order }),
    }),

  // Certificates
  createCertificate: (data: Partial<import("@/types").Certificate>) =>
    request<{ id: number; message: string }>("/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCertificate: (
    id: number,
    data: Partial<import("@/types").Certificate>
  ) =>
    request<{ message: string }>(`/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCertificate: (id: number) =>
    request<{ message: string }>(`/certificates/${id}`, { method: "DELETE" }),
  reorderCertificates: (order: { id: number; display_order: number }[]) =>
    request<{ message: string }>("/certificates/reorder", {
      method: "PUT",
      body: JSON.stringify({ order }),
    }),

  // Tech Stack
  createTechStack: (data: Partial<import("@/types").TechStack>) =>
    request<{ id: number; message: string }>("/tech-stack", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTechStack: (id: number, data: Partial<import("@/types").TechStack>) =>
    request<{ message: string }>(`/tech-stack/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTechStack: (id: number) =>
    request<{ message: string }>(`/tech-stack/${id}`, { method: "DELETE" }),
  reorderTechStack: (order: { id: number; display_order: number }[]) =>
    request<{ message: string }>("/tech-stack/reorder", {
      method: "PUT",
      body: JSON.stringify({ order }),
    }),

  // Contact Info
  updateContactInfo: (
    id: number,
    data: Partial<import("@/types").ContactInfo>
  ) =>
    request<{ message: string }>(`/contact-info/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Messages
  getMessages: () => request<import("@/types").Message[]>("/messages"),
  deleteMessage: (id: number) =>
    request<{ message: string }>(`/messages/${id}`, { method: "DELETE" }),

  // Upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(err.error || "Upload failed");
    }
    return res.json() as Promise<{
      url: string;
      filename: string;
      message: string;
    }>;
  },

  // Visitor Stats
  getVisitorStats: () =>
    request<import("@/types").VisitorStat[]>("/visitor-stats"),
  getVisitorSummary: () =>
    request<import("@/types").VisitorSummary>("/visitor-stats/summary"),
  getComponentViews: () =>
    request<{ component_name: string; views: number }[]>(
      "/visitor-stats/component-views"
    ),
};
