import { NamedIcon } from "@/lib/icons";
import type { Architecture } from "@/lib/types";

type Point = { x: number; y: number };

/**
 * يرسم مخطط هيكلية المشروع: كل طبقة عمود، والأسهم تُحسب بإحداثيات نسبية
 * فتبقى متجاوبة مع أي عرض. الاتجاه LTR حتى تسير التدفقات من اليسار لليمين.
 */
export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const { layers, flows } = architecture;
  const cols = Math.max(layers.length, 1);

  // إحداثيات مركز كل عقدة بالنسب المئوية
  const positions = new Map<string, Point>();
  layers.forEach((layer, colIdx) => {
    const count = Math.max(layer.nodes.length, 1);
    layer.nodes.forEach((node, rowIdx) => {
      positions.set(node.id, {
        x: ((colIdx + 0.5) / cols) * 100,
        y: ((rowIdx + 0.5) / count) * 100,
      });
    });
  });

  return (
    <div dir="ltr" className="relative">
      {/* طبقة الأسهم */}
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <marker
            id="arch-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary/60" />
          </marker>
        </defs>
        {flows.map((flow, i) => {
          const a = positions.get(flow.from);
          const b = positions.get(flow.to);
          if (!a || !b) return null;
          const dx = Math.max(8, Math.abs(b.x - a.x) * 0.45);
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`}
              fill="none"
              className="stroke-primary/50"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              markerEnd="url(#arch-arrow)"
            />
          );
        })}
      </svg>

      {/* تسميات التدفقات */}
      {flows.map((flow, i) => {
        const a = positions.get(flow.from);
        const b = positions.get(flow.to);
        if (!a || !b || !flow.label) return null;
        return (
          <span
            key={`label-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm"
            style={{
              left: `${(a.x + b.x) / 2}%`,
              top: `${(a.y + b.y) / 2}%`,
            }}
          >
            {flow.label}
          </span>
        );
      })}

      {/* الطبقات */}
      <div
        className="relative grid gap-6"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {layers.map((layer, colIdx) => (
          <div key={colIdx} className="flex flex-col justify-center gap-4">
            {layer.title && (
              <div className="mb-1 text-center text-xs font-bold text-muted-foreground">
                {layer.title}
              </div>
            )}
            {layer.nodes.map((node) => (
              <div
                key={node.id}
                className="rounded-xl border border-border bg-card px-3 py-3 text-center shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <NamedIcon name={node.icon} className="size-4" />
                </div>
                <div dir="auto" className="mt-2 text-xs font-bold">
                  {node.label}
                </div>
                {node.description && (
                  <div dir="auto" className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                    {node.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
