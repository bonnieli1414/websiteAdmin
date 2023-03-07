"use strict";
export { addData_BOM, getSuppliersAll_BOM, BOMList, BOMEditToHTML };

// 取FDOM元素
const addBOMSupplier = document.getElementById("addBOMSupplier");
const adminBOM_addFormSelect = document.querySelectorAll("#adminBOM_add .form-select");
const adminBOM_addFormControl = document.querySelectorAll("#adminBOM_add .form-control");


/**
 * 物料頁面UI
 */

// 物料列表
function BOMList(data) {
    let str = "";
    data.forEach((item, index) => {
        str += `<tr scope="row">
            <td>
                <input type="checkbox">
            </td>
            <td>${item["no"]}</td>
            <td>${item["name"]}</td>
            <td>${item["unit"]}</td>
            <td>${item["price"]}</td>
            <td>${item["inventory"]}</td>
            <td>${item["supplier"]}</td>
            <td>
                <input type="button" data-edit=${index + 1} class="btn btn-outline-success btn-sm" value="編輯">
            </td>
            <td>
                <input type="button" data-delete=${index + 1} class="btn btn-outline-danger btn-sm" value="刪除">
            </td>
        </tr>`
    })
    document.querySelector("#adminBOM tbody").innerHTML = str;
}

/**
 * 新增物料頁面
 */

// 供應商下拉式選單UI
function getSuppliersAll_BOM(objData) {
    // console.log(objData);
    let str = "<option selected>選擇</option>";
    objData.forEach((item, index) => {
        str += `<option value="${item['name']}">${item['name']}</option>`
    })
    addBOMSupplier.innerHTML = str;
}

// 要新增物料的資料
function addData_BOM() {
    // 組合資料
    let obj = {
        "finishDegree": "物料",
        "category": adminBOM_addFormSelect[0].value,
        "name": adminBOM_addFormControl[0].value,
        "unit": adminBOM_addFormControl[1].value,
        "price": adminBOM_addFormControl[2].value,
        "inventory": adminBOM_addFormControl[3].value,
        "supplier": adminBOM_addFormSelect[1].value
    }
    return obj;
}

// 編輯BOM表
function BOMEditToHTML(data) {
    console.log(data);
}