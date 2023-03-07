"use strict";
export { addData_product, getSuppliersAll_Product, productList, clearFormText, getBOMAll_Product, productEditToHTML }

// 取FDOM元素
const productPicDemo_add = document.getElementById("productPicDemo_add");
const adminProduct_addBOMBtn = document.getElementById("adminProduct_addBOMBtn");
const adminProduct_addBOMListName = document.getElementById("adminProduct_addBOMListName");
const adminProduct_addBOMListNum = document.getElementById("adminProduct_addBOMListNum");
const addProductSupplier = document.getElementById("addProductSupplier");
let adminProduct_addBOMList = [];
const adminProduct_addFormSelect = document.querySelectorAll("#adminProduct_add .form-select");
const adminProduct_addFormControl = document.querySelectorAll("#adminProduct_add .form-control");
let formText = document.querySelectorAll("#adminProduct_add .form-text");
formText = [...formText]; //類陣列轉陣列
const productPicDemo = document.getElementById("productPicDemo");
const pictureDemo = document.getElementById("pictureDemo");
const switch_sale = document.getElementById("switch_sale");
const switch_sale_label = document.querySelector(".switch_sale-label");
let online = false;
let pictureDemoList = [];
const pictureList = document.querySelector(".card-groups");
const adminProduct_edit = document.getElementById("adminProduct_edit");


/**
 * 商品頁面UI
 */
// 商品列表畫面
function productList(data) {
    console.log(data);
    let str = "";
    data.forEach((item, index) => {
        str += `<tr scope="row">
            <td>
                <input type="checkbox">
            </td>
            <td>${item["no"]}</td>
            <td width="180px">${item["name"]}</td>
            <td width="350px">${item["description"]}</td>
            <td>${item["online"]}</td>
            <td>${item["price"]}</td>
            <td>${item["sale"]}</td>
            <td>${item["inventory"]}</td>
            <td>
                <input type="button" data-edit=${index + 1} class="btn btn-outline-success btn-sm" value="編輯">
            </td>
            <td>
                <input type="button" data-delete=${index + 1} class="btn btn-outline-danger btn-sm" value="刪除">
            </td>
        </tr>`
    })
    document.querySelector("#adminProduct tbody").innerHTML = str;
}

/**
 * 新增商品頁面
 */
// 清空清單
function clearFormText() {
    adminProduct_addBOMList = [];
    pictureDemoList = [];
    formText.forEach(item => {
        item.textContent = "";
    })
}

// 供應商下拉式選單UI
function getSuppliersAll_Product(objData) {
    let str = "<option selected>選擇</option>";
    objData.forEach((item) => {
        str += `<option value="${item['no']}-${item['name']}">${item['no']}-${item['name']}</option>`
    })
    addProductSupplier.innerHTML = str;
}

// 物料清單下拉式選單UI
function getBOMAll_Product(objData) {
    let str = "<option selected>選擇</option>";
    objData.forEach((item) => {
        str += `<option value="${item['no']}-${item['name']}">${item['no']}-${item['name']}</option>`
    })
    adminProduct_addBOMListName.innerHTML = str;
}

// 物料新增清單UI
function addBOMList(data) {
    let str = "";
    data.forEach((item, index) => {
        console.log(data)
        str += `
            <div class="row align-items-center justify-content-center my-2">
            <div class="col-6 col-md-4 my-1 text-end">${item['物料名稱']}
            </div>
            <div class="col-3 col-md-2 my-1 text-start">${item['物料數量']}
            </div>
            <input type="button" class="btn btn-sm btn-outline-secondary col-1 my-1" text-start data-bom_num="${index + 1}" value="–" style="width:24px; height:24px; line-height:14px; vertical-align:middle;">
            </div>
        `
    })
    formText[1].innerHTML = str;
}

// 要新增商品的資料
function addData_product() {
    // 組合資料
    let obj = {
        "finishDegree": "成品",
        "category": adminProduct_addFormSelect[0].value,
        "name": adminProduct_addFormControl[0].value,
        "description": adminProduct_addFormControl[1].value,
        "picture": pictureDemoList,
        "online": online,
        "price": adminProduct_addFormControl[3].value,
        "sale": adminProduct_addFormControl[4].value,
        "inventory": adminProduct_addFormControl[5].value,
        "supplier": adminProduct_addFormSelect[1].value,
        "haveBOM": adminProduct_addBOMList
    }
    console.log(obj);
    return obj;
}

