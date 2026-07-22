"use client";

import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, stagger } from "animejs";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getGlossaryEntry,
  glossaryCategories,
  glossaryEntries,
  type GlossaryEntry,
} from "./glossary-data";
import {
  categories,
  engines,
  getFullSnippet,
  motions,
  type MotionDefinition,
} from "./motion-data";

type DemoProps = { speed: number; reduced: boolean };
type CodeTab = "html" | "css" | "js" | "full";

const demoMap: Record<string, (props: DemoProps) => ReactNode> = {
  "magnetic-cta": (props) => <MagneticDemo {...props} />,
  "liquid-toggle": (props) => <LiquidToggleDemo {...props} />,
  "ripple-success": (props) => <RippleDemo {...props} />,
  "sliding-tabs": (props) => <TabsDemo {...props} />,
  "expanding-search": (props) => <SearchDemo {...props} />,
  "spotlight-card": (props) => <SpotlightDemo {...props} />,
  "toast-stack": (props) => <ToastDemo {...props} />,
  "decoder-text": (props) => <DecoderDemo {...props} />,
  "stagger-list": (props) => <StaggerDemo {...props} />,
  "kpi-counter": (props) => <KpiDemo {...props} />,
  "elastic-error": (props) => <ErrorDemo {...props} />,
  "command-palette": (props) => <CommandDemo {...props} />,
  "flip-grid": (props) => <FlipDemo {...props} />,
  "draggable-sheet": (props) => <SheetDemo {...props} />,
  "scroll-stack": (props) => <ScrollDemo {...props} />,
};

function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ref.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function DemoStage({
  motion,
  speed,
  reduced,
  large = false,
}: {
  motion: MotionDefinition;
  speed: number;
  reduced: boolean;
  large?: boolean;
}) {
  const { ref, visible } = useVisible<HTMLDivElement>();
  const render = demoMap[motion.id];
  return (
    <div
      ref={ref}
      className={`demo-stage ${large ? "demo-stage-large" : ""} ${reduced ? "motion-reduced" : ""}`}
      style={{ "--motion-speed": speed === 0.5 ? 2 : 1 } as CSSProperties}
    >
      <div className="stage-grid" />
      <div className="stage-corner stage-corner-a">⌜</div>
      <div className="stage-corner stage-corner-b">⌟</div>
      {visible && render ? (
        <div className="demo-inner">
          {render({ speed, reduced })}
        </div>
      ) : (
        <div className="demo-sleep">SLEEP MODE</div>
      )}
    </div>
  );
}

function MagneticDemo({ reduced }: DemoProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  function move(event: ReactPointerEvent<HTMLButtonElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * 0.18,
      y: (event.clientY - rect.top - rect.height / 2) * 0.18,
    });
  }
  return (
    <button
      className="demo-magnetic"
      onPointerMove={move}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <span>立即探索</span>
      <b>↗</b>
    </button>
  );
}

function LiquidToggleDemo({ speed, reduced }: DemoProps) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setOn((value) => !value), 1500 / speed);
    return () => window.clearInterval(timer);
  }, [speed, reduced]);
  return (
    <button
      className={`demo-liquid ${on ? "is-on" : ""}`}
      onClick={() => setOn((value) => !value)}
      aria-pressed={on}
    >
      <span className="liquid-track"><i /></span>
      <em>{on ? "ENERGY MODE / ON" : "ENERGY MODE / OFF"}</em>
    </button>
  );
}

function RippleDemo({ speed, reduced }: DemoProps) {
  const [done, setDone] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number }>();
  useEffect(() => {
    if (reduced) return;
    let rippleTimer = 0;
    let doneTimer = 0;
    let resetTimer = 0;
    const play = () => {
      rippleTimer = window.setTimeout(
        () => setRipple({ x: 78, y: 24, id: Date.now() }),
        560 / speed,
      );
      doneTimer = window.setTimeout(() => setDone(true), 920 / speed);
      resetTimer = window.setTimeout(() => {
        setDone(false);
        setRipple(undefined);
      }, 3300 / speed);
    };
    play();
    const loop = window.setInterval(play, 4200 / speed);
    return () => {
      window.clearInterval(loop);
      [rippleTimer, doneTimer, resetTimer].forEach((timer) => window.clearTimeout(timer));
    };
  }, [speed, reduced]);
  function click(event: ReactMouseEvent<HTMLButtonElement>) {
    if (done) {
      setDone(false);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, id: Date.now() });
    window.setTimeout(() => setDone(true), 360);
  }
  return (
    <button className={`demo-ripple ${done ? "is-done" : ""}`} onClick={click}>
      {ripple && <i key={ripple.id} style={{ left: ripple.x, top: ripple.y }} />}
      <span>{done ? "✓ 指令已发送" : "发送指令"}</span>
    </button>
  );
}

