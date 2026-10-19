import type { ProjectStatus, ProjectType, SourceKind, StorageKind } from "./types";

export const projectTypeLabel: Record<ProjectType, string> = {
  mobile: "تطبيق جوال",
  web: "تطبيق ويب",
  extension: "إضافة متصفح",
  desktop: "تطبيق سطح مكتب",
  cli: "أداة سطر أوامر",
};

export const storageLabel: Record<StorageKind, string> = {
  cloud: "تخزين سحابي",
  local: "تخزين محلي",
  none: "بدون تخزين",
};

export const sourceLabel: Record<SourceKind, string> = {
  open: "مصدر مفتوح",
  closed: "مصدر مغلق",
};

export const statusLabel: Record<ProjectStatus, string> = {
  active: "نشِط",
  wip: "قيد التطوير",
  archived: "مؤرشف",
};
