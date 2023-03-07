"use strict";
import { deleteData, getAllData, postData, getOneData, patchData } from "./state.js";
import { add, lastClick } from "./layout_aside.js";
import { orderList } from "./layout_order.js";
import { productList, clearFormText } from "./layout_product.js";
import { BOMList } from "./layout_BOM.js";
import { inventoryList } from "./layout_inventory.js"
import { supplierList } from "./layout_supplier.js";
import { purchaseList } from "./layout_purchase.js";
export { showListAll, deleteBtn, clearFormSelect, clearFormControl };


// 列表畫面初始設定
const perpage = 5; //每頁5筆
let fethchData; //fetch取得的資料
let currentPage; //當前頁碼
let currentClass; //當前類別

/**
 * 各列表共用UI 
 */

// json資料渲染邏輯
function showListAll(jsonData, nowPage, adminClass) {
    fethchData = jsonData;
    currentClass = adminClass;
    // 全部資料筆數
    const dataTotal = jsonData.length;
    // 全部資料頁數
    const pageTotal = Math.ceil(dataTotal / perpage);
    currentPage = nowPage;
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    // 每頁5筆的資料放置
    const minData = (currentPage * perpage) - perpage + 1;
    const maxData = (currentPage * perpage);
    let data = [];
    jsonData.forEach((item, index) => {
        let num = index + 1;
        if (num >= minData && num <= maxData) {
            data.push(item);
        }
    });
    // 頁數資料
    const page = {
        pageTotal,
        currentPage,
        "hasPage": currentPage > 1,
        "hasNext": currentPage < pageTotal,
    }

    let listTotal;
    let pagination;

    switch (adminClass) {
        case "O": //訂單
            listTotal = document.querySelector("#adminOrder .listTotal");
            pagination = document.querySelector("#adminOrder .pagination");
            orderList(data);
            showListTotal(dataTotal, perpage, listTotal)
            showListPageBtn(page, pagination);
            break;
        case "P": //商品
            listTotal = document.querySelector("#adminProduct .listTotal");
            pagination = document.querySelector("#adminProduct .pagination");
            productList(data);
            showListTotal(dataTotal, perpage, listTotal)
            showListPageBtn(page, pagination);
            break;
        case "M": //物料
            listTotal = document.querySelector("#adminBOM .listTotal");
            pagination = document.querySelector("#adminBOM .pagination");
            BOMList(data);
            showListTotal(dataTotal, perpage, listTotal)
            showListPageBtn(page, pagination);
            break;
        case "I": //庫存
            listTotal = document.querySelector("#adminInventory .listTotal");
            pagination = document.querySelector("#adminInventory .pagination");
            inventoryList(data);
            showListTotal(dataTotal, perpage, listTotal)
            showListPageBtn(page, pagination);
            break;
        case "B": //進貨
            listTotal = document.querySelector("#adminPurchase .listTotal");
            pagination = document.querySelector("#adminPurchase .pagination");
            purchaseList(data);
            showListTotal(dataTotal, perpage, listTotal)
            showListPageBtn(page, pagination);
            break;
        case "S": //供應商
            listTotal = document.querySelector("#adminSupplier .listTotal");
            pagination = document.querySelector("#adminSupplier .pagination");
            supplierList(data);
            showListTotal(dataTotal, perpage, listTotal)
            showListPageBtn(page, pagination);
            break;
    }
}

// 總筆數及每頁筆數
function showListTotal(dataTotal, perpage, el) {
    el.textContent = `總共${dataTotal}筆，每頁顯示${perpage}筆`;
}

// 按鈕
function showListPageBtn(page, el) {
    let str = "";
    const total = page.pageTotal;

    if (page.hasPage) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">&laquo;</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">&laquo;</span></li>`;
    }

    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    };
    if (page.hasNext) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">&raquo;</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">&raquo;</span></li>`;

    }
    el.innerHTML = str;
}

// 每頁的畫面渲染
function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    showListAll(fethchData, page, currentClass);
}

// 分頁click事件
const listPagination = document.querySelectorAll('.pagination');
listPagination.forEach((el) => {
    el.addEventListener('click', switchPage)
});


/**
 * 新增資料的畫面初始化
 */

// 取DOM元素
const main = document.querySelector("main");
const signoutBtn = document.getElementById("signoutBtn");

// 下拉式選單預設為選擇
function clearFormSelect() {
    let element = document.querySelectorAll(".form-select");
    element.forEach((item) => {
        item.value = "選擇";
    })
}

// input:text欄位預設為空白
function clearFormControl() {
    let element = document.querySelectorAll(".form-control");
    element.forEach((item) => {
        item.value = "";
    })
}

/**
 * 商品、物料、供應商資料的 新增/刪除/編輯邏輯
 */

// 新增資料按鈕
function addBtn(e, t) {

    // 點擊到新增
    let nextPage = e.target.dataset.nextpage;
    console.log(nextPage)
    nextPage = t.children[nextPage];
    console.log(nextPage)
    // 點選當頁
    const clickPage = nextPage.previousElementSibling;
    clickPage.setAttribute("class", "d-none");
    nextPage.setAttribute("class", "d-block");

    // 初始畫面
    clearFormSelect();
    clearFormControl();
    clearFormText();

    const id = clickPage.id

    if (id.includes("adminProduct")) {
        getAllData("/api/admin/products/all");
        getAllData("/api/admin/suppliers/all");
        getAllData("/api/admin/BOM/all");
    }
    if (id.includes("adminBOM")) {
        getAllData("/api/admin/suppliers/all");
    }
    if (id.includes("adminPurchase")) {
        getAllData("/api/admin/products/all");
    }
}

