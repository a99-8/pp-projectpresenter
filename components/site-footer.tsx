import type { Profile } from "@/lib/types";
import { AnyIcon } from "@/lib/icons";

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono font-bold text-foreground">PP</span> — بنيت
          بـ Next.js، والبيانات تُدار من ملفات داخل المستودع.
        </p>
        <div className="flex items-center gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <AnyIcon name={s.icon} className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
