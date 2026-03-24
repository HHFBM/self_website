import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { generateCoPhoto } from './services/aiPhotoService.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 8787)
const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || 8)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadMb * 1024 * 1024,
  },
})

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_, res) => {
  res.json({
    ok: true,
    service: 'ai-photo-proxy',
    provider: process.env.AI_PROVIDER || 'mock',
    timestamp: new Date().toISOString(),
  })
})

app.post(
  '/api/v1/ai-photo/generate',
  upload.fields([
    { name: 'self_image', maxCount: 1 },
    { name: 'partner_image', maxCount: 1 },
  ]),
  async (req, res) => {
    const requestId = randomUUID()
    const selfImage = req.files?.self_image?.[0]
    const partnerImage = req.files?.partner_image?.[0]

    if (!selfImage || !partnerImage) {
      return res.status(400).json({
        request_id: requestId,
        status: 'failed',
        error: {
          code: 'MISSING_IMAGES',
          message: 'self_image and partner_image are both required.',
        },
      })
    }

    try {
      const result = await generateCoPhoto({
        requestId,
        selfImage,
        partnerImage,
        prompt: req.body?.prompt || '',
        stylePreset: req.body?.style_preset || 'realistic',
      })

      return res.json({
        request_id: requestId,
        status: 'succeeded',
        image_base64: result.buffer.toString('base64'),
        mime_type: result.mimeType,
        meta: {
          provider: result.provider,
          model: result.model,
          note: result.note || '',
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown server error'
      return res.status(500).json({
        request_id: requestId,
        status: 'failed',
        error: {
          code: 'GENERATION_FAILED',
          message,
        },
      })
    }
  },
)

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'failed',
      error: {
        code: 'UPLOAD_INVALID',
        message: `Upload error: ${error.message}`,
      },
    })
  }

  return res.status(500).json({
    status: 'failed',
    error: {
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown internal error',
    },
  })
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AI photo proxy listening on http://localhost:${port}`)
})
