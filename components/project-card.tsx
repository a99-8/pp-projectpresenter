import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnyIcon } from "@/lib/icons";
import { projectTypeLabel, sourceLabel, statusLabel, storageLabel } from "@/lib/labels";
import type { Project } from "@/lib/types";
import { Badge } from "./ui/badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="pointer-events-none absolute -top-16 -left-16 size-40 rounded-full bg-primary/10 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <AnyIcon name={project.framework.icon ?? project.framework.name} className="size-5" />
          </span>
          <div>
            <h3 className="font-bold leading-tight">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              {project.framework.name}
              {project.year ? ` · ${project.year}` : ""}
            </p>
          </div>
        </div>
        <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {project.tagline}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        <Badge variant="outline">
          <AnyIcon name={project.type} className="size-3" />
          {projectTypeLabel[project.type]}
        </Badge>
        <Badge variant="outline">
          <AnyIcon name={project.storage} className="size-3" />
          {storageLabel[project.storage]}
        </Badge>
        <Badge variant="outline">
          <AnyIcon name={project.source === "open" ? "open" : "lock"} className="size-3" />
          {sourceLabel[project.source]}
        </Badge>
        {project.status !== "active" && (
          <Badge variant="accent">{statusLabel[project.status]}</Badge>
        )}
      </div>
    </Link>
  );
}
