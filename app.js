/* app.js — логика сайта меню */
(function () {
  const LS_THEME = "luxmenu_theme";
  const LS_CART = "luxmenu_cart_v1";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const fmtPrice = (n) => `${Math.round(Number(n) || 0)} ₽`;
  const safe = (s) => String(s ?? "");
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function getQueryParam(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  }

  function loadTheme() {
    const t = localStorage.getItem(LS_THEME);
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(LS_THEME, next);
    const icon = $("#themeToggle .icon");
    if (icon) icon.textContent = next === "dark" ? "🌙" : "☀️";
  }

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-show"), 2200);
  }

  // ---- Cart (persisted) ----
  function loadCart() {
    try {
      const raw = localStorage.getItem(LS_CART);
      if (!raw) return {};
      const data = JSON.parse(raw);
      if (data && typeof data === "object") return data;
      return {};
    } catch {
      return {};
    }
  }
  function saveCart(cart) {
    localStorage.setItem(LS_CART, JSON.stringify(cart));
  }
  function cartCount(cart) {
    return Object.values(cart).reduce((a, b) => a + (Number(b) || 0), 0);
  }

  function buildDishIndex() {
    const map = new Map();
    const { categories, dishesByCategory } = window.MENU_DATA;

    for (const cat of categories) {
      const dishes = dishesByCategory[cat.id] || [];
      for (const d of dishes) {
        map.set(d.id, { ...d, categoryId: cat.id, categoryTitle: cat.title });
      }
    }
    return map;
  }

  const dishIndex = () => {
    if (!window.__DISH_INDEX__) window.__DISH_INDEX__ = buildDishIndex();
    return window.__DISH_INDEX__;
  };

  function renderCartUI() {
    const cart = loadCart();
    const count = cartCount(cart);
    const countEl = $("#cartCount");
    if (countEl) countEl.textContent = String(count);

    const listEl = $("#cartList");
    const emptyEl = $("#cartEmpty");
    const totalEl = $("#cartTotal");
    const subtitleEl = $("#cartSubtitle");

    if (!listEl || !emptyEl || !totalEl || !subtitleEl) return;

    const idx = dishIndex();
    const items = Object.entries(cart)
      .map(([id, qty]) => {
        const dish = idx.get(id);
        if (!dish) return null;
        return { dish, qty: Number(qty) || 0 };
      })
      .filter(Boolean)
      .filter((x) => x.qty > 0);

    listEl.innerHTML = "";
    if (items.length === 0) {
      emptyEl.style.display = "block";
    } else {
      emptyEl.style.display = "none";
      for (const it of items) {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div class="cart-item__emoji">${safe(it.dish.emoji || "🍽️")}</div>
          <div class="cart-item__info">
            <p class="cart-item__name">${safe(it.dish.name)}</p>
            <div class="cart-item__meta">${safe(it.dish.categoryTitle)} • ${safe(it.dish.weight || "")}</div>
            <div class="qty">
              <button type="button" data-act="dec" aria-label="Уменьшить">−</button>
              <span>${it.qty}</span>
              <button type="button" data-act="inc" aria-label="Увеличить">+</button>
            </div>
          </div>
          <div class="cart-item__right">
            <div class="cart-item__price">${fmtPrice(it.dish.price * it.qty)}</div>
            <button class="cart-item__remove" type="button" data-act="remove">Удалить</button>
          </div>
        `;

        row.addEventListener("click", (e) => {
          const btn = e.target.closest("button");
          if (!btn) return;
          const act = btn.getAttribute("data-act");
          const id = it.dish.id;

          const c = loadCart();
          const cur = Number(c[id] || 0);

          if (act === "inc") c[id] = cur + 1;
          if (act === "dec") c[id] = clamp(cur - 1, 0, 999);
          if (act === "remove") c[id] = 0;

          if (c[id] <= 0) delete c[id];
          saveCart(c);
          renderCartUI();
        });

        listEl.appendChild(row);
      }
    }

    const total = items.reduce((sum, it) => sum + it.dish.price * it.qty, 0);
    totalEl.textContent = fmtPrice(total);

    const word = (n) => {
      const r10 = n % 10,
        r100 = n % 100;
      if (r100 >= 11 && r100 <= 19) return "позиций";
      if (r10 === 1) return "позиция";
      if (r10 >= 2 && r10 <= 4) return "позиции";
      return "позиций";
    };
    subtitleEl.textContent = `${count} ${word(count)}`;
  }

  function openCart() {
    const drawer = $("#cartDrawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    renderCartUI();
  }
  function closeCart() {
    const drawer = $("#cartDrawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function closeDishModal() {
    const modal = $("#dishModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    _modalDish = null;
  }

  function wireCartCommon() {
    const openBtn = $("#openCart");
    const closeBtn = $("#closeCart");
    const back = $("#cartBackdrop");
    const clearBtn = $("#clearCartBtn");
    const checkoutBtn = $("#checkoutBtn");

    openBtn && openBtn.addEventListener("click", openCart);
    closeBtn && closeBtn.addEventListener("click", closeCart);
    back && back.addEventListener("click", closeCart);

    clearBtn &&
      clearBtn.addEventListener("click", () => {
        localStorage.removeItem(LS_CART);
        renderCartUI();
        toast("Корзина очищена");
      });

    checkoutBtn &&
      checkoutBtn.addEventListener("click", () => {
        const cart = loadCart();
        const idx = dishIndex();
        const items = Object.entries(cart)
          .map(([id, qty]) => {
            const d = idx.get(id);
            const q = Number(qty) || 0;
            if (!d || q <= 0) return null;
            return { d, q };
          })
          .filter(Boolean);

        if (items.length === 0) {
          toast("Добавьте блюда в корзину 🙂");
          return;
        }

        const lines = items.map((x) => `• ${x.d.name} × ${x.q} = ${fmtPrice(x.d.price * x.q)}`);
        const total = items.reduce((sum, x) => sum + x.d.price * x.q, 0);

        alert(
          `✅ Заказ (демо)\n\n${lines.join("\n")}\n\nИтого: ${fmtPrice(total)}\n\n(Здесь можно подключить оплату/QR/кассу)`
        );
        localStorage.removeItem(LS_CART);
        renderCartUI();
        toast("Спасибо! Заказ оформлен (демо)");
      });

    // Esc closes cart / modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCart();
        closeDishModal();
      }
    });
  }

  function addToCart(dishId, qty = 1) {
    const cart = loadCart();
    cart[dishId] = Number(cart[dishId] || 0) + qty;
    saveCart(cart);
    renderCartUI();
    toast("Добавлено в корзину ✅");
  }

  // ---- Index page ----
  function renderTagChips() {
    const wrap = $("#tagChips");
    if (!wrap) return;
    wrap.innerHTML = "";
    const tags = window.MENU_DATA.tags || [];

    for (const t of tags) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "chip";
      el.setAttribute("data-tag", t.id);
      el.innerHTML = `<span class="chip__icon">${safe(t.icon)}</span><span class="chip__text">${safe(t.label)}</span>`;
      wrap.appendChild(el);
    }
  }

  function renderCategories(filterText = "", activeTag = "") {
    const grid = $("#categoryGrid"); // важно: id должен совпадать с HTML
    if (!grid) return;

    const q = filterText.trim().toLowerCase();
    const cats = (window.MENU_DATA.categories || []).filter((c) => {
      const matchText =
        !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      const matchTag = !activeTag || (c.tags || []).includes(activeTag);
      return matchText && matchTag;
    });

    grid.innerHTML = "";
    for (const c of cats) {
      const card = document.createElement("a");
      card.className = `card card--accent-${safe(c.accent || "violet")}`;
      card.href = `./category.html?cat=${encodeURIComponent(c.id)}`;
      card.setAttribute("role", "button");
      card.innerHTML = `
        <div class="card__shine"></div>
        <div class="card__glow" aria-hidden="true"></div>
        <div class="card__head">
          <div class="card__emoji">${safe(c.emoji || "🍽️")}</div>
          <div class="arrow">→</div>
        </div>
        <h3 class="card__title">${safe(c.title)}</h3>
        <p class="card__desc">${safe(c.desc)}</p>
        <div class="card__foot">
          <div class="pills">
            ${(c.tags || [])
              .slice(0, 2)
              .map((tid) => {
                const t = (window.MENU_DATA.tags || []).find((x) => x.id === tid);
                return `<span class="pill-mini">${safe(t?.icon || "✨")} ${safe(t?.label || tid)}</span>`;
              })
              .join("")}
          </div>
          <div class="pill-mini">Открыть</div>
        </div>
      `;
      grid.appendChild(card);
    }

    if (cats.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.innerHTML = `
        <div class="empty__icon">🧭</div>
        <div class="empty__title">Категории не найдены</div>
        <div class="empty__desc">Попробуйте другой запрос или снимите фильтр.</div>
      `;
      grid.appendChild(empty);
    }
  }

  function setRecommendation() {
    const textEl = $("#recommendText");
    const goEl = $("#recommendGo");
    if (!textEl || !goEl) return;

    const cats = window.MENU_DATA.categories || [];
    const all = [];
    for (const c of cats) {
      const dishes = window.MENU_DATA.dishesByCategory?.[c.id] || [];
      for (const d of dishes) all.push({ ...d, catId: c.id, catTitle: c.title });
    }
    if (all.length === 0) return;

    const pick = all[Math.floor(Math.random() * all.length)];
    textEl.textContent = `${pick.emoji} ${pick.name} — ${fmtPrice(pick.price)} • ${pick.calories} ккал`;
    goEl.href = `./category.html?cat=${encodeURIComponent(pick.catId)}&focus=${encodeURIComponent(pick.id)}`;
  }

  // ---- Category page ----
  function getCategoryOrFallback(catId) {
    const cats = window.MENU_DATA.categories || [];
    let cat = cats.find((c) => c.id === catId);
    if (!cat) {
      if (catId === "popular") {
        cat = {
          id: "popular",
          title: "Популярное",
          desc: "Собрали хиты: выбирают чаще всего.",
          emoji: "🔥",
          accent: "violet",
          tags: ["popular"],
        };
      } else {
        cat = cats[0];
      }
    }
    return cat;
  }

  function listDishesForCat(catId) {
    if (catId === "popular") {
      const cats = window.MENU_DATA.categories || [];
      const out = [];
      for (const c of cats) {
        const dishes = window.MENU_DATA.dishesByCategory?.[c.id] || [];
        for (const d of dishes) out.push({ ...d, categoryId: c.id, categoryTitle: c.title });
      }
      return out.sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0)).slice(0, 18);
    }

    const c = (window.MENU_DATA.categories || []).find((x) => x.id === catId);
    const base = window.MENU_DATA.dishesByCategory?.[catId] || [];
    return base.map((d) => ({ ...d, categoryId: catId, categoryTitle: c?.title || "" }));
  }

  function allergenLabel(key) {
    const m = window.MENU_DATA.allergenLabels || {};
    return m[key] || key;
  }

  function spicyLabel(level) {
    const n = Number(level) || 0;
    if (n <= 0) return "не остро";
    if (n === 1) return "слегка";
    if (n === 2) return "умеренно";
    return "очень";
  }

  function renderDishCard(d) {
    const el = document.createElement("div");
    el.className = "card dish-card";
    el.tabIndex = 0;

    const tags = [];
    if (d.veg) tags.push(`<span class="tag tag--veg">🥗 veg</span>`);
    if ((d.spicy || 0) > 0) tags.push(`<span class="tag tag--spicy">🌶️ ${spicyLabel(d.spicy)}</span>`);
    if ((d.tags || []).includes("new")) tags.push(`<span class="tag tag--new">✨ new</span>`);
    if ((d.tags || []).includes("popular")) tags.push(`<span class="tag tag--popular">🔥 hit</span>`);

    el.innerHTML = `
      <div class="card__shine"></div>
      <div class="dish-top">
        <div class="dish-emoji">${safe(d.emoji || "🍽️")}</div>
        <button class="btn btn--ghost" type="button" data-act="open">Подробнее</button>
      </div>

      <h3 class="dish-name">${safe(d.name)}</h3>
      <p class="dish-desc">${safe(d.desc)}</p>

      <div class="dish-tags">${tags.join("")}</div>

      <div class="dish-foot">
        <div>
          <div class="price">${fmtPrice(d.price)}</div>
          <div class="muted" style="margin-top:4px; color: var(--muted2); font-weight:700; font-size:12px;">
            ${safe(d.weight || "")} • ${safe(d.calories)} ккал
          </div>
        </div>
        <button class="btn btn--primary" type="button" data-act="add">В корзину</button>
      </div>
    `;

    el.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const act = btn.getAttribute("data-act");
      if (act === "add") addToCart(d.id, 1);
      if (act === "open") openDishModal(d);
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openDishModal(d);
    });

    return el;
  }

  function applyDishFilters(dishes) {
    const q = safe($("#dishSearch")?.value).trim().toLowerCase();
    const sort = safe($("#sortSelect")?.value);
    const allergen = safe($("#allergenSelect")?.value);
    const onlyVeg = Boolean($("#onlyVeg")?.checked);

    let out = dishes.slice();

    if (q) {
      out = out.filter((d) => {
        const hay = `${d.name} ${d.desc} ${(d.ingredients || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (onlyVeg) out = out.filter((d) => !!d.veg);

    if (allergen) {
      out = out.filter((d) => !(d.allergens || []).includes(allergen));
    }

    if (sort === "priceAsc") out.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") out.sort((a, b) => b.price - a.price);
    if (sort === "calAsc") out.sort((a, b) => (a.calories || 0) - (b.calories || 0));
    if (sort === "calDesc") out.sort((a, b) => (b.calories || 0) - (a.calories || 0));
    if (sort === "popular") out.sort((a, b) => (b.popularScore || 0) - (a.popularScore || 0));

    return out;
  }

  function renderDishList(catId) {
    const grid = $("#dishGrid");
    const empty = $("#dishEmpty");
    const meta = $("#listMeta");
    if (!grid || !empty || !meta) return;

    const all = listDishesForCat(catId);
    const out = applyDishFilters(all);

    grid.innerHTML = "";
    for (const d of out) grid.appendChild(renderDishCard(d));

    meta.textContent = `${out.length} позиций`;
    empty.style.display = out.length ? "none" : "block";

    const focusId = getQueryParam("focus");
    if (focusId) {
      const target = out.find((x) => x.id === focusId);
      if (target) openDishModal(target);
      const u = new URL(window.location.href);
      u.searchParams.delete("focus");
      history.replaceState({}, "", u.toString());
    }
  }

  // ---- Dish modal ----
  let _modalDish = null;

  function openDishModal(d) {
    const modal = $("#dishModal");
    if (!modal) return;

    _modalDish = d;

    $("#modalTitle").textContent = safe(d.name);
    $("#modalEmoji").textContent = safe(d.emoji || "🍽️");
    $("#modalDesc").textContent = safe(d.desc);
    $("#modalCals").textContent = safe(d.calories ?? "—");
    $("#modalWeight").textContent = safe(d.weight ?? "—");
    $("#modalSpicy").textContent = spicyLabel(d.spicy || 0);
    $("#modalPrice").textContent = fmtPrice(d.price);

    $("#modalIngredients").textContent = (d.ingredients || []).length ? (d.ingredients || []).join(", ") : "—";

    const al = (d.allergens || []).map((a) => allergenLabel(a));
    $("#modalAllergens").textContent = al.length ? al.join(", ") : "нет";

    const tags = [];
    if (d.veg) tags.push("veg");
    for (const t of d.tags || []) tags.push(t);
    $("#modalTags").textContent = tags.length ? tags.join(", ") : "—";

    const addBtn = $("#modalAddBtn");
    if (addBtn) addBtn.onclick = () => addToCart(d.id, 1);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function wireModal() {
    $("#closeDishModal")?.addEventListener("click", closeDishModal);
    $("#modalBackdrop")?.addEventListener("click", closeDishModal);
  }

  // ---- Common wiring ----
  function wireThemeButton() {
    loadTheme();
    const icon = $("#themeToggle .icon");
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    if (icon) icon.textContent = cur === "dark" ? "🌙" : "☀️";
    $("#themeToggle")?.addEventListener("click", toggleTheme);
  }

  function wireIndexInteractions() {
    const search = $("#categorySearch");
    const chips = $("#tagChips");

    let activeTag = "";

    search &&
      search.addEventListener("input", () => {
        renderCategories(search.value, activeTag);
      });

    chips &&
      chips.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-tag]");
        if (!btn) return;
        const tag = btn.getAttribute("data-tag");

        // toggle
        if (activeTag === tag) {
          activeTag = "";
        } else {
          activeTag = tag;
        }

        // ui state
        $$(".chip", chips).forEach((c) => c.classList.toggle("is-active", c.getAttribute("data-tag") === activeTag));

        renderCategories(search?.value || "", activeTag);
      });

    // “случайно”
    $("#recommendRandom")?.addEventListener("click", () => {
      setRecommendation();
      toast("Обновили рекомендацию ✨");
    });
  }

  function wireCategoryFilters(catId) {
    const rerender = () => renderDishList(catId);

    $("#dishSearch")?.addEventListener("input", rerender);
    $("#sortSelect")?.addEventListener("change", rerender);
    $("#allergenSelect")?.addEventListener("change", rerender);
    $("#onlyVeg")?.addEventListener("change", rerender);
  }

  function renderCategoryHeader(cat) {
    $("#catEmoji").textContent = safe(cat.emoji || "🍽️");
    $("#catTitle").textContent = safe(cat.title || "Категория");
    $("#catDesc").textContent = safe(cat.desc || "");
    const badge = $("#catBadge");
    if (badge) badge.textContent = safe(cat.accent ? cat.accent : "menu");
  }

  // Public API
  window.MenuApp = {
    initIndexPage() {
      if (!window.MENU_DATA) {
        console.error("MENU_DATA не найден. Подключи data.js перед app.js");
        return;
      }
      wireThemeButton();
      wireCartCommon();
      wireModal();
      renderCartUI();

      renderTagChips();
      renderCategories("", "");
      setRecommendation();
      wireIndexInteractions();
    },

    initCategoryPage() {
      if (!window.MENU_DATA) {
        console.error("MENU_DATA не найден. Подключи data.js перед app.js");
        return;
      }
      wireThemeButton();
      wireCartCommon();
      wireModal();
      renderCartUI();

      const catId = getQueryParam("cat") || (window.MENU_DATA.categories?.[0]?.id ?? "");
      const cat = getCategoryOrFallback(catId);

      renderCategoryHeader(cat);
      renderDishList(cat.id);
      wireCategoryFilters(cat.id);

      // back button
      $("#backBtn")?.addEventListener("click", () => history.back());
    },
  };

  // Авто-инициализация по наличию элементов (чтобы не писать лишнее в HTML)
  document.addEventListener("DOMContentLoaded", () => {
    const isIndex = !!$("#categoryGrid");
    const isCategory = !!$("#dishGrid");

    if (isIndex) window.MenuApp.initIndexPage();
    if (isCategory) window.MenuApp.initCategoryPage();
  });
})();
