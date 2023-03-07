"use strict";
import { getAllData, getInventoryData } from "./state.js";
export { add, lastClick }

// 取DOM元素
const toggleMenuBtn = document.getElementById("toggleMenuBtn");
const adminPage = document.getElementById("adminPage");
const aside = document.querySelector("aside");
const adminIndex = document.getElementById("adminIndex");
// main標籤內的標題id
let mainTitle = document.querySelector("main").children;
mainTitle = [...mainTitle]; //類陣列轉陣列


let add = mainTitle.filter((item) => {
  return item.dataset.child == "add";
})

// 初始化，預設最後一次click是首頁的訊息公告
let lastClick = adminIndex;

/**
 * admin UI 和 要fetch查詢的資料
 */

// 監聽/toggle=>aside旁右上方的收合按鈕
toggleMenuBtn.addEventListener("click", (e) => {
  e.preventDefault();
  adminPage.classList.toggle("aside-toggled");
});

// 監聽aside的選單按鈕
aside.addEventListener("click", function (e) {
  e.preventDefault();

  mainTitle.forEach((item) => {
    if (e.target.dataset.title != "adminIndex") {
      adminIndex.setAttribute("class", "d-none");
    }
    if (e.target.dataset.title == item.id) {
      // 設定要查詢的資料
      setFetchData(item.id);
      // 設定要顯示和隱藏的UI
      lastClick.setAttribute("class", "d-none");
      add.forEach((item) => {
        item.setAttribute("class", "d-none");
      });
      item.setAttribute("class", "d-block");
      // 儲存最後一次的按鈕id
      lastClick = item;
    }
  })
});

// fetch資料
function setFetchData(result) {
  switch (result) {
    case "adminIndex":
      break;
    case "adminOrder":
      getAllData("/api/admin/orders/all");
      break;
    case "adminProduct":
      getAllData("/api/admin/products/all");
      break;
    case "adminBOM":
      getAllData("/api/admin/BOM/all");
      break;
    case "adminInventory":
      getInventoryData("/api/admin/products/all");
      getInventoryData("/api/admin/BOM/all");
      getInventoryData("/api/admin/purchases/all");
      break;
    case "adminPurchase":
      getAllData("/api/admin/purchases/all");
      break;
    case "adminSupplier":
      getAllData("/api/admin/suppliers/all");
      break;
    case "adminProfile":
      getAllData("");
      break;
  }
};
