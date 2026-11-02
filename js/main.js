// ===== Mobile menu toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('main section[id]');
const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 56;

function updateActiveNav() {
  const scrollY = window.scrollY + navHeight + 16;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const link = navLinks.querySelector(`a[href="#${section.id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ===== Project filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectRows = document.querySelectorAll('.project-row');
const projectLists = document.querySelectorAll('.project-list');
const filterCount = document.getElementById('filterCount');

function applyFilter(filter) {
  let visible = 0;
  projectRows.forEach(row => {
    const show = filter === 'all' || row.dataset.category === filter;
    row.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  // 해당 분류의 프로젝트가 없는 회사는 목록 자체를 숨김
  projectLists.forEach(list => {
    list.classList.toggle('empty', !list.querySelector('.project-row:not(.hidden)'));
  });
  filterCount.textContent = `${visible}건`;
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});
applyFilter('all');

// ===== Print / PDF =====
document.getElementById('printBtn').addEventListener('click', () => window.print());

// ===== Career duration (재직기간 자동 계산) =====
// 시작월과 종료월을 모두 포함하여 계산 (예: 2015.12 ~ 2018.12 = 37개월 = 3년 1개월)
function monthsBetween(start, end) {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

function formatDuration(months) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years}년`);
  if (rest) parts.push(`${rest}개월`);
  return parts.join(' ');
}

const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
let totalMonths = 0;

document.querySelectorAll('.period[data-start]').forEach(el => {
  const months = monthsBetween(el.dataset.start, el.dataset.end || currentMonth);
  if (months <= 0) return;
  totalMonths += months;
  const duration = document.createElement('span');
  duration.className = 'duration';
  duration.textContent = `(${formatDuration(months)})`;
  el.appendChild(duration);
});

const totalCareer = document.getElementById('totalCareer');
if (totalCareer && totalMonths > 0) {
  totalCareer.textContent = formatDuration(totalMonths);
}
