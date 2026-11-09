export type GlossaryCategory = "触发方式" | "动效表现" | "组件与场景" | "行为结果" | "实现技术";

export type GlossaryEntry = {
  id: string;
  term: string;
  label: string;
  category: GlossaryCategory;
  summary: string;
  explanation: string;
  example: string;
};

export const glossaryEntries: GlossaryEntry[] = [
  { id: "pointer", term: "Pointer", label: "指针跟随", category: "触发方式", summary: "根据鼠标或触控笔的位置产生变化。", explanation: "页面会持续读取指针在元素中的位置，用它控制位移、光线或角度。它通常只在桌面端明显，触屏端需要提供普通点击作为替代。", example: "鼠标靠近按钮时，按钮被轻微吸向指针。" },
  { id: "click", term: "Click", label: "点击触发", category: "触发方式", summary: "用户点击后开始播放动效。", explanation: "最常见也最容易理解的触发方式。动效应立即回应用户，告诉他这次点击已经被系统接收。", example: "点击发送按钮后出现涟漪和成功状态。" },
  { id: "hover", term: "Hover", label: "悬停触发", category: "触发方式", summary: "鼠标停留在元素上时播放。", explanation: "适合提前暗示一个元素可以操作，但手机没有真正的悬停状态，因此不能把关键信息只放在 Hover 中。", example: "鼠标悬停在商品卡上时出现聚光高亮。" },
  { id: "focus", term: "Focus", label: "聚焦触发", category: "触发方式", summary: "输入框或控件获得操作焦点时播放。", explanation: "鼠标点击输入框或键盘移动到控件时都会获得焦点。它常用于强调当前正在填写或操作的内容。", example: "搜索框获得焦点后从图标展开成完整输入框。" },
  { id: "drag", term: "Drag", label: "拖拽操作", category: "触发方式", summary: "按住元素并移动来直接控制它。", explanation: "拖拽把用户手势与界面位置直接连接起来，释放时通常还要处理惯性、边界和最终落点。", example: "向上拖动底部面板以查看更多内容。" },
  { id: "touch", term: "Touch", label: "触屏操作", category: "触发方式", summary: "针对手机和平板的手指操作。", explanation: "Touch 表示动效不仅考虑鼠标，也考虑手指点击、滑动和拖拽；交互目标需要足够大。", example: "在手机上用手指拖动底部面板。" },
  { id: "scroll", term: "Scroll", label: "滚动触发", category: "触发方式", summary: "根据页面滚动位置驱动动效。", explanation: "动效可以在元素进入屏幕时播放，也可以与滚动进度实时绑定。使用时要避免阻碍用户正常浏览。", example: "向下滚动时，功能卡片逐层堆叠。" },
  { id: "spring", term: "Spring", label: "弹性回弹", category: "动效表现", summary: "像弹簧一样略微越界后回到目标位置。", explanation: "Spring 不只是快慢变化，而是模拟带有弹性和阻尼的运动，所以界面会显得更有生命力。", example: "磁吸按钮在鼠标离开后弹回原位。" },
  { id: "morph", term: "Morph", label: "平滑变形", category: "动效表现", summary: "一个形状或状态连续变化成另一个。", explanation: "Morph 强调两个状态之间的连续关系，让用户看见元素不是消失后重建，而是在原地发生变化。", example: "开关圆点在切换过程中拉伸后恢复。" },
  { id: "tilt", term: "Tilt", label: "透视倾斜", category: "动效表现", summary: "元素随指针产生轻微的三维倾斜。", explanation: "通常通过透视和旋转模拟卡片表面的空间角度，幅度需要克制，否则容易造成眩晕。", example: "商品卡根据鼠标位置向不同方向倾斜。" },
  { id: "spotlight", term: "Spotlight", label: "聚光高亮", category: "动效表现", summary: "在指针附近生成跟随移动的光斑。", explanation: "Spotlight 用局部亮度突出材质和空间感，常与卡片倾斜组合使用。", example: "鼠标经过卡片时，荧光光斑跟随移动。" },
  { id: "stack", term: "Stack", label: "层叠排列", category: "动效表现", summary: "多个元素像卡片一样依次叠放。", explanation: "当新元素出现或页面滚动时，旧元素保留部分可见区域，从而表现顺序和层级。", example: "多条通知从同一位置弹出并向下堆叠。" },
  { id: "scramble", term: "Scramble", label: "文字解码", category: "动效表现", summary: "随机字符逐步还原成真实文字。", explanation: "Scramble 会快速替换尚未揭示的字符，营造系统扫描或数据解码的感觉。", example: "随机字母最终收敛为 MOTION SYSTEM READY。" },
  { id: "stagger", term: "Stagger", label: "依次入场", category: "动效表现", summary: "多个元素错开一点时间依次播放。", explanation: "Stagger 让列表拥有节奏和阅读顺序，比所有元素同时出现更容易感知层级。", example: "三条列表内容从上到下逐项进入。" },
  { id: "counter", term: "Counter", label: "数字滚动", category: "动效表现", summary: "数字从初始值快速变化到目标值。", explanation: "Counter 用连续变化强调数值更新，适合重要指标，但不应让用户等待太久才能读到结果。", example: "完成分数从 0 递增到 94。" },
  { id: "shake", term: "Shake", label: "摇动提示", category: "动效表现", summary: "元素短促地左右摇动。", explanation: "Shake 模拟拒绝或不正确的反馈，通常配合颜色和文字提示，不能只靠摇动表达错误。", example: "验证码错误时输入框左右摇动。" },
  { id: "snap", term: "Snap", label: "自动吸附", category: "动效表现", summary: "拖动结束后自动落到最近的固定位置。", explanation: "Snap 帮助用户把不精确的手势转化为明确状态，例如展开一半、完全展开或关闭。", example: "底部面板松手后吸附到高位或低位。" },
  { id: "cta", term: "CTA", label: "关键行动按钮", category: "组件与场景", summary: "推动用户完成核心操作的按钮。", explanation: "CTA 是 Call To Action 的缩写，常见文字包括立即购买、开始体验、提交申请。它通常是页面上视觉优先级最高的按钮。", example: "首页的“立即探索”按钮。" },
  { id: "toggle", term: "Toggle", label: "开关切换", category: "组件与场景", summary: "在开启和关闭两个状态之间切换。", explanation: "Toggle 适用于立即生效的布尔设置。动画需要清楚表现当前状态，而不是只追求好看。", example: "开启或关闭 ENERGY MODE。" },
  { id: "tabs", term: "Tabs", label: "标签页", category: "组件与场景", summary: "在同一位置切换不同内容分组。", explanation: "Tabs 用并列标签组织同级内容，移动的指示器可以帮助用户追踪当前选择。", example: "在概览、动效和代码之间切换。" },
  { id: "navigation", term: "Navigation", label: "导航交互", category: "组件与场景", summary: "帮助用户在内容或页面之间移动。", explanation: "Navigation 包括菜单、标签页、返回入口等。动效应帮助理解位置变化，不能拖慢跳转。", example: "标签指示器从概览滑动到代码。" },
  { id: "search", term: "Search", label: "搜索组件", category: "组件与场景", summary: "输入关键词来缩小内容范围。", explanation: "搜索动效常用于展开输入区域、显示结果状态和清空内容，但输入本身必须始终清晰可用。", example: "点击搜索图标后展开完整输入框。" },
  { id: "input", term: "Input", label: "输入框", category: "组件与场景", summary: "接收文字、数字等用户输入的控件。", explanation: "输入框的焦点、错误、完成和禁用状态都需要明确反馈，动画只能辅助这些状态。", example: "填写访问代码的输入区域。" },
  { id: "notification", term: "Notification", label: "通知提示", category: "组件与场景", summary: "向用户报告刚刚发生的系统事件。", explanation: "通知通常短暂出现且不打断当前任务，例如保存成功、网络恢复或同步完成。", example: "右上角出现“状态已同步”的 Toast。" },
  { id: "terminal", term: "Terminal", label: "终端风格", category: "组件与场景", summary: "借用命令行和系统仪表的视觉语言。", explanation: "Terminal 是一种视觉气质，常用等宽字体、状态码、网格和荧光色，但内容仍要保持易读。", example: "文字解码和系统在线状态。" },
  { id: "list", term: "List", label: "列表内容", category: "组件与场景", summary: "按顺序排列的一组同类信息。", explanation: "列表适合用轻微的依次入场建立阅读顺序，过强的动画会降低扫描效率。", example: "搜索结果或通知项目逐条出现。" },
  { id: "number", term: "Number", label: "数字指标", category: "组件与场景", summary: "需要被重点读取的数值信息。", explanation: "数字动效常用于强调变化幅度，但最后的稳定数值必须比动画过程更突出。", example: "渲染分数 94/100。" },
  { id: "dashboard", term: "Dashboard", label: "数据看板", category: "组件与场景", summary: "集中展示关键数据和状态的界面。", explanation: "Dashboard 通常包含数字、图表和进度，动效用于提示数据变化，而不是让所有模块持续运动。", example: "展示完成度、活跃度或性能分数。" },
  { id: "overlay", term: "Overlay", label: "覆盖浮层", category: "组件与场景", summary: "显示在当前页面内容上方的临时界面。", explanation: "Overlay 包括弹窗、抽屉和命令面板。出现时需要保持与原页面的空间关系，并提供明确关闭方式。", example: "Command Palette 覆盖在当前界面上方。" },
  { id: "command", term: "Command Palette", label: "命令面板", category: "组件与场景", summary: "通过搜索快速执行功能的效率面板。", explanation: "命令面板常由快捷键唤起，适合功能较多的工具型产品。动画重点是快速、集中注意力。", example: "按下 ⌘K 后搜索并执行导出命令。" },
  { id: "grid", term: "Grid", label: "网格布局", category: "组件与场景", summary: "按行列组织多个卡片或项目。", explanation: "Grid 常用于商品、作品和数据卡片。筛选或排序时需要帮助用户理解项目去了哪里。", example: "四个商品卡片组成两列网格。" },
  { id: "story", term: "Story", label: "滚动叙事", category: "组件与场景", summary: "随着滚动顺序讲述一组连续内容。", explanation: "滚动叙事把页面位置与内容进度结合，适合产品介绍和步骤说明，但应保留自由滚动。", example: "依次介绍发现、调整和导出三个步骤。" },
  { id: "language", term: "Language Switch", label: "语言切换", category: "组件与场景", summary: "在同一份内容的不同语言版本之间切换。", explanation: "语言切换需要保留相同的信息结构，并清楚标记当前正在阅读的版本。简短的 EN、CN 标签适合空间有限的资料卡。", example: "在 Prompt 卡片中切换英文和中文内容。" },
  { id: "feedback", term: "Feedback", label: "操作反馈", category: "行为结果", summary: "让用户知道操作已经被系统接收。", explanation: "Feedback 可以是颜色、文字、声音或动画。好的反馈会回答：有没有成功、系统正在做什么、接下来怎么办。", example: "按钮从“发送指令”变成“指令已发送”。" },
  { id: "copy", term: "Copy", label: "一键复制", category: "行为结果", summary: "把当前内容写入系统剪贴板。", explanation: "复制操作应明确说明复制的对象，并在成功后给出短暂文字反馈。失败时还需要保留可手动选取的内容。", example: "点击 Prompt 卡片中的 COPY，复制当前语言内容。" },
  { id: "state", term: "State", label: "状态切换", category: "行为结果", summary: "组件从一个明确状态变到另一个状态。", explanation: "常见状态包括默认、悬停、处理中、成功、失败和禁用。动效应解释状态之间的关系。", example: "提交按钮从默认状态变成成功状态。" },
  { id: "indicator", term: "Indicator", label: "位置指示", category: "行为结果", summary: "标记当前选项、位置或进度。", explanation: "Indicator 本身不执行操作，而是让用户快速看见自己当前在哪里。", example: "标签页下方移动的荧光色块。" },
  { id: "reveal", term: "Reveal", label: "渐进显现", category: "行为结果", summary: "内容从隐藏状态逐渐变得可见。", explanation: "Reveal 可以通过透明度、裁切或位移实现，适合引导视线，但不应隐藏用户急需的信息。", example: "终端字符逐渐还原成完整标题。" },
  { id: "entrance", term: "Entrance", label: "入场动画", category: "行为结果", summary: "元素第一次出现时的过渡。", explanation: "入场动画说明元素从哪里来，并帮助建立阅读顺序；频繁重复会让界面显得拖沓。", example: "列表项从左侧依次滑入。" },
  { id: "validation", term: "Validation", label: "表单校验", category: "行为结果", summary: "判断用户输入是否符合要求。", explanation: "Validation 需要给出清晰原因和修改方法，摇动和红色只是辅助提示。", example: "访问代码格式错误时显示文字说明。" },
  { id: "reorder", term: "Reorder", label: "平滑重排", category: "行为结果", summary: "项目排序变化时连续移动到新位置。", explanation: "平滑重排保留用户对原位置的记忆，让筛选和排序结果更容易理解。", example: "商品卡片倒序后滑动到新的网格位置。" },
  { id: "css", term: "CSS", label: "CSS 动画", category: "实现技术", summary: "用网页样式规则实现过渡和关键帧。", explanation: "CSS 适合按钮、悬停和简单循环动效，代码短、依赖少，复制到普通网页通常最方便。", example: "开关变形、涟漪和 Toast 入场。" },
  { id: "waapi", term: "WAAPI", label: "浏览器动画接口", category: "实现技术", summary: "浏览器原生提供的 JavaScript 动画能力。", explanation: "WAAPI 是 Web Animations API 的缩写，可以用 JavaScript 创建、暂停和控制动画，不需要第三方库。", example: "控制列表入场或数字变化的播放进度。" },
  { id: "animejs", term: "Anime.js", label: "轻量动画库", category: "实现技术", summary: "用于编排多个网页元素的 JavaScript 动画库。", explanation: "Anime.js 适合交错、数字、文字和时间线等效果。复制相关案例时需要同时加载这个库。", example: "文字解码、列表交错和错误摇动。" },
  { id: "gsap", term: "GSAP", label: "专业动画库", category: "实现技术", summary: "擅长复杂时间线、拖拽和滚动动效的动画库。", explanation: "GSAP 提供精细的时间控制和扩展插件，适合复杂交互；复制案例时需要加载对应脚本。", example: "命令面板、拖拽底部面板和滚动卡片。" },
  { id: "timeline", term: "Timeline", label: "时间线编排", category: "实现技术", summary: "把多个动画按照先后顺序组织起来。", explanation: "Timeline 可以规定谁先出现、谁与前一个重叠、整体如何暂停或重播，适合连续动作。", example: "命令面板先展开，再依次显示三条命令。" },
  { id: "flip", term: "FLIP", label: "布局过渡技术", category: "实现技术", summary: "让元素换位置时仍能平滑移动。", explanation: "FLIP 会记录元素变化前后的位置差异，再用反向变换补间，避免网格重排时突然跳动。", example: "四个卡片倒序后平滑交换位置。" },
];

export const glossaryCategories = ["全部", "触发方式", "动效表现", "组件与场景", "行为结果", "实现技术"] as const;

const aliases: Record<string, string> = { CTA: "cta", FLIP: "flip", CSS: "css", "Anime.js": "animejs", GSAP: "gsap", WAAPI: "waapi" };

export function getGlossaryEntry(term: string) {
  const id = aliases[term] || term.toLowerCase().replace(/[^a-z0-9]/g, "");
  return glossaryEntries.find((entry) => entry.id === id);
}
