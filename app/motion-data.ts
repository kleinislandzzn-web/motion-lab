export type MotionEngine = "原生" | "Anime.js" | "GSAP";

export type MotionStyle = "editorial" | "terminal" | "glass" | "native" | "soft" | "brutalist";

export type MotionCategory =
  | "按钮"
  | "表单"
  | "导航"
  | "卡片"
  | "反馈"
  | "文字"
  | "布局"
  | "滚动"
  | "图标";

export type MotionParameters = Record<string, number>;

export type MotionParameterDefinition = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  cssVariable: `--ml-${string}`;
};

export type MotionSources = { html: string; css: string; js: string };

export type MotionDefinition = {
  id: string;
  index: string;
  title: string;
  englishTitle: string;
  description: string;
  useCase: string;
  engine: MotionEngine;
  category: MotionCategory;
  style: MotionStyle;
  styleSecondary?: MotionStyle;
  tags: string[];
  dependencies: string[];
  parameters?: MotionParameterDefinition[];
  interactionOnly?: boolean;
  variantKind?: string;
  html: string;
  css: string;
  js: string;
};

type ArchiveVariantSpec = {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  useCase: string;
  category: MotionCategory;
  style: MotionStyle;
  variantKind: string;
  tags: string[];
};

const archiveVariantSpecs: ArchiveVariantSpec[] = [
  { id: "button-border-trace", title: "边框追踪按钮", englishTitle: "BORDER TRACE", description: "指针进入时，细线沿按钮轮廓快速完成一次描边。", useCase: "次级操作、作品集入口", category: "按钮", style: "editorial", variantKind: "border-trace", tags: ["hover", "CTA", "CSS"] },
  { id: "button-arrow-slide", title: "箭头滑入按钮", englishTitle: "ARROW SLIDE", description: "文字轻微让位，箭头从边缘滑入完成操作提示。", useCase: "阅读更多、页面跳转", category: "按钮", style: "native", variantKind: "arrow-slide", tags: ["hover", "CTA", "state"] },
  { id: "button-pixel-dissolve", title: "像素溶解按钮", englishTitle: "PIXEL DISSOLVE", description: "按钮边缘以像素颗粒扩散，点击后重新聚合。", useCase: "实验页面、创意入口", category: "按钮", style: "terminal", variantKind: "pixel-dissolve", tags: ["click", "feedback", "CSS"] },
  { id: "button-hold-progress", title: "长按进度按钮", englishTitle: "HOLD PROGRESS", description: "按住按钮时进度从左向右推进，松开后回退。", useCase: "危险操作、确认提交", category: "按钮", style: "brutalist", variantKind: "hold-progress", tags: ["click", "feedback", "state"] },

  { id: "form-floating-label", title: "浮动标签输入框", englishTitle: "FLOATING LABEL", description: "输入框聚焦后标签收缩并上移，持续保留字段含义。", useCase: "登录、注册、设置表单", category: "表单", style: "native", variantKind: "floating-label", tags: ["focus", "input", "state"] },
  { id: "form-segmented-control", title: "弹性分段选择器", englishTitle: "SEGMENTED CONTROL", description: "选择背景在多个选项间滑动并带有轻微回弹。", useCase: "视图切换、模式选择", category: "表单", style: "soft", variantKind: "segmented-control", tags: ["tabs", "toggle", "spring"] },
  { id: "form-otp-cascade", title: "验证码级联输入", englishTitle: "OTP CASCADE", description: "输入焦点在数字格之间逐步推进，并强调当前位。", useCase: "验证码、安全确认", category: "表单", style: "editorial", variantKind: "otp-cascade", tags: ["input", "focus", "feedback"] },

  { id: "nav-dock-magnify", title: "Dock 放大导航", englishTitle: "DOCK MAGNIFY", description: "指针靠近时相邻导航项按距离连续放大。", useCase: "工具栏、快捷入口", category: "导航", style: "glass", variantKind: "dock-magnify", tags: ["pointer", "navigation", "hover"] },
  { id: "nav-breadcrumb-flow", title: "流动面包屑", englishTitle: "BREADCRUMB FLOW", description: "当前层级高亮沿路径平滑移动，强化位置关系。", useCase: "多层页面、文件路径", category: "导航", style: "editorial", variantKind: "breadcrumb-flow", tags: ["navigation", "indicator", "state"] },
  { id: "nav-radial-menu", title: "径向展开菜单", englishTitle: "RADIAL MENU", description: "主按钮展开为环形快捷入口，再收束回中心。", useCase: "创作工具、移动端快捷操作", category: "导航", style: "soft", variantKind: "radial-menu", tags: ["click", "navigation", "morph"] },
  { id: "nav-page-cursor", title: "页码游标", englishTitle: "PAGE CURSOR", description: "细线游标在页码之间移动，保留清晰的阅读节奏。", useCase: "图集、案例分页", category: "导航", style: "brutalist", variantKind: "page-cursor", tags: ["navigation", "indicator", "click"] },

  { id: "card-corner-reveal", title: "折角揭示卡片", englishTitle: "CORNER REVEAL", description: "悬停后纸张折角打开，露出隐藏信息。", useCase: "作品信息、提示卡", category: "卡片", style: "editorial", variantKind: "corner-reveal", tags: ["hover", "reveal", "card"] },
  { id: "card-orbit-actions", title: "环绕操作卡片", englishTitle: "ORBIT ACTIONS", description: "操作按钮从卡片边缘沿圆弧依次进入。", useCase: "素材管理、快捷操作", category: "卡片", style: "glass", variantKind: "orbit-actions", tags: ["hover", "stagger", "card"] },

  { id: "feedback-progress-ring", title: "弹性进度环", englishTitle: "PROGRESS RING", description: "环形进度追赶目标值，并在完成时轻微呼吸。", useCase: "上传、生成、任务完成度", category: "反馈", style: "native", variantKind: "progress-ring", tags: ["feedback", "state", "number"] },
  { id: "feedback-tooltip-follow", title: "跟随式提示气泡", englishTitle: "FOLLOW TOOLTIP", description: "提示内容跟随焦点出现，并保持克制的距离。", useCase: "图表说明、陌生图标解释", category: "反馈", style: "editorial", variantKind: "tooltip-follow", tags: ["pointer", "hover", "feedback"] },
  { id: "feedback-status-pulse", title: "状态脉冲", englishTitle: "STATUS PULSE", description: "状态点以层叠波纹表达连接、同步与等待。", useCase: "在线状态、连接反馈", category: "反馈", style: "terminal", variantKind: "status-pulse", tags: ["feedback", "state", "CSS"] },
  { id: "feedback-skeleton-wave", title: "骨架加载波", englishTitle: "SKELETON WAVE", description: "柔和扫描带穿过占位内容，表达数据正在加载。", useCase: "列表、图片、内容加载", category: "反馈", style: "soft", variantKind: "skeleton-wave", tags: ["feedback", "loading", "CSS"] },

  { id: "type-split-reveal", title: "分行文字揭示", englishTitle: "SPLIT REVEAL", description: "文字按行从遮罩中依次向上显现。", useCase: "页面标题、章节开场", category: "文字", style: "editorial", variantKind: "split-reveal", tags: ["text", "stagger", "reveal"] },
  { id: "type-caret-write", title: "光标打字机", englishTitle: "CARET WRITER", description: "字符逐个出现，像素光标同步推进。", useCase: "状态说明、生成过程", category: "文字", style: "terminal", variantKind: "caret-writer", tags: ["text", "terminal", "reveal"] },
  { id: "type-marquee-shift", title: "变速跑马灯", englishTitle: "MARQUEE SHIFT", description: "文字带在悬停时改变速度和方向。", useCase: "公告、品牌关键词", category: "文字", style: "brutalist", variantKind: "marquee-shift", tags: ["text", "hover", "CSS"] },
  { id: "type-highlight-sweep", title: "文字高亮扫过", englishTitle: "HIGHLIGHT SWEEP", description: "强调色像选区一样扫过关键短语。", useCase: "重点数据、说明文案", category: "文字", style: "soft", variantKind: "highlight-sweep", tags: ["text", "reveal", "state"] },

  { id: "layout-accordion-flow", title: "手风琴内容流", englishTitle: "ACCORDION FLOW", description: "展开一个条目时，其余内容平滑让位。", useCase: "FAQ、设置分组", category: "布局", style: "editorial", variantKind: "accordion-flow", tags: ["layout", "click", "state"] },
  { id: "layout-masonry-shuffle", title: "瀑布流洗牌", englishTitle: "MASONRY SHUFFLE", description: "不同尺寸的块在排序后沿原位置重新排列。", useCase: "灵感墙、图片集合", category: "布局", style: "soft", variantKind: "masonry-shuffle", tags: ["grid", "reorder", "layout"] },
  { id: "layout-carousel-depth", title: "景深轮播", englishTitle: "DEPTH CAROUSEL", description: "前后卡片以缩放和位移建立层级。", useCase: "精选内容、封面浏览", category: "布局", style: "glass", variantKind: "carousel-depth", tags: ["layout", "navigation", "depth"] },
  { id: "layout-expand-grid", title: "网格聚焦展开", englishTitle: "FOCUS GRID", description: "选中项扩大，其余单元自动压缩并保持秩序。", useCase: "作品集、数据概览", category: "布局", style: "brutalist", variantKind: "expand-grid", tags: ["grid", "click", "layout"] },

  { id: "scroll-progress-rail", title: "滚动进度轨", englishTitle: "PROGRESS RAIL", description: "细线跟随阅读进度推进，并标记当前章节。", useCase: "长文、产品叙事", category: "滚动", style: "editorial", variantKind: "progress-rail", tags: ["scroll", "indicator", "story"] },
  { id: "scroll-horizontal-gallery", title: "横向画廊映射", englishTitle: "HORIZONTAL GALLERY", description: "纵向滚动映射为横向内容位移。", useCase: "作品展示、时间线", category: "滚动", style: "native", variantKind: "horizontal-gallery", tags: ["scroll", "layout", "story"] },
  { id: "scroll-chapter-pin", title: "章节吸顶切换", englishTitle: "CHAPTER PIN", description: "章节标题保持固定，正文在其下方连续替换。", useCase: "专题、功能介绍", category: "滚动", style: "brutalist", variantKind: "chapter-pin", tags: ["scroll", "story", "state"] },
  { id: "scroll-parallax-type", title: "文字视差滚动", englishTitle: "TYPE PARALLAX", description: "不同字层以差异速度移动，形成轻量空间感。", useCase: "品牌首屏、章节过渡", category: "滚动", style: "soft", variantKind: "parallax-type", tags: ["scroll", "text", "depth"] },
  { id: "scroll-image-wipe", title: "图像擦除切换", englishTitle: "IMAGE WIPE", description: "滚动进度推动遮罩，逐步显露下一层画面。", useCase: "对比展示、故事转场", category: "滚动", style: "glass", variantKind: "image-wipe", tags: ["scroll", "reveal", "story"] },

  { id: "icon-ring-meter", title: "环形进度图标", englishTitle: "RING METER", description: "环形轨道循环追赶目标值，并在完成时轻微收束。", useCase: "完成度、上传进度、任务状态", category: "图标", style: "native", variantKind: "ring-meter", tags: ["indicator", "state", "number"] },
  { id: "icon-growth-curve", title: "增长曲线图标", englishTitle: "GROWTH CURVE", description: "折线从左向右逐段生长，关键节点依次被点亮。", useCase: "趋势摘要、增长数据、报告卡片", category: "图标", style: "editorial", variantKind: "growth-curve", tags: ["dashboard", "number", "reveal"] },
  { id: "icon-radar-scan", title: "雷达扫描图标", englishTitle: "RADAR SCAN", description: "扫描扇区环绕网格旋转，数据点随扫描被短暂激活。", useCase: "检测、搜索、实时状态", category: "图标", style: "terminal", variantKind: "radar-scan", tags: ["indicator", "state", "CSS"] },
  { id: "icon-bar-rise", title: "柱状增长图标", englishTitle: "BAR RISE", description: "多根柱体按照顺序上升，再回落至基础状态。", useCase: "数据概览、业绩变化、统计入口", category: "图标", style: "brutalist", variantKind: "bar-rise", tags: ["dashboard", "number", "CSS"] },
  { id: "icon-pulse-signal", title: "脉冲信号图标", englishTitle: "PULSE SIGNAL", description: "脉冲线由左向右展开，强调瞬时变化与活跃状态。", useCase: "健康数据、音频状态、实时监控", category: "图标", style: "glass", variantKind: "pulse-signal", tags: ["feedback", "state", "CSS"] },
  { id: "icon-orbit-metric", title: "轨道指标图标", englishTitle: "ORBIT METRIC", description: "多个指标点沿同心轨道错速运行，形成持续的数据活力。", useCase: "系统概览、处理中状态、智能功能", category: "图标", style: "soft", variantKind: "orbit-metric", tags: ["indicator", "dashboard", "CSS"] },
];

