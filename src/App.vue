<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const navItems = [
  { id: 'hero', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'experience', label: '经历' },
  { id: 'projects', label: '项目' },
  { id: 'hobbies', label: '爱好' },
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
]

const hobbies = [
  {
    title: '足球',
    subtitle: 'Football',
    text: '关注比赛战术与团队协作，平时也会和朋友约球，保持节奏与专注力。',
  },
  {
    title: '游戏',
    subtitle: 'Gaming',
    text: '偏好策略和竞技类游戏，喜欢从机制拆解和复盘中提升决策能力。',
  },
  {
    title: '健身',
    subtitle: 'Fitness',
    text: '长期保持力量和有氧训练，稳定体能与执行力，提升长期工作状态。',
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

const filteredProjects = computed(() => {
  if (filter.value === 'all') return projects
  return projects.filter(p => p.tag.includes(filter.value))
})

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
  if (!el) return

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

let cleanupHeroTilt = null
let revealObserver = null
let statsObserver = null

onMounted(() => {
  window.addEventListener('pointermove', setPointerGlow, { passive: true })
  window.addEventListener('scroll', markActiveSection, { passive: true })
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
  cleanupHeroTilt?.()
  revealObserver?.disconnect()
  statsObserver?.disconnect()
})
</script>

<template>
  <div class="scene-bg"></div>
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
          <div class="photo-slot">
            <span>Photo Placeholder</span>
            <small>可放你的头像或生活照<br />建议尺寸：4:5</small>
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
            University of Liverpool BSc Computer Science（First Class Honour, Top 10%, 2024）
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
        <article v-for="item in hobbies" :key="item.title" class="hobby-card liquid-panel">
          <p class="hobby-subtitle">{{ item.subtitle }}</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
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
</template>
