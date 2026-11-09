# Motion Lab 后续修改说明

这份文件记录项目结构、设计约束和发布方式，方便之后继续修改。优先修改源码，不要直接编辑 `dist/` 或 `docs/index.html` 中的构建结果。

## 1. 当前产品方向

- 产品定位：给设计师使用的 Web 动效情绪板与可复制交互组件库。
- 网站外壳：保持一套 Editorial Minimalism 视觉，不再切换整站视觉系统。
- 组件内容：每个组件可以拥有不同风格，并通过风格标签筛选。
- 首页语言：以英文为主，保持轻量、安静、编辑感。
- 详情页语言：允许用中文解释组件用途，并集中承载参数、速度、代码和复制功能。
- 当前规模：54 个组件、9 个类别。
- 交付形态：React 工程、离线单文件 HTML、GitHub Pages 在线版本。

## 2. 重要文件

| 文件 | 用途 |
| --- | --- |
| `app/motion-data.ts` | 动效元数据、标签、分类、依赖及可复制的 HTML/CSS/JS 源码 |
| `app/motion-lab.tsx` | 首页、分类行、筛选器、详情页和 React 预览组件 |
| `app/globals.css` | 网站视觉、响应式规则和内置预览样式 |
| `app/glossary-data.ts` | Tag Glossary 的术语与说明 |
| `standalone/main.tsx` | 单文件构建入口 |
| `tests/` | 数据完整性、渲染结果和复制片段测试 |
| `docs/index.html` | `npm run build:pages` 自动生成的 GitHub Pages 文件 |

## 3. 新增一个组件

### 通用组件

适合复用统一预览结构的组件：

1. 在 `app/motion-data.ts` 的 `archiveVariantSpecs` 中添加定义。
2. 如果是新类别，扩展分类类型、分类元数据和分类样式。
3. 在 `archiveVariantCss` 中补充可复制片段所需的 `.ml-*` 样式。
4. 在 `app/globals.css` 中补充网站预览所需的 `.variant-*` 样式。
5. 更新 README 与本文件中的组件数量。

### 独立 React 预览

适合交互逻辑复杂、需要独立参数控制的组件：

1. 在 `app/motion-data.ts` 中添加完整的 `MotionDefinition`。
2. 在 `app/motion-lab.tsx` 中实现预览组件。
3. 把组件注册到 `demoMap`。
4. 同步提供可以脱离 React 运行的 HTML、CSS 和 JavaScript。

每个定义至少需要稳定的 `id`、英文标题、中文用途说明、类别、风格标签、引擎、依赖、源码和参数定义。

## 4. 视觉与交互约束

- 桌面端每行最多展示 6 个组件，窄屏自然降列。
- 卡片不使用粗黑边，不堆叠多层矩形框。
- 卡片名称与风格元信息保持相近字号和一致基线。
- 首页只负责浏览、筛选和打开详情，不放重型控制。
- 参数、播放速度、代码页签和复制集中在详情页。
- 动效默认循环；离开视口或暂停页面时停止持续动画。
- 支持 `prefers-reduced-motion`，静止状态也应保持可读。
- 全局主题色通过 CSS 变量传递，新增组件应响应主题色。
- 每次改动都检查桌面、窄屏、触屏和详情页叠层关系。

## 5. 修改后的检查

```bash
npx tsc --noEmit
npm run lint
npm test
git diff --check
```

浏览器中至少确认：

- 首页 9 个类别都能显示。
- 搜索、分类、风格、实现方式和收藏筛选可用。
- 全局主题色会同步更新全部支持主题色的组件。
- 详情页不会与首页搜索栏或顶部元素重叠。
- 参数、速度和复制代码功能可用。
- 页面拉窄后没有文字溢出或控件重叠。

## 6. 构建与发布

普通离线构建：

```bash
npm run build
```

生成 GitHub Pages 文件：

```bash
npm run build:pages
```

该命令会生成：

- `dist/motion-lab.html`
- `dist/motion-lab-moodboard.html`
- `docs/index.html`

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动测试、构建并发布到：

<https://kleinislandzzn-web.github.io/motion-lab/>

## 7. 已确认的长期决策

- 整站只保留一个主视觉，组件自身可以拥有不同视觉风格。
- 旧的 PHOSPHOR、HYPER、INDEX、GLYPH、EFFERD 整站版本保留在 Git 历史中，不继续作为主界面切换项。
- 复制片段要能在普通 HTML 中运行，第三方依赖使用明确的版本化 CDN。
- 在线版本与离线版本保持同一份内容。
- 项目不使用账号或后端，用户偏好只写入浏览器本地。
