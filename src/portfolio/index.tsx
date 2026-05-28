import { useEffect, useRef, useState, type ReactNode } from "react";
import portrait from "@/assets/portrait.jpg";
import nexus from "@/assets/project-nexus.jpg";
import quantum from "@/assets/project-quantum.jpg";
import echo from "@/assets/project-echo.jpg";
import neura from "@/assets/project-neura.jpg";
import a1 from "@/assets/article-1.jpg";
import a2 from "@/assets/article-2.jpg";
import a3 from "@/assets/article-3.jpg";

/* ---------- hooks ---------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    io.observe(el);
    el.querySelectorAll(".reveal, .ring-fill").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  return ref;
}

function useTyped(text: string, speed = 90) {
  const [v, setV] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setV(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return v;
}

/* ---------- particle canvas ---------- */
function ParticleField() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 70;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }));

    const chars = "01{}<>[];=+-*/&|01";
    const drops = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: 0.6 + Math.random() * 1.2,
      ch: chars[Math.floor(Math.random() * chars.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // binary rain
      ctx.font = "12px 'JetBrains Mono', monospace";
      drops.forEach((d) => {
        d.y += d.s;
        if (d.y > h + 20) { d.y = -20; d.x = Math.random() * w; d.ch = chars[Math.floor(Math.random() * chars.length)]; }
        ctx.fillStyle = "rgba(0,245,255,0.18)";
        ctx.fillText(d.ch, d.x, d.y);
      });
      // nodes
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,245,255,0.85)";
        ctx.fill();
      });
      // connections
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35;
            const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grd.addColorStop(0, `rgba(0,245,255,${alpha})`);
            grd.addColorStop(1, `rgba(255,0,170,${alpha})`);
            ctx.strokeStyle = grd;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-80" aria-hidden />;
}

/* ---------- nav ---------- */
const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "journey", label: "Journey" },
  { id: "writings", label: "Writings" },
  { id: "contact", label: "Contact" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong" : "border-b border-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="group flex items-center gap-2">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--cyan)]/40 bg-background/40 font-display text-sm font-bold tracking-widest text-[color:var(--cyan)] glow-cyan">
            AR
            <span className="pointer-events-none absolute inset-0 rounded-md spin-slow opacity-50"
              style={{ background: "conic-gradient(from 0deg, transparent 0 70%, color-mix(in oklch, var(--cyan) 70%, transparent) 80%, transparent 100%)", maskImage: "radial-gradient(circle, transparent 60%, black 62%)" }} />
          </span>
          <span className="hidden font-display text-sm tracking-widest text-muted-foreground sm:inline">ALEX&nbsp;RIVERA</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="group relative text-sm text-muted-foreground transition hover:text-foreground">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[color:var(--cyan)] to-[color:var(--magenta)] transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            className="rounded-md border border-border/60 bg-background/40 p-2 text-muted-foreground transition hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
          </button>
          <a href="#" className="relative hidden overflow-hidden rounded-md border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/10 px-4 py-2 text-sm font-medium text-[color:var(--cyan)] transition hover:bg-[color:var(--cyan)]/20 glow-cyan sm:inline-block">
            View Resume
          </a>
          <button onClick={() => setOpen((o) => !o)} className="rounded-md border border-border/60 p-2 md:hidden" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"} /></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="glass-strong md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">{n.label}</a>
            ))}
            <a href="#" className="rounded-md border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/10 px-4 py-2 text-center text-sm font-medium text-[color:var(--cyan)]">View Resume</a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- sections ---------- */