function TabsDemo({ speed, reduced }: DemoProps) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % 3), 1100 / speed);
    return () => window.clearInterval(timer);
  }, [speed, reduced]);
  return (
    <div className="demo-tabs" style={{ "--active": active } as CSSProperties}>
      <i />
      {["概览", "动效", "代码"].map((label, index) => (
        <button className={index === active ? "active" : ""} onClick={() => setActive(index)} key={label}>
          {label}
        </button>
      ))}
    </div>
  );
}

function SearchDemo({ speed, reduced }: DemoProps) {
  const [open, setOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (reduced) return;
    let openTimer = 0;
    let closeTimer = 0;
    const play = () => {
      openTimer = window.setTimeout(() => setAutoOpen(true), 520 / speed);
      closeTimer = window.setTimeout(() => setAutoOpen(false), 3100 / speed);
    };
    play();
    const loop = window.setInterval(play, 4200 / speed);
    return () => {
      window.clearInterval(loop);
      [openTimer, closeTimer].forEach((timer) => window.clearTimeout(timer));
    };
  }, [speed, reduced]);
  return (
    <label className={`demo-search ${open || autoOpen || value ? "is-open" : ""}`}>
      <span>⌕</span>
      <input
        aria-label="搜索系统"
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(event) => setValue(event.target.value)}
        placeholder="SEARCH SYSTEM"
      />
      <button type="button" onClick={() => setValue("")}>×</button>
    </label>
  );
}

function SpotlightDemo({ reduced }: DemoProps) {
  const [vars, setVars] = useState({ mx: 50, my: 50, rx: 0, ry: 0 });
  function move(event: ReactPointerEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setVars({ mx: x * 100, my: y * 100, ry: (x - 0.5) * 13, rx: (0.5 - y) * 13 });
  }
  const style = {
    "--mx": `${vars.mx}%`,
    "--my": `${vars.my}%`,
    "--rx": `${vars.rx}deg`,
    "--ry": `${vars.ry}deg`,
  } as CSSProperties;
  return (
    <article className="demo-spot" style={style} onPointerMove={move} onPointerLeave={() => setVars({ mx: 50, my: 50, rx: 0, ry: 0 })}>
      <small>LIMITED UNIT</small>
      <strong>NEON / 07</strong>
      <p>Experimental interface module</p>
    </article>
  );
}

function ToastDemo({ speed, reduced }: DemoProps) {
  const [toasts, setToasts] = useState([1, 2]);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(
      () => setToasts((items) => [Math.max(0, ...items) + 1, ...items].slice(0, 3)),
      1350 / speed,
    );
    return () => window.clearInterval(timer);
  }, [speed, reduced]);
  function add() {
    setToasts((items) => [Math.max(0, ...items) + 1, ...items].slice(0, 3));
  }
  return (
    <div className="demo-toasts">
      <button onClick={add}>+ 触发通知</button>
      <div>
        {toasts.map((toast) => (
          <p key={toast}><span>状态已同步</span><b>#{String(toast).padStart(2, "0")}</b></p>
        ))}
      </div>
    </div>
  );
}

function DecoderDemo({ speed, reduced }: DemoProps) {
  const text = "MOTION SYSTEM READY";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const [value, setValue] = useState(reduced ? text : chars.slice(0, text.length));
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const decodedAt = text.length * 2;
    const restartAt = decodedAt + 42;
    const timer = window.setInterval(() => {
      if (frame <= decodedAt) {
        setValue(text.split("").map((char, index) => index < frame / 2 || char === " " ? char : chars[Math.floor(Math.random() * chars.length)]).join(""));
      } else {
        setValue(text);
      }
      frame = (frame + 1) % restartAt;
    }, 32 / speed);
    return () => window.clearInterval(timer);
  }, [reduced, speed]);
  return <button className="demo-decode">{value}</button>;
}

