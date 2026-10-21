import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Profile, Project } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");

const SOURCE_KINDS = new Set(["open", "closed"]);
const PROJECT_TYPES = new Set(["mobile", "web", "extension", "desktop", "cli"]);
const STORAGE_KINDS = new Set(["cloud", "local", "none"]);
const STATUSES = new Set(["active", "wip", "archived"]);
const CONTENT_TYPES = new Set(["html", "iframe", "image", "code"]);

function fail(file: string, message: string): never {
  throw new Error(`[data] ${file}: ${message}`);
}

function need<T>(file: string, value: T | undefined | null, field: string): T {
  if (value === undefined || value === null || value === "") {
    fail(file, `الحقل المطلوب "${field}" مفقود أو فارغ`);
  }
  return value;
}

function needString(file: string, value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    fail(file, `الحقل "${field}" يجب أن يكون نصاً غير فارغ`);
  }
  return value as string;
}

function needArray<T>(file: string, value: unknown, field: string): T[] {
  if (!Array.isArray(value)) {
    fail(file, `الحقل "${field}" يجب أن يكون مصفوفة`);
  }
  return value as T[];
}

function validateProject(raw: Record<string, unknown>, file: string): Project {
  const slug = needString(file, raw.slug, "slug");
  const source = needString(file, raw.source, "source");
  const type = needString(file, raw.type, "type");
  const storage = needString(file, raw.storage, "storage");

  if (!SOURCE_KINDS.has(source)) {
    fail(file, `"source" يجب أن يكون open أو closed (وصل: ${source})`);
  }
  if (!PROJECT_TYPES.has(type)) {
    fail(file, `"type" غير معروف: ${type}. القيم المسموحة: ${[...PROJECT_TYPES].join(", ")}`);
  }
  if (!STORAGE_KINDS.has(storage)) {
    fail(file, `"storage" يجب أن يكون cloud أو local أو none (وصل: ${storage})`);
  }
  if (raw.status !== undefined && !STATUSES.has(raw.status as string)) {
    fail(file, `"status" غير معروف: ${String(raw.status)}`);
  }

  const framework = need(file, raw.framework, "framework") as { name?: string; icon?: string };
  needString(file, framework.name, "framework.name");

  const screens = needArray<Project["screens"][number]>(file, raw.screens ?? [], "screens");
  const screenIds = new Set<string>();
  for (const screen of screens) {
    needString(file, screen.id, `screens[].id`);
    needString(file, screen.title, `screens[${screen.id}].title`);
    if (screenIds.has(screen.id)) fail(file, `معرّف شاشة مكرر: "${screen.id}"`);
    screenIds.add(screen.id);
    const content = need(file, screen.content, `screens[${screen.id}].content`);
    if (!CONTENT_TYPES.has(content.type)) {
      fail(file, `screens[${screen.id}].content.type غير معروف: ${String(content.type)}`);
    }
    if (content.type === "html") needString(file, content.html, `screens[${screen.id}].content.html`);
    if (content.type === "iframe") needString(file, content.url, `screens[${screen.id}].content.url`);
    if (content.type === "image") needString(file, content.src, `screens[${screen.id}].content.src`);
    if (content.type === "code") {
      needString(file, content.code, `screens[${screen.id}].content.code`);
      needString(file, content.language, `screens[${screen.id}].content.language`);
    }
  }
  for (const screen of screens) {
    for (const link of screen.links ?? []) {
      needString(file, link.label, `screens[${screen.id}].links[].label`);
      if (!screenIds.has(link.target)) {
        fail(file, `الزر "${link.label}" في الشاشة "${screen.id}" يشير لشاشة غير موجودة: "${link.target}"`);
      }
    }
  }

  if (raw.architecture !== undefined) {
    const arch = raw.architecture as NonNullable<Project["architecture"]>;
    type Layer = NonNullable<Project["architecture"]>["layers"][number];
    const layers = needArray<Layer>(file, arch.layers, "architecture.layers");
    const nodeIds = new Set<string>();
    for (const layer of layers) {
      for (const node of needArray<Layer["nodes"][number]>(
        file,
        layer.nodes,
        "architecture.layers[].nodes",
      )) {
        needString(file, node.id, "architecture node id");
        needString(file, node.label, `architecture node "${node.id}" label`);
        if (nodeIds.has(node.id)) fail(file, `معرّف عقدة مكرر في المخطط: "${node.id}"`);
        nodeIds.add(node.id);
      }
    }
    for (const flow of needArray<{ from: string; to: string }>(
      file,
      arch.flows ?? [],
      "architecture.flows",
    )) {
      if (!nodeIds.has(flow.from)) fail(file, `flow.from غير موجود في المخطط: "${flow.from}"`);
      if (!nodeIds.has(flow.to)) fail(file, `flow.to غير موجود في المخطط: "${flow.to}"`);
    }
  }

  return {
    slug,
    name: needString(file, raw.name, "name"),
    tagline: needString(file, raw.tagline, "tagline"),
    description: (raw.description as string | undefined) ?? undefined,
    source: source as Project["source"],
    repoUrl: raw.repoUrl as string | undefined,
    demoUrl: raw.demoUrl as string | undefined,
    websiteUrl: raw.websiteUrl as string | undefined,
    type: type as Project["type"],
    framework: { name: framework.name!, icon: framework.icon },
    stack: needArray<string>(file, raw.stack ?? [], "stack"),
    storage: storage as Project["storage"],
    status: (raw.status as Project["status"]) ?? "active",
    featured: raw.featured === true,
    year: typeof raw.year === "number" ? raw.year : undefined,
    features: needArray<string>(file, raw.features ?? [], "features"),
    highlights: needArray<string>(file, raw.highlights ?? [], "highlights"),
    challenges: needArray<Project["challenges"][number]>(file, raw.challenges ?? [], "challenges"),
    architecture: raw.architecture as Project["architecture"],
    screens,
  };
}

function parseProjectFile(fileName: string): Project {
  const filePath = path.join(PROJECTS_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");

  if (fileName.endsWith(".json")) {
    return validateProject(JSON.parse(raw), fileName);
  }

  const { data, content } = matter(raw);
  const project = validateProject(data, fileName);
  const body = content.trim();
  if (body) {
    project.description = project.description
      ? `${project.description}\n\n${body}`
      : body;
  }
  return project;
}

let projectsCache: Project[] | null = null;
let profileCache: Profile | null = null;

export function getProjects(): Project[] {
  if (projectsCache) return projectsCache;

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => /\.(json|md|mdx)$/i.test(f))
    .sort();

  projectsCache = files
    .map(parseProjectFile)
    .sort((a, b) =>
      Number(b.featured) - Number(a.featured) ||
      (b.year ?? 0) - (a.year ?? 0) ||
      a.name.localeCompare(b.name, "ar"),
    );
  return projectsCache;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  prev?: Project;
  next?: Project;
} {
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? all[i - 1] : undefined,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined,
  };
}

export function getProfile(): Profile {
  if (profileCache) return profileCache;
  const raw = fs.readFileSync(path.join(DATA_DIR, "profile.json"), "utf-8");
  profileCache = JSON.parse(raw) as Profile;
  return profileCache;
}
