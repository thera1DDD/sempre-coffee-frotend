import { $, safe, fmt, qp, pluralPos, statsForDishes } from "./utils.js";

export function initCategoryPage(){
  const grid = $("#dishGrid");
  if(!grid) return;

  const catId = qp("cat") || "";
  const cat = MENU_DATA.categories.find(c=>c.id===catId);

  if(!cat){
    $("#dishEmpty").style.display="block";
    return;
  }

  const dishes = MENU_DATA.dishesByCategory?.[catId] || [];
  const st = statsForDishes(dishes);

  $("#crumbCat").textContent = safe(cat.title);
  $("#catTitle").textContent = safe(cat.title);
  $("#catDesc").textContent = safe(cat.desc || "");

  // можно убрать emoji вообще или оставить — но ты просил без значков, поэтому делаем нейтрально
  const catEmoji = $("#catEmoji");
  if(catEmoji) catEmoji.style.display = "none";

  $("#statCount").textContent = `${st.count} ${pluralPos(st.count)}`;
  $("#statPrice").textContent = st.count ? `цены: ${fmt(st.min)} — ${fmt(st.max)}` : "—";

  $("#listMeta").textContent = st.count
    ? `В категории: ${st.count} ${pluralPos(st.count)} • от ${fmt(st.min)}`
    : `В категории нет позиций`;

  renderDishes(dishes);
}

function renderDishes(dishes){
  const grid = $("#dishGrid");
  const empty = $("#dishEmpty");

  grid.innerHTML = "";

  if(!dishes.length){
    empty.style.display="block";
    return;
  }
  empty.style.display="none";

  for(const d of dishes){
    const ing = (d.ingredients && d.ingredients.length) ? d.ingredients.join(", ") : "—";

    const card = document.createElement("div");
    card.className = "card dishCard";

    card.innerHTML = `
      <div class="imgFrame imgFrame--dish">
        <img class="imgFrame__img" src="${safe(d.image)}" alt="${safe(d.name)}" loading="lazy">
      </div>

      <div class="dishCard__body">
        <div class="dishCard__name">${safe(d.name)}</div>
        <div class="dishCard__desc">${safe(d.desc || "")}</div>

        <div class="dishCard__ing"><b>Состав:</b> ${safe(ing)}</div>

        <div class="metaRow">
          <span class="chip">⚖️ ${safe(d.weight || "—")}</span>
          <span class="chip">🔥 ${safe(d.calories ?? "—")} ккал</span>
        </div>
      </div>

      <div class="dishCard__right">
        <div>
          <div class="price">${fmt(d.price)}</div>
          <div class="small">за порцию</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
}