function StaggerDemo({ speed, reduced }: DemoProps) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!ref.current || reduced) return;
    const playback = animate(ref.current.querySelectorAll("li"), {
      opacity: [0, 1, 1, 0],
      x: [-24, 0, 0, 24],
      delay: stagger(90 / speed),
      duration: 2600 / speed,
      loopDelay: 260 / speed,
      loop: true,
      ease: "inOutQuad",
    });
    return () => { playback.pause(); };
  }, [speed, reduced]);
  return (
    <div className="demo-stagger">
      <small>SEQUENCE / 090MS</small>
      <ul ref={ref}>
        {["视觉系统", "动效语言", "组件状态"].map((label, index) => <li key={label}><b>0{index + 1}</b>{label}</li>)}
      </ul>
    </div>
  );
}

function KpiDemo({ speed, reduced }: DemoProps) {
  const [value, setValue] = useState(reduced ? 94 : 0);
  useEffect(() => {
    if (reduced) return;
    const upDuration = 1450 / speed;
    const holdDuration = 950 / speed;
    const downDuration = 1050 / speed;
    const restDuration = 500 / speed;
    const cycleDuration = upDuration + holdDuration + downDuration + restDuration;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = (now - startedAt) % cycleDuration;
      let progress = 0;
      if (elapsed < upDuration) {
        const t = elapsed / upDuration;
        progress = 1 - Math.pow(1 - t, 3);
      } else if (elapsed < upDuration + holdDuration) {
        progress = 1;
      } else if (elapsed < upDuration + holdDuration + downDuration) {
        const t = (elapsed - upDuration - holdDuration) / downDuration;
        progress = 1 - t * t * (3 - 2 * t);
      }
      setValue(Math.round(progress * 94));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [speed, reduced]);
  return (
    <div className="demo-kpi"><small>RENDER SCORE</small><strong>{value}</strong><em>/100</em><i style={{ width: `${value}%` }} /></div>
  );
}

function ErrorDemo({ speed, reduced }: DemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (reduced) return;
    let errorTimer = 0;
    let resetTimer = 0;
    const play = () => {
      errorTimer = window.setTimeout(() => {
        setError(true);
        const input = ref.current?.querySelector("input");
        if (input) animate(input, { x: [0, -9, 8, -6, 4, 0], duration: 520 / speed, ease: "outQuad" });
      }, 720 / speed);
      resetTimer = window.setTimeout(() => setError(false), 2800 / speed);
    };
    play();
    const loop = window.setInterval(play, 3900 / speed);
    return () => {
      window.clearInterval(loop);
      [errorTimer, resetTimer].forEach((timer) => window.clearTimeout(timer));
    };
  }, [speed, reduced]);
  function validate() {
    setError(true);
    const input = ref.current?.querySelector("input");
    if (input && !reduced) animate(input, { x: [0, -9, 8, -6, 4, 0], duration: 520 / speed, ease: "outQuad" });
  }
  return (
    <div className={`demo-error ${error ? "has-error" : ""}`} ref={ref}>
      <label>ACCESS CODE<input defaultValue="42-X" /></label>
      <small>代码格式不正确</small>
      <button onClick={validate}>验证</button>
    </div>
  );
}

function CommandDemo({ speed, reduced }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (reduced) return;
    let openTimer = 0;
    let closeTimer = 0;
    const play = () => {
      openTimer = window.setTimeout(() => setOpen(true), 520 / speed);
      closeTimer = window.setTimeout(() => setOpen(false), 3450 / speed);
    };
    play();
    const loop = window.setInterval(play, 4200 / speed);
    return () => {
      window.clearInterval(loop);
      [openTimer, closeTimer].forEach((timer) => window.clearTimeout(timer));
    };
  }, [speed, reduced]);
  useEffect(() => {
    if (!open || !root.current || reduced) return;
    const context = gsap.context(() => {
      gsap.timeline().fromTo("section", { opacity: 0, scale: 0.86, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.34 / speed, ease: "back.out(1.7)" }).from("section p", { opacity: 0, x: -12, stagger: 0.06 / speed }, "-=.12");
    }, root);
    return () => context.revert();
  }, [open, speed, reduced]);
  return (
    <div className="demo-command" ref={root}>
      <button onClick={() => setOpen((value) => !value)}>⌘ K 打开命令</button>
      {open && <section><input autoFocus placeholder="输入命令…" />{["⌕ 搜索动效", "＋ 新建样本", "↗ 导出 HTML"].map((item) => <p key={item}>{item}</p>)}</section>}
    </div>
  );
}

