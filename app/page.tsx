import { ArrowLeft, FolderOpen, Layers, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { getProfile, getProjects } from "@/lib/data";
import { BrandIcon } from "@/lib/icons";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length ? featured : projects).slice(0, 3);
  const frameworks = [
    ...new Map(projects.map((p) => [p.framework.name, p.framework])).values(),
  ];
  const timelineYears = profile.timeline
    .map((t) => Number.parseInt(t.year, 10))
    .filter((y) => !Number.isNaN(y));
  const years = timelineYears.length
    ? Math.max(...timelineYears) - Math.min(...timelineYears) + 1
    : 0;

  return (
    <div className="relative overflow-hidden">
      {/* تأثيرات الخلفية */}
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      {/* البطل */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-16 text-center sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            {profile.availability ?? profile.role}
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.3] tracking-tight sm:text-5xl sm:leading-[1.25]">
            أعرض مشاريعي كما تستحق أن
            <span className="bg-gradient-to-l from-primary to-accent-foreground bg-clip-text text-transparent">
              {" "}
              تُعرَض
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.bio}
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/projects" className={buttonVariants({ size: "lg" })}>
            <FolderOpen className="size-4" />
            استعرض المشاريع
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
            <User className="size-4" />
            نبذة عني
          </Link>
        </Reveal>

        {/* إحصاءات */}
        <Reveal delay={0.32} className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-3">
          {[
            { value: `${projects.length}+`, label: "مشروعاً معروضاً" },
            { value: `${years}+`, label: "سنوات خبرة" },
            { value: `${frameworks.length}`, label: "إطاراً وتقنية" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card/80 px-4 py-5 backdrop-blur"
            >
              <div className="font-mono text-2xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* المشاريع المميزة */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Layers className="size-5 text-primary" />
              مشاريع مميزة
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              كل مشروع بصفحة تفصيلية وعارض تفاعلي يحاكي واجهاته
            </p>
          </div>
          <Link
            href="/projects"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            كل المشاريع
            <ArrowLeft className="size-4" />
          </Link>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* التقنيات */}
      <section className="border-t border-border/60 bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 py-10 sm:px-6">
          {frameworks.map((f) => (
            <span
              key={f.name}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <BrandIcon name={f.icon ?? f.name} className="size-5" />
              {f.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