// 預覽圖
productPicDemo.addEventListener("input", (e) => {
    let str = `<img style="height: 190px;" src="${e.target.value}" data-img="e.target.value"></img>`;
    pictureDemo.innerHTML = str;
});

// 新增圖片"後"的商品圖
function picToHTML() {
    let str = "";
    pictureDemoList.forEach((item, index) => {
        str += `
        <div class="card position-relative m-2" style="width: 12rem; height: 190px" data-img="${index}">
        <div class="card-float position-absolute end-0">
        <button type="button" class="btn-close" aria-label="Close" data-delete="${index}"></button>
        </div>
        <img src="${item}" class="card-img-top">
        </div>
    `
    })
    pictureList.innerHTML = str;
}

// 新增商品圖資料
productPicDemo_add.addEventListener("click", (e) => {
    pictureDemoList.push(productPicDemo.value);
    picToHTML();
});

// 刪除商品圖資料
formText[0].addEventListener("click", (e) => {
    const el = e.target
    if (el.getAttribute("class") == "btn-close") {
        const index = el.getAttribute("data-delete");
        pictureDemoList.splice(index, 1);
        picToHTML();
    }
})

// 是否上架按鈕
switch_sale_label.addEventListener("click", (e) => {
    online = switch_sale.checked;
});

// 新增物料清單按鈕
adminProduct_addBOMBtn.addEventListener("click", (e) => {
    let obj = {
        "物料名稱": adminProduct_addBOMListName.value,
        "物料數量": adminProduct_addBOMListNum.value
    }
    adminProduct_addBOMList.push(obj);
    addBOMList(adminProduct_addBOMList)
});

// 清除物料清單按鈕
formText[1].addEventListener("click", (e) => {
    if (e.target.value === "–") {
        let spliceIndex = e.target.getAttribute("data-bom_num");
        adminProduct_addBOMList.splice(spliceIndex - 1, 1);
        addBOMList(adminProduct_addBOMList)
    }
});


// 編輯單一商品UI
function productEditToHTML(data) {
    console.log(data)
    // 清空
    let str = ""; 
    let pictureStr = ""; 
    let haveBOMStr = "";

    console.log(data, data['haveBOM'].length, data['picture'].length,typeof data['picture'],typeof data['haveBOM']);
    if (typeof data['picture'] == "object"){
        data['picture'].forEach((i)=>{
            pictureStr+=`
            <div class="card position-relative m-2" style="width: 12rem; height: 190px" data-img="0">
                <div class="card-float position-absolute end-0">
                    <button type="button" class="btn-close" aria-label="Close" data-delete="0"></button>
                </div>
                    <img src="${i}"
                        class="card-img-top">
            </div>
            `
        })
    }else{
        str+=`
        <div class="card position-relative m-2" style="width: 12rem; height: 190px" data-img="0">
            <div class="card-float position-absolute end-0">
                <button type="button" class="btn-close" aria-label="Close" data-delete="0"></button>
            </div>
                <img src="${data['picture']}"
                    class="card-img-top">
        </div>
        `
    }
    if(typeof data['haveBOM'] == "object"){
        data['haveBOM'].forEach((j)=>{
            haveBOMStr+=`<p>${j}<p/>`
        })
    }else{
        haveBOMStr+=`
        <p>${j}</p>
        `
    }
}

// str += `
//     <div id="adminProduct_edit" data-child="edit" class="d-block">
//         <div class="px-4 d-flex justify-content-between align-items-center">
//             <strong class="fs-5 m-2" style="color:blue">商品資料</strong>
//             <input id="backProductBtn" class="btn btn-secondary btn-sm m-2" type="button" value="返回商品列表"
//                 data-prepage="adminProductDetail">
//         </div>
//         <div class="container py-2">
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">產品分類</div>
//                 <div class="col-9 col-md-2 my-1 text-start">${data['finishDegree']}</div>
//                 <div class="col-3 col-md-2 my-1 text-end">商品類別</div>
//                 <div class="col-9 col-md-4 my-1 text-start">
//                     ${data['category']}
//                 </div>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="addProductName">商品名稱</label>
//                 </div>
//                 <div class="col-9 col-md-9 my-1 text-start">
//                     ${data['name']}
//                 </div>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="floatingTextarea">商品描述</label>
//                 </div>
//                 <div class="col-9 col-md-9 my-1 text-start">
//                     <textarea class="form-control shadow-none" id="floatingTextarea">${data['description']}</textarea>
//                 </div>
//             </div>
//             <div class="card-groups d-flex flex-wrap justify-content-center form-text">
//                 <div class="card position-relative m-2" style="width: 12rem; height: 190px" data-img="0">
//                     <div class="card-float position-absolute end-0">
//                         <button type="button" class="btn-close" aria-label="Close" data-delete="0"></button>
//                     </div>
//                     <img src="${data['picture']}"
//                         class="card-img-top">
//                 </div>

