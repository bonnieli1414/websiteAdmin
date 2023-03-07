"use strict";
import { showListAll, clearFormSelect, clearFormControl } from "./layout_main.js";
import { addData_product, getSuppliersAll_Product, clearFormText, getBOMAll_Product, productEditToHTML } from "./layout_product.js";
import { addData_BOM, getSuppliersAll_BOM, BOMEditToHTML } from "./layout_BOM.js";
import { addData_Purchase, getProductAll_Purchase } from "./layout_purchase.js";
import { addData_Supplier, supplierEditToHTML } from "./layout_supplier.js";
export { getAllData, getOneData, getInventoryData, postData, putData, patchData, deleteData };

/**
 * 向API傳送與接收資料檔案
 */

const apiUrl = "https://flaskapp-project.herokuapp.com";

// 設定header資料，並將token存至session
const setHeaders = () => {
    const token = sessionStorage.getItem('websiteAdmin');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");
    return myHeaders
}

// 查詢全部資料(訂單/商品/物料/進貨/供應商)
const getAllData = (router) => {
    const myHeaders = setHeaders();
    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };
    fetch(apiUrl + router, requestOptions)
        .then(response => {
            return response.json();
        })
        .then(result => {
                // 訂單資料
            if (router.includes("orders")) {
                showListAll(result["message"], 1, "O");
                // 商品資料
            } else if (router.includes("products")) {
                showListAll(result["message"], 1, "P");
                getProductAll_Purchase(result["message"]);
                // 物料資料 
            } else if (router.includes("BOM")) {
                showListAll(result["message"], 1, "M");
                getBOMAll_Product(result["message"]);
                // 進貨資料
            } else if (router.includes("purchases")) {
                showListAll(result["message"], 1, "B");
                // 供應商資料
            } else if (router.includes("suppliers")) {
                getSuppliersAll_Product(result["message"]);
                getSuppliersAll_BOM(result["message"]);
                showListAll(result["message"], 1, "S");
            } else if (router.includes("")) {
                showListAll(result["message"], 1, "U");
            }
        })
        .catch(error => {
            console.log('error', error);
        });
}

// 查詢單一資料(商品/物料/進貨/供應商)
const getOneData = (router, id) => {
    const myHeaders = setHeaders();
    let requestOptions = {
        method: 'GET',
        headers: myHeaders
    };
    fetch(apiUrl + router + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            // 訂單資料
            if (router.includes("order")) {
                orderEditToHTML(result['message']);
            }   // 商品資料
            else if (router.includes("product")) {
                productEditToHTML(result['message']);
                // 物料資料 
            } else if (router.includes("BOM")) {
                BOMEditToHTML(result['message']);
                // 進貨資料
            } else if (router.includes("purchase")) {
                purchaseEditToHTML(result['message']);
                // 供應商資料
            } else if (router.includes("supplier")) {
                supplierEditToHTML(result['message']);
            }
        })
        .catch(error => console.log('error', error));
}

// 後端資料庫沒有設定庫存router，
// 這裡是由前端各別fetch：商品/物料/進貨 資料
const getInventoryData = (router) => {
    const myHeaders = setHeaders();
    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };
    fetch(apiUrl + router, requestOptions)
        .then(response => {
            return response.json();
        })
        .then(result => {
            setInventoryData(result["message"], 1, "I");
        })
        .catch(error => {
            console.log('error', error);
        });
}

let pList; //商品
let mList; //物料
let bList; //進貨
let iList;
// 承接getInventoryData，這裡需要重組庫存需要顯示的資料
// 重新組合(庫存資料：商品/物料/進貨)
// 組合邏輯：
// 1.先用concat方法組合商品和物料為新的array並賦予在iList變數上，
// 2.再用iList與bList進貨資料一一比對，
// 3.將bList進貨資料也加入iList，組成可以顯示預計來貨的資訊
const setInventoryData = (jsonData, nowPage, adminClass) => {
    let inventoryClass = jsonData[0]["no"]
    if (inventoryClass.includes("P")) {
        pList = jsonData
    } else if (inventoryClass.includes("M")) {
        mList = jsonData
    }
    else {
        bList = jsonData
    }
    // 將商品和物料資料組合，並加入進貨資料
    if (pList != undefined && mList != undefined && bList != undefined) {
        iList = pList.concat(mList);
        iList.forEach((i) => {
            bList.forEach((j) => {
                if (i['no'] == j['productNo']) {
                    i['orderTime'] = j['orderTime'];
                    i['ordererNum'] = j['ordererNum'];
                    i['accepted'] = j['accepted'];
                }
            })
        })
    }
    if (iList != undefined) {
        showListAll(iList, nowPage, adminClass);
    }
}

