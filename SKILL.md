---
name: pdf-whitepaper
description: |
  把内容做成 ai798 Lab 风格的 A4 PDF 白皮书——黑白极简编辑级版式、宋体大字封面、Mono 编号系统、Paged.js 精准分页。
  适用于行业研究报告、政策解读白皮书、社群手册、年度复盘、产品白皮书等需要"权威感+设计感"的长篇 PDF。
  原型：OPC 全国政策白皮书（2026 ai798 Lab）。
  触发短语：做白皮书、白皮书 PDF、PDF 白皮书、做成白皮书、白皮书排版、ai798 白皮书、做成 PDF、生成 PDF、whitepaper、研究报告 PDF、policy paper
---

# PDF 白皮书 Skill — ai798 Lab 风格

把一份 Markdown / 草稿内容固化成一本 A4 PDF 白皮书。视觉系统、版式、分页约束全部锁死，用户只需要喂内容。

---

## 什么时候用这个 Skill

适用：
- 行业研究报告 / 政策解读白皮书 / 趋势观察白皮书
- 社群手册 / 产品白皮书 / 年度复盘
- 任何需要"封面+目录+多章节+图表+联系页"的长篇 PDF（一般 20-80 页）

不适用：
- 单页海报 → 用 `frontend-design` / `infographic`
- 公众号文章 → 用 `md2wechat`
- 小红书轮播 → 用 `xhs`
- PPT 演示 → 用 `ui-ux-design-system` 的 slide 模式

---

## 工作流（4 步）

### Step 1 — 读规范

**必读** `references/style-spec.md`，里面有：
- 颜色 / 字号 / 间距 / 字体堆栈完整变量
- 全部组件清单（封面、目录、章节扉页、政策速览卡、ai798 解析块、note、figure、city-header、community、contact-card）
- Paged.js 分页约束（哪些 break-inside avoid、哪些 break-after avoid）
- 红线（什么不能改、什么可以改）

不读规范直接动手，会做出"形似神不似"的东西——丢失编辑级气质。

### Step 2 — 准备工作目录

在用户的项目下建工作目录（建议结构）：

```
你的白皮书项目/
  04_PDF生产/
    assets/
      whitepaper.css       ← 从 skill 复制
    html/
      whitepaper.html      ← 从 skill 复制 skeleton 后填内容
    images/
      logo.png
      qr_official.png
      qr_assistant.png
      figure_01_xxx.png    ← 图表 PNG
      ...
    scripts/
      generate-pdf.js      ← 从 skill 复制
    output.pdf             ← 最终产物
```

执行：
```bash
cp ~/.claude/skills/pdf-whitepaper/assets/whitepaper.css ./04_PDF生产/assets/
cp ~/.claude/skills/pdf-whitepaper/templates/skeleton.html ./04_PDF生产/html/whitepaper.html
cp ~/.claude/skills/pdf-whitepaper/scripts/generate-pdf.js ./04_PDF生产/scripts/
```

### Step 3 — 填内容

打开 `whitepaper.html`，按 skeleton 的注释提示填：

1. **封面**：标题（≤8 字最佳，宋体 72pt）/ 英文副标 / 引导句 / 4 个数据格 / 期号
2. **目录**：每章一行，编号（序/01/02/.../附）、章节名、一句话 desc、页码（先留空，渲染后回填）
3. **序言 / Preface**：lead 引语 → 正文 → 编辑说明双栏
4. **章节**：每章 `bookpage data-newchapter="true"` 开头，`PART N` mono 标 + 大字 chapter-title + chapter-lead 引语
5. **章节内**：自由用 h2/h3/h4 + p + table + 各种卡片组件（components.html 里全都有片段）
6. **附录**：速查表 + 信源清单 + 关于本白皮书
7. **联系我们**：双栏 contact-card + 二维码 + 底部 brand block

可用组件清单见 `templates/components.html`，照抄结构改字即可。

