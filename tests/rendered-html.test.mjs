import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders Motion Lab metadata and shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Motion Lab/);
  assert.match(html, /Interaction Archive/);
  assert.match(html, /<html lang="en">/);
  assert.doesNotMatch(html, /个人动效情绪板|上海 · 东八区/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("exports a self-contained offline HTML artifact", async () => {
  const url = new URL("../dist/motion-lab.html", import.meta.url);
  const [html, info] = await Promise.all([readFile(url, "utf8"), stat(url)]);
  assert.ok(info.size > 100_000);
  assert.match(html, /<style(?:\s[^>]*)?>/i);
  assert.match(html, /<script type="module"[^>]*>/i);
  const documentShell = html.replace(/<script type="module"[^>]*>[\s\S]*?<\/script>/i, "");
  assert.doesNotMatch(documentShell, /<script[^>]+src=/i);
  assert.doesNotMatch(documentShell, /<link[^>]+href="[^\"]+\.css"/i);
  assert.match(html, /rel="icon"[^>]+%F0%9F%AB%A7/i);
  assert.match(html, /MOTION SYSTEM READY/);
  assert.match(html, /data:font\/ttf;base64,/i);
  assert.match(html, /Kenney Future Narrow/);
});

test("catalog contains 54 uniquely scoped samples", async () => {
  const source = await readFile(new URL("../app/motion-data.ts", import.meta.url), "utf8");
  const originalIds = [...source.matchAll(/^\s{4}id: "([^"]+)",$/gm)].map((match) => match[1]);
  const variantIds = [...source.matchAll(/\{ id: "([^"]+)", title:/g)].map((match) => match[1]);
  const ids = [...originalIds, ...variantIds];
  assert.equal(ids.length, 54);
  assert.equal(new Set(ids).size, 54);
  assert.ok(ids.includes("cursor-dot-field"));
  assert.ok(ids.includes("parallax-image-field"));
  assert.ok(ids.includes("prompt-reference-card"));
  assert.ok(ids.includes("icon-ring-meter"));
  assert.ok(ids.includes("icon-growth-curve"));
  assert.ok(ids.includes("icon-radar-scan"));
  assert.doesNotMatch(source, /<canvas class="ml-dot-field"/);
  assert.match(source, /Array\.from\(\{length:170\}/);
  assert.match(source, /gsap@3\.15\.0/);
  assert.match(source, /animejs@4\.5\.0/);
  assert.match(source, /data-ml-motion=/);
  assert.match(source, /document\.querySelectorAll\(selector\)\.forEach/);
  assert.match(source, /root\.dataset\.mlReady === "true"/);
  assert.doesNotMatch(source, /document\.querySelector\('\.ml-/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /parameters: \[\s*\{ id: "dotSize"/);
  assert.match(source, /cssVariable: "--ml-dot-radius"/);
});

test("organizes the archive into browsable motion categories", async () => {
  const [interfaceSource, styles] = await Promise.all([
    readFile(new URL("../app/motion-lab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(interfaceSource, /const categoryMeta: Record<MotionCategory/);
  assert.equal([...interfaceSource.matchAll(/slug: "[a-z-]+"/g)].length, 9);
  assert.match(interfaceSource, /function openCategory\(nextCategory: MotionCategory\)/);
  assert.match(interfaceSource, /#category\/\$\{categoryMeta\[nextCategory\]\.slug\}/);
  assert.match(interfaceSource, /const showCategoryIndex = !activeCategory/);
  assert.match(interfaceSource, /className="category-shelves"/);
  assert.match(interfaceSource, /className="category-shelf"/);
  assert.match(interfaceSource, /className="shelf-track"/);
  assert.match(interfaceSource, /className="shelf-item-hit"/);
  assert.match(interfaceSource, />MORE <span>→<\/span><\/button>/);
  assert.match(interfaceSource, /className="category-page-hero"/);
  assert.match(interfaceSource, /label="CATEGORY"/);
  assert.match(interfaceSource, /ALL CATEGORIES/);
  assert.match(styles, /\.category-shelves \{ display: grid/);
  assert.match(styles, /\.shelf-track, \.compact-motion-grid \{ display: grid; grid-template-columns: repeat\(6/);
  assert.match(styles, /\.shelf-item \.shelf-preview \.demo-stage \{ width: 100%; height: 168px; min-height: 168px; border: 0; border-radius: 0/);
  assert.match(styles, /\.shelf-preview::after/);
  assert.match(interfaceSource, /surface=\{archiveSurface\}/);
  assert.match(interfaceSource, /function CanvasPicker/);
  assert.doesNotMatch(styles, /\.shelf-item\[data-style="terminal"\] \.demo-stage/);
  assert.match(interfaceSource, /function getShelfMetadata\(motion: MotionDefinition\)/);
  assert.match(interfaceSource, /item\.toLowerCase\(\) === label\.toLowerCase\(\)/);
  assert.match(interfaceSource, /\{getShelfMetadata\(motion\)\}/);
  assert.doesNotMatch(interfaceSource, /variantFamilyLabels/);
  assert.doesNotMatch(interfaceSource, /<b>0\{index \+ 1\}<\/b>|#\{String\(toast\)/);
  assert.doesNotMatch(interfaceSource, /NEON \/ 07|SEQUENCE \/ 090MS|DETAIL \/ 84%|06 LAYERS/);
  assert.match(interfaceSource, /getBoundingClientRect\(\)/);
  assert.match(interfaceSource, /setIndicator\(\{ left: tabRect\.left - rootRect\.left - borderLeft, width: tabRect\.width \}\)/);
});

test("glossary explains every card tag in plain Chinese", async () => {
  const [catalog, glossary, interfaceSource] = await Promise.all([
    readFile(new URL("../app/motion-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/glossary-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/motion-lab.tsx", import.meta.url), "utf8"),
  ]);
  const terms = [...glossary.matchAll(/\{ id: "([^"]+)", term: "([^"]+)"/g)];
  assert.ok(terms.length >= 40);
  assert.match(glossary, /label: "指针跟随"/);
  assert.match(glossary, /label: "关键行动按钮"/);
  assert.match(glossary, /label: "布局过渡技术"/);
  assert.match(catalog, /tags: \["pointer", "spring", "CTA"\]/);
  assert.match(interfaceSource, /openGlossary\(selected\.tags\[0\]\)/);
  assert.doesNotMatch(interfaceSource, /className="tag-row"/);
  assert.doesNotMatch(interfaceSource, /↻ 重播/);
  assert.doesNotMatch(interfaceSource, /setCycle|key=\{`\$\{cycle\}/);
  assert.match(interfaceSource, /const loop = window\.setInterval\(play/);
  assert.match(interfaceSource, /<h2>\{selected\.title\}<\/h2><p>\{selected\.description\}<\/p>/);
  assert.match(interfaceSource, /function CustomSelect/);
  assert.match(interfaceSource, /role="listbox"/);
  assert.doesNotMatch(interfaceSource, /<select value=\{category\}/);
  assert.match(interfaceSource, /Ⅱ PAUSE/);
  assert.match(interfaceSource, /▶ PLAY/);
  assert.match(interfaceSource, /className="glossary-icon"[^>]*>📖<\/span>/);
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.custom-select-menu::-webkit-scrollbar-thumb/);
  assert.match(styles, /scrollbar-color: var\(--phosphor-soft\)/);
  assert.doesNotMatch(styles, /SELECT OPTION/);
  assert.match(interfaceSource, /<span className="glossary-label">TAG GALLERY<\/span>/);
  assert.doesNotMatch(interfaceSource, /glossary-label">TAG GALLERY<b>/);
  assert.match(catalog, /高亮圆点大小/);
  assert.match(catalog, /高亮区域半径/);
  assert.match(interfaceSource, /type="range"/);
  assert.match(catalog, /getPropertyValue\('--ml-dot-radius'\)/);
  assert.match(catalog, /tags: \["language", "copy", "state"\]/);
  assert.match(catalog, /interactionOnly: true/);
  assert.match(interfaceSource, /function PromptReferenceCardDemo/);
  assert.match(interfaceSource, /function copyText\(value: string\)/);
  assert.match(interfaceSource, /document\.execCommand\("copy"\)/);
  assert.match(interfaceSource, /className="dependency-note"/);
  assert.match(interfaceSource, /无需外部库/);
  assert.match(interfaceSource, /className="magnetic-topbar"/);
  assert.doesNotMatch(interfaceSource, /replayNonce|重新播放/);
  assert.doesNotMatch(interfaceSource, /selected\.index/);
});

test("uses one editorial chrome with orthogonal sample style filters", async () => {
  const [catalog, interfaceSource, styles] = await Promise.all([
    readFile(new URL("../app/motion-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/motion-lab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(catalog, /export type MotionStyle = "editorial" \| "terminal" \| "glass" \| "native" \| "soft" \| "brutalist"/);
  assert.equal([...catalog.matchAll(/\bstyle: "(?:editorial|terminal|glass|native|soft|brutalist)"/g)].length, 54);
  assert.equal([...catalog.matchAll(/^\s{4}styleSecondary:/gm)].length, 11);
  assert.match(catalog, /export const motionStyleTokens/);
  assert.match(catalog, /--ml-bg:/);
  assert.match(catalog, /--ml-fg:/);
  assert.match(catalog, /--ml-accent:/);
  assert.match(catalog, /--ml-radius:/);
  assert.match(catalog, /--ml-border:/);
  assert.doesNotMatch(interfaceSource, /type SiteTheme|ThemeSwitch|themeOptions|theme-\$\{theme\}/);
  assert.doesNotMatch(styles, /\.theme-(?:hyper|index|glyph|efferd|phosphor)|theme-switch/);
  assert.match(interfaceSource, /localStorage\.removeItem\("motion-lab:theme"\)/);
  assert.doesNotMatch(interfaceSource, /localStorage\.setItem\("motion-lab:theme"/);
  assert.match(interfaceSource, /label="STYLE"/);
  assert.match(interfaceSource, /options=\{\["ALL", \.\.\.styleOptions/);
  assert.match(interfaceSource, /motion\.style === styleFilter \|\| motion\.styleSecondary === styleFilter/);
  assert.match(interfaceSource, /styleFilter === "全部"/);
  assert.match(interfaceSource, /data-style=\{motion\.style\}/);
  assert.match(interfaceSource, /getShelfMetadata\(motion\)/);
  assert.match(interfaceSource, /className=\{`accent-picker \$\{open/);
  assert.match(interfaceSource, /className="accent-popover"/);
  assert.match(interfaceSource, /"#b7ff3c"/);
  assert.doesNotMatch(interfaceSource, /type="color"/);
  assert.match(interfaceSource, /localStorage\.setItem\("motion-lab:accent"/);
  assert.match(interfaceSource, />1×<\/button>/);
  assert.match(interfaceSource, />0\.5×<\/button>/);
  assert.match(interfaceSource, /surface=\{previewSurface\}/);
  assert.match(interfaceSource, />浅色<\/button>/);
  assert.match(interfaceSource, />深色<\/button>/);
  assert.match(interfaceSource, /defaultPreviewSurface\(motion\.style\)/);
  assert.match(styles, /--site-bg: #ffffff/);
  assert.match(styles, /\.motion-lab-shell::after \{[\s\S]*?opacity: \.12/);
  assert.match(styles, /--site-accent: #4a72ff/);
  assert.match(styles, /--site-highlight: #dfe6ff/);
  assert.match(styles, /--site-border: 2px solid #0a0a0a/);
  assert.match(styles, /--site-radius: 20px/);
  assert.match(styles, /--font-editorial/);
  assert.match(styles, /\.motion-card \{ overflow: visible; border: 0; border-radius: 0; background: transparent; box-shadow: none/);
  assert.match(styles, /\.motion-card > \.demo-stage \{ min-height: 286px; border: 0; border-radius: 0/);
  assert.match(styles, /\.demo-stage\.style-editorial/);
  assert.match(styles, /\.demo-stage\.style-terminal/);
  assert.match(styles, /\.demo-stage\.style-glass/);
  assert.match(styles, /\.demo-stage\.style-native/);
  assert.match(styles, /\.demo-stage\.style-soft/);
  assert.match(styles, /\.detail-backdrop \{ position: fixed; z-index: 1000; isolation: isolate/);
  assert.match(styles, /\.detail-panel \{ position: relative; z-index: 1/);
  assert.match(styles, /\.copy-toast \{ position: fixed; z-index: 1100/);
  assert.match(styles, /\.control-deck > \* \{ min-width: 0; \}/);
  assert.match(styles, /\.control-deck > button \{ display: flex; align-items: center; justify-content: center; gap: 7px; min-width: 0; overflow: hidden/);
  assert.match(styles, /\.glossary-label \{[^}]*min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap/);
  assert.match(styles, /\.lab-footer\.editorial-footer > \.footer-index \{ display: block; min-width: 0; \}/);
  assert.match(styles, /\.lab-footer\.editorial-footer > \.footer-index > div > span \{[^}]*padding: 0; border: 0; border-radius: 0/);
  assert.match(styles, /@media \(max-width: 1100px\) \{[\s\S]*?\.control-deck \{ grid-template-columns: repeat\(3,minmax\(0,1fr\)\); \}/);
  assert.match(styles, /@media \(max-width: 520px\) \{[\s\S]*?\.control-deck \{ grid-template-columns: minmax\(0,1fr\); \}/);
});
