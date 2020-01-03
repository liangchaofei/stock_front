/*
 * @Author: your name
 * @Date: 2019-12-30 22:17:16
 * @LastEditTime : 2020-01-03 18:40:00
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gp/static/js/detail.js
 */
 // 获取search参数
 function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
var code = getUrlParam('code');


// function renderTable(current){
//     $.ajax({
//         url:`https://stock.zhixiutec.com/api/stock/fund?code=000001&page=${current}&page_size=10`,
//         success:function(res){
            
//             var oldData = res.data;
//             var newData = [];
//             $("#pagination1").pagination({
//                 currentPage: current,
//                 totalPage: res.total,
//                 callback: function(current) {
//                     renderTable(current)
//                     newData = res;
//                     console.log('newData',newData)
//                 }
//             });
//             //固定和滚动
//             var right_div2 = document.getElementById("right_div2_jg");
//             right_div2.onscroll = function () {
//                 var right_div2_top = this.scrollTop;
//                 var right_div2_left = this.scrollLeft;
//                 document.getElementById("left_div2_jg").scrollTop = right_div2_top;
//                 document.getElementById("right_div1_jg").scrollLeft = right_div2_left;
//             }
//             //设置右边div宽度
//             document.getElementById("right_div_jg").style.width = "" + document.documentElement.clientWidth - 130 + "px";
//             setInterval(function () {
//                 document.getElementById("right_div_jg").style.width = "" + document.documentElement.clientWidth - 130 + "px";
//             }, 0);
    
//             var res = [];
//             console.log('newData',newData)
//             if(newData.length>0){
//                 res = newData;
//             }else{
//                 res = oldData;
//             }
//             console.log('res',res)
           
//             for (var i = 0; i < res.length; i++) {
//                 $("#left_table2_jg").append(`<tr><th>${res[i].fund_name}</th></tr>`);
//                 $("#right_table2_jg").append("<tr><td>" + res[i].change + "</td><td>" + res[i].code + "</td><td>" + res[i].count + "</td><td>" + res[i].fund_code + "</td><td>" + res[i].percent_jingzhi + "</td><td>" + res[i].price + "</td><td>" + res[i].percent_signal_stock + "</td><td>" + res[i].percent_liutong + "</td></tr>");
//             }
        
//         }
//     })
// }
// var current = 1;
// renderTable(current)


