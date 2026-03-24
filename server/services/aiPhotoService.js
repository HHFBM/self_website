const DEFAULT_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 60_000)

function getAuthHeader() {
  const key = process.env.AI_API_KEY || ''
  const headerName = process.env.AI_API_AUTH_HEADER || 'Authorization'
  const scheme = process.env.AI_API_AUTH_SCHEME || 'Bearer'

  if (!key) return null
  const value = scheme ? `${scheme} ${key}` : key
  return { [headerName]: value }
}

function parseDataUri(dataUri) {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUri)
  if (!match) return null

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  }
}

async function callExternalProvider({ selfImage, partnerImage, prompt, stylePreset }) {
  const apiUrl = process.env.AI_API_URL
  const provider = process.env.AI_PROVIDER || 'custom'
  const model = process.env.AI_MODEL || 'UNSET_MODEL'

  if (!apiUrl) {
    throw new Error('AI_API_URL is missing. Set it in .env before using external provider.')
  }

  const body = new FormData()
  body.append('self_image', new Blob([selfImage.buffer], { type: selfImage.mimetype }), selfImage.originalname)
  body.append(
    'partner_image',
    new Blob([partnerImage.buffer], { type: partnerImage.mimetype }),
    partnerImage.originalname,
  )
  body.append('prompt', prompt)
  body.append('style_preset', stylePreset)
  body.append('model', model)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const headers = {
      ...(getAuthHeader() || {}),
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })

    if (!response.ok) {
      const raw = await response.text()
      throw new Error(`External API failed (${response.status}): ${raw.slice(0, 300)}`)
    }

    const payload = await response.json()

    if (payload.image_base64) {
      return {
        buffer: Buffer.from(payload.image_base64, 'base64'),
        mimeType: payload.mime_type || 'image/png',
        provider,
        model,
        note: payload.note || '',
      }
    }

    if (payload.image_data_uri) {
      const parsed = parseDataUri(payload.image_data_uri)
      if (!parsed) {
        throw new Error('External API returned invalid image_data_uri.')
      }
      return {
        buffer: parsed.buffer,
        mimeType: parsed.mimeType,
        provider,
        model,
        note: payload.note || '',
      }
    }

    if (payload.image_url) {
      const imageRes = await fetch(payload.image_url)
      if (!imageRes.ok) {
        throw new Error(`Fetching image_url failed (${imageRes.status}).`)
      }
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer())
      return {
        buffer: imageBuffer,
        mimeType: imageRes.headers.get('content-type') || 'image/png',
        provider,
        model,
        note: payload.note || '',
      }
    }

    throw new Error('External API response must include image_base64, image_data_uri, or image_url.')
  } finally {
    clearTimeout(timer)
  }
}

export async function generateCoPhoto({ selfImage, partnerImage, prompt, stylePreset }) {
  const provider = process.env.AI_PROVIDER || 'mock'
  const model = process.env.AI_MODEL || 'UNSET_MODEL'

  if (provider === 'mock') {
    return {
      buffer: partnerImage.buffer,
      mimeType: partnerImage.mimetype || 'image/jpeg',
      provider,
      model,
      note: 'Mock mode: returns partner image directly. Configure AI_PROVIDER and API vars for real generation.',
    }
  }

  return callExternalProvider({
    selfImage,
    partnerImage,
    prompt,
    stylePreset,
  })
}
