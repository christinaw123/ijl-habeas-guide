"use client";

import { useEffect } from "react";

export function SelectScrollFix() {
  useEffect(() => {
    // ── CSS side ──────────────────────────────────────────────────────────
    // react-remove-scroll injects a <style> tag with
    // `body[data-scroll-locked] { overflow: hidden !important; }` and also
    // adds a class to <html>. A selector-based !important in globals.css
    // loses to inline !important, so we use setProperty("overflow","auto",
    // "important") which creates an inline !important declaration
    // (specificity 1-0-0-0) — the highest author priority in the cascade.
    function applyOverride() {
      if (document.body.hasAttribute("data-scroll-locked")) {
        document.documentElement.style.setProperty("overflow", "auto", "important");
        document.body.style.setProperty("overflow", "auto", "important");
        document.body.style.setProperty("margin-right", "0", "important");
      } else {
        document.documentElement.style.removeProperty("overflow");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("margin-right");
      }
    }

    const observer = new MutationObserver(applyOverride);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });

    // ── Event side ────────────────────────────────────────────────────────
    // react-remove-scroll also adds bubble-phase wheel/touchmove listeners
    // on document that call preventDefault() for any target outside the
    // dropdown. A capture-phase listener at the document level fires first;
    // stopPropagation() here prevents those bubble listeners from ever
    // running. The browser's native scroll still resolves normally because
    // stopPropagation only affects JS handlers, not the browser's built-in
    // scroll target resolution.
    function allowScroll(e: Event) {
      if (!document.body.hasAttribute("data-scroll-locked")) return;
      e.stopPropagation();
    }

    const opts = { capture: true } as const;
    document.addEventListener("wheel", allowScroll, opts);
    document.addEventListener("touchmove", allowScroll, opts);

    return () => {
      observer.disconnect();
      document.removeEventListener("wheel", allowScroll, opts);
      document.removeEventListener("touchmove", allowScroll, opts);
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("margin-right");
    };
  }, []);

  return null;
}
