/*
 * @Author: your name
 * @Date: 2020-01-03 15:33:09
 * @LastEditTime : 2020-01-19 18:35:55
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gp/static/js/oauth.js
 */
$.ajax({
    url: 'https://stock.zhixiutec.com/api/user',
    type: 'get',
    success: function (res) {
        var data = res.data;
        if (res.error_code === 2) {
            window.open(data, "_self");
        }else{
            $('#box').css({"display":"block"})
        }
    }
})


