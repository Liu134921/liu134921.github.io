const btnDarkMode = document.querySelector(".dark-mode-btn");

// 1. Checking the dark mode at the system settings level
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  btnDarkMode.classList.add("dark-mode-btn--active");
  document.body.classList.add("dark");
}

// 2. Checking dark mode in localStorage
if (localStorage.getItem("darkMode") === "dark") {
  btnDarkMode.classList.add("dark-mode-btn--active");
  document.body.classList.add("dark");
} else if (localStorage.getItem("darkMode") === "light") {
  btnDarkMode.classList.remove("dark-mode-btn--active");
  document.body.classList.remove("dark");
}

// If system settings change, update the theme
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    const newColorScheme = event.matches ? "dark" : "light";

    if (newColorScheme === "dark") {
      btnDarkMode.classList.add("dark-mode-btn--active");
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "dark");
    } else {
      btnDarkMode.classList.remove("dark-mode-btn--active");
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "light");
    }
  });

// Toggle dark mode with a button click
btnDarkMode.onclick = function () {
  btnDarkMode.classList.toggle("dark-mode-btn--active");
  const isDark = document.body.classList.toggle("dark");

  if (isDark) {
    localStorage.setItem("darkMode", "dark");
  } else {
    localStorage.setItem("darkMode", "light");
  }
};

/* ========== Floating glass nav ========== */

const nav = document.querySelector(".nav");

function updateNavState() {
  nav.classList.toggle("nav--scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateNavState, { passive: true });
updateNavState();

/* ========== Scroll reveal ========== */

const revealItems = document.querySelectorAll(".reveal");

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, self) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const siblings = Array.from(entry.target.parentElement.children);
            const index = siblings.indexOf(entry.target) % 4;

            entry.target.style.transitionDelay = `${index * 70}ms`;
            entry.target.classList.add("is-visible");
            self.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      )
    : null;

if (revealObserver) {
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ========== GitHub projects ========== */

const GITHUB_USER = "Liu134921";
const projectGrid = document.getElementById("projectGrid");
const heroUpdated = document.getElementById("heroUpdated");
const heroCount = document.getElementById("heroCount");
const overviewProjects = document.getElementById("overviewProjects");
const biliFollower = document.getElementById("biliFollower");
const biliFollowing = document.getElementById("biliFollowing");
const biliVideos = document.getElementById("biliVideos");

const modal = document.getElementById("projectModal");
const modalLang = document.getElementById("modalLang");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalRepo = document.getElementById("modalRepo");
const modalStars = document.getElementById("modalStars");
const modalReadme = document.getElementById("modalReadme");

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char])
  );

function formatMonth(isoDate) {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}.${month}`;
}

function setHeroMeta(repos) {
  if (!repos.length) {
    heroUpdated.textContent = "暂无公开项目";
    heroCount.textContent = "去看看 GitHub";
    return;
  }

  const latest = repos.reduce((newest, repo) =>
    new Date(repo.updated_at) > new Date(newest.updated_at) ? repo : newest
  );

  heroUpdated.textContent = `最近更新 ${latest.updated_at.slice(0, 10)}`;
  heroCount.textContent = `共 ${repos.length} 个项目`;
}

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572a5",
  "C++": "#f34b7d",
  C: "#666666",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
  Shell: "#89e051",
  Vue: "#41b883",
  "Jupyter Notebook": "#da5b0b",
  Dart: "#00b4ab",
  Kotlin: "#a97bff",
};

function formatActivity(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hour = 3600000;
  const day = 86400000;

  if (!Number.isFinite(diff) || diff < 0) return "刚刚更新";
  if (diff < hour) return "刚刚更新";
  if (diff < day) return `${Math.floor(diff / hour)} 小时前更新`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前更新`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))} 个月前更新`;
  return `${Math.floor(diff / (365 * day))} 年前更新`;
}

function renderOverview(repos) {
  if (!overviewProjects) return;

  const active = [...repos]
    .sort(
      (a, b) =>
        new Date(b.pushed_at || b.updated_at) -
          new Date(a.pushed_at || a.updated_at) ||
        b.stargazers_count - a.stargazers_count
    )
    .slice(0, 2);

  if (!active.length) {
    overviewProjects.innerHTML =
      '<p class="overview__state">还没有公开项目。</p>';
    return;
  }

  overviewProjects.innerHTML = "";

  active.forEach((repo) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "overview__item";
    item.setAttribute("aria-label", `${repo.name}：查看项目介绍`);

    const language = repo.language || "Project";
    const color = LANGUAGE_COLORS[language] || "var(--accent)";

    item.innerHTML = `
      <span class="overview__item-top">
        <span class="overview__name">${escapeHtml(repo.name)}</span>
        <span class="overview__stars">★ ${repo.stargazers_count}</span>
      </span>
      <span class="overview__desc">${escapeHtml(
        repo.description || "暂无项目描述，点开看看 README 吧。"
      )}</span>
      <span class="overview__meta">
        <span class="overview__lang">
          <span class="overview__lang-dot" style="background:${color}"></span>
          ${escapeHtml(language)}
        </span>
        <span class="overview__activity">${formatActivity(
          repo.pushed_at || repo.updated_at
        )}</span>
      </span>
    `;

    item.addEventListener("click", () => openProject(repo));
    overviewProjects.appendChild(item);
  });
}

function formatBiliCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  if (number >= 10000) {
    return `${(number / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  }
  return String(number);
}

