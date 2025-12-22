import { $, safe, fmt, statsForDishes, pluralPos } from "./utils.js";

export function initIndexPage(){
  const grid = $("#categoryGrid");
  if(!grid) return;

  grid.innerHTML = "";

  for(const c of MENU_DATA.categories){
    const dishes = MENU_DATA.dishesByCategory?.[c.id] || [];
    const st = statsForDishes(dishes);

    const a = document.createElement("a");
    a.className = "card catCard";
    a.href = `category.html?cat=${encodeURIComponent(c.id)}`;

    a.innerHTML = `
      <div class="catCard__top">
        <div class="catCard__emoji">${safe(c.emoji)}</div>
        <span class="badge">📋 ${st.count} ${pluralPos(st.count)}</span>
      </div>

      <div>
        <div class="catCard__title">${safe(c.title)}</div>
        <div class="catCard__desc">${safe(c.desc)}</div>
      </div>

      <div class="catCard__foot">
        <span class="badge">от ${fmt(st.min || 0)}</span>
        <span class="link">Открыть →</span>
      </div>
    `;

    grid.appendChild(a);
  }
}
