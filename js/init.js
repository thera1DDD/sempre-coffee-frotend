import { initIndexPage } from "./indexPage.js";
import { initCategoryPage } from "./categoryPage.js";

document.addEventListener("DOMContentLoaded", ()=>{
  if(!window.MENU_DATA){
    console.error("Нет MENU_DATA. Подключи data.js перед init.js");
    return;
  }
  initIndexPage();
  initCategoryPage();
});
