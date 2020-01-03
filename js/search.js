/*
 * @Author: your name
 * @Date: 2020-01-03 14:26:48
 * @LastEditTime : 2020-01-03 16:51:38
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gp/static/js/search.js
 */
$(function(){
    // 基础信息开关
    $('#open_content').css({"display":"none"})
    $('#open').on('click',function(){
        $('#open_content').slideToggle("slow");
        $("#open .up").toggle();
        $("#open .down").toggle();
    })


    // 概念划分开关
    $('#concect_content').css({"display":"none"})
    $('#concect_open').on('click',function(){
            $('#concect_content').slideToggle("slow");
            $("#concect_open .up").toggle();
            $("#concect_open .down").toggle();
    })


    // 特定条件
    $('#must_content').css({"display":"none"})
    $('#must_open').on('click',function(){
            $('#must_content').slideToggle("slow");
            $("#must_open .up").toggle();
            $("#must_open .down").toggle();
    })


    // 高级查询
    $('#high_content').css({"display":"none"})
    $('#high_open').on('click',function(){
            $('#high_content').slideToggle("slow");
            $("#high_open .up").toggle();
            $("#high_open .down").toggle();
    })
})