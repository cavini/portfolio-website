/* Arthur Cavini — portfolio interactions
   mobile nav · sticky header · scroll reveals · scroll spy · hero spotlight */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsIO = "IntersectionObserver" in window;

  /* ------------------------------------------------------------ mobile nav */
  const header = document.querySelector(".site-header");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".site-nav");

  if (burger && nav) {
    const setNav = (open) => {
      nav.classList.toggle("is-open", open);
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
    };

    burger.addEventListener("click", () => {
      setNav(!nav.classList.contains("is-open"));
    });

    // Any link inside the overlay closes it before the anchor scrolls.
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        burger.focus();
      }
    });

    // Resizing past the breakpoint should never leave the body locked.
    window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
      if (event.matches) setNav(false);
    });
  }

  /* ------------------------------------------------------- header on scroll */
  if (header) {
    let queued = false;

    const syncHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      queued = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(syncHeader);
      },
      { passive: true }
    );

    syncHeader();
  }

  /* --------------------------------------------------------- scroll reveals */
  const reveals = document.querySelectorAll(".reveal");

  if (!supportsIO || prefersReduced) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Stagger each section's children so they cascade instead of popping together.
    document.querySelectorAll("main > section").forEach((section) => {
      section.querySelectorAll(".reveal").forEach((el, index) => {
        el.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 80}ms`);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* -------------------------------------------------------------- scroll spy */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const spyTargets = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      return href && href.startsWith("#") ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if (supportsIO && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      // A thin band across the middle of the viewport decides the active section.
      { rootMargin: "-45% 0px -50% 0px" }
    );

    spyTargets.forEach((section) => spy.observe(section));
  }

  /* ----------------------------------------------------------- hero spotlight */
  const hero = document.querySelector(".hero");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && finePointer && !prefersReduced) {
    let frame = 0;

    hero.addEventListener("pointermove", (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        hero.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        frame = 0;
      });
    });

    hero.addEventListener("pointerenter", () => hero.classList.add("has-pointer"));
    hero.addEventListener("pointerleave", () => hero.classList.remove("has-pointer"));
  }
})();
