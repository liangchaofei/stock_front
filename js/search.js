/*
 * @Author: your name
 * @Date: 2020-01-03 14:26:48
 * @LastEditTime : 2020-01-21 16:54:42
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gp/static/js/search.js
 */
$(function () {
        // 基础信息开关
        $('#open_content').css({ "display": "none" })
        $('#open').on('click', function () {
                $('#open_content').slideToggle("slow");
                $("#open .up").toggle();
                $("#open .down").toggle();
        })

        $('#sort_content').css({ "display": "none" })
        // $('#sort_open').on('click', function () {
        //         $('#sort_content').slideToggle("slow");
        //         $("#sort_open .up").toggle();
        //         $("#sort_open .down").toggle();
        // })
        // 概念划分开关
        $('#concect_content').css({ "display": "none" })
        $('#concect_open').on('click', function () {
                $('#concect_content').slideToggle("slow");
                $("#concect_open .up").toggle();
                $("#concect_open .down").toggle();
        })


        // 特定条件
        $('#must_content').css({ "display": "none" })
        $('#must_open').on('click', function () {
                $('#must_content').slideToggle("slow");
                $("#must_open .up").toggle();
                $("#must_open .down").toggle();
        })


        // 高级查询
        $('#high_content').css({ "display": "none" })
        $('#high_open').on('click', function () {
                $('#high_content').slideToggle("slow");
                $("#high_open .up").toggle();
                $("#high_open .down").toggle();
        })

        $('#zb_content').css({ "display": "none" })
        
        $('#sp_content').css({ "display": "none" })
        $('#sp_qk').on('click', function () {
                $('#sp_content').slideToggle("slow");
                $("#sp_qk .up").toggle();
                $("#sp_qk .down").toggle();
        })

        $('#yl_content').css({ "display": "none" })
      

        $('#cz_content').css({ "display": "none" })
     

        $('#yy_content').css({ "display": "none" })


        $('#mg_zb').on('click', function () {
                console.log('123')
                $('#zb_content').slideToggle("slow");
                $("#mg_zb .up").toggle();
                $("#mg_zb .down").toggle();
        })
        $('#cz_nl').on('click', function () {
                $('#cz_content').slideToggle("slow");
                $("#cz_nl .up").toggle();
                $("#cz_nl .down").toggle();
        })
        $('#yl_nl').on('click', function () {
                $('#yl_content').slideToggle("slow");
                $("#yl_nl .up").toggle();
                $("#yl_nl .down").toggle();
        })
        $('#yy_nl').on('click', function () {
                $('#yy_content').slideToggle("slow");
                $("#yy_nl .up").toggle();
                $("#yy_nl .down").toggle();
        })
        $('#sort_open').on('click', function () {
                $('#sort_content').slideToggle("slow");
                $("#sort_open .up").toggle();
                $("#sort_open .down").toggle();
        })
})