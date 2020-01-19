/*
 * @Author: your name
 * @Date: 2019-12-30 22:17:16
 * @LastEditTime : 2020-01-19 15:54:09
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



// 基础信息开关
$('#basic_info_content').css({"display":"none"})
$('.stock_btn').on('click',function(){
    $('#basic_info_content').slideToggle("fast");
    $(".stock_btn .up").toggle();
    $(".stock_btn .down").toggle();
})

// 运营
$('#yy_content').css({"display":"none"})
$('#yy_open').on('click',function(){
    $('#yy_content').slideToggle("fast");
    $("#yy_open .up_open").toggle();
    $("#yy_open .down_open").toggle();
})
// 成长
$('#cz_content').css({"display":"none"})
$('#cz_open').on('click',function(){
    $('#cz_content').slideToggle("fast");
    $("#cz_open .up_open").toggle();
    $("#cz_open .down_open").toggle();
})
// 每股
$('#mg_content').css({"display":"none"})
$('#mg_open').on('click',function(){
    $('#mg_content').slideToggle("fast");
    $("#mg_open .up_open").toggle();
    $("#mg_open .down_open").toggle();
})

// 每股
$('#yl_content').css({"display":"none"})
$('#yl_open').on('click',function(){
    $('#yl_content').slideToggle("fast");
    $("#yl_open .up_open").toggle();
    $("#yl_open .down_open").toggle();
})
wx.ready(function () {  })
$('#share_btn').on('click',function(){
    alert('dddd')
    $.ajax({
        url:`https://stock.zhixiutec.com/api/share?url=stock.zhixiutec.com
        `,
        success:function(res){
            alert('aaaa')
            var shareData = res.data;
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: shareData.appid, // 必填，公众号的唯一标识
                timestamp: shareData.timestamp, // 必填，生成签名的时间戳
                nonceStr: shareData.noncestr, // 必填，生成签名的随机串
                signature: shareData.signature,// 必填，签名
                jsApiList: ['onMenuShareTimeline'] // 必填，需要使用的JS接口列表
              })
              wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
                wx.onMenuShareTimeline({ 
                  title: 'aaa', // 分享标题
                  link: shareData.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: '', // 分享图标
                  success: function () {
                    // 设置成功
                    alert('success')
                  },
                  error:function(err){
                    console.log('err',error)
                  }
                })
              }); 
        }
    })
})
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