function FlipDemo({ speed, reduced }: DemoProps) {
  const grid = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(["A", "B", "C", "D"]);
  function reorder() {
    if (!grid.current || reduced) {
      setOrder((items) => [...items].reverse());
      return;
    }
    gsap.registerPlugin(Flip);
    const state = Flip.getState(grid.current.children);
    setOrder((items) => [...items].reverse());
    window.requestAnimationFrame(() => Flip.from(state, { duration: 0.7 / speed, ease: "power3.inOut", stagger: 0.04 / speed }));
  }
  useEffect(() => {
    if (reduced) return;
    const play = () => {
      if (!grid.current) return;
      gsap.registerPlugin(Flip);
      const state = Flip.getState(grid.current.children);
      setOrder((items) => [...items].reverse());
      window.requestAnimationFrame(() => Flip.from(state, { duration: 0.7 / speed, ease: "power3.inOut", stagger: 0.04 / speed }));
    };
    const first = window.setTimeout(play, 850 / speed);
    const loop = window.setInterval(play, 2800 / speed);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [speed, reduced]);
  return (
    <div className="demo-flip"><button onClick={reorder}>切换排序 ↕</button><div ref={grid}>{order.map((item) => <i key={item}>{item}</i>)}</div></div>
  );
}

function SheetDemo({ speed, reduced }: DemoProps) {
  const sheet = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!sheet.current || reduced) return;
    gsap.registerPlugin(Draggable);
    gsap.set(sheet.current, { y: 48 });
    const [instance] = Draggable.create(sheet.current, {
      type: "y",
      bounds: { minY: -20, maxY: 64 },
      onRelease() {
        gsap.to(sheet.current, { y: this.y < 22 ? -20 : 64, duration: 0.45 / speed, ease: "back.out(1.4)" });
      },
    });
    const auto = gsap.timeline({ repeat: -1, repeatDelay: 0.45 / speed })
      .to(sheet.current, { y: -20, duration: 0.9 / speed, delay: 0.55 / speed, ease: "power2.inOut" })
      .to(sheet.current, { y: 64, duration: 0.9 / speed, delay: 0.8 / speed, ease: "power2.inOut" });
    return () => { auto.kill(); instance.kill(); };
  }, [speed, reduced]);
  return (
    <div className="demo-sheet-stage"><div className="map-dot dot-a" /><div className="map-dot dot-b" /><article ref={sheet}><i /><b>拖动面板</b><p>释放后自动吸附到最近位置</p><span>DETAIL / 84%</span></article></div>
  );
}

function ScrollDemo({ speed, reduced }: DemoProps) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scroller.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = scroller.current.querySelectorAll("article");
    const animations = Array.from(cards).map((card) => gsap.from(card, {
      scale: 0.88,
      opacity: 0.45,
      scrollTrigger: { trigger: card, scroller: scroller.current, start: "top bottom", end: "top center", scrub: 1 / speed },
    }));
    const auto = gsap.timeline({ repeat: -1, repeatDelay: 0.4 / speed })
      .to(scroller.current, { scrollTop: scroller.current.scrollHeight - scroller.current.clientHeight, duration: 2.5 / speed, ease: "power1.inOut" })
      .to(scroller.current, { scrollTop: 0, duration: 1.1 / speed, delay: 0.55 / speed, ease: "power1.inOut" });
    return () => {
      auto.kill();
      animations.forEach((animation) => { animation.scrollTrigger?.kill(); animation.kill(); });
    };
  }, [speed, reduced]);
  return (
    <div className="demo-scroll" ref={scroller}>
      {["DISCOVER", "TUNE", "EXPORT"].map((label, index) => <article key={label}><small>0{index + 1}</small><b>{label}</b></article>)}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return <pre className="code-block"><code>{code}</code></pre>;
}

