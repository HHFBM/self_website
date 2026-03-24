<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import defaultProfilePhoto from './assets/profile-default.jpg'

const ROWS = 20
const COLS = 10

const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], color: 1 },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 2,
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 3,
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 4,
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 5,
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 6,
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 7,
  },
]

const PIECE_COLORS = [
  'rgba(0,0,0,0)',
  '#55d4ff',
  '#ffd166',
  '#ff8d6f',
  '#7cf29a',
  '#b78dff',
  '#70a4ff',
  '#ff6b97',
]

const navItems = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'projects', label: '项目' },
  { id: 'hobbies', label: '爱好' },
  { id: 'upload', label: '上传' },
  { id: 'contact', label: '联系' },
]

const stats = [
  { label: '生成结构合规率', target: 95, suffix: '%+' },
  { label: 'RAG 准确率提升', target: 25, suffix: '%' },
  { label: '链路效率提升', target: 30, suffix: '%' },
]

const projects = [
  {
    title: 'Deep Research Agent（RAG 增强）',
    tag: ['llm'],
    text: '构建 Query → Retrieval → Generation 管线，融合 BM25 与向量检索，并加入 LLM-as-Judge 自动评估重写闭环。',
    bullets: ['问答准确率提升 15%–25%', '复杂问题处理稳定性显著提升'],
  },
  {
    title: 'AlphaFold + ProteinX 蛋白质结构预测',
    tag: ['llm', 'bio'],
    text: '在多卡集群进行 SFT / DPO 训练与结构分类流程整合，贯通 Supfam、Dali 等工具链。',
    bullets: ['预测准确率提升约 5%', '结构类别归类准确率接近 98%'],
  },
  {
    title: 'Tph-YOLOv5 模型优化',
    tag: ['cv'],
    text: '在 YOLOv5 backbone 引入 Transformer attention，并优化 feature fusion 与训练超参。',
    bullets: ['mAP 相对 baseline 提升约 3%', '推理效率提升约 30%'],
  },
]

const experiences = [
  {
    id: 'exp-1',
    role: '算法实习生 · 西安朝野未来科技',
    time: '2025.12 - 2026.06',
    summary: 'AI Agent 与 Deep Research 模块研发，构建 RAG + 推理闭环。',
    details: [
      '搭建 Query → Retrieval → Generation 流程，融合 BM25 与向量检索。',
      '设计“语义拆分 → 检索 → 生成 → 评估 → 重写”的推理闭环。',
      '引入 LLM-as-Judge 自动评测机制，提升结构合规与答案稳定性。',
    ],
  },
  {
    id: 'exp-2',
    role: 'MSc · University College London',
    time: '2024 - 2025',
    summary: 'Scientific Data Intensive Computing（Merit），方向聚焦高性能计算与机器学习。',
    details: [
      '课程覆盖监督学习、信息检索与数据挖掘、高性能计算等方向。',
      '研究方向：基于 AlphaFold 与 ProteinX 的蛋白质结构预测与归类。',
      '在课程与项目中结合算法设计与工程实现，形成端到端研发能力。',
    ],
  },
  {
    id: 'exp-4',
    role: '产品开发实习生 · 神州数码信息服务',
    time: '2022.06 - 2022.08',
    summary: '参与金融微服务系统开发，接触分布式架构与事务一致性方案。',
    details: [
      '基于 Dubbo / Spring Cloud 参与业务模块与接口开发。',
      '学习服务注册发现、负载均衡与 Redis 缓存优化策略。',
      '理解 TCC / SAGA / XA 等分布式事务机制在业务中的取舍。',
    ],
  },
  {
    id: 'exp-3',
    role: 'BSc · University of Liverpool',
    time: '2021 - 2024',
    summary: 'Computer Science（First Class Honour, Top 10%）。',
    details: [
      '聚焦计算机视觉、强化学习、多智能体系统与大数据分析。',
      '毕业研究：基于 YOLOv5 与 Transformer 的目标检测性能提升。',
      '形成从建模、训练到实验评估的完整研究流程。',
    ],
  },
  {
    id: 'exp-3b',
    role: '西安市铁一中学',
    time: '2017 - 2020',
    summary: '完成高中阶段学习，夯实数理与英语基础。',
    details: [
      '建立系统化学习习惯与长期目标管理能力。',
      '在理科与英语学习中形成较好的逻辑分析与表达能力。',
      '为后续计算机与数据科学方向学习打下基础。',
    ],
  },
]

