import { createElement } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Award,
  Box,
  Boxes,
  Briefcase,
  CircleOff,
  Cloud,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrive,
  Layers,
  LayoutDashboard,
  Lock,
  LockOpen,
  Mail,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Palette,
  Puzzle,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";
import {
  siAngular,
  siAstro,
  siDart,
  siDocker,
  siElectron,
  siExpo,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGooglegemini,
  siGraphql,
  siInstagram,
  siJavascript,
  siKotlin,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siRust,
  siSqlite,
  siSupabase,
  siSvelte,
  siSwift,
  siTailwindcss,
  siTelegram,
  siTypescript,
  siVercel,
  siVite,
  siVuedotjs,
  siWhatsapp,
  siX,
  siYoutube,
} from "simple-icons";
import { cn } from "./utils";

const lucideIcons: Record<string, LucideIcon> = {
  award: Award,
  box: Box,
  boxes: Boxes,
  briefcase: Briefcase,
  cli: Terminal,
  cloud: Cloud,
  code: Code2,
  cpu: Cpu,
  database: Database,
  desktop: Monitor,
  extension: Puzzle,
  globe: Globe,
  graduation: GraduationCap,
  layers: Layers,
  layout: LayoutDashboard,
  local: HardDrive,
  lock: Lock,
  mail: Mail,
  message: MessageSquare,
  mobile: Smartphone,
  mouse: MousePointerClick,
  none: CircleOff,
  open: LockOpen,
  palette: Palette,
  rocket: Rocket,
  server: Server,
  shield: Shield,
  sparkles: Sparkles,
  terminal: Terminal,
  web: Globe,
  window: AppWindow,
  wrench: Wrench,
  zap: Zap,
  branch: GitBranch,
};

// لينكدإن أزيلت من simple-icons — مسارها محفوظ يدوياً هنا
const linkedinIcon = {
  title: "LinkedIn",
  slug: "linkedin",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const brandIcons: Record<string, { title: string; path: string; slug: string }> = {
  linkedin: linkedinIcon,
  angular: siAngular,
  astro: siAstro,
  dart: siDart,
  docker: siDocker,
  electron: siElectron,
  expo: siExpo,
  firebase: siFirebase,
  flutter: siFlutter,
  gemini: siGooglegemini,
  git: siGit,
  github: siGithub,
  graphql: siGraphql,
  instagram: siInstagram,
  javascript: siJavascript,
  kotlin: siKotlin,
  mongodb: siMongodb,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  prisma: siPrisma,
  python: siPython,
  react: siReact,
  reactnative: siReact,
  redis: siRedis,
  rust: siRust,
  sqlite: siSqlite,
  supabase: siSupabase,
  svelte: siSvelte,
  swift: siSwift,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  telegram: siTelegram,
  typescript: siTypescript,
  vercel: siVercel,
  vite: siVite,
  vue: siVuedotjs,
  whatsapp: siWhatsapp,
  x: siX,
  youtube: siYoutube,
};

function normalizeKey(name: string) {
  return name.toLowerCase().replace(/[.\s\-_/]+/g, "");
}

/** أيقونة عامة من Lucide بالاسم (تُستخدم في ملفات البيانات) */
export function NamedIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const icon =
    (name && lucideIcons[normalizeKey(name)]) ||
    (name ? lucideIcons[name] : undefined) ||
    Box;
  return createElement(icon, { className: cn("size-4", className), "aria-hidden": true });
}

const brandByName = new Map<string, { title: string; path: string }>(
  Object.entries(brandIcons).flatMap(([key, icon]) => [
    [key, icon],
    [icon.slug, icon],
    [icon.title.toLowerCase(), icon],
  ]),
);

/** أيقونة موحّدة: تبحث في أيقونات البراندات أولاً ثم أيقونات Lucide العامة */
export function AnyIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const key = name ? normalizeKey(name) : "";
  const brand = key ? brandByName.get(key) : undefined;
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label={brand.title}
        fill="currentColor"
        className={cn("size-4", className)}
      >
        <path d={brand.path} />
      </svg>
    );
  }
  const lucide = (key && lucideIcons[key]) || (name ? lucideIcons[name] : undefined);
  return createElement(lucide ?? Code2, {
    className: cn("size-4", className),
    "aria-hidden": true,
  });
}

/** أيقونة تقنية/براند من simple-icons مع رجوع لأيقونة عامة عند عدم وجودها */
export function BrandIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const icon = name ? brandByName.get(normalizeKey(name)) : undefined;
  if (!icon) return <Code2 className={cn("size-4", className)} aria-hidden />;
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={icon.title}
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path d={icon.path} />
    </svg>
  );
}
