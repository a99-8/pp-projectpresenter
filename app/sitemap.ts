import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base },
    { url: `${base}/projects` },
    { url: `${base}/about` },
    ...getProjects().map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