const hobbies = [
  {
    id: 'football',
    title: '足球',
    subtitle: 'Football',
    text: '关注比赛战术与团队协作，平时也会和朋友约球，保持节奏与专注力。',
  },
  {
    id: 'gaming',
    title: '游戏',
    subtitle: 'Gaming',
    text: '偏好策略和竞技类游戏，喜欢从机制拆解和复盘中提升决策能力。',
  },
  {
    id: 'fitness',
    title: '健身',
    subtitle: 'Fitness',
    text: '长期保持力量和有氧训练，稳定体能与执行力，提升长期工作状态。',
  },
  {
    id: 'tetris',
    title: '俄罗斯方块',
    subtitle: 'Tetris Easter Egg',
    text: '点击这里启动小游戏：方向键控制移动，R 切换旋转方向，P 暂停/继续。',
    interactive: true,
  },
]

const skills = [
  'Python',
  'Java',
  'PyTorch',
  'vLLM',
  'RAG',
  'BM25',
  'Transformer',
  'ReAct / CoT / ToT',
  'CUDA / HPC',
  'MySQL',
]

const filter = ref('all')
const activeSection = ref('hero')
const activeExperience = ref(experiences[0].id)
const statValues = ref(stats.map(() => 0))
const heroCard = ref(null)
const uploadInput = ref(null)
const photoInput = ref(null)
const customBackgroundUrl = ref('')
const customBackgroundName = ref('')
const showPhotoModal = ref(false)
const profilePhotoUrl = ref(defaultProfilePhoto)
const profilePhotoName = ref('默认照片')
const isPhotoLocked = ref(false)
const lastUploadedPhotoDataUrl = ref('')

const showTetris = ref(false)
const board = ref(createEmptyBoard())
const currentPiece = ref(null)
const nextPiece = ref(createRandomPiece())
const isGameRunning = ref(false)
const isGameOver = ref(false)
const fastDrop = ref(false)
const score = ref(0)
const linesCleared = ref(0)
const rotationDirection = ref('clockwise')

let cleanupHeroTilt = null
let revealObserver = null
let statsObserver = null
let animationFrameId = null
let lastFrameTime = 0
let dropAccumulator = 0
let customBackgroundObjectUrl = ''
let profilePhotoObjectUrl = ''
const PHOTO_LOCK_ENABLED_KEY = 'self_website_photo_lock_enabled'
const PHOTO_LOCK_DATA_KEY = 'self_website_photo_lock_data'

const level = computed(() => Math.floor(linesCleared.value / 10) + 1)

const filteredProjects = computed(() => {
  if (filter.value === 'all') return projects
  return projects.filter(p => p.tag.includes(filter.value))
})

