import type { ApiResponse, Domain, Module, Notebook } from "./types";

const API_URL = process.env.API_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} returned ${res.status}: ${text}`);
  }
  const envelope: ApiResponse<T> = await res.json();
  if (!envelope.success || envelope.data === null) {
    throw new Error(envelope.error ?? "Unknown API error");
  }
  return envelope.data;
}

export async function getDomains(): Promise<Domain[]> {
  return apiFetch<Domain[]>("/domains");
}

export async function getDomainModules(
  domainId: string,
  params?: { difficulty?: string; tags?: string[] }
): Promise<{ modules: Module[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.difficulty) qs.set("difficulty", params.difficulty);
  params?.tags?.forEach((t) => qs.append("tags", t));
  const query = qs.toString() ? `?${qs}` : "";

  const res = await fetch(`${API_URL}/domains/${domainId}/modules${query}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch modules for ${domainId}`);
  const envelope: ApiResponse<Module[]> = await res.json();
  if (!envelope.success || !envelope.data) throw new Error(envelope.error ?? "Unknown error");
  return { modules: envelope.data, total: envelope.meta?.total ?? envelope.data.length };
}

export async function getModule(moduleId: string): Promise<Module> {
  return apiFetch<Module>(`/modules/${moduleId}`);
}

export async function getModuleContent(moduleId: string, file: string): Promise<string> {
  const res = await fetch(`${API_URL}/modules/${moduleId}/content?file=${file}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return "";
  return res.text();
}

export async function getModuleNotebooks(moduleId: string): Promise<Notebook[]> {
  return apiFetch<Notebook[]>(`/modules/${moduleId}/notebooks`);
}

export async function searchModules(params: {
  q?: string;
  domain?: string;
  difficulty?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}): Promise<{ modules: Module[]; total: number; page: number; limit: number }> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.domain) qs.set("domain", params.domain);
  if (params.difficulty) qs.set("difficulty", params.difficulty);
  params.tags?.forEach((t) => qs.append("tags", t));
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const res = await fetch(`${API_URL}/search?${qs}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Search failed");
  const envelope: ApiResponse<Module[]> = await res.json();
  if (!envelope.success || !envelope.data) throw new Error(envelope.error ?? "Search error");
  return {
    modules: envelope.data,
    total: envelope.meta?.total ?? 0,
    page: envelope.meta?.page ?? 1,
    limit: envelope.meta?.limit ?? 20,
  };
}
