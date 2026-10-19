import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { getProjects } from "@/lib/data";
import { ProjectsBrowser } from "@/components/projects-browser";

export const metadata: Metadata = {
  title: "المشاريع",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div>
        <h1 className="flex items-center gap-2.5 text-3xl font-bold">
          <LayoutGrid className="size-7 text-primary" />
          معرض المشاريع
        </h1>
        <p className="mt-2 text-muted-foreground">
          {projects.length} مشاريع — صفّها حسب النوع أو الإطار أو التخزين، أو ابحث
          بالاسم.
        </p>
      </div>

      <ProjectsBrowser projects={projects} />
    </div>
  );
}