const archiveFamilyClass: Record<MotionCategory, string> = {
  按钮: "button",
  表单: "form",
  导航: "navigation",
  卡片: "card",
  反馈: "feedback",
  文字: "type",
  布局: "layout",
  滚动: "scroll",
  图标: "icon",
};

const archiveVariantCss = `.ml-archive-variant{--variant-x:50%;--variant-y:50%;position:relative;box-sizing:border-box;display:grid;place-items:center;width:min(282px,100%);height:184px;overflow:hidden;padding:15px;border:0;border-radius:var(--ml-radius);background:var(--ml-bg);color:var(--ml-fg);cursor:pointer;filter:saturate(var(--ml-variant-intensity,100%))}.ml-archive-variant *{box-sizing:border-box}.ml-variant-visual{position:relative;width:100%;height:120px}.ml-variant-visual i,.ml-variant-visual span{position:absolute;display:block;transition:transform .5s cubic-bezier(.2,.9,.2,1),opacity .35s,width .5s,background .35s}.ml-variant-visual i{width:12px;height:12px;border:1px solid var(--ml-accent)}.ml-variant-visual i:nth-child(1){left:22%;top:32%}.ml-variant-visual i:nth-child(2){left:40%;top:32%}.ml-variant-visual i:nth-child(3){left:58%;top:32%}.ml-variant-visual i:nth-child(4){left:76%;top:32%}.ml-variant-visual span{left:20%;right:20%;bottom:18px;height:2px;background:color-mix(in srgb,var(--ml-fg) 18%,transparent)}.ml-archive-variant.ml-active .ml-variant-visual i:nth-child(odd){transform:translateY(-9px) rotate(45deg)}.ml-archive-variant.ml-active .ml-variant-visual i:nth-child(even){transform:translateY(9px) rotate(-45deg)}
.ml-family-button .ml-variant-visual{display:grid;place-items:center}.ml-family-button .ml-variant-visual span{inset:27px 22% auto;height:38px;border:1px solid var(--ml-fg);border-radius:999px;background:color-mix(in srgb,var(--ml-accent) 6%,transparent)}.ml-family-button .ml-variant-visual i{z-index:2;top:40px;width:5px;height:5px;border:0;background:var(--ml-accent)}.ml-border-trace .ml-variant-visual span{border-color:var(--ml-accent);border-style:dashed}.ml-arrow-slide .ml-variant-visual i{left:68%;width:11px;height:1px}.ml-arrow-slide.ml-active .ml-variant-visual i{transform:translateX(12px)}.ml-pixel-dissolve .ml-variant-visual i{border-radius:0}.ml-pixel-dissolve.ml-active .ml-variant-visual i:nth-child(1){transform:translate(-22px,-12px)}.ml-pixel-dissolve.ml-active .ml-variant-visual i:nth-child(4){transform:translate(22px,12px)}.ml-hold-progress .ml-variant-visual span{overflow:hidden;border-radius:0}.ml-hold-progress .ml-variant-visual span::after{content:"";position:absolute;inset:0;width:12%;background:var(--ml-accent);transition:width 1.2s linear}.ml-hold-progress.ml-active .ml-variant-visual span::after{width:100%}
.ml-family-form .ml-variant-visual span{inset:24px 13% auto;height:44px;border:1px solid color-mix(in srgb,var(--ml-fg) 32%,transparent);border-radius:8px;background:transparent}.ml-family-form .ml-variant-visual i{top:39px;width:28px;height:4px;border:0;border-radius:99px;background:color-mix(in srgb,var(--ml-fg) 18%,transparent)}.ml-floating-label .ml-variant-visual i:first-child{left:20%;width:52px;background:var(--ml-accent)}.ml-floating-label.ml-active .ml-variant-visual i:first-child{transform:translateY(-17px) scale(.72);transform-origin:left}.ml-segmented-control .ml-variant-visual span{border-radius:999px}.ml-segmented-control .ml-variant-visual span::after{content:"";position:absolute;top:4px;bottom:4px;left:4px;width:31%;border-radius:99px;background:var(--ml-accent);transition:transform .55s cubic-bezier(.2,1.3,.3,1)}.ml-segmented-control.ml-active .ml-variant-visual span::after{transform:translateX(195%)}.ml-otp-cascade .ml-variant-visual span{display:none}.ml-otp-cascade .ml-variant-visual i{top:30px;width:28px;height:36px;border-color:color-mix(in srgb,var(--ml-fg) 25%,transparent)}.ml-otp-cascade.ml-active .ml-variant-visual i:nth-child(3){border-color:var(--ml-accent);transform:translateY(-4px)}
.ml-family-navigation .ml-variant-visual i{top:34px;width:28px;height:28px;border-radius:7px;background:color-mix(in srgb,var(--ml-accent) 8%,transparent)}.ml-family-navigation.ml-active .ml-variant-visual i:nth-child(2),.ml-family-navigation.ml-active .ml-variant-visual i:nth-child(3){transform:translateY(-10px) scale(1.35);background:color-mix(in srgb,var(--ml-accent) 22%,transparent)}.ml-breadcrumb-flow .ml-variant-visual i{top:44px;width:34px;height:1px;border:0;background:color-mix(in srgb,var(--ml-fg) 26%,transparent)}.ml-breadcrumb-flow.ml-active .ml-variant-visual i:nth-child(3){height:2px;transform:none;background:var(--ml-accent)}.ml-radial-menu .ml-variant-visual i{left:48%;top:41%;border-radius:50%}.ml-radial-menu.ml-active .ml-variant-visual i:nth-child(1){transform:translate(-42px,0)}.ml-radial-menu.ml-active .ml-variant-visual i:nth-child(2){transform:translate(-15px,-30px)}.ml-radial-menu.ml-active .ml-variant-visual i:nth-child(3){transform:translate(15px,-30px)}.ml-radial-menu.ml-active .ml-variant-visual i:nth-child(4){transform:translate(42px,0)}.ml-page-cursor .ml-variant-visual span{bottom:22px;height:1px}.ml-page-cursor .ml-variant-visual span::after{content:"";position:absolute;left:0;top:-2px;width:24%;height:4px;background:var(--ml-accent);transition:transform .5s}.ml-page-cursor.ml-active .ml-variant-visual span::after{transform:translateX(315%)}
.ml-family-card .ml-variant-visual span{inset:8px 27% 8px;height:auto;border:1px solid color-mix(in srgb,var(--ml-fg) 25%,transparent);border-radius:10px;background:color-mix(in srgb,var(--ml-fg) 4%,transparent)}.ml-family-card .ml-variant-visual i{z-index:2;width:7px;height:7px;border-radius:50%}.ml-corner-reveal .ml-variant-visual span::after{content:"";position:absolute;right:0;top:0;width:0;height:0;border-style:solid;border-width:0 0 24px 24px;border-color:transparent transparent color-mix(in srgb,var(--ml-accent) 36%,white) transparent;transition:transform .45s}.ml-corner-reveal.ml-active .ml-variant-visual span::after{transform:scale(1.8);transform-origin:top right}.ml-orbit-actions.ml-active .ml-variant-visual i:nth-child(1){transform:translate(-30px,-20px)}.ml-orbit-actions.ml-active .ml-variant-visual i:nth-child(2){transform:translate(-18px,24px)}.ml-orbit-actions.ml-active .ml-variant-visual i:nth-child(3){transform:translate(18px,24px)}.ml-orbit-actions.ml-active .ml-variant-visual i:nth-child(4){transform:translate(30px,-20px)}
.ml-family-feedback .ml-variant-visual i{border-radius:50%;left:calc(50% - 18px);top:25px;width:36px;height:36px}.ml-family-feedback .ml-variant-visual i:not(:first-child){opacity:.2}.ml-progress-ring .ml-variant-visual i{opacity:1}.ml-progress-ring .ml-variant-visual i:first-child{border-color:color-mix(in srgb,var(--ml-fg) 16%,transparent)}.ml-progress-ring .ml-variant-visual i:nth-child(2){opacity:1;border-color:var(--ml-accent);border-left-color:transparent;transform:rotate(-45deg)}.ml-progress-ring .ml-variant-visual i:nth-child(n+3){display:none}.ml-progress-ring.ml-active .ml-variant-visual i:nth-child(2){transform:rotate(275deg) scale(1.05)}.ml-progress-ring .ml-variant-visual span{left:calc(50% - 2px);right:auto;top:41px;bottom:auto;width:4px;height:4px;border-radius:50%;background:var(--ml-accent)}.ml-tooltip-follow .ml-variant-visual span{left:var(--variant-x);right:auto;bottom:auto;top:var(--variant-y);width:72px;height:24px;border:1px solid var(--ml-accent);border-radius:5px;background:var(--ml-bg);transform:translate(-50%,-120%)}.ml-tooltip-follow .ml-variant-visual i{left:calc(50% - 3px);top:42px;width:6px;height:6px;opacity:.28;border:0;background:var(--ml-accent)}.ml-status-pulse .ml-variant-visual i:first-child{z-index:2;left:calc(50% - 6px);top:37px;width:12px;height:12px;border:0;background:var(--ml-accent)}.ml-status-pulse.ml-active .ml-variant-visual i:first-child{transform:none}.ml-status-pulse.ml-active .ml-variant-visual i:nth-child(2){transform:scale(1.65);opacity:.16}.ml-status-pulse.ml-active .ml-variant-visual i:nth-child(3){transform:scale(2.35);opacity:0}.ml-skeleton-wave .ml-variant-visual i{left:16%;width:68%;height:8px;border:0;border-radius:99px;background:color-mix(in srgb,var(--ml-fg) 10%,transparent)}.ml-skeleton-wave .ml-variant-visual i:nth-child(1){top:18px}.ml-skeleton-wave .ml-variant-visual i:nth-child(2){top:36px;width:52%}.ml-skeleton-wave .ml-variant-visual i:nth-child(3){top:54px;width:62%}.ml-skeleton-wave .ml-variant-visual i:nth-child(4){top:72px;width:40%}.ml-skeleton-wave.ml-active .ml-variant-visual i{transform:translateX(12px);background:color-mix(in srgb,var(--ml-accent) 18%,transparent)}
.ml-family-type .ml-variant-visual i{left:12%;width:76%;height:9px;border:0;background:color-mix(in srgb,var(--ml-fg) 15%,transparent)}.ml-family-type .ml-variant-visual i:nth-child(1){top:16px}.ml-family-type .ml-variant-visual i:nth-child(2){top:34px;width:61%}.ml-family-type .ml-variant-visual i:nth-child(3){top:52px;width:70%}.ml-family-type .ml-variant-visual i:nth-child(4){top:70px;width:44%}.ml-family-type.ml-active .ml-variant-visual i{transform:translateX(10px);background:var(--ml-accent)}.ml-split-reveal .ml-variant-visual{overflow:hidden}.ml-split-reveal .ml-variant-visual i{transform:translateY(18px);opacity:0}.ml-split-reveal.ml-active .ml-variant-visual i{transform:translateY(0);opacity:1}.ml-caret-writer .ml-variant-visual span{left:16%;right:auto;bottom:18px;width:2px;height:56px;background:var(--ml-accent);animation:ml-caret-blink .8s steps(1) infinite}.ml-marquee-shift.ml-active .ml-variant-visual i{transform:translateX(-28px)}.ml-highlight-sweep .ml-variant-visual span{inset:30px auto auto 12%;width:0;height:28px;background:color-mix(in srgb,var(--ml-accent) 26%,transparent)}.ml-highlight-sweep.ml-active .ml-variant-visual span{width:76%}
.ml-family-layout .ml-variant-visual{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;padding:8px 18%;transition:grid-template-columns .5s,grid-template-rows .5s}.ml-family-layout .ml-variant-visual i{position:relative;inset:auto;width:auto;height:auto;min-height:34px;background:color-mix(in srgb,var(--ml-accent) 10%,transparent)}.ml-accordion-flow .ml-variant-visual{grid-template-columns:1fr}.ml-accordion-flow .ml-variant-visual i{min-height:14px}.ml-accordion-flow.ml-active .ml-variant-visual i:nth-child(2){min-height:42px}.ml-masonry-shuffle .ml-variant-visual i:nth-child(1),.ml-masonry-shuffle .ml-variant-visual i:nth-child(4){min-height:47px}.ml-masonry-shuffle.ml-active .ml-variant-visual i:nth-child(1){transform:translate(105%,0)}.ml-masonry-shuffle.ml-active .ml-variant-visual i:nth-child(2){transform:translate(-105%,0)}.ml-masonry-shuffle.ml-active .ml-variant-visual i:nth-child(3){transform:translate(105%,0)}.ml-masonry-shuffle.ml-active .ml-variant-visual i:nth-child(4){transform:translate(-105%,0)}.ml-carousel-depth .ml-variant-visual{display:block}.ml-carousel-depth .ml-variant-visual i{position:absolute;top:19px;width:72px;height:58px;border-radius:8px;background:var(--ml-bg)}.ml-carousel-depth .ml-variant-visual i:nth-child(1){left:20%}.ml-carousel-depth .ml-variant-visual i:nth-child(2){left:38%;z-index:2}.ml-carousel-depth .ml-variant-visual i:nth-child(3){left:56%}.ml-carousel-depth .ml-variant-visual i:nth-child(4){display:none}.ml-carousel-depth.ml-active .ml-variant-visual i:nth-child(1){transform:translateX(-10px) scale(.88);opacity:.6}.ml-carousel-depth.ml-active .ml-variant-visual i:nth-child(2){transform:translateY(-6px) scale(1.12)}.ml-carousel-depth.ml-active .ml-variant-visual i:nth-child(3){transform:translateX(10px) scale(.88);opacity:.6}.ml-expand-grid.ml-active .ml-variant-visual{grid-template-columns:1.45fr .55fr;grid-template-rows:1.45fr .55fr}
.ml-family-scroll .ml-variant-visual i{top:12px;width:42px;height:70px;border:0;background:color-mix(in srgb,var(--ml-fg) 8%,transparent)}.ml-family-scroll.ml-active .ml-variant-visual i{transform:translateY(-13px)}.ml-family-scroll .ml-variant-visual span{left:12%;right:auto;bottom:8px;width:2px;height:76px;background:color-mix(in srgb,var(--ml-fg) 14%,transparent)}.ml-family-scroll .ml-variant-visual span::after{content:"";position:absolute;inset:0 0 auto;width:2px;height:35%;background:var(--ml-accent);transition:height .6s}.ml-family-scroll.ml-active .ml-variant-visual span::after{height:100%}.ml-progress-rail .ml-variant-visual i{left:28%;width:55%;height:8px;border:1px solid color-mix(in srgb,var(--ml-fg) 16%,transparent);background:transparent}.ml-progress-rail .ml-variant-visual i:nth-child(1){top:15px}.ml-progress-rail .ml-variant-visual i:nth-child(2){top:38px}.ml-progress-rail .ml-variant-visual i:nth-child(3){top:61px}.ml-progress-rail .ml-variant-visual i:nth-child(4){display:none}.ml-progress-rail.ml-active .ml-variant-visual i{transform:none}.ml-progress-rail.ml-active .ml-variant-visual i:nth-child(2){border-color:var(--ml-accent);background:color-mix(in srgb,var(--ml-accent) 14%,transparent)}.ml-horizontal-gallery.ml-active .ml-variant-visual i{transform:translateX(-25px)}.ml-chapter-pin .ml-variant-visual i:first-child{background:var(--ml-accent)}.ml-parallax-type .ml-variant-visual i:nth-child(even){width:64px}.ml-parallax-type.ml-active .ml-variant-visual i:nth-child(even){transform:translateY(-22px)}.ml-image-wipe .ml-variant-visual i{width:68px;background:color-mix(in srgb,var(--ml-accent) 12%,transparent);clip-path:inset(0 100% 0 0)}.ml-image-wipe.ml-active .ml-variant-visual i{transform:none;clip-path:inset(0);transition:clip-path .65s}
.ml-family-icon .ml-variant-visual{width:150px;margin:auto}.ml-family-icon .ml-variant-visual i{border:0;background:var(--ml-accent);transform:none}.ml-family-icon .ml-variant-visual span{background:transparent}.ml-ring-meter .ml-variant-visual span{left:39px;right:auto;top:10px;bottom:auto;width:72px;height:72px;border-radius:50%;background:conic-gradient(var(--ml-accent) 0 74%,color-mix(in srgb,var(--ml-fg) 12%,transparent) 74%);mask:radial-gradient(circle,transparent 55%,#000 57%)}.ml-ring-meter .ml-variant-visual i:first-child{left:71px;top:42px;width:8px;height:8px;border-radius:50%}.ml-ring-meter .ml-variant-visual i:nth-child(n+2){display:none}.ml-ring-meter.ml-active .ml-variant-visual span{transform:rotate(360deg) scale(1.04)}
.ml-growth-curve .ml-variant-visual span,.ml-pulse-signal .ml-variant-visual span{inset:14px 8px 20px;height:auto;background:var(--ml-accent);clip-path:polygon(0 91%,27% 69%,50% 75%,74% 37%,100% 10%,100% 17%,75% 46%,51% 84%,28% 78%,0 100%);transform:scaleX(1);transform-origin:left center}.ml-growth-curve .ml-variant-visual i{width:7px;height:7px;border-radius:50%}.ml-growth-curve .ml-variant-visual i:nth-child(1){left:7px;top:70px}.ml-growth-curve .ml-variant-visual i:nth-child(2){left:45px;top:54px}.ml-growth-curve .ml-variant-visual i:nth-child(3){left:82px;top:58px}.ml-growth-curve .ml-variant-visual i:nth-child(4){left:135px;top:19px}.ml-growth-curve.ml-active .ml-variant-visual span,.ml-pulse-signal.ml-active .ml-variant-visual span{transform:scaleX(.08)}.ml-growth-curve.ml-active .ml-variant-visual i{transform:scale(1.35);box-shadow:0 0 0 5px color-mix(in srgb,var(--ml-accent) 14%,transparent)}
.ml-radar-scan .ml-variant-visual span{left:35px;right:auto;top:6px;bottom:auto;width:80px;height:80px;border:1px solid color-mix(in srgb,var(--ml-fg) 20%,transparent);border-radius:50%;background:radial-gradient(circle,transparent 0 31%,color-mix(in srgb,var(--ml-fg) 18%,transparent) 32% 33%,transparent 34% 64%,color-mix(in srgb,var(--ml-fg) 18%,transparent) 65% 66%,transparent 67%),conic-gradient(from 0deg,color-mix(in srgb,var(--ml-accent) 48%,transparent),transparent 25%)}.ml-radar-scan .ml-variant-visual i{width:5px;height:5px;border-radius:50%}.ml-radar-scan .ml-variant-visual i:nth-child(1){left:59px;top:28px}.ml-radar-scan .ml-variant-visual i:nth-child(2){left:94px;top:49px}.ml-radar-scan .ml-variant-visual i:nth-child(3){left:68px;top:67px}.ml-radar-scan .ml-variant-visual i:nth-child(4){display:none}.ml-radar-scan.ml-active .ml-variant-visual span{transform:rotate(300deg)}.ml-radar-scan.ml-active .ml-variant-visual i{box-shadow:0 0 10px var(--ml-accent)}
.ml-bar-rise .ml-variant-visual{border-bottom:1px solid color-mix(in srgb,var(--ml-fg) 22%,transparent)}.ml-bar-rise .ml-variant-visual i{top:auto;bottom:0;width:20px;transform:scaleY(1);transform-origin:center bottom}.ml-bar-rise .ml-variant-visual i:nth-child(1){left:17px;height:36px}.ml-bar-rise .ml-variant-visual i:nth-child(2){left:50px;height:58px}.ml-bar-rise .ml-variant-visual i:nth-child(3){left:83px;height:76px}.ml-bar-rise .ml-variant-visual i:nth-child(4){left:116px;height:94px}.ml-bar-rise.ml-active .ml-variant-visual i{transform:scaleY(.24)}.ml-bar-rise.ml-active .ml-variant-visual i:nth-child(2){transition-delay:.08s}.ml-bar-rise.ml-active .ml-variant-visual i:nth-child(3){transition-delay:.16s}.ml-bar-rise.ml-active .ml-variant-visual i:nth-child(4){transition-delay:.24s}
.ml-pulse-signal .ml-variant-visual span{inset:22px 5px 22px;clip-path:polygon(0 48%,24% 48%,31% 18%,41% 82%,50% 40%,58% 58%,66% 48%,100% 48%,100% 53%,68% 53%,58% 65%,51% 48%,41% 92%,31% 30%,26% 53%,0 53%)}.ml-pulse-signal .ml-variant-visual i{display:none}.ml-pulse-signal.ml-active .ml-variant-visual span{filter:drop-shadow(0 0 7px var(--ml-accent))}
.ml-orbit-metric .ml-variant-visual span{left:37px;right:auto;top:8px;bottom:auto;width:76px;height:76px;border:1px solid color-mix(in srgb,var(--ml-fg) 18%,transparent);border-radius:50%}.ml-orbit-metric .ml-variant-visual span::after{content:"";position:absolute;inset:14px;border:1px solid color-mix(in srgb,var(--ml-fg) 18%,transparent);border-radius:50%}.ml-orbit-metric .ml-variant-visual i{left:71px;top:42px;width:8px;height:8px;border-radius:50%;transform-origin:4px 4px}.ml-orbit-metric .ml-variant-visual i:nth-child(2){opacity:.72}.ml-orbit-metric .ml-variant-visual i:nth-child(3){opacity:.48}.ml-orbit-metric .ml-variant-visual i:nth-child(4){opacity:.28}.ml-orbit-metric.ml-active .ml-variant-visual i:nth-child(1){transform:rotate(210deg) translateX(38px)}.ml-orbit-metric.ml-active .ml-variant-visual i:nth-child(2){transform:rotate(-160deg) translateX(38px)}.ml-orbit-metric.ml-active .ml-variant-visual i:nth-child(3){transform:rotate(280deg) translateX(24px)}.ml-orbit-metric.ml-active .ml-variant-visual i:nth-child(4){transform:rotate(-250deg) translateX(24px)}
@keyframes ml-caret-blink{50%{opacity:0}}`;