**红线**（违反一条都会出戏）：
- 中文全角标点（，。：；！？（）），不混半角
- 数据要标信源（mono 小字写在 figure-source 或段末）
- ai798 Lab 解析块用 `<div class="ai798-analysis">`，每章至少 1 个，提供独立判断
- 表格 thead 用 2px 黑顶线 + 1px 黑底线，最后一行加粗——CSS 里已经定好，别动
- 图片放 `images/` 下，相对路径 `../images/xxx.png`
- 字体堆栈：中文优先（Source Han Serif → Songti SC），不引网络字体

### Step 4 — 渲染 PDF

```bash
cd 你的白皮书项目/04_PDF生产
node scripts/generate-pdf.js
```

脚本默认输出 `whitepaper.pdf` 到 04_PDF生产 根目录。

**前置要求**：
- 需要 puppeteer（`npm install -g puppeteer` 或本地 `npm i puppeteer`）
- 需要 paged.js（脚本通过 unpkg CDN 加载，需要联网；离线场景把 polyfill 下到本地改 script src）

Paged.js 渲染通常需要 30-180 秒（页数越多越慢），脚本会等待 `.pagedjs_pages` 出现再导出 PDF。

### Step 5 — 回填页码 / 校对

第一次渲染完，PDF 里的目录页码是占位（001/002 等）。打开 PDF 看每章实际起始页，回填到 `whitepaper.html` 的 `.toc-page` 里，再跑一遍 `generate-pdf.js`。

校对清单：
- [ ] 封面字号 / 数据带对齐
- [ ] 章节扉页 chapter-num（PART ONE/TWO/...）正确
- [ ] 表格不被切断在页底（thead 重复出现说明跨页正常）
- [ ] ai798 解析块 / policy-glance / note 没有跨页
- [ ] 页脚 chapter 名 + 页码出现在每页（首页除外）
- [ ] 目录页码正确

---

## 文件清单

```
~/.claude/skills/pdf-whitepaper/
├── SKILL.md                       本文件
├── assets/
│   └── whitepaper.css             完整 CSS（A4 paged media，640+ 行）
├── templates/
│   ├── skeleton.html              空白骨架（封面+目录+章节+附录+联系页 全套）
│   └── components.html            所有组件 HTML 片段（直接复制粘贴）
├── scripts/
│   └── generate-pdf.js            Puppeteer + Paged.js 渲染脚本
└── references/
    └── style-spec.md              风格规范（颜色/字号/组件/分页约束/红线）
```

## 调用其他 Skill

- 章节里的图表（决策树、时间线、地图、条形图）→ 用 `infographic` 做成 1080×1440 PNG，放 images/ 引用
- 章节文风优化 → 用 `writing-style`（小顾+巫师财经融合）
- 去 AI 味 → 用 `anti-ai-slop`
- 三方审视 → 用 `content-review`

## 改造点（用户可改）

固定不动的：版式、字体堆栈、颜色变量、分页约束、组件结构。
可以改的：
- 封面标题文案 / 数据带 4 个数字 / 引导句
- brand logo（替换 `images/ai798lab_logo.png`）
- 联系页二维码（替换 `images/qr_*.png`）
- 章节顺序 / 数量 / 内容
- 图表 PNG（自己生成，宽度 100%）
- 强调色 `--accent: #1e3a5f`（深海军蓝，只用于链接和极少 label，可改但不建议）

---

## 故障排查

**Puppeteer 报错找不到模块**：
```bash
which puppeteer || npm install -g puppeteer
```
脚本里默认引用全局路径 `~/.npm-global/lib/node_modules/puppeteer`，按本地环境改。

**Paged.js 不出现 `.pagedjs_pages`**：
- 检查 HTML head 里 `<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>` 是否加载成功
- 内容超大（>200 页）可能超时，把 generate-pdf.js 里 `timeout: 180000` 调到 300000

**字体显示成方块**：
- macOS 自带苹方/思源，正常
- 服务器渲染需要装中文字体包，或改 CSS 字体堆栈引用本地字体文件

**表格在页底被切**：
- CSS 已经做了 `tr { break-inside: avoid }`，单行不会被切，但整张表格允许跨页
- 如果整张表格不能跨页，给表格父元素加 `class="figure"` 或 inline `style="break-inside: avoid"`
