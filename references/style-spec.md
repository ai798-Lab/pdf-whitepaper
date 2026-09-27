# ai798 Lab 白皮书风格规范

原型：**OPC 全国政策白皮书**（2026 ai798 Lab）

这份规范是这个 skill 的"灵魂"。CSS / HTML 模板是肌肉，规范是审美决策的依据——为什么这里用宋体不用黑体、为什么 thead 是 2px 不是 1px、为什么 ai798 解析块要左竖线而不是右竖线，答案都在这里。

修改 CSS 之前**必须**读完本文档，否则会丢掉编辑级气质。

---

## 0. 一句话风格定位

> 黑白极简编辑级 + 暖白底纸感 + 宋体大字气场 + Mono 编号系统的精确感 + 一抹蓝（仅用于链接）

参考坐标：**FT / Bloomberg / 经济学人 / Stripe Press / Notion 内部文档**。
不是：彩色 PPT、扁平 SaaS 落地页、马卡龙渐变、emoji 表情包。

---

## 1. 颜色（CSS 变量已定义）

| 变量 | 值 | 用途 |
|---|---|---|
| `--ink` | `#1a1a1a` | 标题、强 emphasis、表格关键边线 |
| `--ink-soft` | `#2d2d2d` | 引语、ai798 解析正文 |
| `--text` | `#3d3d3d` | 正文 |
| `--text-soft` | `#6b6b68` | 副标、说明、次要信息 |
| `--text-mute` | `#9b9a97` | 极细线、tag、页码、edition、source |
| `--line` | `#e7e6e3` | 普通分隔线 |
| `--line-strong` | `#d3d2cf` | 加强分隔线（note 上下线） |
| `--bg` | `#ffffff` | 页面底色 |
| `--bg-soft` | `#faf9f7` | policy-glance 卡片底（极淡暖白） |
| `--bg-warm` | `#f4f2ee` | ai798-analysis 卡片底（明显暖白） |
| `--accent` | `#1e3a5f` | 深海军蓝，**仅用于链接和极少 label** |
| `--accent-soft` | `#f0f3f7` | accent 极淡变体（保留备用） |

**红线**：
- 不引入第二个强调色
- 不用纯蓝 / 纯红 / 纯绿——这套系统就一抹深海军蓝，多了破气场
- 不引入渐变 / 阴影 / 玻璃毛 / 霓虹

---

## 2. 字体堆栈

```css
--serif: "Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", "STSong", serif;
--sans:  "PingFang SC", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif;
--mono:  "SF Mono", "Menlo", "Source Han Mono SC", monospace;
```

**用法**：

| 元素 | 字体 | 字号 |
|---|---|---|
| 封面大标题 | serif 800 weight | 72pt |
| 封面英文副标 | serif italic | 14pt |
| 封面引导句 | serif italic | 13pt |
| 章节大标题 (chapter-title) | serif 800 | 32pt |
| 章节引语 (chapter-lead) | serif italic | 12pt |
| h1 | serif 800 | 36pt |
| h2 | serif 700 | 22pt |
| h3 | serif 700 | 14pt |
| h4 | sans 700 | 11pt（注意：h4 用无衬线，区别于上层标题） |
| 正文 p | sans | 10.5pt / line-height 1.75 |
| 表格 | sans | 9.5pt（compact 9pt） |
| ai798 解析正文 | serif | 10pt（突出与正文区别） |
| 引用块 blockquote | serif italic | 12pt |
| 章节编号 PART ONE / PREFACE | serif italic | 14pt |
| 编号、tag、edition、page、source | mono | 7.5pt~9pt（letter-spacing 0.05-0.2em） |

**红线**：
- **不引入网络字体**（Web Fonts），只用系统字体堆栈——保证离线渲染、跨平台一致
- 中文优先于英文：堆栈第一个永远是中文字体
- 不混用 7+ 字号——规范里这些档位够用

---

## 3. 页面 (A4 / Paged Media)

```
@page {
  size: A4;
  margin: 22mm 22mm 18mm 22mm;  /* 上 右 下 左 */
}
```