//                 <div class="card position-relative m-2" style="width: 12rem; height: 190px" data-img="1">
//                     <div class="card-float position-absolute end-0">
//                         <button type="button" class="btn-close" aria-label="Close" data-delete="1"></button>
//                     </div>
//                     <img src="https://motorolatw.vtexassets.com/arquivos/ids/155657-1200-auto?width=1200&amp;height=auto&amp;aspect=true"
//                         class="card-img-top">
//                 </div>
//             </div>

//             <div id="pictureDemo" style="text-align: center;"><img style="height: 190px;"
//                     src="https://motorolatw.vtexassets.com/arquivos/ids/155679/Motorola-edge-30-pdp-render-Silence-12-bcxm87y2.png?v=637879325266470000"></img>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">是否上架
//                 </div>
//                 <div class="col-3 col-md-3 my-1">
//                     <div class="switch_sale">
//                         <input type="checkbox" class="switch_sale-checkbox" id="switch_sale" checked>
//                         <label class="switch_sale-label" for="switch_sale">
//                             <span class="switch_sale-inner"></span>
//                             <span class="switch_sale-switch"></span>
//                         </label>
//                     </div>
//                 </div>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="addProductPrice">&emsp;&emsp;原價</label>
//                 </div>
//                 <div class="col-9 col-md-4 my-1 text-start">
//                     <input type="number" id="addProductPrice" class="form-control shadow-none" value="${data['price']}">
//                 </div>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="addProductSale">&emsp;&emsp;特價</label>
//                 </div>
//                 <div class="col-9 col-md-4 my-1 text-start">
//                     <input type="number" id="addProductSale" class="form-control shadow-none" value="${data['sale']}">
//                 </div>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="addProductInventory">&emsp;庫存量</label>
//                 </div>
//                 <div class="col-9 col-md-4 my-1 text-start">
//                     <input type="number" id="addProductInventory" class="form-control shadow-none" value="${data['inventory']}">
//                 </div>
//             </div>
//             <div class="row align-items-center">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="addProductSupplier">&emsp;供應商</label>
//                 </div>
//                 <div class="col-9 col-md-4 my-1 text-start">
//                     <select id="addProductSupplier" class="form-select shadow-sm" aria-label="Default select">
//                         <option selected>${data['supplier']}</option>
//                     </select>
//                 </div>
//             </div>
//             <div class="row align-items-center justify-content-end justify-content-md-start">
//                 <div class="col-3 col-md-2 my-1 text-end">
//                     <label for="">物料清單</label>
//                 </div>
//                 <div class="col-9 col-md-4 my-1 text-start">
//                     <select id="adminProduct_addBOMListName" class="form-select shadow-sm"
//                         aria-label="Default select">
//                         <option selected>${data['haveBOM']}</option>
//                     </select>
//                 </div>
//                 <div class="col-6 col-md-3 my-1 text-start">
//                     <input type="number" id="adminProduct_addBOMListNum" class="form-control shadow-none">
//                 </div>
//                 <div class="col-3 col-md-2 my-1 text-start">
//                     <input id="adminProduct_addBOMBtn" type="button" class="btn btn-primary" value="+"
//                         style="width:38px; height:38px;">
//                 </div>
//             </div>
//             <div id="adminProduct_addBOMListText" class="form-text"></div>
//             <br><br><br><br><br><br><br><br>
//             <div class="row align-items-center justify-content-end px-4">
//                 <div class="col my-1 text-end">
//                     <input id="adminProductClear" type="button" class="btn btn-outline-secondary" value="重置"
//                         data-reset="adminProduct_add">
//                     <input id="adminProductSend" type="button" class="btn btn-outline-primary" value="送出"
//                         data-send="adminProduct_add">
//                 </div>
//             </div>
//         </div>
//     </div>
//     `;
//     adminProduct_edit.innerHTML = str;