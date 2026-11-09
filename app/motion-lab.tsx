"use client";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, stagger } from "animejs";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import { parallaxImages } from "./parallax-assets";
import {
  getGlossaryEntry,
  glossaryCategories,
  glossaryEntries,
  type GlossaryEntry,
} from "./glossary-data";
import {
  categories,
  getFullSnippet,
  getMotionSources,
  motions,
  type MotionCategory,
  type MotionDefinition,
  type MotionParameters,
  type MotionStyle,
} from "./motion-data";

type DemoProps = { speed: number; reduced: boolean; parameters: MotionParameters };
type CodeTab = "html" | "css" | "js" | "full";
type PreviewSurface = "light" | "dark";

const accentPresets = ["#4a72ff", "#8b6ee8", "#ef5da8", "#e45151", "#b7ff3c"] as const;

type HsvColor = { h: number; s: number; v: number };

function normalizeHex(input: string) {
  const compact = input.trim().replace(/^#/, "");
  const expanded = compact.length === 3 ? compact.split("").map((character) => character.repeat(2)).join("") : compact;
  return /^[\da-f]{6}$/i.test(expanded) ? `#${expanded.toLowerCase()}` : undefined;
}

function hexToHsv(input: string): HsvColor {
  const hex = normalizeHex(input) ?? "#4a72ff";
  const red = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;
  if (delta) {
    if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  return {
    h: hue < 0 ? hue + 360 : hue,
    s: maximum === 0 ? 0 : delta / maximum,
    v: maximum,
  };
}

function hsvToHex({ h, s, v }: HsvColor) {
  const chroma = v * s;
  const segment = ((h % 360) + 360) % 360 / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const [red, green, blue] = segment < 1 ? [chroma, secondary, 0]
    : segment < 2 ? [secondary, chroma, 0]
      : segment < 3 ? [0, chroma, secondary]
        : segment < 4 ? [0, secondary, chroma]
          : segment < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const match = v - chroma;
  return `#${[red, green, blue].map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, "0")).join("")}`;
}

const styleOptions: { id: MotionStyle; label: string }[] = [
  { id: "editorial", label: "EDITORIAL" },
  { id: "terminal", label: "TERMINAL" },
  { id: "glass", label: "GLASS" },
  { id: "native", label: "NATIVE" },
  { id: "soft", label: "SOFT" },
  { id: "brutalist", label: "BRUTALIST" },
];

const styleLabels = Object.fromEntries(styleOptions.map((option) => [option.id, option.label])) as Record<MotionStyle, string>;
const shelfStyleLabels: Record<MotionStyle, string> = {
  editorial: "Editorial",
  terminal: "Terminal",
  glass: "Glass",
  native: "Native",
  soft: "Soft",
  brutalist: "Brutalist",
};
const defaultPreviewSurface = (style: MotionStyle): PreviewSurface => style === "terminal" || style === "glass" ? "dark" : "light";

const defaultMotionParameters = Object.fromEntries(
  motions.filter((motion) => motion.parameters?.length).map((motion) => [
    motion.id,
    Object.fromEntries((motion.parameters ?? []).map((definition) => [definition.id, definition.defaultValue])),
  ]),
) as Record<string, MotionParameters>;

function getConfiguredSources(motion: MotionDefinition, parameters: MotionParameters) {
  const sources = getMotionSources(motion, parameters);
  return { ...sources, full: getFullSnippet(motion, parameters) };
}

const categoryMeta: Record<MotionCategory, { title: string; english: string; description: string; symbol: string; slug: string }> = {
  按钮: { title: "按钮动效", english: "BUTTONS", description: "强化关键操作、点击确认与行动召唤。", symbol: "↗", slug: "buttons" },
  表单: { title: "表单与输入", english: "FORM CONTROLS", description: "让输入、开关和校验状态更容易被理解。", symbol: "◉", slug: "forms" },
  导航: { title: "导航与切换", english: "NAVIGATION", description: "帮助用户看清当前位置与页面层级变化。", symbol: "≡", slug: "navigation" },
  卡片: { title: "卡片与指针", english: "CARDS & POINTER", description: "通过悬停、聚光和指针响应增加空间感。", symbol: "◫", slug: "cards" },
  反馈: { title: "反馈与浮层", english: "FEEDBACK", description: "用通知、面板与状态变化回应用户操作。", symbol: "!", slug: "feedback" },
  文字: { title: "文字与数字", english: "TYPE & DATA", description: "让标题、数字和状态信息更有出现节奏。", symbol: "Aa", slug: "type-data" },
  布局: { title: "列表与布局", english: "LAYOUT", description: "组织多个元素的入场、排序与位置变化。", symbol: "⊞", slug: "layout" },
  滚动: { title: "滚动叙事", english: "SCROLL", description: "把页面滚动转化为连续的内容讲述过程。", symbol: "↓", slug: "scroll" },
  图标: { title: "数据图标", english: "DATA ICONS", description: "用紧凑的动态图形表达趋势、进度与实时状态。", symbol: "◌", slug: "data-icons" },
};

const motionCategories = categories.filter((item): item is MotionCategory => item !== "全部");
const categoryBySlug = Object.fromEntries(motionCategories.map((item) => [categoryMeta[item].slug, item])) as Record<string, MotionCategory>;

const engineCode = {
  原生: "Native",
  "Anime.js": "Anime.js",
  GSAP: "GSAP",
} as const;

function getShelfMetadata(motion: MotionDefinition) {
  const labels = [shelfStyleLabels[motion.style], engineCode[motion.engine]];
  return labels.filter((label, index) => labels.findIndex((item) => item.toLowerCase() === label.toLowerCase()) === index).join(" · ");
}

const engineFilterLabels: Record<string, string> = { 全部: "ALL", 原生: "NATIVE", "Anime.js": "ANIME.JS", GSAP: "GSAP", 无需外部库: "NO LIBRARY" };
const engineFilterValues = Object.fromEntries(Object.entries(engineFilterLabels).map(([value, label]) => [label, value]));
const categoryFilterOptions = ["ALL CATEGORIES", ...motionCategories.map((category) => categoryMeta[category].english)];

const dependencyLabels: Record<string, string> = {
  anime: "Anime.js 4.5.0",
  gsap: "GSAP 3.15.0",
  flip: "Flip",
  draggable: "Draggable",
  scrollTrigger: "ScrollTrigger",
};

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
  "cursor-dot-field": (props) => <DotFieldDemo {...props} />,
  "parallax-image-field": (props) => <ParallaxImageDemo {...props} />,
  "prompt-reference-card": () => <PromptReferenceCardDemo />,
};

function ArchiveVariantDemo({ motion, speed, reduced, parameters }: DemoProps & { motion: MotionDefinition }) {
  const [active, setActive] = useState(false);
  const strength = parameters.intensity ?? 100;

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setActive((value) => !value), 1800 / speed);
    return () => window.clearInterval(timer);
  }, [reduced, speed]);

  function updatePointer(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--variant-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty("--variant-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <button
      className={`archive-variant-demo variant-${motion.variantKind} family-${motion.category} ${active ? "is-active" : ""}`}
      style={{ "--variant-strength": strength / 100 } as CSSProperties}
      onPointerMove={updatePointer}
      onClick={() => setActive((value) => !value)}
    >
      <div className="archive-variant-visual" aria-hidden="true"><i /><i /><i /><i /><span /></div>
    </button>
  );
}

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
  parameters,
  accentColor,
  large = false,
  surface,
}: {
  motion: MotionDefinition;
  speed: number;
  reduced: boolean;
  parameters: MotionParameters;
  accentColor: string;
  large?: boolean;
  surface?: PreviewSurface;
}) {
  const { ref, visible } = useVisible<HTMLDivElement>();
  const render = demoMap[motion.id] ?? (motion.variantKind ? (props: DemoProps) => <ArchiveVariantDemo motion={motion} {...props} /> : undefined);
  return (
    <div
      ref={ref}
      className={`demo-stage style-${motion.style} preview-${surface ?? defaultPreviewSurface(motion.style)} ${large ? "demo-stage-large" : ""} ${reduced ? "motion-reduced" : ""}`}
      style={{
        "--motion-speed": speed === 0.5 ? 2 : 1,
        "--ml-accent": accentColor,
        "--phosphor": accentColor,
        "--amber": accentColor,
      } as CSSProperties}
    >
      <div className="stage-grid" />
      <div className="stage-corner stage-corner-a">⌜</div>
      <div className="stage-corner stage-corner-b">⌟</div>
      {visible && render ? (
        <div className="demo-inner">
          {render({ speed, reduced, parameters })}
        </div>
      ) : (
        <div className="demo-sleep">SLEEP MODE</div>
      )}
    </div>
  );
}

function AccentPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string>();
  const hsv = hexToHsv(value);

  useEffect(() => {
    if (!open) return;
    function closeOnOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  function updateSpectrum(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const saturation = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const brightness = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    onChange(hsvToHex({ h: hsv.h, s: saturation, v: brightness }));
  }

  function applyDraft() {
    if (draft === undefined) return;
    const normalized = normalizeHex(draft);
    if (normalized) onChange(normalized);
    setDraft(undefined);
  }

  return (
    <div className={`accent-picker ${open ? "is-open" : ""}`} ref={root} aria-label="全局动效主题色">
      <small>ACCENT</small>
      <div className="accent-presets">
        {accentPresets.map((color) => (
          <button
            className={value.toLowerCase() === color ? "active" : ""}
            type="button"
            aria-label={`使用主题色 ${color}`}
            aria-pressed={value.toLowerCase() === color}
            style={{ "--swatch": color } as CSSProperties}
            onClick={() => { setDraft(undefined); onChange(color); }}
            key={color}
          />
        ))}
        <button
          className={`accent-custom-trigger ${accentPresets.includes(value.toLowerCase() as typeof accentPresets[number]) ? "" : "active"}`}
          type="button"
          title="自定义主题色"
          aria-label="打开自定义主题色面板"
          aria-expanded={open}
          onClick={() => { setDraft(undefined); setOpen((current) => !current); }}
        ><span aria-hidden="true" /></button>
      </div>
      {open && <section className="accent-popover" role="dialog" aria-label="自定义主题色">
        <header><small>CUSTOM COLOR</small><button type="button" aria-label="关闭自定义主题色面板" onClick={() => setOpen(false)}>DONE</button></header>
        <div
          className="accent-spectrum"
          style={{ "--picker-hue": hsv.h } as CSSProperties}
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); updateSpectrum(event); }}
          onPointerMove={updateSpectrum}
        ><i style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} /></div>
        <label className="accent-hue"><span>HUE</span><input type="range" min="0" max="360" value={Math.round(hsv.h)} onChange={(event) => onChange(hsvToHex({ ...hsv, h: Number(event.target.value) }))} /></label>
        <div className="accent-hex-row">
          <i style={{ background: value }} />
          <label><span>HEX</span><input value={draft ?? value.toUpperCase()} maxLength={7} spellCheck={false} onChange={(event) => setDraft(event.target.value)} onBlur={applyDraft} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyDraft(); } }} /></label>
        </div>
      </section>}
    </div>
  );
}