**页脚**（`@page` margin-box）：
- 左下：章节名（mono 8pt 灰色，由 `string-set: chaptername` 跑动注入）
- 右下：页码 `decimal-leading-zero`（001 / 002 / 003 / ...）
- 首页（封面）无页脚（`@page :first` 覆盖）

**红线**：
- 不调页边距——22mm 是给宋体大字留呼吸的最小值
- 不改页码风格（不用 1/2/3、不用罗马数字、不用 P.1 / Page 1）
- 不在页眉放任何东西——所有信息留底部

---

## 4. 章节起始页

每个新章节都是从新页开始，结构固定为三段：

```
PART ONE                     ← chapter-num (mono italic, gray)
{大字章节标题}                ← chapter-title (serif 800, 32pt)
{宋体斜体引语}                ← chapter-lead (serif italic)
```

例：
```
PART ONE
概念前置
什么是 OPC，它和个体户、个人独资企业有什么区别，2024 新公司法改了什么。
```

**红线**：
- chapter-num 永远用英文大写："PART ONE / TWO / THREE / FOUR / FIVE / SIX / SEVEN / EIGHT / PREFACE / APPENDIX / CONTACT / CONTENTS"
- chapter-title ≤ 8 字，超字数考虑改章节名
- chapter-lead 一句话，承上启下，**用宋体斜体**

---

## 5. 组件清单（13 个）

完整 HTML 在 `templates/components.html`，这里只总结特征。

| 组件 | 标识 | 关键特征 | 用途 |
|---|---|---|---|
| 封面 | `.cover` | 黑顶 brand band + 大字宋体 + 数据带 + 底部 | 第 1 页 |
| 目录 | `.toc` | mono 编号 + serif 章节名 + sans desc + mono 页码 | 第 2 页 |
| 章节扉页 | `data-newchapter="true"` | PART ONE + chapter-title + chapter-lead | 每章首页 |
| 表格 | `<table>` | thead 上 2px 黑 / 下 1px 黑，最后行加粗黑底线 | 数据对比 |
| ai798 解析 | `.ai798-analysis` | 左竖黑线 + 暖灰底 + 黑底白字 mono tag + 宋体 body | **每章 1-3 个** |
| 政策速览卡 | `.policy-glance` | 黑边框 + 暖白底 + head 标题+大写英文 tag | 章节开头 |
| 注释 | `.note` | 上下双线 + 灰色 + note-label 大写 | 风险提示 |
| 图表块 | `.figure` | FIGURE NN（mono）+ caption（serif）+ img + source（mono） | 信息图 |
| 城市/分组 | `.city-header` + `.community` | 底部黑线 + 子项卡片 | 按地区/部门 |
| 标签 | `.label` / `.label-ink` / `.label-accent` | 70pt 宽迷你边框 | 表格内状态 |
| 数据卡 | `.data-card` | 细边框简单卡 | 双栏 KPI |
| 引语 | `<blockquote>` | 左 2px 黑线 + serif italic | 开篇金句 |
| 联系卡 | `.contact-card` | 边框 + 居中 + 二维码 56mm | 联系页 |

---

## 6. 分页约束（Paged.js 关键技术）

这是 PDF 排版最容易出问题的部分。CSS 已经定好下面这套约束，**不要轻易改**：

### 6.1 标题不能孤儿（页底悬挂）
```css
h1, h2, h3, h4 {
  break-after: avoid !important;
  page-break-after: avoid !important;
}
```

### 6.2 紧跟标题的元素不能从新页开始
```css
h2 + p, h2 + table, h2 + .policy-glance, h2 + .ai798-analysis,
h3 + p, h3 + table, ... {
  break-before: avoid !important;
}
```

### 6.3 关键卡片不可被切两半
```css
.policy-glance, .ai798-analysis, .data-card, .figure, .note,
.community, .contact-card {
  break-inside: avoid !important;
}
```

### 6.4 表格特殊处理
```css
thead { display: table-header-group; }   /* 跨页时 thead 自动重复 */
tr { break-inside: avoid; }              /* 单行不会切两半 */
table { break-inside: auto; }            /* 但整张表允许跨页 */
```

如果某张表必须整张不切，给它的父元素加 `class="figure"` 或 inline `style="break-inside: avoid"`。

