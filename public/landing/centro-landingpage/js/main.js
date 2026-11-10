(() => {
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav-links");
  const top = document.querySelector(".back-top");
  const header = document.querySelector(".nav");
  const closeMenu = () => {
    nav?.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  };
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  document
    .querySelectorAll(".nav-links a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const navSections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(({ section }) => section);
  const setActiveNavLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  const syncActiveNavLink = () => {
    const scrollPosition = window.scrollY + (header?.offsetHeight || 0) + 24;
    let activeSection = navSections[0]?.section;
    navSections.forEach(({ section }) => {
      if (section.offsetTop <= scrollPosition) activeSection = section;
    });
    if (activeSection) setActiveNavLink(activeSection.id);
  };
  navLinks.forEach((link) =>
    link.addEventListener("click", () => setActiveNavLink(link.getAttribute("href").slice(1))),
  );

  document.querySelectorAll(".faq-q").forEach((button, index) => {
    const panel = button.nextElementSibling;
    const id = `faq-answer-${index + 1}`;
    panel.id = id;
    panel.setAttribute("role", "region");
    button.setAttribute("aria-controls", id);
    button.addEventListener("click", () => {
      const item = button.parentElement;
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      button.querySelector("span").textContent = open ? "-" : "+";
    });
  });


  const previewImage = document.querySelector(".customize-dashboard-image");
  const appearanceButtons = document.querySelectorAll(".appearance-option");
  const systemAppearance = window.matchMedia("(prefers-color-scheme: dark)");
  const setPreviewAppearance = (appearance) => {
    if (!previewImage) return;
    const darkPreview = appearance === "dark" || (appearance === "system" && systemAppearance.matches);
    previewImage.src = darkPreview ? previewImage.dataset.darkSrc : previewImage.dataset.lightSrc;
    previewImage.alt = darkPreview ? "Centro dark SaaS dashboard preview" : "Centro light dashboard preview";
    previewImage.closest(".customize-preview")?.classList.toggle("is-dark", darkPreview);
    appearanceButtons.forEach((button) => { const active = button.dataset.appearance === appearance; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  };
  appearanceButtons.forEach((button) => button.addEventListener("click", () => setPreviewAppearance(button.dataset.appearance)));
  systemAppearance.addEventListener?.("change", () => {
    if (document.querySelector(".appearance-option.is-active")?.dataset.appearance === "system") setPreviewAppearance("system");
  });
  const visual = document.querySelector(".theme-visual");
  document.querySelectorAll(".theme-tab").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelectorAll(".theme-tab").forEach((tab) => tab.classList.remove("is-active"));
      button.classList.add("is-active");
      visual?.classList.toggle("theme-dark", button.dataset.theme === "dark");
    }),
  );

  const board = document.querySelector(".control-board");
  const status = document.querySelector(".customizer-status");
  const customizerState = { mode: "light", skin: "sapphire", sidebar: "light", width: "fluid" };
  const skinLabels = {
    sapphire: "Sapphire",
    emerald: "Emerald",
    violet: "Violet",
    rose: "Rose",
    orange: "Orange",
    cyan: "Cyan",
    graphite: "Graphite",
  };
  document.querySelectorAll("[data-customizer] button").forEach((button) =>
    button.addEventListener("click", () => {
      const setting = button.dataset.setting;
      const value = button.dataset.value;
      customizerState[setting] = value;
      document
        .querySelectorAll(`[data-setting="${setting}"]`)
        .forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      board?.classList.toggle("is-dark", customizerState.mode === "dark");
      board?.classList.toggle("sidebar-dark", customizerState.sidebar === "dark");
      board?.classList.toggle("width-boxed", customizerState.width === "boxed");
      if (board) board.dataset.skin = customizerState.skin;
      if (status)
        status.textContent = `Live preview  ${skinLabels[customizerState.skin]}  ${customizerState.mode.charAt(0).toUpperCase() + customizerState.mode.slice(1)}`;
    }),
  );

  const syncScrollState = () => {
    top?.classList.toggle("show", window.scrollY > 420);
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    syncActiveNavLink();
  };
  window.addEventListener("scroll", syncScrollState, { passive: true });
  syncScrollState();
  top?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();


(() => {
  const previews = {
    executive: { image: 'dashboard-executive.png', name: 'Executive overview', route: '/', alt: 'Centro Executive dashboard preview' },
    analytics: { image: 'dashboard-analytics-v2.png', name: 'Analytics dashboard', route: '/dashboards/analytics', alt: 'Centro Analytics dashboard preview' },
    ecommerce: { image: 'dashboard-ecommerce-v2.png', name: 'eCommerce dashboard', route: '/dashboards/ecommerce', alt: 'Centro eCommerce dashboard preview' },
  };
  const image = document.getElementById('hero-preview-image');
  document.querySelectorAll('.hero-preview-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const preview = previews[button.dataset.preview];
      if (!preview || !image) return;
      image.src = `assets/screenshots/${preview.image}`;
      image.alt = preview.alt;
      document.getElementById('hero-preview-name').textContent = preview.name;
      document.getElementById('hero-preview-link').href = `http://localhost:3000${preview.route}`;
      document.querySelectorAll('.hero-preview-tab').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
    });
  });
  const cards = [...document.querySelectorAll('#demos .all-dashboard-card')];
  const search = document.getElementById('demo-search');
  const count = document.querySelector('.demo-result-count');
  const empty = document.querySelector('.demo-empty');
  let category = 'all';
  function filterDemos() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matches = (category === 'all' || card.dataset.category === category) && card.querySelector('h3').textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    });
    if (count) count.textContent = visible === 16 ? 'Showing all 16 dashboards' : `Showing ${visible} of 16 dashboards`;
    if (empty) empty.hidden = visible > 0;
  }
  document.querySelectorAll('.demo-filter').forEach((button) => {
    button.addEventListener('click', () => {
      category = button.dataset.category;
      document.querySelectorAll('.demo-filter').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      filterDemos();
    });
  });
  search?.addEventListener('input', filterDemos);
  filterDemos();
})();

// Embedded official Remix arrows, including generated guide navigation.
(() => {
 const icons={"→":"<svg class=\"remix-arrow\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z\"/></svg>","←":"<svg class=\"remix-arrow remix-arrow-reverse\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z\"/></svg>","↗":"<svg class=\"remix-arrow\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z\"/></svg>","↑":"<svg class=\"remix-arrow\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z\"/></svg>","↓":"<svg class=\"remix-arrow remix-arrow-reverse\" aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z\"/></svg>"};
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode()){const node=walker.currentNode;if(!node.parentElement.closest('script,style,pre,code,textarea,svg')&&/[\u2190-\u2193\u2197]/.test(node.nodeValue))nodes.push(node);}
 for(const node of nodes){const fragment=document.createDocumentFragment();for(const part of node.nodeValue.split(/([\u2190-\u2193\u2197])/)){if(icons[part]){const template=document.createElement('template');template.innerHTML=icons[part];fragment.append(template.content);}else fragment.append(document.createTextNode(part));}node.replaceWith(fragment);}
})();
