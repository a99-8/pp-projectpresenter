"use client";

import { ArrowLeft, ArrowRight, Monitor, Puzzle, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { projectTypeLabel } from "@/lib/labels";
import type { ProjectType, ViewerScreen } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SmartViewer } from "./smart-viewer";
import { buttonVariants } from "./ui/button";

export type HomeViewerEntry = {
  slug: string;
  name: string;
  tagline: string;
  type: ProjectType;
  screens: ViewerScreen[];
};

const TYPE_ORDER: ProjectType[] = ["mobile", "web", "extension", "desktop", "cli"];

const typeIcon: Partial<Record<ProjectType, typeof Smartphone>> = {
  mobile: Smartphone,
  web: Monitor,
  extension: Puzzle,
  desktop: Monitor,
};

export function HomeProjectViewer({ entries }: { entries: HomeViewerEntry[] }) {
  const types = TYPE_ORDER.filter((t) => entries.some((e) => e.type === t));
  const [type, setType] = useState<ProjectType>(types[0] ?? "web");
  const [index, setIndex] = useState(0);

  const list = entries.filter((e) => e.type === type);
  const current = list[Math.min(index, list.length - 1)];

  const selectType = (t: ProjectType) => {
    setType(t);
    setIndex(0);
  };

  if (!current) return null;

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + list.length) % list.length);

  return (
    <div>
      {/* تبويبات نوع المشروع */}
      <div className="flex flex-wrap items-center gap-2">
        {types.map((t) => {
          const Icon = typeIcon[t];
          const count = entries.filter((e) => e.type === t).length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => selectType(t)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                type === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="size-4" />}
              {projectTypeLabel[t]}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* اسم المشروع الحالي */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{current.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{current.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {index + 1} / {list.length}
          </span>
          <Link
            href={`/projects/${current.slug}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            صفحة المشروع
          </Link>
        </div>
      </div>

      {/* العارض */}
      <div className="mt-5">
        <SmartViewer
          key={`${type}-${current.slug}`}
          screens={current.screens}
          devicePicker={false}
          fixedDevice={type === "mobile" ? "mobile" : "desktop"}
        />
      </div>

      {/* التنقل بين مشاريع النوع نفسه — يتوسّط عمود الجهاز لا الصفحة */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="hidden lg:block" />
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={list.length < 2}
            className={cn(
              buttonVariants({ variant: "outline" }),
              list.length < 2 && "pointer-events-none opacity-50",
            )}
          >
            <ArrowRight className="size-4" />
            السابق
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={list.length < 2}
            className={cn(
              buttonVariants(),
              list.length < 2 && "pointer-events-none opacity-50",
            )}
          >
            التالي
            <ArrowLeft className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