const archiveVariants: MotionDefinition[] = archiveVariantSpecs.map((spec, index) => ({
  ...spec,
  index: String(index + 19).padStart(2, "0"),
  engine: "原生",
  dependencies: [],
  parameters: [{ id: "intensity", label: "动效强度", min: 40, max: 140, step: 10, defaultValue: 100, unit: "%", cssVariable: "--ml-variant-intensity" }],
  html: `<button class="ml-archive-variant ml-family-${archiveFamilyClass[spec.category]} ml-${spec.variantKind}" aria-label="${spec.englishTitle}"><span class="ml-variant-visual" aria-hidden="true"><i></i><i></i><i></i><i></i><span></span></span></button>`,
  css: archiveVariantCss,
  js: `root.addEventListener('click',()=>root.classList.toggle('ml-active'));root.addEventListener('pointermove',event=>{const rect=root.getBoundingClientRect();root.style.setProperty('--variant-x',(event.clientX-rect.left)/rect.width*100+'%');root.style.setProperty('--variant-y',(event.clientY-rect.top)/rect.height*100+'%')});`,
}));

const GSAP = '<script data-ml-dependency="gsap" src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"><\/script>';
const GSAP_FLIP = '<script data-ml-dependency="gsap-flip" src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Flip.min.js"><\/script>';
const GSAP_DRAGGABLE = '<script data-ml-dependency="gsap-draggable" src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Draggable.min.js"><\/script>';
const GSAP_SCROLL = '<script data-ml-dependency="gsap-scrolltrigger" src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"><\/script>';
const ANIME = '<script data-ml-dependency="anime" src="https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.umd.min.js"><\/script>';

