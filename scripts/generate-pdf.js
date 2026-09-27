// ai798 Lab 白皮书 PDF 生成器
// 用 Paged.js 在浏览器里完成 CSS Paged Media 分页，再用 Puppeteer page.pdf() 导出 A4 PDF。
//
// 用法：
//   node generate-pdf.js                              # 默认渲染 ../html/whitepaper.html → ../whitepaper.pdf
//   node generate-pdf.js path/to/input.html out.pdf   # 自定义输入 / 输出
//
// 环境：
//   node >= 16
//   puppeteer 已安装（全局或本地都可，脚本会按顺序尝试）

const path = require('path');
const fs = require('fs');

function resolvePuppeteer() {
  // 1) 本地 node_modules
  try { return require('puppeteer'); } catch (_) {}
  // 2) 用户全局 npm（macOS 默认路径）
  const globalPaths = [
    '~/.npm-global/lib/node_modules/puppeteer',
    '/usr/local/lib/node_modules/puppeteer',
    '/opt/homebrew/lib/node_modules/puppeteer',
  ];
  for (const p of globalPaths) {
    if (fs.existsSync(p)) {
      try { return require(p); } catch (_) {}
    }
  }
  throw new Error(
    '找不到 puppeteer。请先安装：\n' +
    '  npm install -g puppeteer\n' +
    '或在项目里：\n' +
    '  npm install puppeteer'
  );
}

(async () => {
  const inputArg = process.argv[2];
  const outputArg = process.argv[3];

  const inputPath = path.resolve(
    inputArg || path.join(__dirname, '..', 'html', 'whitepaper.html')
  );
  const outputPath = path.resolve(
    outputArg || path.join(path.dirname(inputPath), '..', 'whitepaper.pdf')
  );

  if (!fs.existsSync(inputPath)) {
    console.error(`× 输入文件不存在：${inputPath}`);
    process.exit(1);
  }

  const puppeteer = resolvePuppeteer();

  console.log(`→ 启动 Chromium...`);
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files',
      '--disable-web-security',
    ],
  });

  const page = await browser.newPage();
  page.on('console', (msg) => console.log(`[browser:${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log(`[error]`, err.message));

  console.log(`→ 打开 ${inputPath}`);
  await page.goto('file://' + inputPath, {
    waitUntil: 'load',
    timeout: 120000,
  });

  console.log(`→ 等待 Paged.js 渲染（页数越多越慢，30~180 秒）...`);
  try {
    await page.waitForFunction(
      () =>
        document.querySelector('.pagedjs_pages') &&
        document.querySelectorAll('.pagedjs_page').length > 0,
      { timeout: 300000, polling: 2000 }
    );
  } catch (e) {
    console.error('× 等待 Paged.js 超时。检查：');
    console.error('  1. HTML head 是否引入了 paged.polyfill.js');
    console.error('  2. 是否能访问 https://unpkg.com（或换本地副本）');
    console.error('  3. 内容是否过大（>200 页）');
    await browser.close();
    process.exit(1);
  }

  // 多等几秒确保渲染稳定
  await new Promise((r) => setTimeout(r, 5000));

  const pageCount = await page.evaluate(
    () => document.querySelectorAll('.pagedjs_page').length
  );
  console.log(`✓ Paged.js 已完成分页：${pageCount} 页`);

  console.log(`→ 导出 PDF...`);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    preferCSSPageSize: true,
  });

  await browser.close();

  const sizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`✓ 输出：${outputPath} (${sizeMB} MB)`);
})().catch((err) => {
  console.error('× 渲染失败：', err);
  process.exit(1);
});
