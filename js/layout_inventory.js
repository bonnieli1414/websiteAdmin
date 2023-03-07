"use strict";
export { inventoryList }

/**
 * 庫存頁面UI
 */

// 商品物料庫存列表
function inventoryList(data) {

    let str = "";
    let orderTime;
    data.forEach((item, index) => {
        // 將BOM表為空值或物料 的BOM表欄位設定為空白
        if (item.haveBOM == [] || item.haveBOM == undefined) {
            item["haveBOM"] = "";
        };
        // 將沒有來貨資料設定空白
        if (item.orderTime == undefined) {
            orderTime = "";
        } else {
            // 時間戳轉換
            orderTime = Number(item["orderTime"]) * 1000
            orderTime = new Date(orderTime)
            orderTime = (orderTime.getFullYear() +
                "/" + (orderTime.getMonth() + 1) +
                "/" + orderTime.getDate());
        }

        // 將沒有來貨數量也設定空白
        if (item.ordererNum == undefined) {
            item["ordererNum"] = "";
        }

        item["updateTime"] = Number(item["updateTime"]) * 1000
        let updateTime = new Date(item["updateTime"])
        updateTime = (updateTime.getFullYear() +
            "/" + (updateTime.getMonth() + 1) +
            "/" + updateTime.getDate() +
            " " + updateTime.getHours() +
            ":" + updateTime.getMinutes() +
            ":" + updateTime.getSeconds());
        str += `<tr scope="row">
            <td>
                <input type="checkbox">
            </td>
            <td>${item["no"]}</td>
            <td>${item["name"]}</td>
            <td>${item["finishDegree"]}</td>
            <td>${item["inventory"]}</td>
            <td>${item["haveBOM"]}</td>
            <td>${orderTime}</td>
            <td>${item["ordererNum"]}</td>
            <td>${updateTime}</td>
        </tr>`
    })
    document.querySelector("#adminInventory tbody").innerHTML = str;
}