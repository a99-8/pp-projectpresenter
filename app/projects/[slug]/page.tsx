import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Markdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  Lightbulb,
  Monitor,
  Network,
  Siren,
  Workflow,
} from "lucide-react";
import { getAdjacentProjects, getProject, getProjects } from "@/lib/data";
import { AnyIcon } from "@/lib/icons";
import {
  projectTypeLabel,
  sourceLabel,
  statusLabel,
  storageLabel,
} from "@/lib/labels";
import { toViewerScreens } from "@/lib/screens";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { SmartViewer } from "@/components/smart-viewer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="flex items-center gap-2.5 text-2xl font-bold">
        <Icon className="size-6 text-primary" />
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ProjectSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-12 sm:px-6">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-8 flex items-start gap-4">
        <div className="size-16 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="h-4 w-full max-w-md rounded bg-muted" />
        </div>
      </div>
      <div className="mt-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-20 rounded-full bg-muted" />
        ))}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-muted" />
        <div className="h-48 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);
  const screens = await toViewerScreens(project);

  const meta = [
    { icon: project.type, label: projectTypeLabel[project.type] },
    { icon: project.storage, label: storageLabel[project.storage] },
    {
      icon: project.source === "open" ? "open" : "lock",
      label: sourceLabel[project.source],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        كل المشاريع
      </Link>

      {/* الترويسة */}
      <header className="mt-6 flex flex-col gap-6 border-b border-border pb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <AnyIcon
                name={project.framework.icon ?? project.framework.name}
                className="size-8"
              />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {project.status !== "active" && (
                  <Badge variant="accent">{statusLabel[project.status]}</Badge>
                )}
                {project.featured && <Badge variant="accent">مميز</Badge>}
              </div>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <AnyIcon name="github" className="size-4" />
                الكود المصدري
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "sm" })}
              >
                <ExternalLink className="size-4" />
                معاينة حية
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <AnyIcon
              name={project.framework.icon ?? project.framework.name}
              className="size-3.5"
            />
            {project.framework.name}
          </Badge>
          {meta.map((m) => (
            <Badge key={m.label} variant="outline">
              <AnyIcon name={m.icon} className="size-3.5" />
              {m.label}
            </Badge>
          ))}
          {project.stack.map((tech) => (
            <Badge key={tech} variant="outline">
              <AnyIcon name={tech} className="size-3.5" />
              {tech}
            </Badge>
          ))}
          {project.year && <Badge variant="outline">{project.year}</Badge>}
        </div>
      </header>

      {/* الوصف */}
      {project.description && (
        <div className="prose-ar mt-8 max-w-3xl text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:my-1 [&_ul]:list-disc [&_ul]:pr-6 [&_strong]:text-foreground">
          <Markdown>{project.description}</Markdown>
        </div>
      )}

      {/* الخصائص والمميزات */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="size-5 text-primary" />
            خصائص المشروع
          </h3>
          <ul className="mt-4 space-y-2.5">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-bold">
            <Lightbulb className="size-5 text-primary" />
            مميزات المشروع
          </h3>
          <ul className="mt-4 space-y-2.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* العارض الذكي */}
      {screens.length > 0 && (
        <Section icon={Eye} title="العارض التفاعلي">
          <p className="mb-6 -mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Monitor className="size-4" />
            جرّب التنقل بين الشاشات — المناطق النابضة داخل الشاشة تحاكي أزرار الواجهة الحقيقية.
          </p>
          <SmartViewer screens={screens} />
        </Section>
      )}

      {/* المعمارية */}
      {project.architecture && (
        <Section icon={Network} title="هيكلية المشروع">
          <div className="rounded-2xl border border-border bg-card p-6">
            <ArchitectureDiagram architecture={project.architecture} />
          </div>
        </Section>
      )}

      {/* التحديات */}
      {project.challenges.length > 0 && (
        <Section icon={Workflow} title="التحديات والحلول">
          <div className="grid gap-5 md:grid-cols-2">
            {project.challenges.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-bold">{c.title}</h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed">
                  <p className="flex items-start gap-2.5">
                    <Siren className="mt-0.5 size-4 shrink-0 text-red-500" />
                    <span>
                      <span className="font-semibold">المشكلة: </span>
                      <span className="text-muted-foreground">{c.problem}</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>
                      <span className="font-semibold">الحل: </span>
                      <span className="text-muted-foreground">{c.solution}</span>
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* تنقل بين المشاريع */}
      <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
            <div>
              <div className="text-xs text-muted-foreground">السابق</div>
              <div className="font-bold">{prev.name}</div>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-end gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 sm:col-start-2"
          >
            <div>
              <div className="text-xs text-muted-foreground">التالي</div>
              <div className="font-bold">{next.name}</div>
            </div>
            <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        )}
      </nav>
    </div>
  );
}