export const dependencyScripts: Record<string, string> = {
  gsap: GSAP,
  flip: GSAP_FLIP,
  draggable: GSAP_DRAGGABLE,
  scrollTrigger: GSAP_SCROLL,
  anime: ANIME,
};

export const motionStyleTokens: Record<MotionStyle, { bg: string; fg: string; accent: string; radius: string; border: string }> = {
  editorial: { bg: "#F5F5F2", fg: "#0A0A0A", accent: "#007AFF", radius: "0px", border: "1px solid #0A0A0A" },
  terminal: { bg: "#07110C", fg: "#E4EEE7", accent: "#B7FF3C", radius: "0px", border: "1px solid #395744" },
  glass: { bg: "#171A20", fg: "#F7F8FB", accent: "#A8C7FF", radius: "18px", border: "1px solid rgba(255,255,255,.25)" },
  native: { bg: "#F1F2F4", fg: "#111216", accent: "#007AFF", radius: "18px", border: "1px solid #C7CAD0" },
  soft: { bg: "#F2EEE8", fg: "#292622", accent: "#8A67D5", radius: "24px", border: "1px solid #CFC3DE" },
  brutalist: { bg: "#FFFFFF", fg: "#000000", accent: "#FF3B30", radius: "0px", border: "2px solid #000000" },
};

function dedent(value: string) {
  const lines = value.replace(/^\n+|\n+$/g, "").split("\n");
  const indentation = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0));
  return lines.map((line) => line.slice(indentation)).join("\n");
}

