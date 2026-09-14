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

test("hero states the AI multi-company promise directly", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.match(html, /أنشئ وأدر شركاتك ومتاجرك/);
  assert.match(html, /بالذكاء الاصطناعي/);
  assert.match(html, /شخص واحد/);
});

test("hero provides an accessible AI command experience", async () => {
  const html = await readFile(htmlPath, "utf8");
  const js = await readFile(jsPath, "utf8");
  assert.match(html, /<form[^>]*id="ai-search"/i);
  assert.match(html, /<textarea[^>]*name="prompt"/i);
  assert.match(html, /data-suggestion=/);
  assert.match(html, /id="ai-result"/i);
  assert.match(html, /aria-live="polite"/i);
  assert.match(js, /requestSubmit/);
  assert.match(js, /runDemo/);
});

test("homepage explains commerce operations and AI agents", async () => {
  const html = await readFile(htmlPath, "utf8");
  for (const term of ["الدفع", "الشحن", "المخزون", "التسويق", "خدمة العملاء", "وكلاء"]) {
    assert.match(html, new RegExp(term), `missing capability: ${term}`);
  }
});

test("homepage contrasts Million with traditional store platforms", async () => {
  const html = await readFile(htmlPath, "utf8");
  assert.match(html, /id="difference"/i);
  assert.match(html, /منصة متجر تقليدية/);
  assert.match(html, /نظام تشغيل أعمال/);
});

test("homepage contains the full product story", async () => {
  const html = await readFile(htmlPath, "utf8");
  for (const id of ["hero", "services", "process", "projects", "difference", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing section #${id}`);
  }
  assert.match(html, /href=["']#contact["']/);
});

test("navigation is keyboard friendly", async () => {
  const html = await readFile(htmlPath, "utf8");
  const js = await readFile(jsPath, "utf8");
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
