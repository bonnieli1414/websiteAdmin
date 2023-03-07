"use strict";
// 取DOM元素
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminSignupBtn = document.getElementById("adminSignupBtn");
const adminLoginEmail = document.getElementById("adminLoginEmail");
const adminLoginPassword = document.getElementById("adminLoginPassword");
const adminSignupEmail = document.getElementById("adminSignupEmail");
const adminSignupUser = document.getElementById("adminSignupUser");
const adminSignupPassword = document.getElementById("adminSignupPassword");
const adminSignupPassword_db = document.getElementById("adminSignupPassword_db");
const navTabContent = document.getElementById("nav-tabContent");
const adminIndex = document.getElementById("adminIndex");
const loginTime = document.getElementById("loginTime");

// 取資料的API網址
const apiUrl = "https://flaskapp-project.herokuapp.com/api/";

// 使用正則檢查資料
const checkMail = /^[A-Za-z0-9-_]+(\.[A-Za-z0-9-_]+)*@[a-z0-9]+(\.[a-z0-9-_]+)*(\.[a-z]{2,})$/;
// const checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/;
const checkPassword = /^(?=.*[a-z])(?=.*\d)[^]{6,12}$/;


// 畫面初始化
function initFn() {
  loadingPage.style.visibility = "hidden";
  loginPage.style.display = "block";
  errClearFn();
  adminPage.setAttribute("class", "d-none");
}
// 等待畫面
function waitTimeFn() {
  loadingPage.style.visibility = "visible";
  loginPage.style.display = "none";
  adminPage.setAttribute("class", "d-none");
}
/**
 * 進入管理員首頁畫面
 */
function adminIndexFn() {
  loadingPage.setAttribute("class", "d-none");
  loginPage.setAttribute("class", "d-none");
  adminPage.setAttribute("class", "d-flex");
}
// 畫面出現登入錯誤訊息
function errRenderFn(message) {
  initFn();
  const loginPage = document.getElementById("loginPage");
  const newDiv = document.createElement("h5");
  const newContent = document.createTextNode(message);
  newDiv.appendChild(newContent);
  newDiv.setAttribute("class", "text-danger");
  const nav = document.querySelector("nav");
  loginPage.insertBefore(newDiv, nav);
}
// 清除畫面的登入錯誤訊息
function errClearFn() {
  const textDanger = document.querySelector(".text-danger");
  if (textDanger === null) {
    return
  } else {
    const errEl = document.querySelector(".text-danger");
    const loginPage = document.querySelector("#loginPage");
    loginPage.removeChild(errEl);
  }
}
// 會員登入驗證
function adminLoginFn(email, pwd) {
  const requestUrl = apiUrl + "admin/signin";
  let headers = {
    "Content-Type": "application/json"
  }
  let bodys = JSON.stringify({
    "email": email,
    "password": pwd
  });
  let requestDatas = {
    method: "POST",
    headers: headers,
    body: bodys,
  };

  fetch(requestUrl, requestDatas)
    .then(res => {
      return res.json()
    })
    .then(result => {
      if (result.status === 200) {
        adminIndexFn();
        console.log(result['message']);
        // 將資料存到sessionStorage
        sessionStorage.setItem('websiteAdmin', result['token']);
        adminIndex.setAttribute("class", "d-block");
        const timestamp = new Date();
        loginTime.textContent = `登入時間：${new Date()}`;
      }
      else {
        console.log(result['message']);
        let message = "帳號或密碼輸入錯誤"
        errRenderFn(message);
      }
    })
    .catch(err => {
      console.log(err);
      errRenderFn(err['message']);
    })
}
// 會員註冊驗證
function adminSignupFn(email, user, pwd, dbpwd) {
  let requestUrl = apiUrl + "admin/signup"
  let headers = {
    "Content-Type": "application/json"
  }
  let bodys = JSON.stringify({
    "email": email,
    "name": user,
    "password": pwd,
    "passwordCheck": dbpwd
  });
  let requestDatas = {
    method: "POST",
    headers: headers,
    body: bodys
  };
  fetch(requestUrl, requestDatas)
    .then(res => {
      return res.json()
    })
    .then(result => {
      console.log(result['message']);
      errRenderFn(result['message']);
    })
    .catch(err => {
      console.log(err['message']);
      errRenderFn(err['message']);
    })
}
// 登入按鈕監聽
adminLoginBtn.addEventListener("click", e => {
  e.preventDefault();
  waitTimeFn();
  if (adminLoginEmail.value == "" || adminLoginPassword.value == "") {
    alert("資料不得空白");
    return initFn();
  }

  // 正則匹配結果
  let regMail = checkMail.exec(adminLoginEmail.value);
  if (regMail === null) {
    alert("電子信箱格式不正確");
    return initFn();
  }
  adminLoginFn(adminLoginEmail.value, adminLoginPassword.value);
})
// 註冊按鈕監聽
adminSignupBtn.addEventListener("click", e => {
  e.preventDefault();
  waitTimeFn();
  console.log(adminSignupEmail.value, adminSignupUser.value, adminSignupPassword.value, adminSignupPassword_db.value);

  if (adminSignupEmail.value == "" || adminSignupUser.value == "" || adminSignupPassword.value == "" || adminSignupPassword_db.value == "") {
    alert("資料不得空白");
    return initFn();
  }

  // 正則匹配結果
  let regMail = checkMail.exec(adminSignupEmail.value);
  let regPassword = checkPassword.exec(adminSignupPassword.value);
  if (regMail === null) {
    alert("電子信箱格式不正確");
    return initFn();
  }
  if (regPassword === null) {
    alert("密碼長度必須符合：\r\n 1.長度6-12位\r\n 2.至少一個數字\r\n 3.至少一個大寫字母\r\n 4.至少一個小寫字母\r\n");
    return initFn();
  }
  adminSignupFn(adminSignupEmail.value, adminSignupUser.value, adminSignupPassword.value, adminSignupPassword_db.value)
})
