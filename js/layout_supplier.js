"use strict";
export { supplierList, addData_Supplier, supplierEditToHTML };

// 取FDOM元素
const adminSupplier_addFormControl = document.querySelectorAll("#adminSupplier_add .form-control");

/**
 * 供應商頁面UI
 */

// 供應商列表
function supplierList(data) {
  let str = "";
  data.forEach((item, index) => {
    str += `
      <tr scope="row">
          <td>
              <input type="checkbox">
          </td>
          <td>${item['no']}</td>
          <td>${item['name']}</td>
          <td>${item['contact']}</td>
          <td>${item['telephone']}</td>
          <td>${item['deliveryDate']}</td>
          <td>
            <input type="button" data-edit=${index + 1} class="btn btn-outline-success btn-sm" value="編輯">
          </td>
          <td>
            <input type="button" data-delete=${index + 1} class="btn btn-outline-danger btn-sm" value="刪除">
          </td>
      </tr>`

  })
  document.getElementById("adminSupplierListContent").innerHTML = str;
}

/**
 * 新增供應商頁面
 */

// 要新增供應商的資料
function addData_Supplier() {
  // 組合資料
  let obj = {
    "name": adminSupplier_addFormControl[0].value,
    "telephone": adminSupplier_addFormControl[1].value,
    "contact": adminSupplier_addFormControl[2].value,
    "deliveryDate": adminSupplier_addFormControl[3].value
  }
  return obj;
}

/**
 * 供應商資料編輯按鈕
 */

function supplierEditToHTML(data) {
  console.log(data);
}