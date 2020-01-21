/*
 * @Author: your name
 * @Date: 2020-01-21 11:44:06
 * @LastEditTime: 2020-01-21 11:44:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /gp2/static/js/qecode.js
 */
function isWeixin() { //判断是否是微信
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == "micromessenger";
};
if(!isWeixin()){
    window.location.href="/component/wx.html"
}