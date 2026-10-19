import { codeToHtml } from "shiki";
import type { Project, ViewerScreen } from "./types";

async function highlightCode(code: string, lang: string): Promise<string> {
  "use cache";
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
  });
}

/** يحوّل شاشات المشروع الخام إلى شاشات جاهزة للعرض — الكود يُلوَّن في الخادم عبر Shiki */
export async function toViewerScreens(project: Project): Promise<ViewerScreen[]> {
  return Promise.all(
    project.screens.map(async (screen) => {
      const base = {
        id: screen.id,
        title: screen.title,
        device: screen.device ?? "desktop",
        description: screen.description,
        links: screen.links ?? [],
      };

      switch (screen.content.type) {
        case "html":
          return { ...base, kind: "html" as const, html: screen.content.html };
        case "iframe":
          return {
            ...base,
            kind: "iframe" as const,
            url: screen.content.url,
            fileName: screen.content.title,
          };
        case "image":
          return {
            ...base,
            kind: "image" as const,
            src: screen.content.src,
            alt: screen.content.alt ?? screen.title,
          };
        case "code":
          return {
            ...base,
            kind: "code" as const,
            fileName: screen.content.fileName,
            html: await highlightCode(screen.content.code, screen.content.language),
          };
      }
    }),
  );
}
