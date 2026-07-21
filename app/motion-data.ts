export type MotionEngine = "原生" | "Anime.js" | "GSAP";

export type MotionCategory =
  | "按钮"
  | "表单"
  | "导航"
  | "卡片"
  | "反馈"
  | "文字"
  | "布局"
  | "滚动";

export type MotionDefinition = {
  id: string;
  index: string;
  title: string;
  englishTitle: string;
  description: string;
  useCase: string;
  engine: MotionEngine;
  category: MotionCategory;
  tags: string[];
  dependencies: string[];
  html: string;
  css: string;
  js: string;
};

const GSAP = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"><\/script>';
const GSAP_FLIP = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js"><\/script>';
const GSAP_DRAGGABLE = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Draggable.min.js"><\/script>';
const GSAP_SCROLL = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"><\/script>';
const ANIME = '<script src="https://cdn.jsdelivr.net/npm/animejs@4.4.1/dist/bundles/anime.umd.min.js"><\/script>';

export const dependencyScripts: Record<string, string> = {
  gsap: GSAP,
  flip: GSAP_FLIP,
  draggable: GSAP_DRAGGABLE,
  scrollTrigger: GSAP_SCROLL,
  anime: ANIME,
};

export function getFullSnippet(motion: MotionDefinition) {
  const deps = motion.dependencies.map((name) => dependencyScripts[name]).join("\n");
  return `${deps ? `${deps}\n\n` : ""}${motion.html}\n\n<style>\n${motion.css}\n</style>\n\n<script>\n${motion.js}\n<\/script>`;
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
    tags: ["pointer", "spring", "CTA"],
    dependencies: [],
    html: '<button class="ml-magnetic"><span>立即探索</span><b>↗</b></button>',
    css: `.ml-magnetic{--x:0px;--y:0px;display:inline-flex;gap:28px;align-items:center;padding:16px 18px 16px 22px;border:1px solid #b8ff38;background:#b8ff38;color:#07110d;font:700 14px ui-monospace,monospace;transform:translate(var(--x),var(--y));transition:transform .45s cubic-bezier(.2,1.5,.3,1),box-shadow .25s;box-shadow:0 0 0 rgba(184,255,56,0)}.ml-magnetic:hover{box-shadow:0 10px 35px rgba(184,255,56,.22)}.ml-magnetic b{font-size:18px}`,
    js: `const button=document.querySelector('.ml-magnetic');
button.addEventListener('pointermove',e=>{const r=button.getBoundingClientRect();button.style.setProperty('--x',(e.clientX-r.left-r.width/2)*.18+'px');button.style.setProperty('--y',(e.clientY-r.top-r.height/2)*.18+'px')});
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
    tags: ["toggle", "morph", "CSS"],
    dependencies: [],
    html: '<label class="ml-liquid"><input type="checkbox"><span><i></i></span><em>ENERGY MODE</em></label>',
    css: `.ml-liquid{display:grid;grid-template-columns:auto 1fr;gap:10px 14px;align-items:center;color:#dce9df;font:12px ui-monospace,monospace}.ml-liquid input{position:absolute;opacity:0}.ml-liquid span{width:78px;height:38px;padding:4px;border:1px solid #466052;border-radius:99px;background:#101d17;cursor:pointer}.ml-liquid i{display:block;width:28px;height:28px;border-radius:50%;background:#718077;transition:.55s cubic-bezier(.2,1.5,.3,1)}.ml-liquid input:checked+span{border-color:#b8ff38;box-shadow:inset 0 0 18px rgba(184,255,56,.15)}.ml-liquid input:checked+span i{transform:translateX(40px) scaleX(1.12);background:#b8ff38;box-shadow:0 0 22px #b8ff38}.ml-liquid em{font-style:normal;color:#768b7e}.ml-liquid input:checked~em{color:#b8ff38}`,
    js: `document.querySelector('.ml-liquid input').addEventListener('change',e=>console.log('energy mode:',e.target.checked));`,
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
    tags: ["click", "feedback", "state"],
    dependencies: [],
    html: '<button class="ml-ripple"><span>发送指令</span></button>',
    css: `.ml-ripple{position:relative;overflow:hidden;min-width:150px;padding:14px 24px;border:1px solid #ffb454;background:#171711;color:#ffcc88;font:700 13px ui-monospace,monospace;transition:.35s}.ml-ripple i{position:absolute;width:10px;height:10px;border-radius:50%;background:#ffb454;transform:translate(-50%,-50%) scale(0);animation:ml-ripple .55s ease-out}.ml-ripple.done{color:#07110d;background:#b8ff38;border-color:#b8ff38}@keyframes ml-ripple{to{transform:translate(-50%,-50%) scale(22);opacity:0}}`,
    js: `const button=document.querySelector('.ml-ripple');button.addEventListener('click',e=>{if(button.classList.contains('done'))return;const r=button.getBoundingClientRect(),wave=document.createElement('i');wave.style.left=e.clientX-r.left+'px';wave.style.top=e.clientY-r.top+'px';button.append(wave);setTimeout(()=>{button.classList.add('done');button.querySelector('span').textContent='✓ 指令已发送';wave.remove()},420)});`,
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
    tags: ["tabs", "navigation", "indicator"],
    dependencies: [],
    html: '<div class="ml-tabs"><i></i><button>概览</button><button>动效</button><button>代码</button></div>',
    css: `.ml-tabs{--active:0;position:relative;display:grid;grid-template-columns:repeat(3,1fr);padding:4px;width:270px;border:1px solid #33473b;background:#0b1510}.ml-tabs i{position:absolute;z-index:0;left:4px;top:4px;width:calc((100% - 8px)/3);height:calc(100% - 8px);background:#b8ff38;transform:translateX(calc(var(--active)*100%));transition:.45s cubic-bezier(.2,.9,.25,1)}.ml-tabs button{z-index:1;padding:10px 14px;border:0;background:transparent;color:#87978d;font:12px ui-monospace,monospace;cursor:pointer}.ml-tabs button.active{color:#07110d;font-weight:700}`,
    js: `const tabs=document.querySelector('.ml-tabs'),buttons=[...tabs.querySelectorAll('button')];buttons[0].classList.add('active');buttons.forEach((button,i)=>button.onclick=()=>{tabs.style.setProperty('--active',i);buttons.forEach(x=>x.classList.remove('active'));button.classList.add('active')});`,
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
    tags: ["focus", "search", "input"],
    dependencies: [],
    html: '<label class="ml-search"><span>⌕</span><input placeholder="SEARCH SYSTEM"><button type="button">×</button></label>',
    css: `.ml-search{display:flex;align-items:center;width:48px;height:48px;border:1px solid #465b4f;background:#0b1510;overflow:hidden;transition:.45s cubic-bezier(.2,.9,.2,1)}.ml-search:focus-within{width:280px;border-color:#b8ff38;box-shadow:0 0 28px rgba(184,255,56,.1)}.ml-search span{min-width:48px;text-align:center;color:#b8ff38;font-size:24px}.ml-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#e7f2ea;font:12px ui-monospace,monospace}.ml-search button{border:0;background:transparent;color:#718077;padding:12px;cursor:pointer}`,
    js: `const box=document.querySelector('.ml-search'),input=box.querySelector('input');box.querySelector('button').onclick=()=>{input.value='';input.focus()};`,
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
    tags: ["tilt", "spotlight", "hover"],
    dependencies: [],
    html: '<article class="ml-spot"><small>LIMITED UNIT</small><strong>NEON / 07</strong><p>Experimental interface module</p></article>',
    css: `.ml-spot{--rx:0deg;--ry:0deg;--mx:50%;--my:50%;position:relative;width:250px;padding:28px;border:1px solid #425449;background:radial-gradient(circle at var(--mx) var(--my),rgba(184,255,56,.2),transparent 35%),#101a15;transform:perspective(700px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform .15s;color:#e3eee6}.ml-spot small{color:#b8ff38;font:10px ui-monospace,monospace;letter-spacing:.14em}.ml-spot strong{display:block;margin:45px 0 10px;font:700 30px ui-monospace,monospace}.ml-spot p{margin:0;color:#819085;font:12px ui-monospace,monospace}`,
    js: `const card=document.querySelector('.ml-spot');card.onpointermove=e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',x*100+'%');card.style.setProperty('--my',y*100+'%');card.style.setProperty('--ry',(x-.5)*12+'deg');card.style.setProperty('--rx',(0.5-y)*12+'deg')};card.onpointerleave=()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')};`,
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
    tags: ["notification", "stack", "spring"],
    dependencies: [],
    html: '<div class="ml-toasts"><button>+ 触发通知</button><div class="ml-toast-list"></div></div>',
    css: `.ml-toasts{display:grid;gap:14px;place-items:center}.ml-toasts>button{padding:10px 16px;border:1px solid #b8ff38;background:transparent;color:#b8ff38;font:12px ui-monospace,monospace}.ml-toast-list{display:grid;gap:8px;width:250px}.ml-toast{display:flex;justify-content:space-between;padding:12px 14px;border:1px solid #3d5547;background:#152119;color:#dce9df;font:11px ui-monospace,monospace;animation:ml-toast-in .5s cubic-bezier(.18,1.6,.35,1)}.ml-toast b{color:#b8ff38}@keyframes ml-toast-in{from{opacity:0;transform:translateY(-18px) scale(.88)}}`,
    js: `const root=document.querySelector('.ml-toasts'),list=root.querySelector('.ml-toast-list');let count=0;root.querySelector('button').onclick=()=>{count++;const item=document.createElement('div');item.className='ml-toast';item.innerHTML='<span>状态已同步</span><b>#'+String(count).padStart(2,'0')+'</b>';list.prepend(item);if(list.children.length>3)list.lastElementChild.remove()};`,
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
    tags: ["scramble", "terminal", "reveal"],
    dependencies: ["anime"],
    html: '<button class="ml-decode">MOTION SYSTEM READY</button>',
    css: `.ml-decode{min-width:270px;padding:20px;border:1px solid #b8ff38;background:#08110d;color:#b8ff38;font:700 15px ui-monospace,monospace;letter-spacing:.08em;text-shadow:0 0 12px rgba(184,255,56,.5)}`,
    js: `const target=document.querySelector('.ml-decode'),text='MOTION SYSTEM READY',chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';target.onclick=()=>{let frame=0;const timer=setInterval(()=>{target.textContent=text.split('').map((c,i)=>i<frame/2?c:chars[Math.floor(Math.random()*chars.length)]).join('');frame++;if(frame>text.length*2){clearInterval(timer);target.textContent=text;anime.animate(target,{scale:[.96,1],duration:500,ease:'outBack'})}},35)};target.click();`,
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
    tags: ["stagger", "list", "entrance"],
    dependencies: ["anime"],
    html: '<div class="ml-stagger"><button>REPLAY</button><ul><li><b>01</b>视觉系统</li><li><b>02</b>动效语言</li><li><b>03</b>组件状态</li></ul></div>',
    css: `.ml-stagger{width:270px}.ml-stagger button{margin-bottom:12px;border:0;background:transparent;color:#b8ff38;font:11px ui-monospace,monospace}.ml-stagger ul{display:grid;gap:6px;margin:0;padding:0;list-style:none}.ml-stagger li{display:flex;gap:16px;padding:12px;border:1px solid #34483c;background:#111c16;color:#d9e5dc;font:12px ui-monospace,monospace}.ml-stagger b{color:#ffb454}`,
    js: `const root=document.querySelector('.ml-stagger'),play=()=>anime.animate(root.querySelectorAll('li'),{opacity:[0,1],x:[-24,0],delay:anime.stagger(90),duration:650,ease:'outExpo'});root.querySelector('button').onclick=play;play();`,
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
    tags: ["number", "dashboard", "counter"],
    dependencies: ["anime"],
    html: '<button class="ml-kpi"><small>RENDER SCORE</small><strong>0</strong><em>/100</em></button>',
    css: `.ml-kpi{padding:22px 30px;border:1px solid #394d41;background:#0f1914;color:#dfeae2;text-align:left;font-family:ui-monospace,monospace}.ml-kpi small{display:block;margin-bottom:10px;color:#718478;font-size:10px}.ml-kpi strong{font-size:46px;color:#b8ff38}.ml-kpi em{font-size:12px;color:#718478;font-style:normal}`,
    js: `const button=document.querySelector('.ml-kpi'),number=button.querySelector('strong');button.onclick=()=>{let value=0;number.textContent='0';const timer=setInterval(()=>{value=Math.min(94,value+Math.ceil((94-value)*.18));number.textContent=value;if(value===94){clearInterval(timer);anime.animate(number,{scale:[.8,1],duration:550,ease:'outElastic(1,.5)'})}},32)};button.click();`,
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
    tags: ["validation", "shake", "feedback"],
    dependencies: ["anime"],
    html: '<div class="ml-error"><label>ACCESS CODE<input value="42-X"></label><small>代码格式不正确</small><button>验证</button></div>',
    css: `.ml-error{display:grid;gap:8px;width:270px;font:11px ui-monospace,monospace}.ml-error label{color:#84958a}.ml-error input{box-sizing:border-box;width:100%;margin-top:7px;padding:12px;border:1px solid #44574c;outline:0;background:#0c1510;color:#e5eee8;font:14px ui-monospace,monospace}.ml-error small{opacity:0;color:#ff8b70}.ml-error button{justify-self:start;padding:8px 14px;border:1px solid #b8ff38;background:transparent;color:#b8ff38;font:11px ui-monospace,monospace}`,
    js: `const root=document.querySelector('.ml-error'),input=root.querySelector('input'),hint=root.querySelector('small');root.querySelector('button').onclick=()=>{hint.style.opacity=1;input.style.borderColor='#ff7557';anime.animate(input,{x:[0,-9,8,-6,4,0],duration:520,ease:'outQuad'})};`,
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
    tags: ["timeline", "overlay", "command"],
    dependencies: ["gsap"],
    html: '<div class="ml-command"><button>⌘ K 打开命令</button><section><input placeholder="输入命令…"><p>⌕ 搜索动效</p><p>＋ 新建样本</p><p>↗ 导出 HTML</p></section></div>',
    css: `.ml-command{position:relative;width:290px;font:11px ui-monospace,monospace}.ml-command>button{padding:11px 16px;border:1px solid #58685e;background:#121c16;color:#a5b3aa;font:11px ui-monospace,monospace}.ml-command section{position:absolute;z-index:2;inset:-38px 0 auto;padding:12px;border:1px solid #b8ff38;background:#0b120e;box-shadow:0 20px 60px rgba(0,0,0,.55);visibility:hidden}.ml-command input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #33463a;background:#111c16;color:#e6efe9}.ml-command p{margin:4px 0 0;padding:9px;color:#a8b8ae}.ml-command p:hover{background:#1b2b21;color:#b8ff38}`,
    js: `const root=document.querySelector('.ml-command'),panel=root.querySelector('section');root.querySelector('button').onclick=()=>{gsap.set(panel,{visibility:'visible'});gsap.timeline().fromTo(panel,{opacity:0,scale:.85,y:18},{opacity:1,scale:1,y:0,duration:.35,ease:'back.out(1.7)'}).from(panel.querySelectorAll('p'),{opacity:0,x:-12,stagger:.06},'-=.12')};`,
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
    tags: ["FLIP", "grid", "reorder"],
    dependencies: ["gsap", "flip"],
    html: '<div class="ml-flip"><button>切换排序</button><div><i>A</i><i>B</i><i>C</i><i>D</i></div></div>',
    css: `.ml-flip{width:280px}.ml-flip button{margin-bottom:10px;border:0;background:transparent;color:#b8ff38;font:11px ui-monospace,monospace}.ml-flip>div{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.ml-flip i{display:grid;place-items:center;height:62px;border:1px solid #3b5143;background:#152219;color:#b8ff38;font:700 18px ui-monospace,monospace;font-style:normal}.ml-flip i:nth-child(2n){color:#ffbd68}`,
    js: `gsap.registerPlugin(Flip);const root=document.querySelector('.ml-flip'),grid=root.querySelector('div');root.querySelector('button').onclick=()=>{const state=Flip.getState(grid.children);grid.append(...[...grid.children].reverse());Flip.from(state,{duration:.7,ease:'power3.inOut',stagger:.04})};`,
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
    tags: ["drag", "snap", "touch"],
    dependencies: ["gsap", "draggable"],
    html: '<div class="ml-sheet-stage"><section class="ml-sheet"><i></i><b>拖动面板</b><p>释放后自动吸附到最近位置</p></section></div>',
    css: `.ml-sheet-stage{position:relative;overflow:hidden;width:280px;height:190px;border:1px solid #304439;background:linear-gradient(#0e1913,#08100c)}.ml-sheet{position:absolute;box-sizing:border-box;left:8px;right:8px;bottom:-72px;height:150px;padding:10px 18px;border:1px solid #b8ff38;background:#142219;color:#dbe7de;font:12px ui-monospace,monospace;cursor:grab}.ml-sheet i{display:block;width:38px;height:3px;margin:0 auto 20px;background:#5c7164}.ml-sheet b{color:#b8ff38}.ml-sheet p{color:#809287;font-size:10px}`,
    js: `gsap.registerPlugin(Draggable);const sheet=document.querySelector('.ml-sheet');Draggable.create(sheet,{type:'y',bounds:{minY:-70,maxY:0},onRelease(){gsap.to(sheet,{y:this.y<-35?-70:0,duration:.5,ease:'back.out(1.4)'})}});`,
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
    tags: ["scroll", "stack", "story"],
    dependencies: ["gsap", "scrollTrigger"],
    html: '<div class="ml-scroll"><article>01 / DISCOVER</article><article>02 / TUNE</article><article>03 / EXPORT</article></div>',
    css: `.ml-scroll{box-sizing:border-box;width:290px;height:190px;overflow:auto;padding:12px 12px 120px;background:#0b130f;border:1px solid #33483b;scrollbar-width:thin}.ml-scroll article{position:sticky;top:10px;display:grid;place-items:center;height:100px;margin-bottom:48px;border:1px solid #476052;background:#142119;color:#b8ff38;font:700 13px ui-monospace,monospace;box-shadow:0 12px 30px rgba(0,0,0,.35)}.ml-scroll article:nth-child(2){top:24px;color:#ffbd68}.ml-scroll article:nth-child(3){top:38px;color:#d7e4db}`,
    js: `gsap.registerPlugin(ScrollTrigger);const scroller=document.querySelector('.ml-scroll');gsap.utils.toArray('.ml-scroll article').forEach((card,i)=>gsap.from(card,{scale:.88,opacity:.45,scrollTrigger:{trigger:card,scroller,start:'top bottom',end:'top center',scrub:true}}));`,
  },
];

export const categories = ["全部", ...Array.from(new Set(motions.map((motion) => motion.category)))];
export const engines = ["全部", ...Array.from(new Set(motions.map((motion) => motion.engine)))];