### 6.5 跑动章节名
```css
.bookpage { string-set: chaptername attr(data-chapter); }
.runchapter { position: running(runchapter); }
@page { @bottom-left { content: element(runchapter); } }
```

每个 `<div class="bookpage" data-chapter="第 01 部分 · 概念前置">` 内部都要有 `<div class="runchapter">第 01 部分 · 概念前置</div>` 和 data-chapter 属性同名——这样左下页脚才会显示当前章节名。

---

## 7. 内容写作红线

排版只是壳，文风才是肉。白皮书内容必须遵守：

### 7.1 数据必须有信源
- 图表 → `figure-source` 写信源（mono 小字）
- 段落数据 → 段末或下一段开头加 `<small>` 标信源
- 政策、补贴、文号 → 必须能追溯到首都之窗 / 财政部 / 国务院 / 各地政府门户等 S 级源

### 7.2 ai798 Lab 解析块不能省
- 每章至少 1 个、建议 2~3 个
- 必须是**独立观点**，不重复正文
- 内容来源：ai798 Lab 实践数据、ZOPC 复盘、用户案例、和平/辛一/金小喵的判断
- 不写"客观分析"——客观分析放在正文，解析块就是要有立场

### 7.3 中文标点 / 政治合规 / 反 AI 味
完全继承项目 CLAUDE.md 的红线：
- 中文全角标点（，。：；！？（）），不混半角
- "中国" → "国内" / "咱们国内"
- 不用 "扎心 / 翻译成人话 / 与此同时 / 说白了" 等 AI 套话
- 不用反转对仗句式（"这不叫 X，这叫 Y"）
- 狐狸式表达（概率化、多视角、可证伪），不写绝对化预测
- AI 专业词第一次出现时括号注解（参考 `~/.claude/skills/anti-ai-slop/ai-terms-2026.md`）

### 7.4 AI 制图规范
- 图表 PNG 用 `infographic` skill 生成，宽度 ≥ 1080px
- 风格延续主题：黑白 + 一抹深海军蓝 + 宋体大数字
- 别用 Chart.js 默认的彩色配色——会跟正文气质冲突

---

## 8. 整体页面节奏

一份合格的白皮书应该有这种 "高低起伏" 的视觉节奏：

```
封面（极简爆点） →
目录（mono 编号+干净分行） →
序言（lead 引语+双栏编辑说明，文气重） →

PART ONE（大字扉页，重）
  二级标题（轻）
  正文段落（轻）
  表格（精确）
  ai798 解析（重，提一口气）
  正文段落（轻）
  政策速览卡（精确）
  注释（说明）

PART TWO（再起一波）
  ...

附录（数据感重，速查表 + 信源清单）
联系页（回到品牌，宋体大字 brand block 收束）
```

**关键判断**：每翻一页都要有节奏感的"起伏"——大字 / 大段正文 / 表格 / 卡片 / 解析 / 注释 交替出现。如果连续 3 页都是纯正文，把第二页改成表格或卡片。

---

## 9. 改造点（用户改什么、不改什么）

### 9.1 可以改
- 封面标题文案 / 数据带 4 个数字 / 引导句
- brand logo（替换 `images/ai798lab_logo.png`）
- 联系页二维码（替换 `images/qr_*.png`）
- 章节顺序 / 数量 / 内容
- 图表 PNG（用 infographic skill 自己生成）

### 9.2 别改（除非有明确理由）
- 颜色变量（特别是 accent 蓝）
- 字体堆栈
- 字号档位
- 页边距 / 页脚结构
- 分页约束（h1-h4 break-after avoid 等）
- thead 边线粗细 / 颜色
- ai798 解析 / policy-glance / note 的视觉特征

如果用户要"换个色调"或"加点彩色"，先问一下："你看 OPC 白皮书黑白底现在的气场，是不是这个气场？" 黑白底是这套风格的根基，染色基本等于换风格。

### 9.3 绝对不改
- 这份风格规范本身（除非全面升级 v2，需要保留 v1 副本）
- ai798 Lab brand 标语 "Zero to One Person Company / 我们帮你从零走到一"
