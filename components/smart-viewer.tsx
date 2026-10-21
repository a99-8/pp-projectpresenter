"use client";

import DOMPurify from "dompurify";
import {
  Code2,
  Globe,
  Image as ImageIcon,
  Monitor,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { DeviceKind, ViewerScreen } from "@/lib/types";
import { cn } from "@/lib/utils";

const kindIcon = {
  html: Globe,
  iframe: Globe,
  image: ImageIcon,
  code: Code2,
} as const;

function buildSrcDoc(html: string) {
  // DOMPurify يرتبط بـ window في المتصفح فقط؛ أثناء العرض على الخادم يمرّر النص
  // كما هو — ويبقى <iframe sandbox=""/> حاجزاً مانعاً لأي تنفيذ سكربت.
  const clean =
    typeof DOMPurify.sanitize === "function"
      ? DOMPurify.sanitize(html, {
          USE_PROFILES: { html: true },
          FORBID_TAGS: ["form"],
        })
      : html;
  return `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}*{box-sizing:border-box}</style></head><body>${clean}</body></html>`;
}

function ScreenContent({ screen }: { screen: ViewerScreen }) {
  // DOMPurify يعمل في المتصفح فقط؛ نؤجّل العرض حتى ما بعد الـ hydration ليتطابق
  // ناتج التطهير على الخادم والعميل ولا يحدث hydration mismatch في srcDoc.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const srcDoc = useMemo(
    () =>
      mounted && screen.kind === "html" && screen.html
        ? buildSrcDoc(screen.html)
        : null,
    [mounted, screen],
  );

  switch (screen.kind) {
    case "html":
      if (!mounted) {
        return <div className="absolute inset-0 size-full bg-white" />;
      }
      return (
        <iframe
          title={screen.title}
          sandbox=""
          srcDoc={srcDoc ?? ""}
          className="absolute inset-0 size-full border-0 bg-white"
        />
      );
    case "iframe":
      return (
        <iframe
          title={screen.title}
          sandbox="allow-scripts allow-same-origin allow-forms"
          src={screen.url}
          className="absolute inset-0 size-full border-0 bg-white"
        />
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={screen.src}
          alt={screen.alt ?? screen.title}
          className="absolute inset-0 size-full object-cover"
        />
      );
    case "code":
      return (
        <div dir="ltr" className="absolute inset-0 flex flex-col bg-[#0d1117]">
          {screen.fileName && (
            <div className="flex h-8 shrink-0 items-center border-b border-white/10 px-3">
              <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80">
                {screen.fileName}
              </span>
            </div>
          )}
          <div
            className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: screen.html ?? "" }}
          />
        </div>
      );
  }
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[290px]">
      <div className="relative aspect-[9/19.2] overflow-hidden rounded-[2.4rem] border-[9px] border-zinc-800 bg-black shadow-2xl ring-1 ring-border">
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}

function DesktopFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      <div className="flex h-9 items-center gap-3 border-b border-border bg-muted px-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-sm items-center justify-center rounded-md bg-background px-3 font-mono text-[10px] text-muted-foreground">
          {title}
        </div>
        <div className="w-10" />
      </div>
      <div className="relative aspect-[16/10]" dir="rtl">
        {children}
      </div>
    </div>
  );
}

export function SmartViewer({
  screens,
  devicePicker = true,
  fixedDevice,
}: {
  screens: ViewerScreen[];
  /** إظهار زرّي التبديل بين سطح المكتب والجوال */
  devicePicker?: boolean;
  /** تثبيت الجهاز على قيمة محددة وإخفاء المبدّل */
  fixedDevice?: DeviceKind;
}) {
  const [activeId, setActiveId] = useState(screens[0]?.id ?? "");
  const active = screens.find((s) => s.id === activeId) ?? screens[0];
  const [deviceOverride, setDeviceOverride] = useState<DeviceKind | null>(null);

  const device = fixedDevice ?? deviceOverride ?? active?.device ?? "desktop";

  if (!active) return null;

  const select = (screen: ViewerScreen) => {
    setActiveId(screen.id);
    setDeviceOverride(null);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
      {/* قائمة الشاشات */}
      <aside className="order-2 space-y-2 lg:order-1">
        <p className="text-xs font-bold text-muted-foreground">شاشات المشروع</p>
        <div className="flex gap-2 overflow-auto pb-1 lg:flex-col lg:overflow-visible">
          {screens.map((screen) => {
            const Icon = kindIcon[screen.kind];
            const isActive = screen.id === active.id;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => select(screen)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-right text-sm transition-colors lg:w-full",
                  isActive
                    ? "border-primary bg-accent font-semibold text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {screen.title}
              </button>
            );
          })}
        </div>

        {active.description && (
          <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
            {active.description}
          </p>
        )}
      </aside>

      {/* إطار الجهاز */}
      <div className="order-1 lg:order-2">
        <div className="mb-4 flex items-center justify-center gap-2">
          {devicePicker &&
            (
              [
                { value: "desktop", label: "سطح مكتب", icon: Monitor },
                { value: "mobile", label: "جوال", icon: Smartphone },
              ] as const
            ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDeviceOverride(opt.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                device === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <opt.icon className="size-3.5" />
              {opt.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active.id}-${device}`}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {device === "mobile" ? (
              <MobileFrame>
                <ScreenContent screen={active} />
                <Hotspots screen={active} onGo={select} screens={screens} />
              </MobileFrame>
            ) : (
              <DesktopFrame title={active.title}>
                <ScreenContent screen={active} />
                <Hotspots screen={active} onGo={select} screens={screens} />
              </DesktopFrame>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Hotspots({
  screen,
  screens,
  onGo,
}: {
  screen: ViewerScreen;
  screens: ViewerScreen[];
  onGo: (screen: ViewerScreen) => void;
}) {
  const hotspots = screen.links.filter((l) => l.hotspot);
  if (!hotspots.length) return null;

  return (
    <>
      {hotspots.map((link) => {
        const target = screens.find((s) => s.id === link.target);
        if (!target || !link.hotspot) return null;
        const { x, y, w, h } = link.hotspot;
        return (
          <button
            key={`${link.target}-${link.label}`}
            type="button"
            onClick={() => onGo(target)}
            aria-label={link.label}
            className="group absolute z-10 rounded-lg border-2 border-dashed border-primary/70 bg-primary/10 animate-pulse-soft transition-colors hover:bg-primary/20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
          >
            <span className="pointer-events-none absolute -top-7 right-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {link.label} ←
            </span>
          </button>
        );
      })}
    </>
  );
}
