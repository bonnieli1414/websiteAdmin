"use strict";
let Code = {
    bottonMap: {},
    labelMap: {},
    navMap: {}
}

/**
 * 建立元素
 * @param {字串} el 標籤
 * @param {物件} attr 屬性
 * @param {字串} text 文字內容
 * @returns {物件}元素
 */
Code.createElement = function (el, attr, text) {
    // 建立標籤
    const element = document.createElement(el);
    // 建立屬性
    for (let a in attr) {
        element.setAttribute(a, attr[a])
    }
    // 建立文字內容
    text && (element.innerHTML = text)
    return element
}

let UI = {};

UI.soup = "!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


// 亂數生成20字的uid
UI.getUid = function () {
    let a = UI.soup.length;
    let b = [];
    for (let c = 0; 20 > c; c++) {
        b[c] = UI.soup.charAt(Math.random() * a);
    }
    return b.join("");
}

// label元素初始設定
UI.Label = function (titleElement, text = "label") {
    this.uid = UI.getUid();
    this.titleElement = titleElement;
    // 從1開始起算，數量取key值的標籤數量
    this.number = Object.keys(Code.labelMap).length + 1;
    // 設定屬性
    this.name = 'label' + this.number;
    this.text = text;
    this.top = 0;
    this.left = 0;
    this.width = 80;
    this.height = 40;
    this.type = "label";
    // 建立p標籤、類別是label_text以及dataset元素
    this.el = this.createElement();
    // 將上一行加入子元素
    titleElement.appendChild(this.el);
    // 將uid加入Code.labelMap物件
    Code.labelMap[this.uid] = this;
}

// label元素建立，label類別標籤包label_text類別標籤
UI.Label.prototype.createElement = function () {
    // 子層
    this.label = Code.createElement("p", { class: "label_text", "data-name": this.name }, this.text);
    // 父層
    this.el = Code.createElement("div", { "class": "label" });
    // 父層包子層
    this.el.appendChild(this.label);
    return this.el;
}

// 設定label尺寸
UI.Label.prototype.setSize = function (width, height) {
    this.width = width;
    this.height = height;
    this.el.style.width = width;
    this.el.style.height = height;
    this.label.style.lineHeight = height + "px";
    return this;
}

// 設定label位置
UI.Label.prototype.setPosition = function (top, left) {
    this.el.style.position = "absolute";
    this.el.style.top = top;
    this.el.style.left = left;
    return this;
}

// 設定label dataset
UI.Label.prototype.setName = function (name) {
    this.name = name;
    this.el.setAttribute("data-name", name);
    return this;
}

// 設定label字體大小
UI.Label.prototype.setFontSize = function (size = 12) {
    this.label.style.setFontSize = size + "px";
}