function CanvasPicker({ value, onChange }: { value: PreviewSurface; onChange: (value: PreviewSurface) => void }) {
  return (
    <div className="canvas-picker" aria-label="Preview canvas">
      <small>CANVAS</small>
      <div>
        <button className={value === "light" ? "active" : ""} type="button" aria-pressed={value === "light"} onClick={() => onChange("light")}><i />LIGHT</button>
        <button className={value === "dark" ? "active" : ""} type="button" aria-pressed={value === "dark"} onClick={() => onChange("dark")}><i />DARK</button>
      </div>
    </div>
  );
}

function MagneticDemo({ reduced, parameters }: DemoProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const strength = (parameters.strength ?? 18) / 100;
  const returnDuration = parameters.returnDuration ?? 450;
  function move(event: ReactPointerEvent<HTMLButtonElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * strength,
      y: (event.clientY - rect.top - rect.height / 2) * strength,
    });
  }
  return (
    <button
      className="demo-magnetic"
      onPointerMove={move}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, "--demo-magnetic-return": `${returnDuration}ms` } as CSSProperties}
    >
      <span>EXPLORE NOW</span>
      <b>↗</b>
    </button>
  );
}

function LiquidToggleDemo({ speed, reduced, parameters }: DemoProps) {
  const [on, setOn] = useState(true);
  const duration = parameters.duration ?? 550;
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
      style={{ "--demo-liquid-duration": `${duration}ms` } as CSSProperties}
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
      <span>{done ? "✓ SENT" : "SEND COMMAND"}</span>
    </button>
  );
}

