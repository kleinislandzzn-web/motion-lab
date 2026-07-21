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
  assert.match(html, /可复制的 HTML 动效收藏馆/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("exports a self-contained offline HTML artifact", async () => {
  const url = new URL("../dist/motion-lab.html", import.meta.url);
  const [html, info] = await Promise.all([readFile(url, "utf8"), stat(url)]);
  assert.ok(info.size > 100_000);
  assert.match(html, /<style>/i);
  assert.match(html, /<script type="module"[^>]*>/i);
  const documentShell = html.replace(/<script type="module"[^>]*>[\s\S]*?<\/script>/i, "");
  assert.doesNotMatch(documentShell, /<script[^>]+src=/i);
  assert.doesNotMatch(documentShell, /<link[^>]+href="[^\"]+\.css"/i);
  assert.match(html, /MOTION SYSTEM READY/);
});

test("catalog contains 15 uniquely scoped samples", async () => {
  const source = await readFile(new URL("../app/motion-data.ts", import.meta.url), "utf8");
  const ids = [...source.matchAll(/\n\s+id: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 15);
  assert.equal(new Set(ids).size, 15);
  assert.match(source, /gsap@3\.13\.0/);
  assert.match(source, /animejs@4\.4\.1/);
});
