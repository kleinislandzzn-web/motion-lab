# Motion Lab

一个面向设计师的 Web 动效情绪板与可复制交互组件库。

浏览组件、调整参数、切换播放速度，并从详情页复制 HTML、CSS、JavaScript 或完整片段。网站本体采用 Editorial Minimalism 视觉，组件内部可以保留各自不同的视觉风格。

## 在线访问

[打开 Motion Lab](https://kleinislandzzn-web.github.io/motion-lab/)

当前版本包含 54 个组件、9 个类别，支持全局主题色、浅色/深色预览、风格与实现方式筛选、收藏、参数调节和代码复制。

## 本地运行

要求 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run lint
npm test
npm run build
npm run build:pages
```

## 项目入口

- `app/motion-data.ts`：全部动效定义、元数据和可复制源码
- `app/motion-lab.tsx`：网站界面与预览组件
- `app/globals.css`：网站和动效预览样式
- `app/glossary-data.ts`：标签词典
- `tests/`：组件与复制片段测试
- `docs/index.html`：自动生成的 GitHub Pages 文件，请勿直接修改

更完整的维护说明见 [PROJECT_NOTES.md](./PROJECT_NOTES.md)。

## 数据范围

收藏、筛选偏好、主题色与减少动效设置仅保存在浏览器本地，不上传账号数据。
