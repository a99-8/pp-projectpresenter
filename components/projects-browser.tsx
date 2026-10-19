"use client";

import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { AnyIcon } from "@/lib/icons";
import {
  projectTypeLabel,
  sourceLabel,
  storageLabel,
} from "@/lib/labels";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";

type FilterGroup = {
  key: "type" | "storage" | "source";
  label: string;
  options: { value: string; label: string; icon?: string }[];
};

const GROUPS: FilterGroup[] = [
  {
    key: "type",
    label: "نوع المشروع",
    options: Object.entries(projectTypeLabel).map(([value, label]) => ({
      value,
      label,
      icon: value,
    })),
  },
  {
    key: "storage",
    label: "التخزين",
    options: Object.entries(storageLabel).map(([value, label]) => ({
      value,
      label,
      icon: value,
    })),
  },
  {
    key: "source",
    label: "المصدر",
    options: [
      { value: "open", label: sourceLabel.open, icon: "open" },
      { value: "closed", label: sourceLabel.closed, icon: "lock" },
    ],
  },
];

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [framework, setFramework] = useState<string | null>(null);

  const frameworks = useMemo(
    () => [...new Set(projects.map((p) => p.framework.name))].sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filters.type && p.type !== filters.type) return false;
      if (filters.storage && p.storage !== filters.storage) return false;
      if (filters.source && p.source !== filters.source) return false;
      if (framework && p.framework.name !== framework) return false;
      if (
        q &&
        !`${p.name} ${p.tagline} ${p.framework.name} ${p.stack.join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [projects, query, filters, framework]);

  const toggle = (key: string, value: string) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? null : value }));

  return (
    <div className="mt-8">
      {/* البحث */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث باسم المشروع أو تقنية…"
          className="h-11 w-full rounded-xl border border-border bg-card pr-10 pl-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
        />
      </div>

      {/* المرشحات */}
      <div className="mt-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">الإطار:</span>
          {frameworks.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFramework((cur) => (cur === f ? null : f))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                framework === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {GROUPS.map((group) => (
          <div key={group.key} className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {group.label}:
            </span>
            {group.options.map((opt) => {
              const active = filters[group.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(group.key, opt.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {opt.icon && <AnyIcon name={opt.icon} className="size-3" />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* النتائج */}
      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} من {projects.length} مشروعاً
      </p>

      {filtered.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            لا توجد مشاريع تطابق المرشحات الحالية
          </p>
        </div>
      )}
    </div>
  );
}
