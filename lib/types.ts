export type SourceKind = "open" | "closed";
export type ProjectType = "mobile" | "web" | "extension" | "desktop" | "cli";
export type StorageKind = "cloud" | "local" | "none";
export type DeviceKind = "mobile" | "desktop";
export type ProjectStatus = "active" | "wip" | "archived";

/** محتوى الشاشة داخل العارض الذكي */
export type ScreenContent =
  | { type: "html"; html: string }
  | { type: "iframe"; url: string; title?: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "code"; language: string; code: string; fileName?: string };

/** زر تنقّل داخل العارض: ينقل المستخدم لشاشة أخرى، ويمكن إظهاره كنقطة ساخنة فوق الشاشة */
export type ScreenLink = {
  label: string;
  target: string;
  hotspot?: { x: number; y: number; w: number; h: number };
};

export type ProjectScreen = {
  id: string;
  title: string;
  device?: DeviceKind;
  description?: string;
  content: ScreenContent;
  links?: ScreenLink[];
};

export type ArchNode = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
};

export type Architecture = {
  layers: { title?: string; nodes: ArchNode[] }[];
  flows: { from: string; to: string; label?: string }[];
};

export type Challenge = {
  title: string;
  problem: string;
  solution: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description?: string;
  source: SourceKind;
  repoUrl?: string;
  demoUrl?: string;
  type: ProjectType;
  framework: { name: string; icon?: string };
  stack: string[];
  storage: StorageKind;
  status: ProjectStatus;
  featured: boolean;
  year?: number;
  features: string[];
  highlights: string[];
  challenges: Challenge[];
  architecture?: Architecture;
  screens: ProjectScreen[];
};

export type SocialLink = {
  label: string;
  url: string;
  icon: string;
};

export type SkillGroup = {
  group: string;
  items: { name: string; icon?: string; level?: number }[];
};

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
  icon?: string;
};

export type Profile = {
  name: string;
  role: string;
  bio: string;
  location?: string;
  availability?: string;
  email?: string;
  socials: SocialLink[];
  skills: SkillGroup[];
  timeline: TimelineEntry[];
};

/** شاشة جاهزة للعرض بعد المعالجة في الخادم (الكود يصبح HTML ملوّناً) */
export type ViewerScreen = {
  id: string;
  title: string;
  device: DeviceKind;
  description?: string;
  kind: "html" | "iframe" | "image" | "code";
  html?: string;
  url?: string;
  src?: string;
  alt?: string;
  fileName?: string;
  links: ScreenLink[];
};