const sceneBackgroundStyle = computed(() => {
  if (!customBackgroundUrl.value) return {}
  return {
    backgroundImage: `linear-gradient(125deg, rgba(7, 24, 42, 0.42), rgba(17, 63, 95, 0.22)), url(${customBackgroundUrl.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
})

const displayBoard = computed(() => {
  const overlay = board.value.map(row => row.slice())
  const piece = currentPiece.value

  if (!piece) return overlay

  for (let r = 0; r < piece.matrix.length; r += 1) {
    for (let c = 0; c < piece.matrix[r].length; c += 1) {
      if (!piece.matrix[r][c]) continue
      const y = piece.y + r
      const x = piece.x + c
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        overlay[y][x] = piece.color
      }
    }
  }

  return overlay
})

const boardCells = computed(() => displayBoard.value.flat())

const setPointerGlow = e => {
  const x = (e.clientX / window.innerWidth) * 100
  const y = (e.clientY / window.innerHeight) * 100
  document.documentElement.style.setProperty('--mx', `${x}%`)
  document.documentElement.style.setProperty('--my', `${y}%`)
}

const scrollToId = id => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const markActiveSection = () => {
  let current = 'hero'
  for (const item of navItems) {
    const el = document.getElementById(item.id)
    if (!el) continue
    const top = el.offsetTop - 140
    if (window.scrollY >= top) current = item.id
  }
  activeSection.value = current
}

const animateStats = () => {
  stats.forEach((item, idx) => {
    const start = performance.now()
    const duration = 1100

    const step = now => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      statValues.value[idx] = Math.round(item.target * eased)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  })
}

const bindHeroTilt = () => {
  const el = heroCard.value
  if (!el) return null

  const onMove = e => {
    const box = el.getBoundingClientRect()
    const px = (e.clientX - box.left) / box.width
    const py = (e.clientY - box.top) / box.height
    const rotateY = (px - 0.5) * 10
    const rotateX = (0.5 - py) * 10
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const onLeave = () => {
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
}

const toggleExperience = id => {
  activeExperience.value = activeExperience.value === id ? '' : id
}

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
}

function cloneMatrix(matrix) {
  return matrix.map(row => [...row])
}

function createRandomPiece() {
  const proto = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]
  const matrix = cloneMatrix(proto.shape)
  return {
    matrix,
    color: proto.color,
    x: Math.floor((COLS - matrix[0].length) / 2),
    y: -1,
  }
}

function hasCollision(testBoard, matrix, x, y) {
  for (let r = 0; r < matrix.length; r += 1) {
    for (let c = 0; c < matrix[r].length; c += 1) {
      if (!matrix[r][c]) continue
      const nx = x + c
      const ny = y + r

      if (nx < 0 || nx >= COLS || ny >= ROWS) return true
      if (ny >= 0 && testBoard[ny][nx] !== 0) return true
    }
  }
  return false
}

function spawnPiece() {
  const piece = nextPiece.value
  piece.x = Math.floor((COLS - piece.matrix[0].length) / 2)
  piece.y = -1
  currentPiece.value = piece
  nextPiece.value = createRandomPiece()

  if (hasCollision(board.value, piece.matrix, piece.x, piece.y)) {
    isGameOver.value = true
    isGameRunning.value = false
    stopGameLoop()
  }
}

function mergeCurrentPiece() {
  const piece = currentPiece.value
  if (!piece) return

  const merged = board.value.map(row => row.slice())

  for (let r = 0; r < piece.matrix.length; r += 1) {
    for (let c = 0; c < piece.matrix[r].length; c += 1) {
      if (!piece.matrix[r][c]) continue
      const y = piece.y + r
      const x = piece.x + c
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
        merged[y][x] = piece.color
      }
    }
  }

  board.value = merged
}

function clearCompletedLines() {
  const keptRows = board.value.filter(row => row.some(cell => cell === 0))
  const cleared = ROWS - keptRows.length

  if (!cleared) return

  const newRows = Array.from({ length: cleared }, () => Array(COLS).fill(0))
  board.value = [...newRows, ...keptRows]
  linesCleared.value += cleared

  const reward = [0, 100, 300, 500, 800]
  score.value += reward[cleared] * level.value
}

function lockPieceAndContinue() {
  mergeCurrentPiece()
  clearCompletedLines()
  spawnPiece()
}

function tryMove(dx, dy) {
  const piece = currentPiece.value
  if (!piece || isGameOver.value) return false

  const nextX = piece.x + dx
  const nextY = piece.y + dy

  if (!hasCollision(board.value, piece.matrix, nextX, nextY)) {
    currentPiece.value = { ...piece, x: nextX, y: nextY }
    return true
  }

  if (dy === 1) {
    lockPieceAndContinue()
  }

  return false
}

function rotateMatrixClockwise(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0))

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      rotated[c][rows - 1 - r] = matrix[r][c]
    }
  }

  return rotated
}

function rotateMatrixCounterClockwise(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0))

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      rotated[cols - 1 - c][r] = matrix[r][c]
    }
  }

  return rotated
}

function rotateCurrentPiece(clockwise = true) {
  const piece = currentPiece.value
  if (!piece || isGameOver.value) return

  const rotated = clockwise
    ? rotateMatrixClockwise(piece.matrix)
    : rotateMatrixCounterClockwise(piece.matrix)
  const kicks = [0, -1, 1, -2, 2]

  for (const offset of kicks) {
    const testX = piece.x + offset
    if (!hasCollision(board.value, rotated, testX, piece.y)) {
      currentPiece.value = { ...piece, matrix: rotated, x: testX }
      return
    }
  }
}

function hardDrop() {
  const piece = currentPiece.value
  if (!piece || isGameOver.value) return

  let y = piece.y
  while (!hasCollision(board.value, piece.matrix, piece.x, y + 1)) {
    y += 1
  }

  currentPiece.value = { ...piece, y }
  lockPieceAndContinue()
}

function gameTick() {
  if (!isGameRunning.value || isGameOver.value) return
  tryMove(0, 1)
}

function runGameLoop(timestamp) {
  if (!isGameRunning.value) return

  if (!lastFrameTime) {
    lastFrameTime = timestamp
  }

  const delta = timestamp - lastFrameTime
  lastFrameTime = timestamp
  dropAccumulator += delta

  const baseInterval = Math.max(110, 520 - (level.value - 1) * 34)
  const dropInterval = fastDrop.value ? 50 : baseInterval

  if (dropAccumulator >= dropInterval) {
    gameTick()
    dropAccumulator = 0
  }

  animationFrameId = requestAnimationFrame(runGameLoop)
}

function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function startGameLoop() {
  stopGameLoop()
  lastFrameTime = 0
  dropAccumulator = 0
  animationFrameId = requestAnimationFrame(runGameLoop)
}

function restartTetrisGame() {
  board.value = createEmptyBoard()
  currentPiece.value = null
  nextPiece.value = createRandomPiece()
  score.value = 0
  linesCleared.value = 0
  isGameOver.value = false
  isGameRunning.value = true
  fastDrop.value = false
  rotationDirection.value = 'clockwise'
  spawnPiece()
  startGameLoop()
}

function openTetris() {
  showTetris.value = true
  restartTetrisGame()
  nextTick(() => {
    document.getElementById('tetris-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function closeTetris() {
  showTetris.value = false
  isGameRunning.value = false
  fastDrop.value = false
  stopGameLoop()
}

function onHobbyClick(item) {
  if (item.id !== 'tetris') return
  if (!showTetris.value) {
    openTetris()
    return
  }
  document.getElementById('tetris-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function onGameKeydown(e) {
  if (showPhotoModal.value) {
    if (e.key === 'Escape') {
      closePhotoModal()
    }
    return
  }

  if (!showTetris.value) return

  const key = e.key
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'r', 'R', 'p', 'P'].includes(key)) {
    e.preventDefault()
  }

  if (key === 'p' || key === 'P') {
    if (isGameOver.value) return
    if (isGameRunning.value) {
      isGameRunning.value = false
      fastDrop.value = false
      stopGameLoop()
    } else {
      isGameRunning.value = true
      startGameLoop()
    }
    return
  }

  if (!isGameRunning.value || isGameOver.value) {
    if (key === 'Enter') {
      restartTetrisGame()
    }
    return
  }

  if (key === 'ArrowLeft') {
    tryMove(-1, 0)
  } else if (key === 'ArrowRight') {
    tryMove(1, 0)
  } else if (key === 'ArrowDown') {
    fastDrop.value = true
  } else if (key === 'ArrowUp') {
    rotateCurrentPiece(rotationDirection.value === 'clockwise')
  } else if (key === 'r' || key === 'R') {
    rotationDirection.value =
      rotationDirection.value === 'clockwise' ? 'counterclockwise' : 'clockwise'
  } else if (key === ' ') {
    hardDrop()
  }
}

function onGameKeyup(e) {
  if (e.key === 'ArrowDown') {
    fastDrop.value = false
  }
}

function getCellStyle(cellValue) {
  if (!cellValue) {
    return { background: 'rgba(255, 255, 255, 0.08)' }
  }

  return {
    background: `linear-gradient(145deg, ${PIECE_COLORS[cellValue]}, rgba(255,255,255,0.88))`,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 10px rgba(0,0,0,0.18)',
  }
}

function persistPhotoLockState() {
  try {
    localStorage.setItem(PHOTO_LOCK_ENABLED_KEY, isPhotoLocked.value ? '1' : '0')
  } catch {
    // Ignore storage write errors.
  }
}

function persistLockedPhotoData(dataUrl, name) {
  try {
    localStorage.setItem(PHOTO_LOCK_DATA_KEY, JSON.stringify({ dataUrl, name }))
  } catch {
    // Ignore storage write errors.
  }
}

function clearLockedPhotoData() {
  try {
    localStorage.removeItem(PHOTO_LOCK_DATA_KEY)
  } catch {
    // Ignore storage write errors.
  }
}

function restoreLockedPhoto() {
  try {
    isPhotoLocked.value = localStorage.getItem(PHOTO_LOCK_ENABLED_KEY) === '1'
    if (!isPhotoLocked.value) return

    const raw = localStorage.getItem(PHOTO_LOCK_DATA_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw)
    if (!parsed?.dataUrl || typeof parsed.dataUrl !== 'string') return

    profilePhotoUrl.value = parsed.dataUrl
    profilePhotoName.value = parsed.name || '本地锁定头像'
    lastUploadedPhotoDataUrl.value = parsed.dataUrl
  } catch {
    // Ignore storage parse/read errors.
  }
}

function openPhotoModal() {
  showPhotoModal.value = true
}

function closePhotoModal() {
  showPhotoModal.value = false
}

function onProfilePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return

  if (profilePhotoObjectUrl) {
    URL.revokeObjectURL(profilePhotoObjectUrl)
  }

  profilePhotoObjectUrl = URL.createObjectURL(file)
  profilePhotoUrl.value = profilePhotoObjectUrl
  profilePhotoName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') return
    lastUploadedPhotoDataUrl.value = reader.result
    if (isPhotoLocked.value) {
      persistLockedPhotoData(reader.result, file.name)
    }
  }
  reader.readAsDataURL(file)

  closePhotoModal()
}

function resetProfilePhoto() {
  if (profilePhotoObjectUrl) {
    URL.revokeObjectURL(profilePhotoObjectUrl)
    profilePhotoObjectUrl = ''
  }
  profilePhotoUrl.value = defaultProfilePhoto
  profilePhotoName.value = '默认照片'
  lastUploadedPhotoDataUrl.value = ''
  clearLockedPhotoData()
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

function togglePhotoLock() {
  isPhotoLocked.value = !isPhotoLocked.value
  persistPhotoLockState()

  if (!isPhotoLocked.value) {
    clearLockedPhotoData()
    return
  }

  if (lastUploadedPhotoDataUrl.value) {
    persistLockedPhotoData(lastUploadedPhotoDataUrl.value, profilePhotoName.value)
    return
  }

  if (profilePhotoUrl.value.startsWith('data:image/')) {
    persistLockedPhotoData(profilePhotoUrl.value, profilePhotoName.value)
  }
}

function onLocalBackgroundUpload(event) {
  const file = event.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return

  if (customBackgroundObjectUrl) {
    URL.revokeObjectURL(customBackgroundObjectUrl)
  }

  customBackgroundObjectUrl = URL.createObjectURL(file)
  customBackgroundUrl.value = customBackgroundObjectUrl
  customBackgroundName.value = file.name
}

function clearLocalBackground() {
  if (customBackgroundObjectUrl) {
    URL.revokeObjectURL(customBackgroundObjectUrl)
  }
  customBackgroundObjectUrl = ''
  customBackgroundUrl.value = ''
  customBackgroundName.value = ''
  if (uploadInput.value) {
    uploadInput.value.value = ''
  }
}

onMounted(() => {
  restoreLockedPhoto()
  window.addEventListener('pointermove', setPointerGlow, { passive: true })
  window.addEventListener('scroll', markActiveSection, { passive: true })
  window.addEventListener('keydown', onGameKeydown)
  window.addEventListener('keyup', onGameKeyup)
  markActiveSection()

  cleanupHeroTilt = bindHeroTilt()

  const revealNodes = document.querySelectorAll('.reveal')
  revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    },
    { threshold: 0.16 },
  )

  revealNodes.forEach(node => revealObserver.observe(node))

  const statsNode = document.querySelector('.stats')
  if (statsNode) {
    let played = false
    statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !played) {
            played = true
            animateStats()
          }
        })
      },
      { threshold: 0.4 },
    )
    statsObserver.observe(statsNode)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', setPointerGlow)
  window.removeEventListener('scroll', markActiveSection)
  window.removeEventListener('keydown', onGameKeydown)
  window.removeEventListener('keyup', onGameKeyup)
  cleanupHeroTilt?.()
  revealObserver?.disconnect()
  statsObserver?.disconnect()
  stopGameLoop()
  if (customBackgroundObjectUrl) {
    URL.revokeObjectURL(customBackgroundObjectUrl)
    customBackgroundObjectUrl = ''
  }
  if (profilePhotoObjectUrl) {
    URL.revokeObjectURL(profilePhotoObjectUrl)
    profilePhotoObjectUrl = ''
  }
})
</script>

<template>
  <div class="scene-bg" :class="{ 'with-upload': !!customBackgroundUrl }" :style="sceneBackgroundStyle"></div>
  <div class="grain"></div>

  <header class="topbar liquid-panel reveal visible">
    <a class="brand" href="#hero" @click.prevent="scrollToId('hero')">Jiajun Li</a>
    <nav>
      <button
        v-for="item in navItems"
        :key="item.id"
        :class="['nav-btn', { active: activeSection === item.id }]"
        @click="scrollToId(item.id)"
      >
        {{ item.label }}
      </button>
    </nav>
  </header>

  <main>
    <section id="hero" class="hero section">
      <div class="hero-grid">
        <article ref="heroCard" class="hero-card liquid-panel reveal">
          <p class="kicker">AI Engineer / LLM Application Builder</p>
          <h1>李佳俊 Jiajun Li</h1>
          <p>
            关注 LLM Agent、RAG、计算机视觉与高性能计算，擅长把研究思路快速落地成可运行系统。
          </p>
          <div class="cta-row">
            <a class="btn primary" href="#projects" @click.prevent="scrollToId('projects')">查看项目</a>
            <a class="btn ghost" href="mailto:894480363@qq.com">联系我</a>
          </div>
        </article>

        <article class="photo-card liquid-panel reveal">
          <h3>个人照片</h3>
          <div
            class="photo-slot photo-slot-clickable"
            role="button"
            tabindex="0"
            @click="openPhotoModal"
            @keydown.enter.prevent="openPhotoModal"
            @keydown.space.prevent="openPhotoModal"
          >
            <img class="profile-photo" :src="profilePhotoUrl" alt="李佳俊头像" />
            <div class="photo-slot-overlay">点击更换照片</div>
          </div>
          <div class="photo-meta-row">
            <p class="photo-meta">当前头像：{{ profilePhotoName }}</p>
            <button class="tiny-btn lock-btn" :class="{ active: isPhotoLocked }" @click="togglePhotoLock">
              {{ isPhotoLocked ? '🔒 已锁定（本地）' : '🔓 本地锁定头像' }}
            </button>
          </div>
        </article>
      </div>

      <ul class="stats reveal">
        <li v-for="(item, idx) in stats" :key="item.label" class="liquid-panel">
          <h3>{{ statValues[idx] }}{{ item.suffix }}</h3>
          <p>{{ item.label }}</p>
        </li>
      </ul>
    </section>

    <section id="about" class="section reveal">
      <h2>关于我</h2>
      <div class="about-grid">
        <article class="liquid-panel">
          <h3>教育背景</h3>
          <p>
            UCL MSc Scientific Data Intensive Computing（Merit, 2025）<br />
            University of Liverpool BSc Computer Science（First Class Honour, Top 10%, 2024）<br />
            西安市铁一中学（2017 - 2020）
          </p>
        </article>
        <article class="liquid-panel">
          <h3>研究兴趣</h3>
          <p>蛋白质结构预测、RAG 推理链路、LLM 自动评估、目标检测模型优化。</p>
        </article>
        <article class="liquid-panel">
          <h3>工程优势</h3>
          <p>兼顾算法与工程，可在有限算力环境下完成模型部署、调优与产品化交付。</p>
        </article>
      </div>
    </section>

    <section id="experience" class="section reveal">
      <h2>个人经历时间线</h2>
      <div class="timeline">
        <article
          v-for="item in experiences"
          :key="item.id"
          :class="['timeline-item', 'liquid-panel', { expanded: activeExperience === item.id }]"
        >
          <button class="timeline-summary" @click="toggleExperience(item.id)">
            <div class="dot"></div>
            <div class="summary-main">
              <h3>{{ item.role }}</h3>
              <span>{{ item.time }}</span>
              <p>{{ item.summary }}</p>
            </div>
            <span class="toggle-text">{{ activeExperience === item.id ? '收起' : '查看详情' }}</span>
          </button>

          <transition name="expand">
            <div v-if="activeExperience === item.id" class="timeline-detail">
              <ul>
                <li v-for="point in item.details" :key="point">{{ point }}</li>
              </ul>
            </div>
          </transition>
        </article>
      </div>
    </section>

    <section id="projects" class="section reveal">
      <div class="section-head">
        <h2>代表项目</h2>
        <div class="filters">
          <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
          <button :class="{ active: filter === 'llm' }" @click="filter = 'llm'">LLM</button>
          <button :class="{ active: filter === 'cv' }" @click="filter = 'cv'">CV</button>
          <button :class="{ active: filter === 'bio' }" @click="filter = 'bio'">Bio</button>
        </div>
      </div>

      <div class="project-grid">
        <article v-for="item in filteredProjects" :key="item.title" class="project-card liquid-panel">
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <ul>
            <li v-for="point in item.bullets" :key="point">{{ point }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="hobbies" class="section reveal">
      <h2>个人爱好</h2>
      <div class="hobby-grid">
        <article
          v-for="item in hobbies"
          :key="item.id"
          :class="['hobby-card', 'liquid-panel', { clickable: item.interactive }]"
          @click="onHobbyClick(item)"
        >
          <p class="hobby-subtitle">{{ item.subtitle }}</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>

      <article v-if="showTetris" id="tetris-panel" class="tetris-panel liquid-panel">
        <div class="tetris-head">
          <div>
            <h3>Tetris 彩蛋已启动</h3>
            <p>方向键控制移动：上键旋转、下键按住加速、空格直接落下，R 切换旋转方向，P 暂停/继续。</p>
          </div>
          <div class="tetris-actions">
            <button class="tiny-btn" @click="restartTetrisGame">重新开始</button>
            <button class="tiny-btn" @click="closeTetris">收起彩蛋</button>
          </div>
        </div>

        <div class="tetris-wrap">
          <div class="tetris-board" role="application" aria-label="Tetris game board">
            <div
              v-for="(cell, index) in boardCells"
              :key="index"
              class="tetris-cell"
              :style="getCellStyle(cell)"
            ></div>
          </div>

          <aside class="tetris-side">
            <div class="tetris-stat liquid-subpanel">
              <span>分数</span>
              <strong>{{ score }}</strong>
            </div>
            <div class="tetris-stat liquid-subpanel">
              <span>消行</span>
              <strong>{{ linesCleared }}</strong>
            </div>
            <div class="tetris-stat liquid-subpanel">
              <span>等级</span>
              <strong>{{ level }}</strong>
            </div>
            <div class="liquid-subpanel control-note">
              <p>← →：左右移动</p>
              <p>↑：按当前方向旋转</p>
              <p>↓：按住加速下落</p>
              <p>Space：直接落下</p>
              <p>R：切换旋转方向</p>
              <p>P：暂停 / 继续</p>
            </div>
            <div class="tetris-stat liquid-subpanel">
              <span>旋转方向</span>
              <strong>{{ rotationDirection === 'clockwise' ? '顺时针' : '逆时针' }}</strong>
            </div>
            <div v-if="!isGameRunning && !isGameOver" class="game-paused liquid-subpanel">
              <p>已暂停</p>
              <small>按 P 继续游戏</small>
            </div>
            <div v-if="isGameOver" class="game-over liquid-subpanel">
              <p>Game Over</p>
              <small>按“重新开始”或 Enter 再来一局</small>
            </div>
          </aside>
        </div>
      </article>
    </section>

    <section id="upload" class="section reveal">
      <h2>上传内容</h2>
      <article class="upload-panel liquid-panel">
        <p>
          你可以从本地选择一张图片作为页面背景。图片仅在当前浏览器本地渲染，不会上传到公网或仓库。
        </p>
        <div class="upload-row">
          <label class="upload-btn">
            选择本地图片
            <input ref="uploadInput" type="file" accept="image/*" @change="onLocalBackgroundUpload" />
          </label>
          <button class="tiny-btn" :disabled="!customBackgroundUrl" @click="clearLocalBackground">
            清除背景
          </button>
        </div>
        <p v-if="customBackgroundName" class="upload-meta">当前背景：{{ customBackgroundName }}</p>
      </article>
    </section>

    <section id="contact" class="section reveal">
      <h2>技能与联系</h2>
      <div class="skill-wrap liquid-panel">
        <div class="chips">
          <span v-for="skill in skills" :key="skill">{{ skill }}</span>
        </div>
      </div>
      <div class="contact-row">
        <a href="mailto:894480363@163.com">894480363@163.com</a>
        <a href="mailto:894480363@qq.com">894480363@qq.com</a>
        <a href="tel:+8615399419326">+86 153-9941-9326</a>
      </div>
    </section>
  </main>

  <div v-if="showPhotoModal" class="photo-modal-backdrop" @click.self="closePhotoModal">
    <article class="photo-modal liquid-panel">
      <h3>上传个人照片</h3>
      <p>只在当前浏览器本地预览，不会上传到公网。</p>
      <div class="upload-row">
        <label class="upload-btn">
          选择本地图片
          <input ref="photoInput" type="file" accept="image/*" @change="onProfilePhotoUpload" />
        </label>
        <button class="tiny-btn" @click="resetProfilePhoto">恢复默认</button>
        <button class="tiny-btn" @click="closePhotoModal">关闭</button>
      </div>
      <p class="upload-meta">当前头像：{{ profilePhotoName }}</p>
      <p class="upload-meta">状态：{{ isPhotoLocked ? '已启用本地锁定（刷新后保留）' : '未锁定（刷新后恢复默认）' }}</p>
    </article>
  </div>
</template>