function Hero() {
  const typed = useTyped("Alex Rivera", 110);
  return (
    <section id="home" className="relative isolate flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <ParticleField />
      <div className="pointer-events-none absolute right-[-8rem] top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="relative h-[420px] w-[420px] float-slow pulse-glow">
          <div className="absolute inset-0 rounded-full border border-[color:var(--cyan)]/30" />
          <div className="absolute inset-6 rounded-full border border-[color:var(--magenta)]/30 spin-slow" />
          <div className="absolute inset-16 rounded-full border border-[color:var(--purple)]/40" />
          <div className="absolute inset-24 rounded-full bg-gradient-to-br from-[color:var(--cyan)]/40 via-[color:var(--purple)]/30 to-[color:var(--magenta)]/40 blur-2xl" />
          <div className="absolute inset-28 rounded-full bg-background/60 backdrop-blur" />
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--cyan)] animate-pulse" /> Available for select 2026 engagements
        </p>
        <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl">
          <span className="text-gradient">{typed}</span>
          <span className="caret ml-1 inline-block h-[0.9em] w-[3px] translate-y-2 bg-[color:var(--cyan)]" />
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Crafting Digital Realities <span className="mx-2 text-[color:var(--cyan)]">|</span> Full-Stack Engineer & AI Systems Architect
        </p>
        <p className="mt-3 max-w-2xl font-display text-2xl text-foreground/90 md:text-3xl">
          Building scalable systems that shape the future.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#projects" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[color:var(--cyan)]/60 bg-[color:var(--cyan)]/10 px-7 py-3.5 text-sm font-semibold text-[color:var(--cyan)] glow-cyan transition hover:bg-[color:var(--cyan)]/20">
            <span className="relative z-10">Explore My Work</span>
            <svg className="relative z-10 transition group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a href="#contact" className="rounded-full border border-border/60 bg-background/40 px-7 py-3.5 text-sm font-medium text-foreground/80 transition hover:border-[color:var(--magenta)]/60 hover:text-[color:var(--magenta)]">
            Get in touch
          </a>
        </div>
      </div>
      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground" aria-label="Scroll">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border/60 p-1">
          <span className="h-2 w-1 rounded-full bg-[color:var(--cyan)] animate-bounce" />
        </div>
      </a>
    </section>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: ReactNode; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id={id} ref={ref} className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="reveal mb-14 max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)]">{eyebrow}</p>
        <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">{title}</h2>
      </div>
      <div className="reveal">{children}</div>
    </section>
  );
}

const STATS = [
  { k: "8+", v: "Years Experience" },
  { k: "50+", v: "Projects Delivered" },
  { k: "15", v: "OSS Contributions" },
  { k: "2", v: "Patents Pending" },
];

