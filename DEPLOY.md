# 发布说明（Vue + Vite + GitHub Pages）

## 1. 本地开发
```bash
cd /Users/jason/Documents/personal-site-mvp
npm install
npm run dev
```

## 2. 发布方式
仓库已配置 `.github/workflows/deploy-pages.yml`，每次 push 到 `main` 会自动：
1. 安装依赖（`npm ci`）
2. 构建站点（`npm run build`）
3. 发布 `dist` 到 GitHub Pages

## 3. GitHub Pages 设置
1. 打开仓库 `Settings -> Pages`
2. `Source` 选择 `GitHub Actions`
3. 等待工作流 `Deploy Site to GitHub Pages` 成功

## 4. 当前公网地址
默认访问地址：`https://hhfbm.github.io/self_website/`

## 5. 自定义域名（可选）
如果需要绑定域名：
1. 新建 `public/CNAME`，内容写你的域名（例如 `www.example.com`）
2. push 到 `main`
3. 在 Cloudflare DNS 中把 `www` CNAME 到 `hhfbm.github.io`
4. 在 Pages 设置中开启 `Enforce HTTPS`