// 新增資料(商品/物料/進貨/供應商)
const postData = (router) => {
    let obj;
    const myHeaders = setHeaders();
    // 商品
    if (router.includes("product")) {
        obj = addData_product();
        // 物料 
    } else if (router.includes("BOM")) {
        obj = addData_BOM();
        // 進貨
    } else if (router.includes("purchase")) {
        obj = addData_Purchase();
        // 供應商
    } else if (router.includes("supplier")) {
        obj = addData_Supplier();
    }

    const raw = JSON.stringify(obj);
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    fetch(apiUrl + router, requestOptions)
        .then(response => response.json())
        .then(
            result => {
                alert(result.message);
                clearFormSelect();
                clearFormControl();
                clearFormText();
                // 新增商品資料
                if (router.includes("product")) {
                    // 新增物料資料 
                } else if (router.includes("BOM")) {
                    // 新增進貨資料
                } else if (router.includes("purchase")) {
                    // 新增供應商資料
                } else if (router.includes("supplier")) {
                }
            }
        )
        .catch(error => {
            console.log('error', error);
            alert(error);
        });
}

// 刪除資料(訂單/商品/物料/進貨/供應商)
// 刪除後向API重新取得新資料
const deleteData = (router, id) => {
    const myHeaders = setHeaders();
    const raw = "";
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw
    };
    fetch(apiUrl + router + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result);
            alert("刪除成功");
            // 取得全部訂單資料
            if (router.includes("order")) {
                getAllData("/api/admin/orders/all");
                // 取得全部商品資料
            } else if (router.includes("product")) {
                getAllData("/api/admin/products/all");
                // 取得全部物料資料 
            } else if (router.includes("BOM")) {
                getAllData("/api/admin/BOM/all");
                // 取得全部進貨資料
            } else if (router.includes("purchase")) {
                getAllData("/api/admin/purchases/all");
                // 取得全部供應商資料
            } else if (router.includes("supplier")) {
                getAllData("/api/admin/suppliers/all");
            }
        })
        .catch(error => console.log('error', error));
}

// fetch-put(商品/物料/供應商)
const putData = (router, id) => {
    const myHeaders = setHeaders();
    // 商品資料修改
    if (router.includes("product")) {
        // 物料資料修改 
    } else if (router.includes("BOM")) {
        // 進貨資料修改
    } else if (router.includes("purchase")) {
        // 供應商資料修改
    } else if (router.includes("supplier")) {
    }

    let raw = JSON.stringify(obj);
    let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiUrl + router + id, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

// fetch-patch(訂單/進貨)
const patchData = (router, id) => {
    const myHeaders = setHeaders();
    let raw = "";
    // 訂單狀態變更
    if (router.includes("order")) {
        raw = JSON.stringify({
            "handle": true
        });
        // 進貨狀態變更
    } else if (router.includes("purchase")) {
        raw = JSON.stringify({
            "accepted": true
        });
    }

    let requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw
    };

    fetch(apiUrl + router + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result);
                // 訂單狀態變更
            if (router.includes("order")) {
                if (result.status == 200) {
                    alert("訂單已處理成功");
                } else {
                    alert(result.message);
                }
                getAllData("/api/admin/orders/all");
                // 進貨狀態變更
            } else if (router.includes("purchase")) {
                if (result.status == 200){
                    alert("進貨已點收成功");
                }else{
                    alert(result.message);
                }
                getAllData("/api/admin/purchases/all");
            }
        })
        .catch(error => console.log('error', error));
}
