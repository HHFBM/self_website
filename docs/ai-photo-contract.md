# AI 合照接口契约与状态机

## 1. Endpoint
- `POST /api/v1/ai-photo/generate`
- `Content-Type: multipart/form-data`

## 2. Request Fields
- `self_image` (file, required): 站点中的“本人头像”图片
- `partner_image` (file, required): 访客上传图片
- `prompt` (string, optional): 生成提示词
- `style_preset` (string, optional): `realistic | cinematic | casual`

## 3. Success Response
```json
{
  "request_id": "uuid",
  "status": "succeeded",
  "image_base64": "...",
  "mime_type": "image/png",
  "meta": {
    "provider": "mock|custom",
    "model": "YOUR_MODEL",
    "note": "optional"
  }
}
```

## 4. Error Response
```json
{
  "request_id": "uuid",
  "status": "failed",
  "error": {
    "code": "GENERATION_FAILED",
    "message": "具体错误"
  }
}
```

## 5. 前端状态机
状态集合：
- `idle`
- `validating`
- `uploading`
- `generating`
- `success`
- `error`

状态流转：
- `idle -> validating -> uploading -> generating -> success`
- 任一中间状态失败：`* -> error`
- 用户点击重置：`success/error -> idle`

## 6. 配置入口
- 后端配置文件：`/Users/jason/Documents/personal-site-mvp/.env`
- 示例模板：`/Users/jason/Documents/personal-site-mvp/.env.example`

你后续只需要：
1. 复制 `.env.example` 为 `.env`
2. 填写 `AI_PROVIDER=custom`
3. 填写 `AI_API_URL`、`AI_API_KEY`、`AI_MODEL`
4. 启动后端：`npm run dev:server`
