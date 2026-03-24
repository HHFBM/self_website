# 发布说明（GitHub Pages + Cloudflare）

## 1. 推送到 GitHub
```bash
cd /Users/jason/Documents/personal-site-mvp
git init
git add .
git commit -m "setup github pages deploy"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. 开启 GitHub Pages（Actions 模式）
1. 打开仓库 `Settings -> Pages`
2. `Source` 选择 `GitHub Actions`
3. 等待 workflow `Deploy Site to GitHub Pages` 成功

## 3. 修改 CNAME
把根目录 `CNAME` 文件中的 `www.your-domain.com` 改成你的真实域名再 push。

## 4. Cloudflare DNS 配置
- `www` 记录：`CNAME` 到 `<your-username>.github.io`（可开启代理）
- 根域 `@`：
  - 方案 A：`A` 记录到 `185.199.108.153`
  - 方案 B：`A` 记录到 `185.199.109.153`
  - 方案 C：`A` 记录到 `185.199.110.153`
  - 方案 D：`A` 记录到 `185.199.111.153`

## 5. HTTPS
在 GitHub Pages 设置中开启 `Enforce HTTPS`。

## 6. 后续更新
每次 `git push` 到 `main` 都会自动触发重新发布。
