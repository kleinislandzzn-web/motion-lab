import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadCatalog() {
  const source = await readFile(new URL("../app/motion-data.ts", import.meta.url), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
}

test("all copied snippets are scoped, idempotent, and syntactically valid", async () => {
  const catalog = await loadCatalog();
  assert.equal(catalog.motions.length, 54);

  for (const motion of catalog.motions) {
    const sources = catalog.getMotionSources(motion, {});
    assert.match(sources.html, new RegExp(`data-ml-motion="${motion.id}"`));
    assert.match(sources.js, /document\.querySelectorAll\(selector\)\.forEach/);
    assert.match(sources.js, /root\.dataset\.mlReady === "true"/);
    assert.match(sources.js, /prefers-reduced-motion/);
    assert.match(sources.css, /--ml-bg:/);
    assert.match(sources.css, /--ml-fg:/);
    assert.match(sources.css, /--ml-accent:/);
    assert.match(sources.css, /--ml-radius:/);
    assert.match(sources.css, /--ml-border:/);
    assert.doesNotThrow(() => new Function(sources.js), `${motion.id} exports invalid JavaScript`);

    const full = catalog.getFullSnippet(motion, {});
    assert.match(full, new RegExp(`style: ${motion.style}`));
    assert.match(full, /parameters:/);
    assert.match(full, new RegExp(`style data-motion-lab="${motion.id}"`));
    if (motion.dependencies.length === 0) assert.doesNotMatch(full, /<script[^>]+src=/);
  }
});

test("archive variants copy their real visual structure without card labels", async () => {
  const source = await readFile(new URL("../app/motion-data.ts", import.meta.url), "utf8");
  assert.match(source, /class=\"ml-archive-variant ml-family-\$\{archiveFamilyClass\[spec\.category\]\} ml-\$\{spec\.variantKind\}\"/);
  assert.match(source, /class=\"ml-variant-visual\" aria-hidden=\"true\"/);
  assert.match(source, /const archiveVariantCss =/);
  assert.match(source, /\.ml-progress-ring/);
  assert.match(source, /\.ml-carousel-depth/);
  assert.match(source, /\.ml-split-reveal/);
  assert.doesNotMatch(source, /<span>\$\{spec\.englishTitle\}<\/span><i><\/i><b>OPEN/);
});

test("adjusted parameters are preserved in copied HTML", async () => {
  const catalog = await loadCatalog();
  const magnetic = catalog.motions.find((motion) => motion.id === "magnetic-cta");
  const magneticFull = catalog.getFullSnippet(magnetic, { strength: 30, returnDuration: 700 });
  assert.match(magneticFull, /--ml-magnetic-strength:30%/);
  assert.match(magneticFull, /--ml-magnetic-return:700ms/);
  assert.match(magneticFull, /"strength":30/);

  const dot = catalog.motions.find((motion) => motion.id === "cursor-dot-field");
  const dotFull = catalog.getFullSnippet(dot, { dotSize: 12, radius: 130 });
  assert.match(dotFull, /--ml-dot-size:12px/);
  assert.match(dotFull, /--ml-dot-radius:130px/);
  assert.match(dotFull, /"radius":130/);
});

test("third-party snippets use the project dependency versions", async () => {
  const catalog = await loadCatalog();
  const decoder = catalog.motions.find((motion) => motion.id === "decoder-text");
  const flip = catalog.motions.find((motion) => motion.id === "flip-grid");
  assert.match(catalog.getFullSnippet(decoder, {}), /animejs@4\.5\.0/);
  assert.match(catalog.getFullSnippet(flip, {}), /gsap@3\.15\.0/);
  assert.equal((catalog.getFullSnippet(flip, {}).match(/gsap\.min\.js/g) ?? []).length, 1);
});