async function loadBilibiliStats() {
  if (!biliFollower) return;

  try {
    // B 站接口不支持跨域，数字来自本地快照文件
    const response = await fetch("./data/bilibili.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    biliFollower.textContent = formatBiliCount(data.follower);
    biliFollowing.textContent = formatBiliCount(data.following);
    biliVideos.textContent = formatBiliCount(data.video);
  } catch (error) {
    biliFollower.textContent = "—";
    biliFollowing.textContent = "—";
    biliVideos.textContent = "—";
  }
}

function createProjectCard(repo, index) {
  const card = document.createElement("article");
  card.className = `post reveal is-visible${
    index === 0 ? " post--featured" : ""
  }`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${repo.name}：查看项目介绍`);

  const updated = new Date(repo.updated_at);
  const tags = [
    repo.stargazers_count ? `★ ${repo.stargazers_count}` : "",
    repo.forks_count ? `Fork ${repo.forks_count}` : "",
    repo.license &&
    repo.license.spdx_id &&
    repo.license.spdx_id !== "NOASSERTION"
      ? repo.license.spdx_id
      : "",
  ].filter(Boolean);

  card.innerHTML = `
    <div class="post__top">
      <span class="post__date"><strong>${String(
        updated.getDate()
      ).padStart(2, "0")}</strong>${formatMonth(repo.updated_at)}</span>
      <span class="post__time">${escapeHtml(repo.language || "Project")}</span>
    </div>
    <h3 class="post__title">${escapeHtml(repo.name)}</h3>
    <p class="post__excerpt">${escapeHtml(
      repo.description || "暂无项目描述，点开看看 README 吧。"
    )}</p>
    <div class="post__tags">
      ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
    <span class="post__arrow" aria-hidden="true">→</span>
  `;

  card.addEventListener("click", () => openProject(repo));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(repo);
    }
  });

  return card;
}

function sanitizeReadme(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc
    .querySelectorAll("script, iframe, object, embed, form, input, button")
    .forEach((node) => node.remove());

  doc.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attr) => {
      if (
        attr.name.startsWith("on") ||
        attr.value.trim().toLowerCase().startsWith("javascript:")
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

function fixReadmeLinks(repo) {
  const base = `https://github.com/${GITHUB_USER}/${repo.name}/blob/HEAD/`;
  const rawBase = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/HEAD/`;

  modalReadme.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (href.startsWith("#")) return;

    if (!/^(https?:|mailto:)/i.test(href)) {
      link.setAttribute("href", base + href.replace(/^\.?\//, ""));
    }

    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  modalReadme.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");

    if (!/^(https?:|data:)/i.test(src)) {
      img.setAttribute("src", rawBase + src.replace(/^\.?\//, ""));
    }
  });
}

function closeProject() {
  modal.classList.remove("modal--open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function openProject(repo) {
  modal.classList.add("modal--open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modalLang.textContent = repo.language || "PROJECT";
  modalTitle.textContent = repo.name;
  modalDesc.textContent = repo.description || "";
  modalRepo.href = repo.html_url;
  modalStars.textContent = `★ ${repo.stargazers_count} · Fork ${repo.forks_count}`;
  modalReadme.innerHTML = '<p class="modal__state">正在加载 README…</p>';

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/readme`,
      { headers: { Accept: "application/vnd.github.html+json" } }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    modalReadme.innerHTML = sanitizeReadme(await response.text());
    fixReadmeLinks(repo);
  } catch (error) {
    modalReadme.innerHTML = `<p class="modal__state">README 加载失败，请前往 <a href="${repo.html_url}" target="_blank" rel="noopener">GitHub 仓库</a> 查看。</p>`;
  }
}

modal.querySelectorAll("[data-close]").forEach((node) => {
  node.addEventListener("click", closeProject);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("modal--open")) {
    closeProject();
  }
});

async function loadProjects() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const repos = (await response.json())
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    projectGrid.innerHTML = "";
    setHeroMeta(repos);
    renderOverview(repos);

    if (!repos.length) {
      projectGrid.innerHTML =
        '<p class="posts__status">还没有公开的项目，去 GitHub 看看吧。</p>';
      return;
    }

    repos.slice(0, 8).forEach((repo, index) => {
      projectGrid.appendChild(createProjectCard(repo, index));
    });
  } catch (error) {
    heroUpdated.textContent = "GitHub 同步失败";
    heroCount.textContent = "请稍后刷新重试";
    if (overviewProjects) {
      overviewProjects.innerHTML = `<p class="overview__state">项目暂时加载失败，去 <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">GitHub</a> 看看吧。</p>`;
    }
    projectGrid.innerHTML = `<p class="posts__status">项目暂时加载失败，可以直接访问 <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">GitHub 主页</a>。</p>`;
  }
}

if (projectGrid) {
  loadProjects();
}

loadBilibiliStats();