function GlossaryPage({
  initialTerm,
  onBack,
  onSelectTerm,
}: {
  initialTerm?: string;
  onBack: () => void;
  onSelectTerm: (id: string) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof glossaryCategories)[number]>("全部");
  const selected = initialTerm ? glossaryEntries.find((entry) => entry.id === initialTerm) : undefined;
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return glossaryEntries.filter((entry) => {
      const searchable = [entry.term, entry.label, entry.summary, entry.explanation, entry.example].join(" ").toLowerCase();
      return (!needle || searchable.includes(needle)) && (category === "全部" || entry.category === category);
    });
  }, [query, category]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function choose(entry: GlossaryEntry) {
    onSelectTerm(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const relatedMotions = selected
    ? motions.filter((motion) => motion.tags.some((tag) => getGlossaryEntry(tag)?.id === selected.id))
    : [];

  return (
    <div className="glossary-page">
      <header className="glossary-header">
        <div className="header-topline"><span>ML_SYS / TERM DATABASE</span><span className="system-live"><i /> DICTIONARY ONLINE</span><span>{glossaryEntries.length} TERMS INDEXED</span></div>
        <button className="back-to-archive" onClick={onBack}>← 返回动效收藏馆</button>
        <div className="glossary-hero">
          <div><p className="eyebrow">MOTION GLOSSARY / 动效术语查询</p><h1>标签<br /><span>词典_</span></h1></div>
          <div><p>这里收录网站中出现的专业词汇。你不需要先成为开发者，只要搜索一个不理解的标签，就能知道它是什么、为什么使用，以及在哪个案例里能看到。</p><b>{String(glossaryEntries.length).padStart(2, "0")}<small>TERMS / 术语</small></b></div>
        </div>
      </header>

      <section className="glossary-controls" aria-label="术语筛选器">
        <label className="lab-search"><span>⌕</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索英文、中文或解释…" /><kbd>/</kbd></label>
        <div className="glossary-category-row">{glossaryCategories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </section>

      {selected && (
        <section className="term-focus">
          <div className="term-focus-code"><small>SELECTED TERM</small><strong>{selected.term}</strong><span>{selected.label}</span></div>
          <div className="term-focus-copy"><small>{selected.category}</small><h2>{selected.summary}</h2><p>{selected.explanation}</p><blockquote><b>举个例子</b>{selected.example}</blockquote></div>
          <div className="term-related"><small>本站对应案例</small>{relatedMotions.length ? relatedMotions.map((motion) => <span key={motion.id}>{motion.index} / {motion.title}</span>) : <span>通用技术概念</span>}</div>
        </section>
      )}

      <div className="result-line glossary-results"><span>DICTIONARY RESULTS</span><b>{String(filtered.length).padStart(2, "0")} / {glossaryEntries.length}</b><i /></div>
      <section className="glossary-grid">
        {filtered.map((entry) => (
          <button className={`glossary-card ${selected?.id === entry.id ? "selected" : ""}`} onClick={() => choose(entry)} key={entry.id}>
            <div><small>{entry.category}</small><span>↗</span></div>
            <strong>{entry.term}</strong>
            <h2>{entry.label}</h2>
            <p>{entry.summary}</p>
            <em>查看完整解释</em>
          </button>
        ))}
      </section>
      {!filtered.length && <section className="empty-state glossary-empty"><b>NO TERM FOUND</b><p>没有匹配的术语，试试更短的关键词。</p><button onClick={() => { setQuery(""); setCategory("全部"); }}>清除搜索</button></section>}
      <footer className="lab-footer"><div><b>MOTION GLOSSARY_</b><p>不要求你懂术语，只负责把它们讲明白。</p></div><div><span>触发方式</span><span>动效表现</span><span>使用场景</span></div><small>PLAIN LANGUAGE · SEARCHABLE · LOCAL FIRST</small></footer>
    </div>
  );
}

export default function MotionLab() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [engine, setEngine] = useState("全部");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>();
  const [codeTab, setCodeTab] = useState<CodeTab>("full");
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState<string>();
  const [slowIds, setSlowIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"archive" | "glossary">("archive");
  const [glossaryTerm, setGlossaryTerm] = useState<string>();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = window.requestAnimationFrame(() => {
      const storedFavorites = JSON.parse(localStorage.getItem("motion-lab:favorites") || "[]") as string[];
      setFavorites(new Set(storedFavorites));
      setReduced(localStorage.getItem("motion-lab:reduced") === "true" || media.matches);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function syncFromHash() {
      const match = window.location.hash.match(/^#glossary(?:\/([a-z0-9-]+))?/i);
      setView(match ? "glossary" : "archive");
      setGlossaryTerm(match?.[1]);
    }
    const frame = window.requestAnimationFrame(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("hashchange", syncFromHash); };
  }, []);

  useEffect(() => {
    localStorage.setItem("motion-lab:favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("motion-lab:reduced", String(reduced));
  }, [reduced]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (view === "archive" && event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        if (selectedId) setSelectedId(undefined);
        else if (view === "glossary") closeGlossary();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, view]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return motions.filter((motion) => {
      const searchable = [motion.title, motion.englishTitle, motion.description, motion.category, motion.engine, ...motion.tags].join(" ").toLowerCase();
      return (!needle || searchable.includes(needle)) && (category === "全部" || motion.category === category) && (engine === "全部" || motion.engine === engine) && (!favoritesOnly || favorites.has(motion.id));
    });
  }, [query, category, engine, favoritesOnly, favorites]);

  const selected = motions.find((motion) => motion.id === selectedId);

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSlow(id: string) {
    setSlowIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function copyMotion(motion: MotionDefinition, value = getFullSnippet(motion)) {
    await navigator.clipboard.writeText(value);
    setCopied(motion.id);
    window.setTimeout(() => setCopied(undefined), 1500);
  }

  function openGlossary(term?: string) {
    const resolved = term ? getGlossaryEntry(term)?.id : undefined;
    setGlossaryTerm(resolved);
    setSelectedId(undefined);
    setView("glossary");
    window.history.pushState(null, "", `#glossary${resolved ? `/${resolved}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectGlossaryTerm(id: string) {
    setGlossaryTerm(id);
    window.history.replaceState(null, "", `#glossary/${id}`);
  }

  function closeGlossary() {
    setView("archive");
    setGlossaryTerm(undefined);
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentCode = selected ? codeTab === "html" ? selected.html : codeTab === "css" ? selected.css : codeTab === "js" ? selected.js : getFullSnippet(selected) : "";

  if (view === "glossary") {
    return (
      <main className="motion-lab-shell glossary-shell">
        <div className="ambient ambient-a" /><div className="ambient ambient-b" />
        <GlossaryPage initialTerm={glossaryTerm} onBack={closeGlossary} onSelectTerm={selectGlossaryTerm} />
      </main>
    );
  }

  return (
    <main className="motion-lab-shell">
      <div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <header className="lab-header">
        <div className="header-topline"><span>ML_SYS / 2026</span><span className="system-live"><i /> SYSTEM ONLINE</span><span>SHANGHAI +08:00</span></div>
        <div className="hero-copy">
          <div><p className="eyebrow">INTERACTION ARCHIVE / 可复制动效零件库</p><h1>MOTION<br /><span>LAB_</span></h1></div>
          <div className="hero-aside"><p>把好玩的网页动效变成真正可带走的零件。现场试玩，拆开阅读，然后复制到你的下一个 HTML 项目。</p><div className="hero-stats"><b>15<small>动效案例</small></b><b>03<small>实现方式</small></b><b>{glossaryEntries.length}<small>术语解释</small></b></div></div>
        </div>
        <div className="signal-line"><span /><i /><span /></div>
      </header>

      <section className="control-deck" aria-label="动效筛选器">
        <label className="lab-search"><span>⌕</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索动效名称或用途…" /><kbd>/</kbd></label>
        <label><small>动效类型</small><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><small>实现方式</small><select value={engine} onChange={(event) => setEngine(event.target.value)}>{engines.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className={favoritesOnly ? "filter-active" : ""} onClick={() => setFavoritesOnly((value) => !value)}>♡ 收藏 {favorites.size ? `(${favorites.size})` : ""}</button>
        <button className={reduced ? "filter-active" : ""} onClick={() => setReduced((value) => !value)}>≈ 减弱动效</button>
        <button className="glossary-link" onClick={() => openGlossary()}>? 标签词典 <b>{glossaryEntries.length}</b></button>
      </section>

      <div className="result-line"><span>ARCHIVE RESULTS</span><b>{String(filtered.length).padStart(2, "0")} / {motions.length}</b><i /></div>

      <section className="motion-grid">
        {filtered.map((motion) => {
          const isSlow = slowIds.has(motion.id);
          return (
            <article className="motion-card" key={motion.id}>
              <div className="card-head"><span>{motion.index}</span><div><small>{motion.category} / {motion.engine}</small><h2>{motion.title}</h2></div><button className={favorites.has(motion.id) ? "is-favorite" : ""} aria-label={`收藏${motion.title}`} onClick={() => toggleFavorite(motion.id)}>{favorites.has(motion.id) ? "♥" : "♡"}</button></div>
              <DemoStage motion={motion} speed={isSlow ? 0.5 : 1} reduced={reduced} />
              <div className="card-copy">
                <p>{motion.description}</p>
                <div className="card-context">
                  <div><small>适合用在</small><span>{motion.useCase}</span></div>
                  <button onClick={() => openGlossary()}>查看 {motion.tags.length} 个相关术语 <i>↗</i></button>
                </div>
              </div>
              <div className="card-actions"><button className={isSlow ? "active" : ""} onClick={() => toggleSlow(motion.id)}>{isSlow ? "0.5× 慢放" : "1× 速度"}</button><button onClick={() => { setSelectedId(motion.id); setCodeTab("full"); }}>查看代码</button><button className="copy-action" onClick={() => copyMotion(motion)}>{copied === motion.id ? "✓ 已复制" : "复制片段"}</button></div>
            </article>
          );
        })}
      </section>

      {!filtered.length && <section className="empty-state"><b>NO SIGNAL</b><p>没有匹配的动效样本。试试清除筛选条件。</p><button onClick={() => { setQuery(""); setCategory("全部"); setEngine("全部"); setFavoritesOnly(false); }}>重置筛选</button></section>}

      <footer className="lab-footer"><div><b>MOTION LAB_</b><p>一个不断生长的网页动效零件库。</p></div><div><span>CSS / WAAPI</span><span>ANIME.JS</span><span>GSAP</span></div><small>BUILD 01 · LOCAL FIRST · COPY FRIENDLY</small></footer>

      {selected && (
        <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={`${selected.title} 代码详情`} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(undefined); }}>
          <aside className="detail-panel">
            <header><div><span>{selected.index} / {selected.engine}</span><h2>{selected.title}</h2><p>{selected.description}</p></div><button onClick={() => setSelectedId(undefined)} aria-label="关闭">×</button></header>
            <div className="detail-preview"><DemoStage motion={selected} speed={slowIds.has(selected.id) ? 0.5 : 1} reduced={reduced} large /><div><small>推荐场景</small><p>{selected.useCase}</p><small>播放方式</small><p>进入视野后自动循环，离开视野自动暂停</p><small>依赖</small><p>{selected.dependencies.length ? `${selected.engine} · 复制片段时通过版本化 CDN 加载` : "无第三方依赖 · 可离线运行"}</p></div></div>
            <div className="code-toolbar"><div>{(["html", "css", "js", "full"] as CodeTab[]).map((tab) => <button className={codeTab === tab ? "active" : ""} onClick={() => setCodeTab(tab)} key={tab}>{tab === "full" ? "完整片段" : tab.toUpperCase()}</button>)}</div><button className="copy-code" onClick={() => copyMotion(selected, currentCode)}>{copied === selected.id ? "✓ 已复制" : "复制当前代码"}</button></div>
            <CodeBlock code={currentCode} />
          </aside>
        </div>
      )}

      {copied && <div className="copy-toast">✓ 代码已进入剪贴板</div>}
    </main>
  );
}
