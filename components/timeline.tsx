import { NamedIcon } from "@/lib/icons";
import type { TimelineEntry } from "@/lib/types";
import { Reveal } from "./reveal";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative mt-8 space-y-8 border-r-2 border-border pr-8">
      {entries.map((entry, i) => (
        <li key={`${entry.year}-${entry.title}`} className="relative">
          <Reveal delay={i * 0.08}>
            <span className="absolute -right-[47px] flex size-7 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
              <NamedIcon name={entry.icon} className="size-3.5" />
            </span>
            <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
              <span className="font-mono text-sm font-bold text-primary">
                {entry.year}
              </span>
              <h3 className="mt-1 font-bold">{entry.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
