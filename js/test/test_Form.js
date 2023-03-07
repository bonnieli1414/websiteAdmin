"use strict";
UI.Form = function () {
    this.page = {
        main: 1,
        config: 2,
        edit: 3
    }
    this.setInterface();
    // this.bindKeydown();
    // this.bindKeyup();
}

UI.Form.prototype.setInterface = function () {
    // 取得DOM元素
    this.title1 = document.getElementById('title1');
    // 建立物件實體
    this.title_label = new UI.Label(this.title1, '訊息公告');
    this.title_label.setFontSize(20);
}
const form = new UI.Form();
