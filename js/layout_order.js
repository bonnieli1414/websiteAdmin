"use strict";
export { orderList };


/**
 * 訂單頁面UI
 */

// 訂單列表
function orderList(data) {
    let str = "";
    data.forEach((item, index) => {
        if (item['handle'] && item['handle']==true){
            item['handle'] = "已處理"
        }else{
            item['handle'] = "未處理"
        }
        str += `<tr scope="row">
            <td>
                <input type="checkbox">
            </td>
            <td>${item["no"]}</td>
            <td>${item["receiver"]}</td>
            <td>${item["receiverAddress"]}</td>
            <td>${item["email"]}</td>`;

        // 訂購商品資料組合
        let inner = "";
        item['cartList'].forEach((item) => {

            inner += `<p>
            ${item['product']['name']}
            <span> X ${item['quantity']}</span>
            </p>`
        });
        str += `<td>${inner}</td>`;

        const timestamp = item["no"].replace(/[a-zA-Z]+/g, "");
        // JS以毫秒為單位，為13碼
        let date = new Date(Number(timestamp.substr(0,13)));
        // console.log(Number(timestamp.substr(0,13)))
        date = date.getFullYear()+
        "/"+(date.getMonth()+1)+
        "/"+date.getDate()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds()
        str += `<td>${date}</td>
            <td>${item["payment"]}</td>
            <td>
                <input type="button" data-edit=${index + 1} data-handle=${item["no"]} class="btn btn-outline-success btn-sm" value="${item['handle']}">
            </td>
            <td>
                <input type="button" data-delete=${index + 1} class="btn btn-outline-danger btn-sm" value="刪除">
            </td>
        </tr>`
    })
    document.querySelector("#adminOrder tbody").innerHTML = str;
}