// 返回上一頁面按鈕
function backBtn(e, t) {

    // 點選到返回，fetch資料
    let prePage = e.target.dataset.prepage;
    switch (prePage) {
        case "adminProduct":
            getAllData("/api/admin/products/all");
            break
        case "adminBOM":
            getAllData("/api/admin/BOM/all");
            break
        case "adminPurchase":
            getAllData("/api/admin/purchases/all");
            break
        case "adminSupplier":
            getAllData("/api/admin/suppliers/all");
            break
    }
    prePage = t.children[prePage];
    // 點選當頁
    const clickPage = prePage.nextElementSibling;
    console.log(clickPage, prePage);
    clickPage.setAttribute("class", "d-none");
    prePage.setAttribute("class", "d-block");

    // 回到初始畫面
    clearFormSelect();
    clearFormControl();
    clearFormText();
}

// 重置按鈕
function resetBtn() {
    clearFormSelect();
    clearFormControl();
    clearFormText();
}

// 送出按鈕
function sendBtn(e, t) {
    let dom = e.target.dataset.send;
    console.log(dom);
    switch (dom) {
        case "adminProduct_add":
            postData("/api/admin/product");
            break;
        case "adminBOM_add":
            postData("/api/admin/BOM");
            break;
        case "adminPurchase_add":
            postData("/api/admin/purchase");
            break;
        case "adminSupplier_add":
            postData("/api/admin/supplier");
            break;
    }
}

// 編輯邏輯
// 1.先取得點擊的當前編號
// 2.再向API取得該id的資料
function editBtn(e) {
    let editIndex = e.target.getAttribute("data-edit");
    editIndex = Number(currentPage - 1) * Number(perpage) + Number(editIndex);
    const newArr = fethchData.filter((value, index, array) => {
        return Number(index) + 1 == editIndex
    })

    let adminClass = newArr[0]["no"].toUpperCase();
    adminClass = adminClass[0];
    switch (adminClass) {
        case "O": //訂單
            getOneData("/api/user/order/", newArr[0]["no"]);
            break;
        case "P": //商品
            getOneData("/api/admin/product/", newArr[0]["no"]);
            break;
        case "M": //物料
            getOneData("/api/admin/BOM/", newArr[0]["no"]);
            break;
        case "B": //進貨
            getOneData("/api/admin/purchase/", newArr[0]["no"]);
            break;
        case "S": //供應商
            getOneData("/api/admin/supplier/", newArr[0]["no"]);
            break;
    }
}

// 刪除邏輯
// 1.先取得點擊的當前編號
// 2.再向API刪除該id的資料
function deleteBtn(e) {
    let spliceIndex = e.target.getAttribute("data-delete");
    spliceIndex = Number(currentPage - 1) * Number(perpage) + Number(spliceIndex);
    const newArr = fethchData.filter((value, index, array) => {
        return Number(index) + 1 == spliceIndex
    });

    let adminClass = newArr[0]["no"].toUpperCase();
    adminClass = adminClass[0];

    switch (adminClass) {
        case "O": //訂單
            deleteData("/api/admin/order/", newArr[0]["no"]);
            break;
        case "P": //商品
            deleteData("/api/admin/product/", newArr[0]["no"]);
            break;
        case "M": //物料
            deleteData("/api/admin/BOM/", newArr[0]["no"]);
            break;
        case "B": //進貨
            deleteData("/api/admin/purchase/", newArr[0]["no"]);
            break;
        case "S": //供應商
            deleteData("/api/admin/supplier/", newArr[0]["no"]);
            break;
    }
}

// 訂單狀態：未處理設定為處理
// 1.data-handle 即是訂單編號
// 2.取得data-handle後，向API設定為已處理
function handleBtn(e) {
    const handleIndex = e.target.getAttribute("data-handle");
    patchData("/api/admin/order/", handleIndex);
}

// 收貨狀態：false設定為true
// 1.data-accept 即是進貨編號
// 2.取得data-accept後，向API設定為已點收
function acceptBtn(e) {
    const acceptIndex = e.target.getAttribute("data-check");
    console.log(acceptIndex);
    patchData("/api/admin/purchase/", acceptIndex);
}

// 登出 的click事件
signoutBtn.addEventListener("click", function (e) {
    if (e.target.id == "signoutBtn") {
        // 清除session
        sessionStorage.removeItem('websiteAdmin');
        // 關閉新增資料畫面
        add.forEach((item) => {
            item.setAttribute("class", "d-none");
        });
        lastClick.setAttribute("class", "d-none");
        // 選單往上收
        collapseProduct.setAttribute("class", "collapse");
        collapsePurchase.setAttribute("class", "collapse");
        adminPage.setAttribute("class", "d-none");
        adminIndex.setAttribute("class", "d-block");
        loginPage.setAttribute("class", "d-block text-center mx-auto pt-3");
    }
})

// 商品、物料、供應商 新增/刪除/編輯 的click事件
main.addEventListener("click", function (e) {
    const value = e.target.value;
    if (typeof value == "undefined" || value == 0) {
        return;
    } else if (value.includes("新增")) {
        addBtn(e, this);
    } else if (value == "編輯") {
        editBtn(e);
    } else if (value == "未處理") {
        handleBtn(e); //訂單狀態
    } else if (value == "已處理") {
        alert("訂單狀態已處理");
    } else if (value == "未點收") {
        acceptBtn(e); //收貨狀態
    } else if (value == "已點收") {
        alert("收貨已點收");
    } else if (value == "刪除") {
        deleteBtn(e);
    } else if (value.includes("返回")) {
        backBtn(e, this);
    } else if (value == "重置") {
        resetBtn();
    } else if (value == "送出") {
        sendBtn(e, this);
    }
});
