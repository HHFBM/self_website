const revealEls = document.querySelectorAll('.reveal');
const sectionEls = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.topbar nav a');
const statEls = document.querySelectorAll('.stat-number');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const currentYear = document.getElementById('year');

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

let statsAnimated = false;
const animateStats = () => {
  if (statsAnimated) return;
  statsAnimated = true;

  statEls.forEach(el => {
    const target = Number(el.dataset.target || 0);
    let value = 0;
    const step = Math.max(1, Math.round(target / 32));

    const timer = setInterval(() => {
      value += step;
      if (value >= target) {
        value = target;
        clearInterval(timer);
      }
      el.textContent = String(value);
    }, 26);
  });
};

const statAnchor = document.querySelector('.stats');
if (statAnchor) {
  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          statObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  statObserver.observe(statAnchor);
}

const activateNavByScroll = () => {
  let active = '';
  sectionEls.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      active = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href === `#${active}`);
  });
};

window.addEventListener('scroll', activateNavByScroll, { passive: true });
activateNavByScroll();

const applyFilter = filter => {
  projectCards.forEach(card => {
    if (filter === 'all') {
      card.classList.remove('is-hidden');
      return;
    }

    const tags = (card.dataset.tags || '').split(' ');
    card.classList.toggle('is-hidden', !tags.includes(filter));
  });
};

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter || 'all';

    filterBtns.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(filter);
  });
});
