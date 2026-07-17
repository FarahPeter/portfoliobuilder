/* FolioForge marketing site interactions */
(() => {
  // ---------------- app links (login / register buttons) ----------------
  const app = (window.FF_CONFIG && window.FF_CONFIG.appUrl) || "#";
  const paths = { login: "/login", register: "/register" };
  document.querySelectorAll("[data-app-link]").forEach((a) => {
    a.href = app.replace(/\/$/, "") + (paths[a.dataset.appLink] || "/");
  });

  // ---------------- nav ----------------
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");
  if (burger) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        links.classList.remove("open");
      })
    );
  }

  // ---------------- reveal on scroll ----------------
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------------- count-up stats ----------------
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        cio.unobserve(e.target);
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const start = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const p = Math.min((t - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));

  // ---------------- typing rotator ----------------
  const typer = document.getElementById("typer");
  if (typer) {
    const words = ["developers", "designers", "engineers", "data scientists", "architects", "artists", "researchers"];
    let wi = 0, ci = words[0].length, deleting = true;
    const step = () => {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      typer.textContent = word.slice(0, ci);
      let delay = deleting ? 45 : 90;
      if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
      else if (deleting && ci === 0) { wi = (wi + 1) % words.length; deleting = false; delay = 350; }
      setTimeout(step, delay);
    };
    setTimeout(step, 2200);
  }

  // ---------------- tilt cards ----------------
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (fine) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  // ---------------- cursor glow ----------------
  const glow = document.querySelector(".cursor-glow");
  if (glow && fine) {
    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  // ---------------- particle field ----------------
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, dots;
    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.min(90, Math.floor((w * h) / 22000));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x = (d.x + d.vx + w) % w;
        d.y = (d.y + d.vy + h) % h;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 163, 255, 0.35)";
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 120 * 120) {
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.16 * (1 - dist / 14400)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    init();
    window.addEventListener("resize", init);
    draw();
  }

  // ---------------- footer year ----------------
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