function resolveParameters(motion: MotionDefinition, parameters: MotionParameters) {
  return Object.fromEntries((motion.parameters ?? []).map((parameter) => [
    parameter.id,
    parameters[parameter.id] ?? parameter.defaultValue,
  ])) as MotionParameters;
}

function buildHtml(motion: MotionDefinition, parameters: MotionParameters) {
  const variables = (motion.parameters ?? [])
    .map((parameter) => `${parameter.cssVariable}:${parameters[parameter.id]}${parameter.unit === "×" ? "" : parameter.unit}`)
    .join(";");
  const attributes = ` data-ml-motion="${motion.id}"${variables ? ` style="${variables}"` : ""}`;
  return motion.html.replace(/^<([a-z][a-z0-9-]*)/i, `<$1${attributes}`);
}

function buildJavascript(motion: MotionDefinition) {
  const code = dedent(motion.js).split("\n").map((line) => `    ${line}`).join("\n");
  return `(() => {
  const selector = '[data-ml-motion="${motion.id}"]';
  document.querySelectorAll(selector).forEach((root) => {
    if (root.dataset.mlReady === "true") return;
    root.dataset.mlReady = "true";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
${code}
  });
})();`;
}

export function getMotionSources(motion: MotionDefinition, parameters: MotionParameters = {}): MotionSources {
  const resolvedParameters = resolveParameters(motion, parameters);
  const style = motionStyleTokens[motion.style];
  const styleTokenCss = `[data-ml-motion="${motion.id}"]{--ml-bg:${style.bg};--ml-fg:${style.fg};--ml-accent:${style.accent};--ml-radius:${style.radius};--ml-border:${style.border}}`;
  const reducedMotionCss = `@media (prefers-reduced-motion: reduce){[data-ml-motion="${motion.id}"],[data-ml-motion="${motion.id}"] *{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}`;
  return {
    html: buildHtml(motion, resolvedParameters),
    css: `${styleTokenCss}\n${dedent(motion.css)}\n${reducedMotionCss}`,
    js: buildJavascript(motion),
  };
}

export function getFullSnippet(motion: MotionDefinition, parameters: MotionParameters = {}) {
  const resolvedParameters = resolveParameters(motion, parameters);
  const { html, css, js } = getMotionSources(motion, resolvedParameters);
  const deps = [...new Set(motion.dependencies)].map((name) => dependencyScripts[name]).filter(Boolean).join("\n");
  const snapshot = JSON.stringify(resolvedParameters);
  return `<!-- Motion Lab · ${motion.title}\n     style: ${motion.style}${motion.styleSecondary ? ` / ${motion.styleSecondary}` : ""}\n     parameters: ${snapshot}\n     dependencies: ${motion.dependencies.length ? motion.dependencies.join(", ") : "none"} -->\n${html}\n\n<style data-motion-lab="${motion.id}">\n${css}\n</style>${deps ? `\n\n${deps}` : ""}\n\n<script>\n${js}\n<\/script>`;
}

