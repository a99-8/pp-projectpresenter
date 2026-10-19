import type { Metadata } from "next";
import { MapPin, User } from "lucide-react";
import { getProfile } from "@/lib/data";
import { AnyIcon, BrandIcon } from "@/lib/icons";
import { Reveal } from "@/components/reveal";
import { Timeline } from "@/components/timeline";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "نبذة عني",
};

export default function AboutPage() {
  const profile = getProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* الملف الشخصي */}
      <section className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <Reveal>
          <div className="flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-4xl font-bold text-primary-foreground">
            {profile.name.trim().charAt(0)}
          </div>
        </Reveal>
        <div className="flex-1">
          <Reveal delay={0.05}>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="mt-1 text-lg text-primary">{profile.role}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {profile.location}
                </span>
              )}
              {profile.availability && (
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  {profile.availability}
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-5 flex flex-wrap gap-2">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <AnyIcon name={s.icon} className="size-4" />
                {s.label}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* المهارات */}
      <section className="mt-20">
        <Reveal>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <User className="size-5 text-primary" />
            المهارات التقنية
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-primary">{group.group}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((skill) => (
                    <li key={skill.name} className="flex items-center gap-2.5 text-sm">
                      <BrandIcon
                        name={skill.icon ?? skill.name}
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span className="flex-1">{skill.name}</span>
                      {typeof skill.level === "number" && (
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                          />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* الجدول الزمني */}
      <section className="mt-20">
        <Reveal>
          <h2 className="text-2xl font-bold">المسيرة البرمجية</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            محطات رئيسية في رحلتي مع البرمجة
          </p>
        </Reveal>
        <Timeline entries={profile.timeline} />
      </section>
    </div>
  );
}