function TabsDemo({ speed, reduced }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState({ left: 4, width: 0 });
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % 3), 1100 / speed);
    return () => window.clearInterval(timer);
  }, [speed, reduced]);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const updateIndicator = () => {
      const tab = element.querySelector<HTMLButtonElement>(`[data-tab-index="${active}"]`);
      if (!tab) return;
      const rootRect = element.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const borderLeft = Number.parseFloat(getComputedStyle(element).borderLeftWidth) || 0;
      setIndicator({ left: tabRect.left - rootRect.left - borderLeft, width: tabRect.width });
    };
    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);
  return (
    <div className="demo-tabs" ref={root}>
      <i style={{ left: indicator.left, width: indicator.width }} />
      {["OVERVIEW", "MOTION", "CODE"].map((label, index) => (
        <button data-tab-index={index} className={index === active ? "active" : ""} onClick={() => setActive(index)} key={label}>
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

function SpotlightDemo({ reduced, parameters }: DemoProps) {
  const [vars, setVars] = useState({ mx: 50, my: 50, rx: 0, ry: 0 });
  const tilt = parameters.tilt ?? 12;
  const spotlight = parameters.spotlight ?? 35;
  function move(event: ReactPointerEvent<HTMLElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setVars({ mx: x * 100, my: y * 100, ry: (x - 0.5) * tilt, rx: (0.5 - y) * tilt });
  }
  const style = {
    "--mx": `${vars.mx}%`,
    "--my": `${vars.my}%`,
    "--rx": `${vars.rx}deg`,
    "--ry": `${vars.ry}deg`,
    "--demo-spot-radius": `${spotlight}%`,
  } as CSSProperties;
  return (
    <article className="demo-spot" style={style} onPointerMove={move} onPointerLeave={() => setVars({ mx: 50, my: 50, rx: 0, ry: 0 })}>
      <small>LIMITED UNIT</small>
      <strong>NEON</strong>
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
      <button onClick={add}>+ ADD NOTICE</button>
      <div>
        {toasts.map((toast) => <p key={toast}><span>STATE SYNCED</span></p>)}
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
      <ul ref={ref}>
        {["VISUAL SYSTEM", "MOTION LANGUAGE", "COMPONENT STATE"].map((label) => <li key={label}>{label}</li>)}
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
      <small>INVALID CODE FORMAT</small>
      <button onClick={validate}>VALIDATE</button>
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
      <button onClick={() => setOpen((value) => !value)}>⌘ K OPEN COMMAND</button>
      {open && <section><input autoFocus placeholder="Type a command…" />{["⌕ SEARCH MOTION", "＋ NEW SAMPLE", "↗ EXPORT HTML"].map((item) => <p key={item}>{item}</p>)}</section>}
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
    <div className="demo-flip"><button onClick={reorder}>REORDER ↕</button><div ref={grid}>{order.map((item) => <i key={item}>{item}</i>)}</div></div>
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
    <div className="demo-sheet-stage"><div className="map-dot dot-a" /><div className="map-dot dot-b" /><article ref={sheet}><i /><b>DRAG PANEL</b><p>Release to snap to the nearest point.</p><span>SNAP READY</span></article></div>
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
      {["DISCOVER", "TUNE", "EXPORT"].map((label) => <article key={label}><b>{label}</b></article>)}
    </div>
  );
}

function DotFieldDemo({ speed, reduced, parameters }: DemoProps) {
  const root = useRef<HTMLDivElement>(null);
  const radiusValue = parameters.radius ?? 96;
  const maxDotSize = parameters.dotSize ?? 8;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const dots = Array.from(element.querySelectorAll<HTMLElement>("i"));
    const pointer = { x: 0, y: 0, active: false };
    let currentX = element.clientWidth / 2;
    let currentY = element.clientHeight / 2;
    let frame = 0;

    const render = (time: number) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const targetX = pointer.active ? pointer.x : width / 2 + Math.cos(time * 0.00055 * speed) * width * 0.25;
      const targetY = pointer.active ? pointer.y : height / 2 + Math.sin(time * 0.0008 * speed) * height * 0.22;
      const follow = reduced ? 1 : 0.2;
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
      const radius = Math.min(radiusValue, width * 0.48);

      dots.forEach((dot, index) => {
        const column = index % 17;
        const row = Math.floor(index / 17);
        const x = 14 + (column / 16) * (width - 28);
        const y = 14 + (row / 9) * (height - 28);
        const dx = currentX - x;
        const dy = currentY - y;
        const influence = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
        const eased = influence * influence * (3 - 2 * influence);
        dot.style.transform = `translate(${dx * eased * 0.18}px,${dy * eased * 0.18}px) scale(${1 + eased * (maxDotSize / 2 - 1)})`;
        dot.style.opacity = String(0.18 + eased * 0.82);
        dot.style.boxShadow = eased > 0.08 ? `0 0 ${4 + eased * 12}px color-mix(in srgb,var(--phosphor) ${Math.round((0.35 + eased * 0.55) * 100)}%,transparent)` : "none";
      });
      if (!reduced) frame = window.requestAnimationFrame(render);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (reduced) render(performance.now());
    };
    const releasePointer = () => {
      pointer.active = false;
      if (reduced) render(0);
    };
    element.addEventListener("pointerenter", updatePointer);
    element.addEventListener("pointermove", updatePointer);
    element.addEventListener("pointerleave", releasePointer);

    const observer = new ResizeObserver(() => { if (reduced) render(0); });
    observer.observe(element);
    render(0);
    return () => {
      observer.disconnect();
      element.removeEventListener("pointerenter", updatePointer);
      element.removeEventListener("pointermove", updatePointer);
      element.removeEventListener("pointerleave", releasePointer);
      window.cancelAnimationFrame(frame);
    };
  }, [speed, reduced, radiusValue, maxDotSize]);

  return (
    <div
      ref={root}
      className="demo-dot-field"
      role="img"
      aria-label="会跟随指针移动并向外渐隐的点阵区域"
    >
      {Array.from({ length: 170 }, (_, index) => <i aria-hidden="true" key={index} />)}
    </div>
  );
}

function ParallaxImageDemo({ reduced }: DemoProps) {
  return (
    <div className="relative h-[210px] w-full max-w-[340px] overflow-hidden border border-white/10 bg-[#070807] shadow-2xl shadow-black/30">
      <div className="parallax-accent-glow absolute inset-0" />
      <ParallaxHeroImages
        images={parallaxImages}
        disabled={reduced}
        imageClassName="!h-14 !w-20 rounded-md border border-white/10 shadow-xl md:!h-16 md:!w-24"
      />
      <div className="pointer-events-none absolute inset-0 z-20 grid place-content-center text-center font-mono">
        <small className="parallax-accent-label mb-2 text-[7px] tracking-[0.28em]">LAYER FIELD</small>
        <b className="text-[15px] tracking-[-0.03em] text-white">MOVE / DEPTH</b>
      </div>
    </div>
  );
}

const promptCardCopies = {
  EN: "Redraw the attached image in a clumsy, hand-made editorial style. Use Image 1 for composition and retain the phrase ‘Keep the happy accidents.’",
  CN: "请用笨拙、手工感的编辑设计风格重绘附加图片。参考图片 1 的构图，并保留文字“留下那些快乐的意外。”",
};

function PromptReferenceCardDemo() {
  const [language, setLanguage] = useState<keyof typeof promptCardCopies>("EN");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function handleCopy() {
    if (!await copyText(promptCardCopies[language])) return;
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="demo-prompt-ref">
      <header className="demo-prompt-ref-head">
        <b>Prompt_018</b>
        <div className="demo-prompt-ref-actions">
          <div className="demo-prompt-ref-language" role="group" aria-label="选择 Prompt 语言">
            {(["EN", "CN"] as const).map((option) => (
              <button
                className={language === option ? "active" : ""}
                type="button"
                aria-pressed={language === option}
                onClick={() => { setLanguage(option); setCopied(false); }}
                key={option}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="demo-prompt-ref-copy" type="button" onClick={handleCopy} aria-live="polite">
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
      </header>
      <div className="demo-prompt-ref-body" lang={language === "CN" ? "zh-CN" : "en"}>
        {language === "EN" ? (
          <p>Redraw the attached image in a <mark className="prompt-core-ref">clumsy, hand-made editorial style</mark>. Use <mark className="prompt-image-ref">Image 1</mark> for composition and retain the phrase <mark className="prompt-text-ref">“Keep the happy accidents.”</mark></p>
        ) : (
          <p>请用<mark className="prompt-core-ref">笨拙、手工感的编辑设计风格</mark>重绘附加图片。参考<mark className="prompt-image-ref">图片 1</mark>的构图，并保留文字<mark className="prompt-text-ref">“留下那些快乐的意外。”</mark></p>
        )}
      </div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return <pre className="code-block"><code>{code}</code></pre>;
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function CustomSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.indexOf(value)));

  useEffect(() => {
    if (!open) return;
    function closeOnOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  function choose(index: number) {
    onChange(options[index]);
    setActiveIndex(index);
    setOpen(false);
    trigger.current?.focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!open) {
        setActiveIndex(Math.max(0, options.indexOf(value)));
        setOpen(true);
      } else {
        setActiveIndex((current) => (current + direction + options.length) % options.length);
      }
      return;
    }
    if (open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      choose(activeIndex);
      return;
    }
    if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
    }
  }

  return (
    <div className={`custom-select ${open ? "is-open" : ""}`} ref={root}>
      <small>{label}</small>
      <button
        ref={trigger}
        type="button"
        className="custom-select-trigger"
        role="combobox"
        aria-label={`${label}：${value}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
        onClick={() => {
          setActiveIndex(Math.max(0, options.indexOf(value)));
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
      >
        <span>{value}</span><i aria-hidden="true" />
      </button>
      {open && (
        <>
          <ul className="custom-select-menu" id={listboxId} role="listbox" aria-label={label}>
            {options.map((item, index) => (
              <li
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={item === value}
                className={`${item === value ? "selected" : ""} ${index === activeIndex ? "active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                key={item}
              >
                <b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span><i>{item === value ? "✓" : ""}</i>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
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
        <div className="header-topline"><span>动效术语库 / 2026</span><span className="system-live"><i /> 可离线查询</span><div className="header-tools"><span>{glossaryEntries.length} 个术语</span></div></div>
        <button className="back-to-archive" onClick={onBack}>← 返回动效收藏馆</button>
        <div className="glossary-hero">
          <div><p className="eyebrow">MOTION GLOSSARY / 动效术语查询</p><h1>TAG<br /><span>GLOSSARY_</span></h1></div>
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
  const [activeCategory, setActiveCategory] = useState<MotionCategory>();
  const [engine, setEngine] = useState("全部");
  const [styleFilter, setStyleFilter] = useState<MotionStyle | "全部">("全部");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>();
  const [codeTab, setCodeTab] = useState<CodeTab>("full");
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState<string>();
  const [copyError, setCopyError] = useState(false);
  const [slowIds, setSlowIds] = useState<Set<string>>(new Set());
  const [accentColor, setAccentColor] = useState("#4a72ff");
  const [archiveSurface, setArchiveSurface] = useState<PreviewSurface>("light");
  const [view, setView] = useState<"archive" | "glossary">("archive");
  const [glossaryTerm, setGlossaryTerm] = useState<string>();
  const [previewSurface, setPreviewSurface] = useState<PreviewSurface>("light");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [parameterValues, setParameterValues] = useState<Record<string, MotionParameters>>(() => defaultMotionParameters);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = window.requestAnimationFrame(() => {
      const storedFavorites = JSON.parse(localStorage.getItem("motion-lab:favorites") || "[]") as string[];
      setFavorites(new Set(storedFavorites));
      setReduced(localStorage.getItem("motion-lab:reduced") === "true" || media.matches);
      setAccentColor(localStorage.getItem("motion-lab:accent") || "#4a72ff");
      setArchiveSurface(localStorage.getItem("motion-lab:canvas") === "dark" ? "dark" : "light");
      localStorage.removeItem("motion-lab:theme");
      setPreferencesLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function syncFromHash() {
      const glossaryMatch = window.location.hash.match(/^#glossary(?:\/([a-z0-9-]+))?/i);
      const categoryMatch = window.location.hash.match(/^#category\/([a-z0-9-]+)/i);
      setView(glossaryMatch ? "glossary" : "archive");
      setGlossaryTerm(glossaryMatch?.[1]);
      if (!glossaryMatch) setActiveCategory(categoryMatch ? categoryBySlug[categoryMatch[1]] : undefined);
    }
    const frame = window.requestAnimationFrame(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("hashchange", syncFromHash); };
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem("motion-lab:favorites", JSON.stringify([...favorites]));
  }, [favorites, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem("motion-lab:reduced", String(reduced));
  }, [reduced, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem("motion-lab:accent", accentColor);
  }, [accentColor, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem("motion-lab:canvas", archiveSurface);
  }, [archiveSurface, preferencesLoaded]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!selectedId && view === "archive" && event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        if (selectedId) setSelectedId(undefined);
        else if (view === "glossary") {
          setView("archive");
          setGlossaryTerm(undefined);
          window.history.pushState(null, "", activeCategory ? `#category/${categoryMeta[activeCategory].slug}` : `${window.location.pathname}${window.location.search}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (activeCategory) {
          setActiveCategory(undefined);
          setQuery("");
          window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeCategory, selectedId, view]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return motions.filter((motion) => {
      const searchable = [motion.title, motion.englishTitle, motion.description, motion.category, motion.engine, ...motion.tags].join(" ").toLowerCase();
      const matchesEngine = engine === "全部" || (engine === "无需外部库" ? motion.dependencies.length === 0 : motion.engine === engine);
      const matchesStyle = styleFilter === "全部" || motion.style === styleFilter || motion.styleSecondary === styleFilter;
      return (!needle || searchable.includes(needle)) && (!activeCategory || motion.category === activeCategory) && matchesEngine && matchesStyle && (!favoritesOnly || favorites.has(motion.id));
    });
  }, [query, activeCategory, engine, styleFilter, favoritesOnly, favorites]);

  const categoryGroups = useMemo(() => motionCategories.map((item) => ({
    category: item,
    meta: categoryMeta[item],
    motions: motions.filter((motion) => motion.category === item),
  })), []);
  const showCategoryIndex = !activeCategory && !query.trim() && engine === "全部" && styleFilter === "全部" && !favoritesOnly;

  const selected = motions.find((motion) => motion.id === selectedId);
  const selectedParameters = selected ? parameterValues[selected.id] ?? {} : {};
  const selectedParameterDefinitions = selected?.parameters ?? [];

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function setSlowPlayback(id: string, slow: boolean) {
    setSlowIds((current) => {
      const next = new Set(current);
      if (slow) next.add(id); else next.delete(id);
      return next;
    });
  }

  function updateParameter(motionId: string, parameterId: string, value: number) {
    setParameterValues((current) => ({
      ...current,
      [motionId]: { ...current[motionId], [parameterId]: value },
    }));
  }

  function resetParameters(motionId: string) {
    setParameterValues((current) => ({
      ...current,
      [motionId]: { ...defaultMotionParameters[motionId] },
    }));
  }

  function openMotion(motion: MotionDefinition) {
    setPreviewSurface(archiveSurface);
    setSelectedId(motion.id);
    setCodeTab("full");
  }

  function scrollToArchive() {
    setActiveCategory(undefined);
    setQuery("");
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    window.requestAnimationFrame(() => document.querySelector(".category-shelves")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function copyMotion(motion: MotionDefinition, value = getConfiguredSources(motion, parameterValues[motion.id] ?? {}).full) {
    setCopyError(false);
    const success = await copyText(value);
    if (!success) {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2400);
      return;
    }
    setCopied(motion.id);
    window.setTimeout(() => setCopied(undefined), 2000);
  }

  function openGlossary(term?: string) {
    const resolved = term ? getGlossaryEntry(term)?.id : undefined;
    setGlossaryTerm(resolved);
    setSelectedId(undefined);
    setView("glossary");
    window.history.pushState(null, "", `#glossary${resolved ? `/${resolved}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCategory(nextCategory: MotionCategory) {
    setActiveCategory(nextCategory);
    setQuery("");
    window.history.pushState(null, "", `#category/${categoryMeta[nextCategory].slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeCategory() {
    setActiveCategory(undefined);
    setQuery("");
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectGlossaryTerm(id: string) {
    setGlossaryTerm(id);
    window.history.replaceState(null, "", `#glossary/${id}`);
  }

  function closeGlossary() {
    setView("archive");
    setGlossaryTerm(undefined);
    window.history.pushState(null, "", activeCategory ? `#category/${categoryMeta[activeCategory].slug}` : `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const selectedSources = selected ? getConfiguredSources(selected, selectedParameters) : undefined;
  const currentCode = selectedSources ? selectedSources[codeTab] : "";
  const shellStyle = { "--site-accent": accentColor, "--site-highlight": `${accentColor}24` } as CSSProperties;

  if (view === "glossary") {
    return (
      <main className="motion-lab-shell glossary-shell" style={shellStyle}>
        <GlossaryPage initialTerm={glossaryTerm} onBack={closeGlossary} onSelectTerm={selectGlossaryTerm} />
      </main>
    );
  }

  return (
    <main className="motion-lab-shell" style={shellStyle}>
      <nav className="magnetic-topbar" aria-label="Primary navigation">
        <button className="topbar-brand" onClick={closeCategory}>MOTION</button>
        <div className="topbar-links">
          <button onClick={scrollToArchive}>ARCHIVE</button>
          <button onClick={scrollToArchive}>CATEGORIES</button>
          <button onClick={() => openGlossary()}>GLOSSARY</button>
        </div>
        <span className="topbar-index">INDEX [ {String(motions.length).padStart(5, "0")} ]</span>
        <button className="topbar-cta" onClick={scrollToArchive}>OPEN ARCHIVE <i>↘</i></button>
      </nav>
      <header className="lab-header">
        {activeCategory ? <div className="category-page-hero">
          <button className="back-to-categories" onClick={closeCategory}>← ALL CATEGORIES</button>
          <div><p className="eyebrow">MOTION CATEGORY</p><h1>{categoryMeta[activeCategory].english}<span>{categoryMeta[activeCategory].symbol}</span></h1></div>
          <div className="category-page-note"><b>{String(motions.filter((motion) => motion.category === activeCategory).length).padStart(2, "0")}<small>AVAILABLE VARIANTS</small></b><p>Open any sample to tune its playback, parameters and source code.</p></div>
        </div> : <div className="hero-copy">
          <div className="hero-title-cluster"><p className="eyebrow">INTERACTION ARCHIVE</p><h1><span className="hero-motion-word">MOTION</span><span className="hero-lab-line"><em>LAB</em><b>_</b></span></h1><p className="hero-intro">A curated archive of reusable web interactions.<br />Preview, tune, inspect and copy every component.</p><div className="hero-index-line"><span>[ {String(motions.length).padStart(3, "0")} COMPONENTS ]</span><span>[ {String(motionCategories.length).padStart(2, "0")} CATEGORIES ]</span><span>CSS · WAAPI · JS</span></div></div>
          <div className="hero-artifacts" aria-hidden="true">
            <code className="artifact-code">&lt;motion data-index=&quot;018&quot;&gt;<br />&nbsp;&nbsp;--ease: cubic-bezier(.25,.1,.25,1);<br />&lt;/motion&gt;</code>
            <div className="artifact-window"><span><i /><i /><i /> PREVIEW</span><b>240 × 120</b></div>
            <div className="artifact-selection"><i /><i /><i /><i /><div className="artifact-halftone" /></div>
            <div className="artifact-ease">ease(.25,<br />.1, .25, 1)</div>
            <div className="artifact-cursor" />
            <pre className="artifact-ascii">·· · ···↘{`\n`}[ x:075 y:042 ]{`\n`}░▒▓ 018</pre>
          </div>
        </div>}
      </header>

      <section className="control-deck" aria-label="动效筛选器">
        <label className="lab-search"><span>⌕</span><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components…" /><kbd>/</kbd></label>
        <AccentPicker value={accentColor} onChange={setAccentColor} />
        <CanvasPicker value={archiveSurface} onChange={setArchiveSurface} />
        <CustomSelect label="CATEGORY" value={activeCategory ? categoryMeta[activeCategory].english : "ALL CATEGORIES"} options={categoryFilterOptions} onChange={(value) => value === "ALL CATEGORIES" ? closeCategory() : openCategory(motionCategories.find((category) => categoryMeta[category].english === value) ?? motionCategories[0])} />
        <CustomSelect label="STYLE" value={styleFilter === "全部" ? "ALL" : styleLabels[styleFilter]} options={["ALL", ...styleOptions.map((option) => option.label)]} onChange={(value) => setStyleFilter(value === "ALL" ? "全部" : styleOptions.find((option) => option.label === value)?.id ?? "全部")} />
        <CustomSelect label="ENGINE" value={engineFilterLabels[engine]} options={Object.values(engineFilterLabels)} onChange={(value) => setEngine(engineFilterValues[value] ?? "全部")} />
        <button className={`saved-link ${favoritesOnly ? "filter-active" : ""}`} onClick={() => setFavoritesOnly((value) => !value)}>🤍 SAVED {favorites.size ? `(${favorites.size})` : ""}</button>
        <button className={`motion-toggle ${reduced ? "filter-active" : ""}`} onClick={() => setReduced((value) => !value)}>{reduced ? "▶ PLAY" : "Ⅱ PAUSE"}</button>
        <button className="glossary-link" onClick={() => openGlossary()}><span className="glossary-icon" aria-hidden="true">📖</span><span className="glossary-label">TAG GALLERY</span></button>
      </section>

      {showCategoryIndex ? <>
        <div className="category-shelves" aria-label="按类别浏览动效">
          {categoryGroups.map((group) => <section className="category-shelf" key={group.category}>
            <header className="shelf-header"><div className="shelf-heading"><h2>{group.meta.english}</h2><small>[ {String(group.motions.length).padStart(2, "0")} ITEMS ]</small></div><button onClick={() => openCategory(group.category)}>MORE <span>→</span></button></header>
            <div className="shelf-track">
              {group.motions.map((motion) => <article className="shelf-item" data-style={motion.style} key={motion.id}>
                <button className="shelf-item-hit" aria-label={`Open ${motion.englishTitle}`} onClick={() => openMotion(motion)} />
                <div className={`shelf-preview surface-${archiveSurface}`} aria-hidden="true" inert><DemoStage motion={motion} speed={slowIds.has(motion.id) ? 0.5 : 1} reduced={reduced} parameters={parameterValues[motion.id] ?? {}} accentColor={accentColor} surface={archiveSurface} /></div>
                <div className="shelf-caption"><h3>{motion.englishTitle}</h3><small>{getShelfMetadata(motion)}</small></div>
              </article>)}
            </div>
          </section>)}
        </div>
      </> : <>
      <div className="result-line"><span>{activeCategory ? `${categoryMeta[activeCategory].english} VARIANTS` : "SEARCH RESULTS"}</span><b>{String(filtered.length).padStart(2, "0")} / {activeCategory ? motions.filter((motion) => motion.category === activeCategory).length : motions.length}</b><i /></div>

      <section className="motion-grid compact-motion-grid">
        {filtered.map((motion) => (
          <article className="shelf-item result-shelf-item" data-style={motion.style} key={motion.id}>
            <button className="shelf-item-hit" aria-label={`Open ${motion.englishTitle}`} onClick={() => openMotion(motion)} />
            <div className={`shelf-preview surface-${archiveSurface}`} aria-hidden="true" inert><DemoStage motion={motion} speed={slowIds.has(motion.id) ? 0.5 : 1} reduced={reduced} parameters={parameterValues[motion.id] ?? {}} accentColor={accentColor} surface={archiveSurface} /></div>
            <div className="shelf-caption"><h3>{motion.englishTitle}</h3><small>{getShelfMetadata(motion)}</small></div>
          </article>
        ))}
      </section>

      {!filtered.length && <section className="empty-state"><b>NO COMPONENT FOUND</b><p>Try a different category, style or engine.</p><button onClick={() => { setQuery(""); setEngine("全部"); setStyleFilter("全部"); setFavoritesOnly(false); }}>RESET FILTERS</button></section>}
      </>}

      <footer className="lab-footer editorial-footer"><div className="footer-brand"><b>MOTION LAB</b><p>A growing archive of reusable interaction components.</p></div><div className="footer-index"><small>INTERACTION TOOLKIT</small><div><span><i>01</i>CSS + WAAPI</span><span><i>02</i>ANIME.JS</span><span><i>03</i>GSAP</span></div></div><div className="footer-status"><small>BUILD 01</small><b>Local first,<br />copy friendly.</b></div></footer>

      {selected && (
        <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={`${selected.title} 代码详情`} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(undefined); }}>
          <aside className="detail-panel">
            <header><div><span>{styleLabels[selected.style]} · {selected.engine}</span><h2>{selected.title}</h2><p>{selected.description}</p></div><button onClick={() => setSelectedId(undefined)} aria-label="关闭"><i aria-hidden="true" /></button></header>
            <div className="detail-preview">
              <div className="detail-stage-window">
                <DemoStage key={selected.id} motion={selected} speed={slowIds.has(selected.id) ? 0.5 : 1} reduced={reduced} parameters={selectedParameters} accentColor={accentColor} surface={previewSurface} large />
              </div>
              <div className="detail-controls">
                <section className="surface-control"><small>预览底色</small><div><button className={previewSurface === "light" ? "active" : ""} onClick={() => setPreviewSurface("light")}>浅色</button><button className={previewSurface === "dark" ? "active" : ""} onClick={() => setPreviewSurface("dark")}>深色</button></div></section>
                {!selected.interactionOnly ? <section className="playback-panel"><small>播放速度</small><div className="speed-control"><button className={!slowIds.has(selected.id) ? "active" : ""} onClick={() => setSlowPlayback(selected.id, false)}>1×</button><button className={slowIds.has(selected.id) ? "active" : ""} onClick={() => setSlowPlayback(selected.id, true)}>0.5×</button></div></section> : <section className="interaction-note"><small>互动方式</small><p>手动切换语言并复制内容，无自动播放。</p></section>}
                {selectedParameterDefinitions.length > 0 ? <section className="parameter-panel"><div className="parameter-title"><small>实时参数</small><button onClick={() => resetParameters(selected.id)}>恢复默认</button></div>{selectedParameterDefinitions.map((definition) => { const value = selectedParameters[definition.id] ?? definition.defaultValue; return <label key={definition.id}><span>{definition.label}<output>{value}{definition.unit}</output></span><input type="range" min={definition.min} max={definition.max} step={definition.step} value={value} onChange={(event) => updateParameter(selected.id, definition.id, Number(event.target.value))} /></label>; })}</section> : <section className="parameter-empty"><small>实时参数</small><p>这个样本目前没有额外参数。</p></section>}
                <section className="detail-meta"><small>推荐场景</small><p>{selected.useCase}</p><small>依赖</small><p>{selected.dependencies.length ? `${selected.engine} · 复制片段时通过版本化 CDN 加载` : "无第三方依赖 · 可离线运行"}</p></section>
                <div className="detail-quick-actions"><button className={favorites.has(selected.id) ? "active" : ""} onClick={() => toggleFavorite(selected.id)}>🤍 {favorites.has(selected.id) ? "已收藏" : "收藏"}</button><button onClick={() => openGlossary(selected.tags[0])}>📖 标签词典</button></div>
              </div>
            </div>
            <div className="dependency-note"><div><small>复制所需</small><b>{selected.dependencies.length ? selected.dependencies.map((dependency) => dependencyLabels[dependency] ?? dependency).join(" + ") : "无需外部库"}</b></div><span>{selected.dependencies.length ? "完整片段会自动加入对应的版本化 CDN" : "复制后可直接在普通 HTML 中运行"}</span></div>
            <div className="code-toolbar"><div>{(["html", "css", "js", "full"] as CodeTab[]).map((tab) => <button className={codeTab === tab ? "active" : ""} onClick={() => setCodeTab(tab)} key={tab}>{tab === "full" ? "完整片段" : tab.toUpperCase()}</button>)}</div><button className="copy-code" onClick={() => copyMotion(selected, currentCode)}>{copied === selected.id ? "✓ 已复制" : "复制当前代码"}</button></div>
            <CodeBlock code={currentCode} />
          </aside>
        </div>
      )}

      {copied && <div className="copy-toast">✓ 代码已进入剪贴板</div>}
      {copyError && <div className="copy-toast copy-toast-error">复制失败，请在代码区域中手动选择</div>}
    </main>
  );
}
