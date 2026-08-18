import type {
  AuthResponse,
  AuthUser,
  DataCategoryResponse,
  HealthResponse,
  QueryResponse,
} from "../types/types";

const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://medirator2-backend.onrender.com";

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg).join(", ");
    }
  } catch {
    // fall through
  }
  return `Request failed with status ${res.status}`;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("medirator_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function queryAssistant(
  query: string,
  category?: string | null,
): Promise<QueryResponse> {
  const res = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify({ query, category: category || null }),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/health`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch backend health");
  return res.json();
}

export async function getCategoryData(
  category: string,
  q?: string,
): Promise<DataCategoryResponse> {
  const params = q ? `?q=${encodeURIComponent(q)}` : "";
  const res = await fetch(`${BASE_URL}/data/${category}${params}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function googleLogin(credential: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    credentials: "include",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function logoutRequest(): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export type ComplaintSubmitResponse = {
  ok: boolean;
  id: string;
  to: string;
  from_email: string;
  from_name: string;
  subject: string;
  message_body: string;
  delivered: "smtp" | "pending_client" | string;
  message: string;
};

export async function submitComplaint(payload: {
  toEmail: string;
  subject: string;
  complaint: string;
  attachment?: File | null;
}): Promise<ComplaintSubmitResponse> {
  const form = new FormData();
  form.append("to_email", payload.toEmail);
  form.append("subject", payload.subject);
  form.append("complaint", payload.complaint);
  if (payload.attachment) {
    form.append("attachment", payload.attachment);
  }

  const res = await fetch(`${BASE_URL}/complaints`, {
    method: "POST",
    headers: { ...authHeaders() },
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** FormSubmit must be called from a browser page served over http(s), not file:// */
export async function deliverComplaintEmail(payload: {
  to: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  messageBody: string;
  attachment?: File | null;
}): Promise<void> {
  const form = new FormData();
  form.append("name", payload.fromName || payload.fromEmail);
  form.append("email", payload.fromEmail);
  form.append("_replyto", payload.fromEmail);
  form.append("subject", `[Medirator] ${payload.subject}`);
  form.append("message", payload.messageBody);
  form.append("_template", "table");
  form.append("_captcha", "false");
  if (payload.attachment) {
    form.append("attachment", payload.attachment);
  }

  const res = await fetch(`https://formsubmit.co/ajax/${payload.to}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: form,
  });

  let data: { success?: string | boolean; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok || data.success === "false" || data.success === false) {
    throw new Error(
      data.message ||
        "Email delivery failed. Open the app via http://localhost:5173 (not a local HTML file) and try again. If this is the first send, check your inbox for a FormSubmit activation link.",
    );
  }
}
