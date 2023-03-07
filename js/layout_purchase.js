"use strict";
export { purchaseList, getProductAll_Purchase, addData_Purchase }

// 取FDOM元素
const addPurchaseProduct = document.getElementById("addPurchaseProduct");
const adminPurchase_addFormSelect = document.querySelectorAll("#adminPurchase_add .form-select");
const adminPurchase_addFormControl = document.querySelectorAll("#adminPurchase_add .form-control");
/**
 * 進貨頁面UI
 */

// 進貨列表畫面
function purchaseList(data) {
    let str = "";
    data.forEach((item, index) => {
        // JS是以毫秒為單位
        const timestamp = Number(item["buildTime"] * 1000);
        let date = new Date(timestamp)
        date = (date.getFullYear() +
            "/" + (date.getMonth() + 1) +
            "/" + date.getDate() +
            " " + date.getHours() +
            ":" + date.getMinutes() +
            ":" + date.getSeconds())
        if (item["accepted"] == false) {
            item["accepted"] = "未點收";
        } else if (item["accepted"] == true) {
            item["accepted"] = "已點收";
        }

        str += `<tr scope="row">
            <td>
                <input type="checkbox">
            </td>
            <td>${date}</td>
            <td>${item["no"]}</td>
            <td>${item["productNo"]}</td>
            <td>${item["productName"]}</td>
            <td>${item["ordererNum"]}</td>
            <td>${item["acceptDate"]}</td>
            <td>
                <input type="button" data-edit=${index + 1} data-check=${item["no"]} class="btn btn-outline-success btn-sm" value="${item["accepted"]}">
            </td>
            <td>
                <input type="button" data-delete=${index + 1} class="btn btn-outline-danger btn-sm" value="刪除">
            </td>
        </tr>`
    })
    document.querySelector("#adminPurchase tbody").innerHTML = str;
}

// 要新增的進貨資料
function addData_Purchase() {
    const str = adminPurchase_addFormSelect[0].value;
    const str_no = str.substring(0, 6);
    const str_name = str.substring(7, str.length);
    // 組合資料
    const obj = {
        "productNo": str_no,
        "productName": str_name,
        "ordererNum": adminPurchase_addFormControl[0].value,
        "acceptDate": adminPurchase_addFormControl[1].value,
        "accepted": false
    }
    return obj;
}

// 商品下拉式選單UI
function getProductAll_Purchase(objData) {
    let str = "<option selected>選擇</option>";
    objData.forEach((item) => {
        str += `<option value="${item['no']}-${item['name']}">${item['name']}</option>`
    })
    addPurchaseProduct.innerHTML = str;
}