export const motions: MotionDefinition[] = [
  {
    id: "magnetic-cta",
    index: "01",
    title: "磁吸 CTA 按钮",
    englishTitle: "MAGNETIC CTA",
    description: "按钮会被指针轻微吸引，离开时自然回弹。",
    useCase: "关键行动按钮、营销页入口",
    engine: "原生",
    category: "按钮",
    style: "soft",
    tags: ["pointer", "spring", "CTA"],
    dependencies: [],
    parameters: [
      { id: "strength", label: "磁吸强度", min: 5, max: 35, step: 1, defaultValue: 18, unit: "%", cssVariable: "--ml-magnetic-strength" },
      { id: "returnDuration", label: "回弹时间", min: 150, max: 900, step: 50, defaultValue: 450, unit: "ms", cssVariable: "--ml-magnetic-return" },
    ],
    html: '<button class="ml-magnetic"><span>立即探索</span><b>↗</b></button>',
    css: `.ml-magnetic{--x:0px;--y:0px;display:inline-flex;gap:28px;align-items:center;padding:16px 18px 16px 22px;border:1px solid #b8ff38;background:#b8ff38;color:#07110d;font:700 14px ui-monospace,monospace;transform:translate(var(--x),var(--y));transition:transform var(--ml-magnetic-return,450ms) cubic-bezier(.2,1.5,.3,1),box-shadow .25s;box-shadow:0 0 0 rgba(184,255,56,0)}.ml-magnetic:hover{box-shadow:0 10px 35px rgba(184,255,56,.22)}.ml-magnetic b{font-size:18px}`,
    js: `const button=root,style=getComputedStyle(button),strength=(parseFloat(style.getPropertyValue('--ml-magnetic-strength'))||18)/100;
button.addEventListener('pointermove',e=>{if(reduceMotion)return;const r=button.getBoundingClientRect();button.style.setProperty('--x',(e.clientX-r.left-r.width/2)*strength+'px');button.style.setProperty('--y',(e.clientY-r.top-r.height/2)*strength+'px')});
button.addEventListener('pointerleave',()=>{button.style.setProperty('--x','0px');button.style.setProperty('--y','0px')});`,
  },
  {
    id: "liquid-toggle",
    index: "02",
    title: "液态开关",
    englishTitle: "LIQUID TOGGLE",
    description: "带有黏滞拉伸感的状态切换，适合强化设置反馈。",
    useCase: "设置项、模式开关",
    engine: "原生",
    category: "表单",
    style: "native",
    styleSecondary: "glass",
    tags: ["toggle", "morph", "CSS"],
    dependencies: [],
    parameters: [
      { id: "duration", label: "切换时间", min: 200, max: 1000, step: 50, defaultValue: 550, unit: "ms", cssVariable: "--ml-liquid-duration" },
    ],
    html: '<label class="ml-liquid"><input type="checkbox"><span><i></i></span><em>ENERGY MODE</em></label>',
    css: `.ml-liquid{display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;color:#dce9df;font:12px ui-monospace,monospace}.ml-liquid input{position:absolute;opacity:0}.ml-liquid span{width:78px;height:38px;padding:4px;border:1px solid #466052;border-radius:99px;background:#101d17;cursor:pointer}.ml-liquid i{display:block;width:28px;height:28px;border-radius:50%;background:#718077;transition:var(--ml-liquid-duration,550ms) cubic-bezier(.2,1.5,.3,1)}.ml-liquid input:checked+span{border-color:#b8ff38;box-shadow:inset 0 0 18px rgba(184,255,56,.15)}.ml-liquid input:checked+span i{transform:translateX(40px) scaleX(1.12);background:#b8ff38;box-shadow:0 0 22px #b8ff38}.ml-liquid em{font-style:normal;color:#768b7e}.ml-liquid input:checked~em{color:#b8ff38}`,
    js: `const input=root.querySelector('input');input.addEventListener('change',e=>console.log('energy mode:',e.target.checked));`,
  },
  {
    id: "ripple-success",
    index: "03",
    title: "点击涟漪与成功态",
    englishTitle: "RIPPLE SUCCESS",
    description: "点击位置生成涟漪，随后按钮收束为完成状态。",
    useCase: "提交、保存、支付确认",
    engine: "原生",
    category: "按钮",
    style: "soft",
    styleSecondary: "native",
    tags: ["click", "feedback", "state"],
    dependencies: [],
    html: '<button class="ml-ripple"><span>发送指令</span></button>',
    css: `.ml-ripple{position:relative;overflow:hidden;min-width:150px;padding:14px 24px;border:1px solid #ffb454;background:#171711;color:#ffcc88;font:700 13px ui-monospace,monospace;transition:.35s}.ml-ripple i{position:absolute;width:10px;height:10px;border-radius:50%;background:#ffb454;transform:translate(-50%,-50%) scale(0);animation:ml-ripple .55s ease-out}.ml-ripple.ml-done{color:#07110d;background:#b8ff38;border-color:#b8ff38}@keyframes ml-ripple{to{transform:translate(-50%,-50%) scale(22);opacity:0}}`,
    js: `const button=root;button.addEventListener('click',e=>{if(button.classList.contains('ml-done'))return;const r=button.getBoundingClientRect(),wave=document.createElement('i');wave.style.left=e.clientX-r.left+'px';wave.style.top=e.clientY-r.top+'px';button.append(wave);setTimeout(()=>{button.classList.add('ml-done');button.querySelector('span').textContent='✓ 指令已发送';wave.remove()},reduceMotion?0:420)});`,
  },
  {
    id: "sliding-tabs",
    index: "04",
    title: "滑动标签指示器",
    englishTitle: "SLIDING TABS",
    description: "高亮轨道平滑移动，让导航层级更清晰。",
    useCase: "分段控制、内容导航",
    engine: "原生",
    category: "导航",
    style: "editorial",
    styleSecondary: "native",
    tags: ["tabs", "navigation", "indicator"],
    dependencies: [],
    html: '<div class="ml-tabs"><i></i><button>概览</button><button>动效</button><button>代码</button></div>',
    css: `.ml-tabs{position:relative;display:grid;grid-template-columns:minmax(0,1.18fr) repeat(2,minmax(0,.9fr));box-sizing:border-box;padding:4px;width:min(270px,100%);border:1px solid #33473b;background:#0b1510}.ml-tabs i{position:absolute;z-index:0;left:var(--indicator-left,4px);top:4px;width:var(--indicator-width,calc((100% - 8px)/3));height:calc(100% - 8px);background:#b8ff38;transition:left .45s cubic-bezier(.2,.9,.25,1),width .2s ease}.ml-tabs button{position:relative;z-index:1;min-width:0;padding:10px 6px;border:0;background:transparent;color:#87978d;font:10px ui-monospace,monospace;cursor:pointer}.ml-tabs button.ml-active{color:#07110d;font-weight:700}`,
    js: `const tabs=root,buttons=[...tabs.querySelectorAll('button')];let activeButton=buttons[0];const update=button=>{const rootRect=tabs.getBoundingClientRect(),tabRect=button.getBoundingClientRect(),borderLeft=parseFloat(getComputedStyle(tabs).borderLeftWidth)||0;tabs.style.setProperty('--indicator-left',tabRect.left-rootRect.left-borderLeft+'px');tabs.style.setProperty('--indicator-width',tabRect.width+'px')};const select=button=>{activeButton=button;buttons.forEach(item=>item.classList.toggle('ml-active',item===button));update(button)};buttons.forEach(button=>button.addEventListener('click',()=>select(button)));new ResizeObserver(()=>update(activeButton)).observe(tabs);select(activeButton);`,
  },
  {
    id: "expanding-search",
    index: "05",
    title: "展开式搜索框",
    englishTitle: "EXPANDING SEARCH",
    description: "紧凑图标在聚焦时展开，保留空间也保持可发现性。",
    useCase: "导航栏、工具面板",
    engine: "原生",
    category: "表单",
    style: "native",
    styleSecondary: "editorial",
    tags: ["focus", "search", "input"],
    dependencies: [],
    html: '<label class="ml-search"><span>⌕</span><input placeholder="SEARCH SYSTEM"><button type="button">×</button></label>',
    css: `.ml-search{display:flex;align-items:center;width:48px;height:48px;border:1px solid #465b4f;background:#0b1510;overflow:hidden;transition:.45s cubic-bezier(.2,.9,.2,1)}.ml-search:focus-within{width:280px;border-color:#b8ff38;box-shadow:0 0 28px rgba(184,255,56,.1)}.ml-search span{min-width:48px;text-align:center;color:#b8ff38;font-size:24px}.ml-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#e7f2ea;font:12px ui-monospace,monospace}.ml-search button{border:0;background:transparent;color:#718077;padding:12px;cursor:pointer}`,
    js: `const box=root,input=box.querySelector('input');box.querySelector('button').onclick=()=>{input.value='';input.focus()};`,
  },
  {
    id: "spotlight-card",
    index: "06",
    title: "聚光倾斜商品卡",
    englishTitle: "SPOTLIGHT CARD",
    description: "指针驱动微透视和高光，给静态卡片增加材质感。",
    useCase: "商品、会员权益、作品卡片",
    engine: "原生",
    category: "卡片",
    style: "glass",
    styleSecondary: "terminal",
    tags: ["tilt", "spotlight", "hover"],
    dependencies: [],
    parameters: [
      { id: "tilt", label: "倾斜幅度", min: 4, max: 24, step: 1, defaultValue: 12, unit: "deg", cssVariable: "--ml-spot-tilt" },
      { id: "spotlight", label: "高光范围", min: 20, max: 60, step: 2, defaultValue: 35, unit: "%", cssVariable: "--ml-spot-radius" },
    ],
    html: '<article class="ml-spot"><small>LIMITED UNIT</small><strong>NEON</strong><p>Experimental interface module</p></article>',
    css: `.ml-spot{--rx:0deg;--ry:0deg;--mx:50%;--my:50%;position:relative;width:250px;padding:28px;border:1px solid #425449;background:radial-gradient(circle at var(--mx) var(--my),rgba(184,255,56,.2),transparent var(--ml-spot-radius,35%)),#101a15;transform:perspective(700px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform .15s;color:#e3eee6}.ml-spot small{color:#b8ff38;font:10px ui-monospace,monospace;letter-spacing:.14em}.ml-spot strong{display:block;margin:45px 0 10px;font:700 30px ui-monospace,monospace}.ml-spot p{margin:0;color:#819085;font:12px ui-monospace,monospace}`,
    js: `const card=root,style=getComputedStyle(card),tilt=parseFloat(style.getPropertyValue('--ml-spot-tilt'))||12;card.onpointermove=e=>{if(reduceMotion)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',x*100+'%');card.style.setProperty('--my',y*100+'%');card.style.setProperty('--ry',(x-.5)*tilt+'deg');card.style.setProperty('--rx',(0.5-y)*tilt+'deg')};card.onpointerleave=()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')};`,
  },
  {
    id: "toast-stack",
    index: "07",
    title: "弹性 Toast 堆叠",
    englishTitle: "TOAST STACK",
    description: "消息从同一锚点弹出并自动重排，层级变化清晰。",
    useCase: "保存提示、系统通知",
    engine: "原生",
    category: "反馈",
    style: "native",
    styleSecondary: "soft",
    tags: ["notification", "stack", "spring"],
    dependencies: [],
    html: '<div class="ml-toasts"><button>+ 触发通知</button><div class="ml-toast-list"></div></div>',
    css: `.ml-toasts{display:grid;gap:14px;place-items:center}.ml-toasts>button{padding:10px 16px;border:1px solid #b8ff38;background:transparent;color:#b8ff38;font:12px ui-monospace,monospace}.ml-toast-list{display:grid;gap:8px;width:250px}.ml-toast{padding:12px 14px;border:1px solid #3d5547;background:#152119;color:#dce9df;font:11px ui-monospace,monospace;animation:ml-toast-in .5s cubic-bezier(.18,1.6,.35,1)}@keyframes ml-toast-in{from{opacity:0;transform:translateY(-18px) scale(.88)}}`,
    js: `const list=root.querySelector('.ml-toast-list');root.querySelector('button').onclick=()=>{const item=document.createElement('div');item.className='ml-toast';item.textContent='状态已同步';list.prepend(item);if(list.children.length>3)list.lastElementChild.remove()};`,
  },
  {
    id: "decoder-text",
    index: "08",
    title: "终端文字解码",
    englishTitle: "TEXT DECODER",
    description: "随机字符逐步收敛为真实内容，强化终端扫描氛围。",
    useCase: "状态标题、身份确认",
    engine: "Anime.js",
    category: "文字",
    style: "terminal",
    tags: ["scramble", "terminal", "reveal"],
    dependencies: ["anime"],
    html: '<button class="ml-decode">MOTION SYSTEM READY</button>',
    css: `.ml-decode{min-width:270px;padding:20px;border:1px solid #b8ff38;background:#08110d;color:#b8ff38;font:700 15px ui-monospace,monospace;letter-spacing:.08em;text-shadow:0 0 12px rgba(184,255,56,.5)}`,
    js: `const target=root,text='MOTION SYSTEM READY',chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';target.onclick=()=>{if(reduceMotion){target.textContent=text;return}let frame=0;const timer=setInterval(()=>{target.textContent=text.split('').map((c,i)=>i<frame/2?c:chars[Math.floor(Math.random()*chars.length)]).join('');frame++;if(frame>text.length*2){clearInterval(timer);target.textContent=text;anime.animate(target,{scale:[.96,1],duration:500,ease:'outBack'})}},35)};target.click();`,
  },
  {
    id: "stagger-list",
    index: "09",
    title: "列表交错入场",
    englishTitle: "STAGGER LIST",
    description: "多个列表项按节奏依次显现，建立阅读顺序。",
    useCase: "搜索结果、通知列表",
    engine: "Anime.js",
    category: "布局",
    style: "editorial",
    tags: ["stagger", "list", "entrance"],
    dependencies: ["anime"],
    html: '<div class="ml-stagger"><button>PLAY</button><ul><li>视觉系统</li><li>动效语言</li><li>组件状态</li></ul></div>',
    css: `.ml-stagger{width:270px}.ml-stagger button{margin-bottom:12px;border:0;background:transparent;color:#b8ff38;font:11px ui-monospace,monospace}.ml-stagger ul{display:grid;gap:6px;margin:0;padding:0;list-style:none}.ml-stagger li{padding:12px;border:1px solid #34483c;background:#111c16;color:#d9e5dc;font:12px ui-monospace,monospace}`,
    js: `const play=()=>{if(reduceMotion)return;anime.animate(root.querySelectorAll('li'),{opacity:[0,1],x:[-24,0],delay:anime.stagger(90),duration:650,ease:'outExpo'})};root.querySelector('button').onclick=play;play();`,
  },
  {
    id: "kpi-counter",
    index: "10",
    title: "KPI 数字滚动",
    englishTitle: "KPI COUNTER",
    description: "指标快速追赶至目标值，并在完成时给出轻微强调。",
    useCase: "数据看板、完成度展示",
    engine: "Anime.js",
    category: "文字",
    style: "editorial",
    styleSecondary: "terminal",
    tags: ["number", "dashboard", "counter"],
    dependencies: ["anime"],
    html: '<button class="ml-kpi"><small>RENDER SCORE</small><strong>0</strong><em>/100</em></button>',
    css: `.ml-kpi{padding:22px 30px;border:1px solid #394d41;background:#0f1914;color:#dfeae2;text-align:left;font-family:ui-monospace,monospace}.ml-kpi small{display:block;margin-bottom:10px;color:#718478;font-size:10px}.ml-kpi strong{font-size:46px;color:#b8ff38}.ml-kpi em{font-size:12px;color:#718478;font-style:normal}`,
    js: `const button=root,number=button.querySelector('strong');button.onclick=()=>{if(reduceMotion){number.textContent='94';return}let value=0;number.textContent='0';const timer=setInterval(()=>{value=Math.min(94,value+Math.ceil((94-value)*.18));number.textContent=value;if(value===94){clearInterval(timer);anime.animate(number,{scale:[.8,1],duration:550,ease:'outElastic(1,.5)'})}},32)};button.click();`,
  },
  {
    id: "elastic-error",
    index: "11",
    title: "表单错误弹性反馈",
    englishTitle: "ELASTIC ERROR",
    description: "错误字段短促摇摆，同时给出明确但克制的提示。",
    useCase: "登录、支付、关键表单",
    engine: "Anime.js",
    category: "表单",
    style: "native",
    styleSecondary: "soft",
    tags: ["validation", "shake", "feedback"],
    dependencies: ["anime"],
    html: '<div class="ml-error"><label>ACCESS CODE<input value="42-X"></label><small>代码格式不正确</small><button>验证</button></div>',
    css: `.ml-error{display:grid;gap:8px;width:270px;font:11px ui-monospace,monospace}.ml-error label{color:#84958a}.ml-error input{box-sizing:border-box;width:100%;margin-top:7px;padding:12px;border:1px solid #44574c;outline:0;background:#0c1510;color:#e5eee8;font:14px ui-monospace,monospace}.ml-error small{opacity:0;color:#ff8b70}.ml-error button{justify-self:start;padding:8px 14px;border:1px solid #b8ff38;background:transparent;color:#b8ff38;font:11px ui-monospace,monospace}`,
    js: `const input=root.querySelector('input'),hint=root.querySelector('small');root.querySelector('button').onclick=()=>{hint.style.opacity=1;input.style.borderColor='#ff7557';if(!reduceMotion)anime.animate(input,{x:[0,-9,8,-6,4,0],duration:520,ease:'outQuad'})};`,
  },
  {
    id: "command-palette",
    index: "12",
    title: "Command Palette 展开",
    englishTitle: "COMMAND PALETTE",
    description: "面板从快捷键提示展开，结果按时间线逐项进入。",
    useCase: "效率工具、全局命令",
    engine: "GSAP",
    category: "导航",
    style: "glass",
    styleSecondary: "native",
    tags: ["timeline", "overlay", "command"],
    dependencies: ["gsap"],
    html: '<div class="ml-command"><button>⌘ K 打开命令</button><section><input placeholder="输入命令…"><p>⌕ 搜索动效</p><p>＋ 新建样本</p><p>↗ 导出 HTML</p></section></div>',
    css: `.ml-command{position:relative;width:290px;font:11px ui-monospace,monospace}.ml-command>button{padding:11px 16px;border:1px solid #58685e;background:#121c16;color:#a5b3aa;font:11px ui-monospace,monospace}.ml-command section{position:absolute;z-index:2;inset:-38px 0 auto;padding:12px;border:1px solid #b8ff38;background:#0b120e;box-shadow:0 20px 60px rgba(0,0,0,.55);visibility:hidden}.ml-command input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #33463a;background:#111c16;color:#e6efe9}.ml-command p{margin:4px 0 0;padding:9px;color:#a8b8ae}.ml-command p:hover{background:#1b2b21;color:#b8ff38}`,
    js: `const panel=root.querySelector('section');root.querySelector('button').onclick=()=>{gsap.set(panel,{visibility:'visible'});if(reduceMotion){gsap.set(panel,{opacity:1,scale:1,y:0});return}gsap.timeline().fromTo(panel,{opacity:0,scale:.85,y:18},{opacity:1,scale:1,y:0,duration:.35,ease:'back.out(1.7)'}).from(panel.querySelectorAll('p'),{opacity:0,x:-12,stagger:.06},'-=.12')};`,
  },
  {
    id: "flip-grid",
    index: "13",
    title: "FLIP 商品网格重排",
    englishTitle: "FLIP GRID",
    description: "筛选后项目不是瞬间跳位，而是沿原位置平滑重排。",
    useCase: "商品筛选、看板排序",
    engine: "GSAP",
    category: "布局",
    style: "editorial",
    tags: ["FLIP", "grid", "reorder"],
    dependencies: ["gsap", "flip"],
    html: '<div class="ml-flip"><button>切换排序</button><div><i>A</i><i>B</i><i>C</i><i>D</i></div></div>',
    css: `.ml-flip{width:280px}.ml-flip button{margin-bottom:10px;border:0;background:transparent;color:#b8ff38;font:11px ui-monospace,monospace}.ml-flip>div{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.ml-flip i{display:grid;place-items:center;height:62px;border:1px solid #3b5143;background:#152219;color:#b8ff38;font:700 18px ui-monospace,monospace;font-style:normal}.ml-flip i:nth-child(2n){color:#ffbd68}`,
    js: `gsap.registerPlugin(Flip);const grid=root.querySelector('div');root.querySelector('button').onclick=()=>{if(reduceMotion){grid.append(...[...grid.children].reverse());return}const state=Flip.getState(grid.children);grid.append(...[...grid.children].reverse());Flip.from(state,{duration:.7,ease:'power3.inOut',stagger:.04})};`,
  },
  {
    id: "draggable-sheet",
    index: "14",
    title: "可拖拽底部面板",
    englishTitle: "DRAGGABLE SHEET",
    description: "面板跟随拖拽，并在释放后吸附到最近的高度。",
    useCase: "移动端筛选、地图详情",
    engine: "GSAP",
    category: "反馈",
    style: "native",
    styleSecondary: "soft",
    tags: ["drag", "snap", "touch"],
    dependencies: ["gsap", "draggable"],
    html: '<div class="ml-sheet-stage"><section class="ml-sheet"><i></i><b>拖动面板</b><p>释放后自动吸附到最近位置</p></section></div>',
    css: `.ml-sheet-stage{position:relative;overflow:hidden;width:280px;height:190px;border:1px solid #304439;background:linear-gradient(#0e1913,#08100c)}.ml-sheet{position:absolute;box-sizing:border-box;left:8px;right:8px;bottom:-72px;height:150px;padding:10px 18px;border:1px solid #b8ff38;background:#142219;color:#dbe7de;font:12px ui-monospace,monospace;cursor:grab}.ml-sheet i{display:block;width:38px;height:3px;margin:0 auto 20px;background:#5c7164}.ml-sheet b{color:#b8ff38}.ml-sheet p{color:#809287;font-size:10px}`,
    js: `gsap.registerPlugin(Draggable);const sheet=root.querySelector('.ml-sheet');Draggable.create(sheet,{type:'y',bounds:{minY:-70,maxY:0},onRelease(){gsap.to(sheet,{y:this.y<-35?-70:0,duration:reduceMotion?0:.5,ease:'back.out(1.4)'})}});`,
  },
  {
    id: "scroll-stack",
    index: "15",
    title: "ScrollTrigger 卡片堆叠",
    englishTitle: "SCROLL STACK",
    description: "滚动推动卡片逐层靠拢，适合讲述连续功能或步骤。",
    useCase: "产品介绍、步骤叙事",
    engine: "GSAP",
    category: "滚动",
    style: "editorial",
    tags: ["scroll", "stack", "story"],
    dependencies: ["gsap", "scrollTrigger"],
    html: '<div class="ml-scroll"><article>DISCOVER</article><article>TUNE</article><article>EXPORT</article></div>',
    css: `.ml-scroll{box-sizing:border-box;width:290px;height:190px;overflow:auto;padding:12px 12px 120px;background:#0b130f;border:1px solid #33483b;scrollbar-width:thin}.ml-scroll article{position:sticky;top:10px;display:grid;place-items:center;height:100px;margin-bottom:48px;border:1px solid #476052;background:#142119;color:#b8ff38;font:700 13px ui-monospace,monospace;box-shadow:0 12px 30px rgba(0,0,0,.35)}.ml-scroll article:nth-child(2){top:24px;color:#ffbd68}.ml-scroll article:nth-child(3){top:38px;color:#d7e4db}`,
    js: `if(!reduceMotion){gsap.registerPlugin(ScrollTrigger);const scroller=root;Array.from(root.querySelectorAll('article')).forEach(card=>gsap.from(card,{scale:.88,opacity:.45,scrollTrigger:{trigger:card,scroller,start:'top bottom',end:'top center',scrub:true}}))}`,
  },
  {
    id: "cursor-dot-field",
    index: "16",
    title: "指针感应点阵",
    englishTitle: "CURSOR DOT FIELD",
    description: "圆形影响场跟随指针移动，点阵从中心增强并向外渐隐。",
    useCase: "科技界面背景、数据面板、互动展示区",
    engine: "原生",
    category: "卡片",
    style: "terminal",
    tags: ["pointer", "grid", "hover"],
    dependencies: [],
    parameters: [
      { id: "dotSize", label: "高亮圆点大小", min: 4, max: 14, step: 1, defaultValue: 8, unit: "px", cssVariable: "--ml-dot-size" },
      { id: "radius", label: "高亮区域半径", min: 45, max: 145, step: 5, defaultValue: 96, unit: "px", cssVariable: "--ml-dot-radius" },
    ],
    html: '<div class="ml-dot-field" role="img" aria-label="会跟随指针移动并向外渐隐的点阵区域"></div>',
    css: `.ml-dot-field{box-sizing:border-box;display:grid;grid-template-columns:repeat(17,1fr);grid-template-rows:repeat(10,1fr);width:304px;height:190px;padding:14px;border:1px solid #395744;background:radial-gradient(circle at 50% 50%,rgba(183,255,60,.035),transparent 58%),#07110c;cursor:crosshair;touch-action:none}.ml-dot-field i{place-self:center;width:2px;height:2px;border-radius:50%;background:#b7ff3c;opacity:.18;will-change:transform,opacity,box-shadow}`,
    js: `const field=root,dots=Array.from({length:170},()=>field.appendChild(document.createElement('i'))),pointer={x:0,y:0,active:false},computed=getComputedStyle(field),radius=parseFloat(computed.getPropertyValue('--ml-dot-radius'))||96,maxDotSize=parseFloat(computed.getPropertyValue('--ml-dot-size'))||8;let frame=0,cx=152,cy=95;function render(time=0){const rect=field.getBoundingClientRect(),w=rect.width,h=rect.height,tx=pointer.active?pointer.x:w/2+Math.cos(time*.00055)*w*.25,ty=pointer.active?pointer.y:h/2+Math.sin(time*.0008)*h*.22,follow=reduceMotion?1:.2,r=Math.min(radius,w*.48);cx+=(tx-cx)*follow;cy+=(ty-cy)*follow;dots.forEach((dot,index)=>{const col=index%17,row=Math.floor(index/17),x=14+col/16*(w-28),y=14+row/9*(h-28),dx=cx-x,dy=cy-y,n=Math.max(0,1-Math.hypot(dx,dy)/r),e=n*n*(3-2*n);dot.style.transform='translate('+dx*e*.18+'px,'+dy*e*.18+'px) scale('+(1+e*(maxDotSize/2-1))+')';dot.style.opacity=.18+e*.82;dot.style.boxShadow=e>.08?'0 0 '+(4+e*12)+'px rgba(183,255,60,'+(.35+e*.55)+')':'none'});if(!reduceMotion)frame=requestAnimationFrame(render)}function move(event){const rect=field.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=true;if(reduceMotion)render(performance.now())}field.addEventListener('pointerenter',move);field.addEventListener('pointermove',move);field.addEventListener('pointerleave',()=>{pointer.active=false;if(reduceMotion)render()});render();`,
  },
  {
    id: "parallax-image-field",
    index: "17",
    title: "六层图像视差",
    englishTitle: "PARALLAX IMAGE FIELD",
    description: "六张图像按不同景深跟随指针移动，构成具有空间感的 Hero 画面。",
    useCase: "品牌首屏、作品集封面、专题视觉",
    engine: "原生",
    category: "卡片",
    style: "glass",
    styleSecondary: "soft",
    tags: ["pointer", "parallax", "depth"],
    dependencies: [],
    html: '<div class="ml-parallax"><i></i><i></i><i></i><i></i><i></i><i></i><section><small>LAYER FIELD</small><b>MOVE / DEPTH</b></section></div>',
    css: `.ml-parallax{position:relative;box-sizing:border-box;overflow:hidden;width:320px;height:200px;border:1px solid #33483b;background:radial-gradient(circle at 50% 50%,rgba(183,255,60,.08),transparent 48%),#070807}.ml-parallax>i{--d:.3;position:absolute;width:86px;height:56px;border:1px solid rgba(255,255,255,.15);border-radius:7px;background:radial-gradient(circle at 32% 28%,#f7ff9f,transparent 36%),linear-gradient(145deg,#1a3423,#050606);box-shadow:0 10px 28px rgba(0,0,0,.45);will-change:transform}.ml-parallax>i:nth-child(1){left:8px;top:10px;--d:.3}.ml-parallax>i:nth-child(2){right:8px;top:10px;--d:.35;background:radial-gradient(circle at 68% 32%,#ffb4d8,transparent 36%),linear-gradient(145deg,#3b1424,#050606)}.ml-parallax>i:nth-child(3){left:12px;top:72px;--d:.9;background:radial-gradient(circle at 30% 70%,#b9d5ff,transparent 38%),linear-gradient(145deg,#111d43,#050606)}.ml-parallax>i:nth-child(4){right:12px;top:72px;--d:.85;background:radial-gradient(circle at 68% 30%,#ffd9a8,transparent 38%),linear-gradient(145deg,#3b1b10,#050606)}.ml-parallax>i:nth-child(5){left:8px;bottom:10px;--d:.4;background:radial-gradient(circle at 35% 35%,#b5fff1,transparent 38%),linear-gradient(145deg,#0c3028,#050606)}.ml-parallax>i:nth-child(6){right:8px;bottom:10px;--d:.45;background:radial-gradient(circle at 65% 35%,#e5c5ff,transparent 38%),linear-gradient(145deg,#28133c,#050606)}.ml-parallax section{position:absolute;z-index:5;inset:0;display:grid;place-content:center;text-align:center;font-family:ui-monospace,monospace;pointer-events:none}.ml-parallax small{margin-bottom:7px;color:#b7ff3c;font-size:7px;letter-spacing:.25em}.ml-parallax b{color:#fff;font-size:15px;letter-spacing:-.03em}`,
    js: `const layers=Array.from(root.querySelectorAll(':scope>i'));if(reduceMotion)return;let tx=0,ty=0,cx=0,cy=0,frame=0;function render(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;layers.forEach(layer=>{const depth=parseFloat(getComputedStyle(layer).getPropertyValue('--d'))||.3;layer.style.transform='translate3d('+(cx*28*depth)+'px,'+(cy*28*depth)+'px,0)'});frame=requestAnimationFrame(render)}root.addEventListener('pointermove',event=>{const rect=root.getBoundingClientRect();tx=(event.clientX-rect.left)/rect.width*2-1;ty=(event.clientY-rect.top)/rect.height*2-1});root.addEventListener('pointerleave',()=>{tx=0;ty=0});render();`,
  },
  {
    id: "prompt-reference-card",
    index: "18",
    title: "双语 Prompt 引用卡",
    englishTitle: "PROMPT REFERENCE CARD",
    description: "无持续动效的交互卡片，可切换中英文内容并复制当前 Prompt。",
    useCase: "模型评测展示、提示词引用、双语 Prompt 对照",
    engine: "原生",
    category: "卡片",
    style: "native",
    tags: ["language", "copy", "state"],
    dependencies: [],
    interactionOnly: true,
    html: `<section class="ml-prompt-card">
  <header>
    <b>Prompt_018</b>
    <div class="ml-prompt-actions">
      <div class="ml-language" role="group" aria-label="Prompt language">
        <button class="ml-active" type="button" data-lang="EN" aria-pressed="true">EN</button>
        <button type="button" data-lang="CN" aria-pressed="false">CN</button>
      </div>
      <button class="ml-copy" type="button">COPY</button>
    </div>
  </header>
  <div class="ml-prompt-body" data-copy="EN"><p>Redraw the attached image in a <mark class="ml-core-ref">clumsy, hand-made editorial style</mark>. Use <mark class="ml-image-ref">Image 1</mark> for composition and retain the phrase <mark class="ml-text-ref">“Keep the happy accidents.”</mark></p></div>
  <div class="ml-prompt-body" data-copy="CN" hidden><p>请用<mark class="ml-core-ref">笨拙、手工感的编辑设计风格</mark>重绘附加图片。参考<mark class="ml-image-ref">图片 1</mark>的构图，并保留文字<mark class="ml-text-ref">“留下那些快乐的意外。”</mark></p></div>
</section>`,
    css: `.ml-prompt-card{box-sizing:border-box;width:min(326px,100%);padding:10px;border:1px solid #d7dbe2;border-radius:12px;background:#fff;color:#1b2028;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.ml-prompt-card *{box-sizing:border-box}.ml-prompt-card header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:9px}.ml-prompt-card header>b{font-size:11px;letter-spacing:.01em}.ml-prompt-actions{display:flex;align-items:center;gap:7px}.ml-language{display:flex;padding:2px;border:1px solid #e1e4e9;border-radius:7px;background:#f7f8fa}.ml-language button,.ml-copy{border:0;background:transparent;color:#747b86;font:700 8px/1 ui-monospace,SFMono-Regular,Menlo,monospace;cursor:pointer}.ml-language button{min-width:27px;padding:5px 6px;border-radius:5px}.ml-language button.ml-active{background:#dbeafe;color:#1d4ed8}.ml-copy{padding:7px 8px;border:1px solid #d7dbe2;border-radius:7px;color:#303641}.ml-copy:focus-visible,.ml-language button:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}.ml-prompt-body{height:130px;overflow:auto;padding:12px 13px;border:1px solid #e3e6eb;border-radius:8px;background:#fbfcfe;scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent}.ml-prompt-body[hidden]{display:none}.ml-prompt-body p{margin:0;color:#3b424c;font-size:11px;line-height:1.68}.ml-prompt-body mark{padding:1px 3px;border-radius:3px;color:inherit}.ml-prompt-body .ml-image-ref{background:#dbeafe;color:#1d4ed8}.ml-prompt-body .ml-text-ref{background:#eceef1;color:#4b5563}.ml-prompt-body .ml-core-ref{border-left:2px solid #8b5cf6;border-radius:0;background:#f1eafe;color:#5b21b6}`,
    js: `const languageButtons=Array.from(root.querySelectorAll('[data-lang]')),bodies=Array.from(root.querySelectorAll('[data-copy]')),copyButton=root.querySelector('.ml-copy');let language='EN',copyTimer=0;languageButtons.forEach(button=>button.addEventListener('click',()=>{language=button.dataset.lang||'EN';languageButtons.forEach(item=>{const active=item===button;item.classList.toggle('ml-active',active);item.setAttribute('aria-pressed',String(active))});bodies.forEach(body=>{body.hidden=body.dataset.copy!==language})}));copyButton.addEventListener('click',async()=>{const text=root.querySelector('[data-copy="'+language+'"]')?.textContent?.trim()||'';let copied=false;try{await navigator.clipboard.writeText(text);copied=true}catch{const textarea=document.createElement('textarea');textarea.value=text;textarea.style.position='fixed';textarea.style.opacity='0';document.body.appendChild(textarea);textarea.select();copied=document.execCommand('copy');textarea.remove()}if(!copied)return;copyButton.textContent='COPIED';clearTimeout(copyTimer);copyTimer=setTimeout(()=>{copyButton.textContent='COPY'},1400)});`,
  },
  ...archiveVariants,
];

export const categories = ["全部", ...Array.from(new Set(motions.map((motion) => motion.category)))];
export const engines = ["全部", ...Array.from(new Set(motions.map((motion) => motion.engine)))];
