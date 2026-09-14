import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const htmlPath = new URL("../index.html", import.meta.url);
const cssPath = new URL("../styles.css", import.meta.url);
const jsPath = new URL("../script.js", import.meta.url);

test("homepage is Arabic RTL and responsive", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/i);
  assert.match(html, /name="viewport"/i);
  assert.match(html, /<main/i);
});

test("homepage contains core conversion sections", async () => {
  const html = await readFile(htmlPath, "utf8");
  for (const id of ["hero", "services", "process", "projects", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing section #${id}`);
  }
  assert.match(html, /href=["']#contact["']/);
});

test("navigation is keyboard and mobile friendly", async () => {
  const html = await readFile(htmlPath, "utf8");
  const js = await readFile(jsPath, "utf8");
  assert.match(html, /aria-label=/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /Escape/);
});

test("styles include responsive and reduced-motion behavior", async () => {
  const css = await readFile(cssPath, "utf8");
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});

test("local asset references resolve", async () => {
  const html = await readFile(htmlPath, "utf8");
  const refs = [...html.matchAll(/(?:src|href)=["'](?!https?:|#|mailto:|tel:)([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((path) => !path.startsWith("data:"));

  for (const ref of refs) {
    await readFile(new URL(`../${ref}`, import.meta.url));
  }
});