function About() {
  return (
    <Section id="about" eyebrow="About" title={<>The <span className="text-gradient">engineer</span> behind the systems.</>}>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative group">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[color:var(--cyan)]/30 via-[color:var(--magenta)]/20 to-[color:var(--purple)]/30 opacity-60 blur-2xl transition group-hover:opacity-90" />
          <div className="relative overflow-hidden rounded-2xl glass-strong">
            <img src={portrait} alt="Portrait of Alex Rivera" width={768} height={960} className="aspect-[4/5] w-full object-cover" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            I'm <span className="text-foreground">Alex Rivera</span> — a full-stack engineer and AI systems architect obsessed with the intersection of <span className="text-[color:var(--cyan)]">scale</span>, <span className="text-[color:var(--magenta)]">intelligence</span>, and <span className="text-[color:var(--purple)]">elegance</span>. For nearly a decade I've shipped distributed systems, real-time platforms, and ML infrastructure for startups and Fortune 500s alike.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            My work lives where high-throughput backends meet thoughtful UX — autonomous agents, decentralized storage, low-latency trading, and developer tooling that feels inevitable.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.v} className="group relative overflow-hidden rounded-xl glass p-6 transition hover:-translate-y-1 hover:border-[color:var(--cyan)]/60">
                <div className="font-display text-4xl font-bold text-gradient">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[color:var(--cyan)]/10 blur-2xl transition group-hover:bg-[color:var(--magenta)]/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- skills ---------- */
const SKILL_GROUPS: { title: string; accent: string; items: { name: string; level: number; desc: string }[] }[] = [
  { title: "Languages", accent: "var(--cyan)", items: [
    { name: "Python", level: 95, desc: "ML, backends, automation — a decade of fluency." },
    { name: "TypeScript", level: 96, desc: "End-to-end type safety from edge to DB." },
    { name: "Rust", level: 84, desc: "Systems, WASM, performance-critical services." },
    { name: "Go", level: 86, desc: "Concurrent backends and CLI tooling." },
    { name: "Solidity", level: 72, desc: "Smart contracts and on-chain primitives." },
  ]},
  { title: "Frameworks", accent: "var(--magenta)", items: [
    { name: "Next.js", level: 94, desc: "Full-stack React with edge rendering." },
    { name: "React", level: 96, desc: "Composable interfaces and design systems." },
    { name: "Node", level: 92, desc: "APIs, workers, and realtime pipelines." },
    { name: "Django", level: 80, desc: "Batteries-included Python web stack." },
    { name: "FastAPI", level: 90, desc: "Typed async APIs for ML services." },
    { name: "Kubernetes", level: 85, desc: "Production-grade orchestration." },
  ]},
  { title: "AI / ML", accent: "var(--purple)", items: [
    { name: "PyTorch", level: 90, desc: "Custom models, training loops, fine-tuning." },
    { name: "LangChain", level: 88, desc: "Agent orchestration and tool use." },
    { name: "Transformers", level: 89, desc: "LLMs, embeddings, evaluation." },
    { name: "RAG Systems", level: 92, desc: "Hybrid retrieval at production scale." },
  ]},
  { title: "Tools & Others", accent: "var(--cyan)", items: [
    { name: "Docker", level: 93, desc: "Reproducible builds and shipping." },
    { name: "AWS", level: 88, desc: "From Lambda to EKS and beyond." },
    { name: "WebGL", level: 76, desc: "GPU-accelerated visualizations." },
    { name: "Three.js", level: 78, desc: "Immersive 3D for the web." },
    { name: "Blockchain", level: 74, desc: "EVM tooling and indexing." },
  ]},
];

function SkillOrb({ name, level, desc, accent }: { name: string; level: number; desc: string; accent: string }) {
  const target = 283 - (283 * level) / 100;
  return (
    <div className="group relative">
      <div className="reveal ring-fill hex relative mx-auto h-36 w-32 cursor-pointer overflow-hidden bg-background/40 transition-transform duration-500 hover:scale-105"
        style={{ ['--ring-target' as never]: target, boxShadow: `inset 0 0 24px color-mix(in oklch, ${accent} 35%, transparent)` }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 120 130">
          <polygon points="30,8 90,8 116,65 90,122 30,122 4,65" fill="none" stroke={`color-mix(in oklch, ${accent} 50%, transparent)`} strokeWidth="1.5" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-display text-lg font-semibold text-foreground">{name}</div>
          <div className="font-display text-2xl font-bold" style={{ color: `color-mix(in oklch, ${accent} 80%, white)` }}>{level}%</div>
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 rounded-lg glass-strong p-3 text-center text-xs text-muted-foreground opacity-0 transition group-hover:-translate-y-1 group-hover:opacity-100">
        {desc}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title={<>An <span className="text-gradient">arsenal</span> built for ambitious systems.</>}>
      <div className="space-y-16">
        {SKILL_GROUPS.map((g) => (
          <div key={g.title}>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="font-display text-2xl font-semibold" style={{ color: `color-mix(in oklch, ${g.accent} 80%, white)` }}>{g.title}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {g.items.map((s) => <SkillOrb key={s.name} {...s} accent={g.accent} />)}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- projects ---------- */
const PROJECTS = [
  { id: "nexus", name: "NexusAI", tag: "Autonomous AI Agents", img: nexus, desc: "A platform for designing, deploying, and observing autonomous AI agents at production scale.", stack: ["TypeScript", "Python", "LangChain", "K8s"], metrics: ["6.2× faster orchestration", "120k agents in production", "99.97% uptime"] },
  { id: "quantum", name: "QuantumVault", tag: "Decentralized Storage", img: quantum, desc: "Ultra-secure decentralized storage with client-side encryption and verifiable redundancy.", stack: ["Rust", "Solidity", "IPFS", "WASM"], metrics: ["E2E encrypted by default", "32 region availability", "0 data-loss events"] },
  { id: "echo", name: "EchoFlow", tag: "Realtime Collab IDE", img: echo, desc: "Realtime collaborative coding environment with an AI pair programmer baked into the editor.", stack: ["Next.js", "Rust", "CRDT", "OpenAI"], metrics: ["<40ms sync latency", "18k weekly devs", "AI accepted in 41% of edits"] },
  { id: "neura", name: "NeuraTrade", tag: "HFT + ML Predictions", img: neura, desc: "High-frequency trading system with ML-driven prediction models and risk-aware execution.", stack: ["Rust", "Python", "PyTorch", "FPGA"], metrics: ["220μs decision loop", "Sharpe 3.4 (live)", "$1.2B notional / mo"] },
];

function Projects() {
  const [active, setActive] = useState<typeof PROJECTS[number] | null>(null);
  return (
    <Section id="projects" eyebrow="Featured Projects" title={<>Systems I'm <span className="text-gradient">proud</span> to have shipped.</>}>
      <div className="grid gap-8 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <button key={p.id} onClick={() => setActive(p)} className={`group relative overflow-hidden rounded-2xl glass text-left transition hover:-translate-y-1 ${i % 3 === 0 ? "md:col-span-2" : ""}`}>
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={p.img} alt={`${p.name} preview`} width={1280} height={800} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--cyan) 25%, transparent), color-mix(in oklch, var(--magenta) 25%, transparent))" }} />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1 text-xs uppercase tracking-widest text-[color:var(--cyan)]">{p.tag}</div>
            </div>
            <div className="p-7">
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-[color:var(--cyan)]/30 bg-[color:var(--cyan)]/10 px-3 py-1 text-xs text-[color:var(--cyan)]">{s}</span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="rounded-md border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/10 px-4 py-2 text-xs font-semibold text-[color:var(--cyan)] glow-cyan">Live Demo</span>
                <span className="rounded-md border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground">View Case Study →</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-xl" onClick={() => setActive(null)}>
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl glass-strong" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActive(null)} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full glass p-2 text-muted-foreground hover:text-foreground">✕</button>
            <img src={active.img} alt={active.name} className="h-72 w-full object-cover" />
            <div className="p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)]">{active.tag}</p>
              <h3 className="mt-2 font-display text-4xl font-bold">{active.name}</h3>
              <p className="mt-4 text-lg text-muted-foreground">{active.desc}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {active.metrics.map((m) => (
                  <div key={m} className="rounded-xl glass p-4 text-sm">
                    <div className="text-gradient font-display text-lg font-bold">{m.split(" ")[0]}</div>
                    <div className="text-muted-foreground">{m.split(" ").slice(1).join(" ")}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {active.stack.map((s) => (
                  <span key={s} className="rounded-full border border-[color:var(--magenta)]/30 bg-[color:var(--magenta)]/10 px-3 py-1 text-xs text-[color:var(--magenta)]">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ---------- journey ---------- */
const JOURNEY = [
  { year: "2024 — Now", role: "Principal AI Systems Architect", co: "Stealth (YC W24)", points: ["Designed multi-tenant agent runtime serving 120k+ concurrent agents.", "Led infra rewrite cutting cold-start latency by 86%."] },
  { year: "2022 — 2024", role: "Staff Engineer", co: "Nimbus Labs", points: ["Built realtime collab engine adopted by 18k devs/week.", "Mentored 9 engineers; established platform guild."] },
  { year: "2020 — 2022", role: "Senior Full-Stack Engineer", co: "Helix Finance", points: ["Shipped HFT execution layer with sub-millisecond P99.", "Architected risk service handling $1.2B notional/mo."] },
  { year: "2018 — 2020", role: "Software Engineer", co: "Orbital", points: ["Owned core APIs powering 4 consumer products.", "Migrated monolith to event-driven services."] },
  { year: "2016 — 2018", role: "Engineering Intern → Engineer", co: "Various", points: ["Open source contributions to PyTorch and FastAPI.", "Hackathon wins at MIT and ETHGlobal."] },
];

function Journey() {
  return (
    <Section id="journey" eyebrow="Journey" title={<>A <span className="text-gradient">decade</span> of building things that ship.</>}>
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[color:var(--cyan)]/60 via-[color:var(--magenta)]/40 to-transparent md:left-1/2" />
        <div className="space-y-12">
          {JOURNEY.map((j, i) => (
            <div key={j.year} className={`relative grid gap-6 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="absolute left-4 top-2 -translate-x-1/2 md:left-1/2">
                <span className="block h-4 w-4 rounded-full bg-[color:var(--cyan)] glow-cyan" />
              </div>
              <div className="pl-12 md:pl-0 md:pr-12 md:text-right">
                <p className="font-display text-sm uppercase tracking-widest text-[color:var(--magenta)]">{j.year}</p>
                <h3 className="font-display text-2xl font-semibold">{j.role}</h3>
                <p className="text-muted-foreground">{j.co}</p>
              </div>
              <div className="pl-12 md:pl-12">
                <div className="rounded-xl glass p-5">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {j.points.map((p) => (<li key={p} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--cyan)]" />{p}</li>))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- writings ---------- */
const WRITINGS = [
  { img: a1, title: "Designing Agent Runtimes That Don't Lie to You", time: "9 min", tag: "AI Systems" },
  { img: a2, title: "The Quiet Cost of Distributed State", time: "12 min", tag: "Distributed" },
  { img: a3, title: "Why I'm Betting on Rust for Inference Edge", time: "7 min", tag: "Rust" },
];

function Writings() {
  return (
    <Section id="writings" eyebrow="Writings" title={<>Notes from the <span className="text-gradient">build log</span>.</>}>
      <div className="grid gap-6 md:grid-cols-3">
        {WRITINGS.map((w) => (
          <a key={w.title} href="#" className="group overflow-hidden rounded-2xl glass transition hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={w.img} alt={w.title} width={1024} height={640} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-[color:var(--cyan)]">{w.tag}</span>
                <span>{w.time} read</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug transition group-hover:text-[color:var(--cyan)]">{w.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

/* ---------- testimonials ---------- */
const TESTI = [
  { q: "Alex is the most rigorous systems thinker I've worked with. He ships things that look impossible.", n: "Priya Shah", r: "Eng Lead, Meta" },
  { q: "He rewired our inference path and cut latency by an order of magnitude. Quietly. Over a weekend.", n: "Marcus Lee", r: "CTO, Helix Finance" },
  { q: "Rare combination of taste and depth. Frontends feel inevitable, backends never page.", n: "Anaya Khan", r: "Director, Stripe" },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % TESTI.length), 6000); return () => clearInterval(id); }, []);
  const t = TESTI[i];
  return (
    <Section id="testimonials" eyebrow="Testimonials" title={<>Words from people I've <span className="text-gradient">shipped</span> with.</>}>
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="rounded-2xl glass-strong p-10">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto text-[color:var(--cyan)] opacity-60"><path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a4 4 0 0 1-4 4v2a6 6 0 0 0 6-6V9a2 2 0 0 0 0-2zm12 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a4 4 0 0 1-4 4v2a6 6 0 0 0 6-6V9a2 2 0 0 0 0-2z"/></svg>
          <p key={t.q} className="mt-4 font-display text-2xl leading-snug text-foreground/90 md:text-3xl">"{t.q}"</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[color:var(--cyan)] to-[color:var(--magenta)] font-display text-sm font-bold text-background">{t.n.split(" ").map(s=>s[0]).join("")}</div>
            <div className="text-left">
              <div className="text-sm font-semibold">{t.n}</div>
              <div className="text-xs text-muted-foreground">{t.r}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {TESTI.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Testimonial ${idx+1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[color:var(--cyan)]" : "w-2 bg-border"}`} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- contact ---------- */
function Contact() {
  const socials = [
    { name: "GitHub", d: "M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4 1 0 2 .1 2.9.4 2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" },
    { name: "X", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" },
    { name: "LinkedIn", d: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07s.92-2.07 2.06-2.07c1.14 0 2.06.93 2.06 2.07s-.92 2.07-2.06 2.07zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" },
    { name: "Discord", d: "M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.485 0 12.51 12.51 0 0 0-.617-1.249.077.077 0 0 0-.073-.035 19.736 19.736 0 0 0-3.76 1.17.066.066 0 0 0-.03.027C2.018 7.952 1.265 11.43 1.638 14.864a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.058.078.078 0 0 0 .084-.027 14.3 14.3 0 0 0 1.226-2 .076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.04.106c.36.698.772 1.362 1.225 2a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.058.077.077 0 0 0 .032-.055c.5-3.998-.838-7.447-3.548-10.468a.06.06 0 0 0-.03-.028zM8.02 12.86c-1.183 0-2.157-1.085-2.157-2.418 0-1.334.955-2.419 2.157-2.419 1.21 0 2.176 1.094 2.157 2.419 0 1.333-.955 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.334.955-2.419 2.157-2.419 1.21 0 2.176 1.094 2.157 2.419 0 1.333-.946 2.418-2.157 2.418z" },
  ];
  return (
    <Section id="contact" eyebrow="Contact" title={<>Let's build something <span className="text-gradient">legendary</span>.</>}>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-lg text-muted-foreground">
            I take on a small number of high-leverage engagements each year — architecture, AI systems, and 0→1 product engineering. If you're building something ambitious, let's talk.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[color:var(--cyan)] animate-pulse" />
            Based in Singapore · Remote Worldwide
          </div>
          <div className="mt-10 flex gap-3">
            {socials.map((s) => (
              <a key={s.name} href="#" aria-label={s.name} className="group grid h-12 w-12 place-items-center rounded-xl glass transition hover:-translate-y-1 hover:border-[color:var(--cyan)]/60">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground transition group-hover:text-[color:var(--cyan)] group-hover:drop-shadow-[0_0_8px_color-mix(in_oklch,var(--cyan)_60%,transparent)]"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-2xl glass-strong p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Name</span>
              <input className="w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--cyan)] focus:ring-2 focus:ring-[color:var(--cyan)]/30" placeholder="Your name" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</span>
              <input type="email" className="w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--cyan)] focus:ring-2 focus:ring-[color:var(--cyan)]/30" placeholder="you@company.com" />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Project</span>
            <textarea rows={5} className="w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--cyan)] focus:ring-2 focus:ring-[color:var(--cyan)]/30" placeholder="What are you building?" />
          </label>
          <button className="group relative w-full overflow-hidden rounded-lg border border-[color:var(--cyan)]/50 bg-[color:var(--cyan)]/10 px-6 py-3 text-sm font-semibold text-[color:var(--cyan)] glow-cyan transition hover:bg-[color:var(--cyan)]/20">
            Send Transmission
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Alex Rivera. All rights reserved.</p>
        <p className="text-xs">Made with passion and 10,000+ lines of clean code.</p>
        <div className="flex gap-5">
          {NAV.slice(0, 4).map((n) => <a key={n.id} href={`#${n.id}`} className="hover:text-foreground">{n.label}</a>)}
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  return (
    <div className="relative overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Writings />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
