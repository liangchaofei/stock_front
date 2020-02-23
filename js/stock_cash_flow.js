// 获取search参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

var upColor = '#00da3c';
var downColor = '#ec0000';


function splitData(rawData) {
    var categoryData = [];
    var values = [];
    var volumes = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i]);
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    }

    return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
    };
}

function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data && data.values && data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}

var ua = navigator.userAgent.toLowerCase();
var code = getQueryString('code');
var date = getUrlParam('date');
var stock_cash_flowData = [], stock_liabilitiesData = [], stock_profitData = [];

$('#loadimg').css("display", "block")

$.ajax({
    url: 'https://stock.zhixiutec.com/api/user',
    type: 'get',
    success: function (res) {
        var data = res.data;
        if (res.error_code === 2) {
            window.open(data, "_self");
        } else {
            $.ajax({
                url: `https://stock.zhixiutec.com/api/stock/detail?code=${escape(code)}`,
                async: false,
                success: function (res) {
                    if (res.error_code === 1) {
                        $('#search_detail').css("display", "none")
                        $('#search_count').append(`<div>${res.err_msg}</div>`)
                    } else {
                        $('#loadimg').css("display", "none")
                        $('#search_detail').css("display", "block")
                        $('#search_count').css("display", "none")


                      

                        // 设置href
                        $('#ch_count').attr('href', `/component/ch.html?code=${escape(code)}`)
                        $('#zf_count').attr('href', `/component/table.html?code=${escape(code)}&type=zf`)
                        $('#pg_count').attr('href', `/component/pg.html?code=${escape(code)}&type=pg`)
                        $('#zz_count').attr('href', `/component/zz.html?code=${escape(code)}&type=zz`)
                        $('#sg_count').attr('href', `/component/sg.html?code=${escape(code)}&type=sg`)
                        $('#fh_count').attr('href', `/component/fh.html?code=${escape(code)}&type=fh`)
                        $('#kg_count').attr('href', `/component/kg.html?code=${escape(code)}`)
                        var data = res.data;
                        // 两融
                        var two_r = data.rong;
                        var rzrq = data.rzrq;
                        if(two_r){
                            $('#tow_r').show()
                        }else{
                            $('#tow_r').hide()
                        }
                        // 股东
                        var stockholder = data.stockholder;
                        var per_ticket = data.per_ticket;
                        // 条件命中的标签 
                        var predict = data.predict;
                        var stock = data.stock;
                        var str = predict.percent >= 0 ? " +" : " ";
                        if (predict.percent > 0) {
                            $('#percits_price').addClass('winner')
                        } else {
                            $('#percits_price').addClass('loser')
                        }

                        // 十大流动股东
                        var cirListColumns = [
                            [
                                { field: 'holder_name', title: '股东', width: 180, fixed: true },
                                { field: 'percent', title: '持有比例', width: 150 },
                                { field: 'count', title: '本期持有股', width: 150 },
                                { field: 'change', title: '变化', width: 180 },
                            ]
                        ];

                        var stockholderData = [];
                        stockholder.forEach((item, index) => {
                            stockholderData.push({
                                holder_name: item.holder_name, percent: item.percent, count: item.count, change: item.change
                            })

                        })
                        var config = {
                            "data": stockholderData,
                            "columns": cirListColumns,
                            "click": function (index, row) {
                                window.open(`/component/gd.html?holder_name=${encodeURIComponent(row.holder_name)}`, "_self")
                            }
                        };
                        $("#test").mobileTable(config);


                        // 近期公告
                        $.ajax({
                            url: `https://stock.zhixiutec.com/api/stock/public?type=news&code=${code}`,
                            success: function (res) {
                                var data = res.data;
                                var zfData = []
                                data.forEach(item => {
                                    zfData.push({
                                        title:item.title,
                                        time:item.time,
                                        type:item.type,
                                        url:item.url
                                    })
                                })
                                $('#currTable').bootstrapTable({
                                    method: 'get',
                                    cache: false,
                                    height: 400,
                                    striped: true,
                                    pagination: true,
                                    pageSize: 10,
                                    pageNumber: 1,
                                    pageList: [10, 20, 50, 100, 200, 500],
                                    search: false,
                                    showColumns: false,
                                    showRefresh: false,
                                    showExport: false,
                                    exportTypes: ['csv', 'txt', 'xml'],
                                    search: false,
                                    clickToSelect: true,
                                    columns: [
                                        { field: "title", title: "标题", align: "center", valign: "middle", sortable: "true" },
                                        { field: "time", title: "日期", align: "center", valign: "middle", sortable: "true" },
                                        { field: "type", title: "类型", align: "center", valign: "middle", sortable: "true" },
                                    ],
                                    data: zfData,
                                    onPageChange: function (size, number) {
                                    },
                                    onClickRow:function(row){
                                        window.open(row.url,'_self')
                                    }
                                });
                             
                            }
                        })
                        $(window).resize(function () {
                            $('#currTable').bootstrapTable('resetView');
                        });

                        // 季度公告
                        
                        $.ajax({
                            url: `https://stock.zhixiutec.com/api/stock/public?type=reports&code=${code}`,
                            success: function (res) {
                                var data = res.data;
                                var zfData = []
                                data.forEach(item => {
                                    zfData.push({
                                        title:item.title,
                                        time:item.time,
                                        type:item.type,
                                        url:item.url
                                    })
                                })
                                $('#jdTable').bootstrapTable({
                                    method: 'get',
                                    cache: false,
                                    height: 400,
                                    striped: true,
                                    pagination: true,
                                    pageSize: 10,
                                    pageNumber: 1,
                                    pageList: [10, 20, 50, 100, 200, 500],
                                    search: false,
                                    showColumns: false,
                                    showRefresh: false,
                                    showExport: false,
                                    exportTypes: ['csv', 'txt', 'xml'],
                                    search: false,
                                    clickToSelect: true,
                                    columns: [
                                        { field: "title", title: "标题", align: "center", valign: "middle", sortable: "true" },
                                        { field: "time", title: "日期", align: "center", valign: "middle", sortable: "true" },
                                        { field: "type", title: "类型", align: "center", valign: "middle", sortable: "true" },
                                    ],
                                    data: zfData,
                                    onPageChange: function (size, number) {
                                    },
                                    onClickRow:function(row){
                                        window.open(row.url,'_self')
                                    }
                                });
                             
                            }
                        })
                        $(window).resize(function () {
                            $('#jdTable').bootstrapTable('resetView');
                        });
                        // 财务数据
                        // 运营能力
                        var yy_data = per_ticket.yy;
                        var yy_str = '';
                        yy_data.forEach(item => {
                            yy_str += `
                            <div class="weui-panel__ft">
                                            <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                                              <div class="weui-cell__bd">
                                                  <span class="yy_name">${item.key}：</span>
                                                  <span class="yy_count">${item.value}</span>
                                              </div>
                                            </a>    
                                        </div>
                            `
                        })
                        $('#yy_content').append(yy_str)

                        // 成长能力
                        var cz_data = per_ticket.cz;
                        var cz_str = '';
                        cz_data.forEach(item => {
                            cz_str += `
                            <div class="weui-panel__ft">
                                            <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                                              <div class="weui-cell__bd">
                                                  <span class="yy_name">${item.key}：</span>
                                                  <span class="yy_count">${item.value}</span>
                                              </div>
                                            </a>    
                                        </div>
                            `
                        })
                        $('#cz_content').append(cz_str)

                        // 每股指标
                        var mg_data = per_ticket.mg;
                        var mg_str = '';
                        mg_data.forEach(item => {
                            mg_str += `
                            <div class="weui-panel__ft">
                                            <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                                              <div class="weui-cell__bd">
                                                  <span class="yy_name">${item.key}：</span>
                                                  <span class="yy_count">${item.value}</span>
                                              </div>
                                            </a>    
                                        </div>
                            `
                        })
                        $('#mg_content').append(mg_str)

                        // 盈利能力
                        var yl_data = per_ticket.yl;
                        var yl_str = '';
                        yl_data.forEach(item => {
                            yl_str += `
                            <div class="weui-panel__ft">
                                            <a href="javascript:void(0);" class="weui-cell weui-cell_access weui-cell_link">
                                              <div class="weui-cell__bd">
                                                  <span class="yy_name">${item.key}：</span>
                                                  <span class="yy_count">${item.value}</span>
                                              </div>
                                            </a>    
                                        </div>
                            `
                        })
                        $('#yl_content').append(yl_str)
                        // 数量统计
                        if (predict.fund_count === 0) {
                            $('#cc_count').css("display", "none")
                        }
                        if (predict.subcomp_count === 0) {
                            $('#kk_company').css("display", "none")
                        }
                        if (predict.fenghong_count === 0) {
                            $('#fg_count').css("display", "none")
                        }
                        if (predict.songgu_count === 0) {
                            $('#sg_count').css("display", "none")
                        }
                        if (predict.zhuangzeng_count === 0) {
                            $('#zz_count').css("display", "none")
                        }
                        if (predict.peigu_count === 0) {
                            $('#pg_count').css("display", "none")
                        }
                        if (predict.zengfa_count === 0) {
                            $('#zf_count').css("display", "none")
                        }
                        console.log('predict',predict)
                        window.gpName = predict.name
                        $('#per_fund_count').text(`${predict.fund_count}个`)
                        $('#per_subcomp_count').text(`${predict.subcomp_count}个`)
                        $('#per_fenghong_count').text(`${predict.fenghong_count}次`)
                        $('#per_songgu_count').text(`${predict.songgu_count}次`)
                        $('#per_zhuangzeng_count').text(`${predict.zhuangzeng_count}次`)
                        $('#per_peigu_count').text(`${predict.peigu_count}次`)
                        $('#per_zengfa_count').text(`${predict.zengfa_count}次`)
                        // 基本数据
                        $('#percits_date').text('本数据更新于' + predict.date)
                        $('#percits_name').text(predict.name)
                        var title = document.createElement('title');
                        title.append(`${predict.name}-知修数据`)
                        document.head.appendChild(title);


                        // 加入自选股
                       $('#joinBtn').on('click',function(){
                        var joinBtnData = {"code":code, "name":predict.name}
                        $.ajax({
                            url:'https://stock.zhixiutec.com/api/add_stock',
                            type:'post',
                            data:JSON.stringify(joinBtnData),
                            success:function(res){
                                $.toast(res.data)
                            }
                        })
                       })
                        $('#percits_code').text(predict.code)

                        $('#percits_location').text(stock.location)
                        $('#percits_belong').text(stock.belong)
                        $('#percits_organizational_form').text(stock.organizational_form)


                        $('#stock_company_name').text(stock.company_name)
                        $('#stock_institutional_type').text(stock.institutional_type)
                        $('#stock_establishment_time').text(stock.establishment_time)



                        var conditionText = "";
                        predict.condition.split('; ').map(item => {
                            conditionText += `<span class=${item ? 'ant-tag-red' : ''}>${item}</span>`
                        })
                        $('#percits_condition').html(conditionText)
                        var badconditionText = "";
                        predict.bad_condition.split('; ').map(item => {
                            badconditionText += `<span class=${item ? 'ant-tag-green' : ''}>${item}</span>`
                        })
                        $('#percits_bad_condition').html(badconditionText)

                        var financeText = "";
                        predict.finance.split('; ').map(item => {
                            financeText += `<span class=${item ? 'ant-tag-gold' : ''}>${item}</span>`
                        })
                        $('#percits_finance').html(financeText)


                        var conceptText = "";
                        stock.concept.split(',').map(item => {
                            conceptText += `<span class=${item ? 'ant-tag-blue' : ''}>${item}</span>`
                        })
                        $('#percits_concept').html(conceptText)


                        $('#percits_price').html(`<span style="margin-right:10px">${predict.price}¥</span>${str}${predict.percent}%`)
                        $('#percits_sm_count').text(predict.sm_count)
                        $('#percits_fund_count').text(predict.fund_count)
                        // 股票的详情数据
                        var stock = data.stock;
                        $('#detail_address').text(stock.address);
                        $('#detail_belong').text(stock.belong);
                        $('#detail_address').text(stock.address);




                        $('#detail_business_scope').text(stock.business_scope);
                        $('#detail_code').text(stock.code);
                        $('#detail_company_name').text(stock.company_name);


                        $('#detail_concept').text(stock.concept);
                        $('#detail_establishment_time').text(stock.establishment_time);
                        $('#detail_history_names').text(stock.history_names);
                        $('#detail_institutional_type').text(stock.institutional_type);
                        $('#detail_listing_date').text(stock.listing_date);
                        $('#detail_location').text(stock.location);
                        $('#detail_major_businesses').text(stock.major_businesses);
                        $('#detail_name').text(stock.name);
                        $('#detail_net_address').text(stock.net_address);
                        $('#detail_organizational_form').text(stock.organizational_form);

                        // 两融
                        var twoData = data.rzrq;
                        
                        var all_count =[], balance = [],tow_date = [];
                        twoData.length>0 && twoData.forEach(item => {
                            tow_date.push(item.date.replace(/-/g,'.'))
                            all_count.push(item.all_count)
                            balance.push(item.balance)
                        })
                        var twoData_arr = [{
                            name: '融资余额(元)',
                            type: 'line',
                            stack: '总量',
                            data: balance
                        },{
                            name: '融券余额(股)',
                            type: 'line',
                            stack: '总量',
                            data: all_count
                        }]
                        // 现金流量表 
                        // var stock_cash_flow = data.stock_cash_flow;
                        // var date = [], cash_remain = [], fundraising_cash_flow = [], invest_cash_flow = [], manage_cash_flow = [];
                        // stock_cash_flow.forEach(item => {
                        //     date.push(item.date);
                        //     cash_remain.push(item.cash_remain);
                        //     fundraising_cash_flow.push(item.fundraising_cash_flow)
                        //     invest_cash_flow.push(item.invest_cash_flow)
                        //     manage_cash_flow.push(item.manage_cash_flow)
                        // })
                        // stock_cash_flowData = [{
                        //     name: '经营活动产生的现金流量净额',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: manage_cash_flow
                        // }, {
                        //     name: '投资活动产生的现金流量净额',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: invest_cash_flow
                        // }, {
                        //     name: '筹资活动产生的现金流量净额',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: fundraising_cash_flow
                        // }, {
                        //     name: '期末现金及现金等价物余额',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: cash_remain
                        // }]

                        // 资产负债表
                        // var stock_liabilities = data.stock_liabilities;
                        // var current_assets = [], not_current_assets = [], total_assets = [], current_liabilities = [], not_current_liabilities = [], total_liabilities = [];
                        // stock_liabilities.forEach(item => {
                        //     current_assets.push(item.current_assets);
                        //     not_current_assets.push(item.not_current_assets);
                        //     total_assets.push(item.total_assets);
                        //     current_liabilities.push(item.current_liabilities);
                        //     not_current_liabilities.push(item.not_current_liabilities);
                        //     total_liabilities.push(item.total_liabilities);
                        // })
                        // stock_liabilitiesData = [{
                        //     name: '流动资产合计',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: current_assets
                        // }, {
                        //     name: '非流动资产合计',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: not_current_assets
                        // }, {
                        //     name: '资产总计',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: total_assets
                        // }, {
                        //     name: '流动负债合计',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: current_liabilities
                        // }, {
                        //     name: '非流动负债合计',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: not_current_liabilities
                        // }, {
                        //     name: '负债合计',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: total_liabilities
                        // }]
                        // 利润表
                        // var stock_profit = data.stock_profit;
                        // var gross_trading_income = [], total_operating_cost = [], net_profit = [];
                        // stock_profit.forEach(item => {
                        //     gross_trading_income.push(item.gross_trading_income);
                        //     total_operating_cost.push(item.total_operating_cost);
                        //     net_profit.push(item.net_profit);
                        // })
                        // stock_profitData = [{
                        //     name: '营业总收入',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: gross_trading_income
                        // }, {
                        //     name: '营业总成本',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: total_operating_cost
                        // }, {
                        //     name: '净利润 ',
                        //     type: 'line',
                        //     stack: '总量',
                        //     data: net_profit
                        // }]
                        // 股票十大流通股东， 主要为了展示想比上一个季度报表的 change 变化情况
                        // var stockholder = data.stockholder;
                        // //固定和滚动
                        // var right_div2 = document.getElementById("right_div2");
                        // right_div2.onscroll = function () {
                        //     var right_div2_top = this.scrollTop;
                        //     var right_div2_left = this.scrollLeft;
                        //     document.getElementById("left_div2").scrollTop = right_div2_top;
                        //     document.getElementById("right_div1").scrollLeft = right_div2_left;
                        // }
                        // //设置右边div宽度
                        // document.getElementById("right_div").style.width = "" + document.documentElement.clientWidth - 130 + "px";
                        // setInterval(function () {
                        //     document.getElementById("right_div").style.width = "" + document.documentElement.clientWidth - 130 + "px";
                        // }, 0);



                        // for (var i = 0; i < stockholder.length; i++) {
                        //     $("#left_table2").append(`<tr><th>${stockholder[i].holder_name}</th></tr>`);
                        //     $("#right_table2").append("<tr><td>" + stockholder[i].count + "</td><td>" + stockholder[i].percent + "</td><td>" + stockholder[i].change + "</td></tr>");
                        // }
                        // day
                        var ticket_history = data.ticket_history;
                        var dayData = [];
                        ticket_history.forEach(item => {
                            dayData.push([item.date.replace(/-/g,'.'), item.kai, item.shou, item.low, item.high, item.total_count])
                        })
                        // week
                        var ticket_history_weekly = data.ticket_history_weekly;
                        var myChart_stock_cash_flow = echarts.init(document.getElementById('stock_cash_flow'))

                        var stock_cash_flow = {
                            backgroundColor: '#000',
                            title: {
                                text: '融资融券',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            // legend: {
                            //     data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额', '期末现金及现金等价物余额']
                            // },
                            grid: {
                                left: '3%',
                                right: '4%',
                                // bottom: '1%',
                                // top:'1%',
                                containLabel: true,
                                height: '150px',
                                padding: '0px'
                            },
                            toolbox: {
                                show: false,
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    dataView: { readOnly: false },
                                    magicType: { type: ['line', 'bar'] },
                                    restore: {},
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: tow_date,
                                axisLine: { lineStyle: { color: '#8392A5' } }
                            },
                            yAxis: {
                                type: 'value',
                                splitLine: {
                                    show: false
                                },
                                axisLine: { lineStyle: { color: '#8392A5' } },
                            },
                            series: twoData_arr
                        };


                        myChart_stock_cash_flow.setOption(stock_cash_flow)



                        // var myChart_stock_liabilities = echarts.init(document.getElementById('stock_liabilities'))

                        // var stock_liabilities = {
                        //     backgroundColor: '#000',
                        //     title: {
                        //         text: '资产负债趋势',
                        //         textStyle: {
                        //             color: '#fff'
                        //         }
                        //     },
                        //     tooltip: {
                        //         trigger: 'axis'
                        //     },
                        //     // legend: {
                        //     //     data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额', '期末现金及现金等价物余额']
                        //     // },
                        //     grid: {
                        //         left: '3%',
                        //         right: '4%',
                        //         bottom: '3%',
                        //         containLabel: true
                        //     },
                        //     toolbox: {
                        //         show: false,
                        //         feature: {
                        //             saveAsImage: {}
                        //         }
                        //     },
                        //     xAxis: {
                        //         type: 'category',
                        //         boundaryGap: false,
                        //         data: date,
                        //         axisLine: { lineStyle: { color: '#8392A5' } }
                        //     },
                        //     yAxis: {
                        //         type: 'value',
                        //         splitLine: {
                        //             show: false
                        //         },
                        //         axisLine: { lineStyle: { color: '#8392A5' } },
                        //     },
                        //     series: stock_liabilitiesData
                        // };


                        // myChart_stock_liabilities.setOption(stock_liabilities)


                        // 分数
                        var myChart_stock_score = echarts.init(document.getElementById('stock_score'))

                        var stock_score = {
                            tooltip: {
                                formatter: '{a} <br/>{b} : {c}%'
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                // bottom: '1%',
                                top: '3%',
                                containLabel: true
                            },
                            // toolbox: {
                            //     feature: {
                            //         restore: {},
                            //         saveAsImage: {}
                            //     }
                            // },
                            series: [
                                {
                                    name: '系统评分',
                                    type: 'gauge',
                                    // detail: {formatter: '{value}%'},
                                    data: [{ value: predict.score, name: '系统评分' }],
                                    radius: "100%",
                                }
                            ]
                        };

                        // option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                        myChart_stock_score.setOption(stock_score, true);

                        // 利润
                        // var myChart_stock_profit = echarts.init(document.getElementById('stock_profit'))

                        // var stock_profit = {
                        //     backgroundColor: '#000',
                        //     title: {
                        //         text: '利润趋势',
                        //         textStyle: {
                        //             color: '#fff'
                        //         }
                        //     },
                        //     tooltip: {
                        //         trigger: 'axis'
                        //     },
                        //     // legend: {
                        //     //     data: ['经营活动产生的现金流量净额', '投资活动产生的现金流量净额', '筹资活动产生的现金流量净额', '期末现金及现金等价物余额']
                        //     // },
                        //     grid: {
                        //         left: '3%',
                        //         right: '4%',
                        //         bottom: '3%',
                        //         containLabel: true
                        //     },
                        //     toolbox: {
                        //         show: false,
                        //         feature: {
                        //             saveAsImage: {}
                        //         }
                        //     },
                        //     xAxis: {
                        //         type: 'category',
                        //         boundaryGap: false,
                        //         data: date,
                        //         axisLine: { lineStyle: { color: '#8392A5' } }
                        //     },
                        //     yAxis: {
                        //         type: 'value',
                        //         splitLine: {
                        //             show: false
                        //         },
                        //         axisLine: { lineStyle: { color: '#8392A5' } },
                        //     },
                        //     series: stock_profitData
                        // };


                        // myChart_stock_profit.setOption(stock_profit)

                        var mainContainer = document.getElementById('daykline');
                        var resizeMainContainer = function () {
                            mainContainer.style.width = window.innerWidth + 'px';
                            mainContainer.style.height = window.innerHeight * 0.5 + 'px';
                        };
                        //设置div容器高宽
                        resizeMainContainer();
                        // 初始化图表
                        var mainChart = echarts.init(mainContainer);
                        $(window).on('resize', function () {//
                            //屏幕大小自适应，重置容器高宽
                            resizeMainContainer();
                            mainChart.resize();
                        });
                        var data = splitData(dayData);
                        var option = {
                            backgroundColor: '#000',
                            animation: false,
                            legend: {
                                // bottom: 10,
                                // left: 'center',
                                x: 'top',
                                y: 'center',
                                top: 10,
                                data: ['日线', 'MA5', 'MA10', 'MA30', 'MA60'],
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            tooltip: {
                                // trigger: 'axis',
                                // axisPointer: {
                                //     type: 'cross'
                                // },
                                // backgroundColor: 'rgba(245, 245, 245, 0.8)',
                                // borderWidth: 1,
                                // borderColor: '#ccc',
                                // padding: 10,
                                // textStyle: {
                                //     color: '#000'
                                // },
                                // position: function (pos, params, el, elRect, size) {
                                //     var obj = {top: 10};
                                //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                //     return obj;
                                // },
                                // extraCssText: 'width: 170px'
                            },
                            axisPointer: {
                                link: { xAxisIndex: 'all' },
                                label: {
                                    backgroundColor: '#777'
                                }
                            },
                            toolbox: {
                                show: false,
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: false
                                    },
                                    brush: {
                                        type: ['lineX', 'clear']
                                    }
                                }
                            },
                            brush: {
                                xAxisIndex: 'all',
                                brushLink: 'all',
                                outOfBrush: {
                                    colorAlpha: 0.1
                                }
                            },
                            visualMap: {
                                show: false,
                                seriesIndex: 5,
                                dimension: 2,
                                pieces: [{
                                    value: 1,
                                    color: upColor
                                }, {
                                    value: -1,
                                    color: downColor
                                }]
                            },
                            grid: [
                                {
                                    left: '10%',
                                    right: '8%',
                                    height: '45%'
                                },
                                {
                                    left: '10%',
                                    right: '8%',
                                    top: '79%',
                                    height: '19%'
                                }
                            ],
                            xAxis: [
                                {
                                    type: 'category',
                                    data: data.categoryData,
                                    scale: true,
                                    boundaryGap: false,
                                    axisLine: { onZero: false, lineStyle: { color: '#8392A5' } },
                                    splitLine: { show: false },
                                    splitNumber: 20,
                                    min: 'dataMin',
                                    max: 'dataMax',
                                    axisPointer: {
                                        z: 100
                                    }
                                },
                                {
                                    type: 'category',
                                    gridIndex: 1,
                                    data: data.categoryData,
                                    scale: true,
                                    boundaryGap: false,
                                    axisLine: { onZero: false, lineStyle: { color: '#8392A5' } },
                                    axisTick: { show: false },
                                    splitLine: { show: false },
                                    axisLabel: { show: false },
                                    splitNumber: 20,
                                    min: 'dataMin',
                                    max: 'dataMax'
                                }
                            ],
                            yAxis: [
                                {
                                    scale: true,
                                    splitArea: {
                                        show: true
                                    },
                                    axisLine: { lineStyle: { color: '#8392A5' } },
                                    splitArea: {
                                        show: true,
                                        areaStyle: {
                                            color: ['#000',]
                                        }
                                    },
                                    splitLine: {
                                        show: false
                                    }
                                },
                                {
                                    scale: true,
                                    gridIndex: 1,
                                    splitNumber: 2,
                                    axisLabel: { show: false },
                                    axisLine: { show: false },
                                    axisTick: { show: false },
                                    splitLine: { show: false }
                                }
                            ],
                            // dataZoom: [
                            //     {
                            //         type: 'inside',
                            //         xAxisIndex: [0, 1],
                            //         start: 1,
                            //         end: 100
                            //     },
                            //     {
                            //         show: true,
                            //         xAxisIndex: [0, 1],
                            //         type: 'slider',
                            //         top: '85%',
                            //         start: 98,
                            //         end: 100
                            //     }
                            // ],
                            series: [
                                {
                                    name: '日线',
                                    type: 'candlestick',
                                    data: data.values,
                                    itemStyle: {
                                        color: downColor,
                                        color0: upColor,
                                        borderColor: null,
                                        borderColor0: null
                                    },
                                    // tooltip: {
                                    //     formatter: function (param) {
                                    //         param = param[0];
                                    //         return [
                                    //             'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                    //             'Open: ' + param.data[0] + '<br/>',
                                    //             'Close: ' + param.data[1] + '<br/>',
                                    //             'Lowest: ' + param.data[2] + '<br/>',
                                    //             'Highest: ' + param.data[3] + '<br/>'
                                    //         ].join('');
                                    //     }
                                    // }
                                },
                                {
                                    name: 'MA5',
                                    type: 'line',
                                    data: calculateMA(5, data),
                                    smooth: true,
                                    lineStyle: {
                                        normal: {
                                            width: 1
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            lineStyle: {
                                                color: '#fff',
                                                // width:'10px'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'MA10',
                                    type: 'line',
                                    data: calculateMA(10, data),
                                    smooth: true,
                                    lineStyle: {
                                        opacity: 0.5,
                                        normal: {
                                            width: 1
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            lineStyle: {
                                                color: 'rgb(255,251,63)'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'MA30',
                                    type: 'line',
                                    data: calculateMA(30, data),
                                    smooth: true,
                                    lineStyle: {
                                        opacity: 0.5,
                                        normal: {
                                            width: 1
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            lineStyle: {
                                                color: 'rgb(255,16,251)'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'MA60',
                                    type: 'line',
                                    data: calculateMA(60, data),
                                    smooth: true,
                                    lineStyle: {
                                        opacity: 0.5,
                                        normal: {
                                            width: 1
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            lineStyle: {
                                                color: 'rgb(0,254,55)'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: '成交量',
                                    type: 'bar',
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    data: data.volumes
                                }
                            ]
                        }


                        // 使用刚指定的配置项和数据显示图表。
                        mainChart.setOption(option, true);

                    }



                }
            })


            $.ajax({
                url: `https://stock.zhixiutec.com/api/stock/k/detail?code=${escape(code)}&type=week&token=${data.token}`,
                success: function (res) {
                    var data = res.data;
                    var dayData = [];
                    data.forEach(item => {
                        dayData.push([item.date.replace(/-/g,'.'), item.kai, item.shou, item.low, item.high, item.total_count])
                    })
                    var mainContainer = document.getElementById('weekline');
                    var resizeMainContainer = function () {
                        mainContainer.style.width = window.innerWidth + 'px';
                        mainContainer.style.height = window.innerHeight * 0.5 + 'px';
                    };
                    //设置div容器高宽
                    resizeMainContainer();
                    // 初始化图表
                    var mainChart = echarts.init(mainContainer);
                    $(window).on('resize', function () {//
                        //屏幕大小自适应，重置容器高宽
                        resizeMainContainer();
                        mainChart.resize();
                    });
                    var data = splitData(dayData);
                    var option = {
                        backgroundColor: '#000',
                        animation: false,
                        legend: {
                            // bottom: 10,
                            // left: 'center',
                            x: 'top',
                            y: 'center',
                            top: 10,
                            data: ['周线', 'MA5', 'MA10', 'MA30', 'MA60'],
                            textStyle: {
                                color: '#fff'
                            }
                        },

                        axisPointer: {
                            link: { xAxisIndex: 'all' },
                            label: {
                                backgroundColor: '#777'
                            }
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: false
                                },
                                brush: {
                                    type: ['lineX', 'clear']
                                }
                            }
                        },
                        brush: {
                            xAxisIndex: 'all',
                            brushLink: 'all',
                            outOfBrush: {
                                colorAlpha: 0.1
                            }
                        },
                        visualMap: {
                            show: false,
                            seriesIndex: 5,
                            dimension: 2,
                            pieces: [{
                                value: 1,
                                color: upColor
                            }, {
                                value: -1,
                                color: downColor
                            }]
                        },
                        grid: [
                            {
                                left: '10%',
                                right: '8%',
                                height: '45%'
                            },
                            {
                                left: '10%',
                                right: '8%',
                                top: '79%',
                                height: '19%'
                            }
                        ],
                        xAxis: [
                            {
                                type: 'category',
                                data: data.categoryData,
                                scale: true,
                                boundaryGap: false,
                                axisLine: { onZero: false, lineStyle: { color: '#8392A5' } },
                                splitLine: { show: false },
                                splitNumber: 20,
                                min: 'dataMin',
                                max: 'dataMax',
                                axisPointer: {
                                    z: 100
                                }
                            },
                            {
                                type: 'category',
                                gridIndex: 1,
                                data: data.categoryData,
                                scale: true,
                                boundaryGap: false,
                                axisLine: { onZero: false, lineStyle: { color: '#8392A5' } },
                                axisTick: { show: false },
                                splitLine: { show: false },
                                axisLabel: { show: false },
                                splitNumber: 20,
                                min: 'dataMin',
                                max: 'dataMax'
                            }
                        ],
                        yAxis: [
                            {
                                scale: true,
                                splitArea: {
                                    show: true
                                },
                                axisLine: { lineStyle: { color: '#8392A5' } },
                                splitArea: {
                                    show: true,
                                    areaStyle: {
                                        color: ['#000',]
                                    }
                                },
                                splitLine: {
                                    show: false
                                }
                            },
                            {
                                scale: true,
                                gridIndex: 1,
                                splitNumber: 2,
                                axisLabel: { show: false },
                                axisLine: { show: false },
                                axisTick: { show: false },
                                splitLine: { show: false }
                            }
                        ],
                        // dataZoom: [
                        //     {
                        //         type: 'inside',
                        //         xAxisIndex: [0, 1],
                        //         start: 1,
                        //         end: 100
                        //     },
                        //     {
                        //         show: true,
                        //         xAxisIndex: [0, 1],
                        //         type: 'slider',
                        //         top: '85%',
                        //         start: 98,
                        //         end: 100
                        //     }
                        // ],
                        series: [
                            {
                                name: '周线',
                                type: 'candlestick',
                                data: data.values,
                                itemStyle: {
                                    color: downColor,
                                    color0: upColor,
                                    borderColor: null,
                                    borderColor0: null
                                },
                                // tooltip: {
                                //     formatter: function (param) {
                                //         param = param[0];
                                //         return [
                                //             'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                //             'Open: ' + param.data[0] + '<br/>',
                                //             'Close: ' + param.data[1] + '<br/>',
                                //             'Lowest: ' + param.data[2] + '<br/>',
                                //             'Highest: ' + param.data[3] + '<br/>'
                                //         ].join('');
                                //     }
                                // }
                            },
                            {
                                name: 'MA5',
                                type: 'line',
                                data: calculateMA(5, data),
                                smooth: true,
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: '#fff',
                                            // width:'10px'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'MA10',
                                type: 'line',
                                data: calculateMA(10, data),
                                smooth: true,
                                lineStyle: {
                                    opacity: 0.5,
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgb(255,251,63)'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'MA30',
                                type: 'line',
                                data: calculateMA(30, data),
                                smooth: true,
                                lineStyle: {
                                    opacity: 0.5,
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgb(255,16,251)'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'MA60',
                                type: 'line',
                                data: calculateMA(60, data),
                                smooth: true,
                                lineStyle: {
                                    opacity: 0.5,
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgb(0,254,55)'
                                        }
                                    }
                                }
                            },
                            {
                                name: '成交量',
                                type: 'bar',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                data: data.volumes
                            }
                        ]
                    }


                    // 使用刚指定的配置项和数据显示图表。
                    mainChart.setOption(option, true);
                }
            })

            $.ajax({
                url: `https://stock.zhixiutec.com/api/stock/k/detail?code=${escape(code)}&type=month&token=${data.token}`,
                success: function (res) {
                    var data = res.data;
                    var dayData = [];
                    data.forEach(item => {
                        dayData.push([item.date.replace(/-/g,'.'), item.kai, item.shou, item.low, item.high, item.total_count])
                    })
                    var mainContainer = document.getElementById('monthline');
                    var resizeMainContainer = function () {
                        mainContainer.style.width = window.innerWidth + 'px';
                        mainContainer.style.height = window.innerHeight * 0.5 + 'px';
                    };
                    //设置div容器高宽
                    resizeMainContainer();
                    // 初始化图表
                    var mainChart = echarts.init(mainContainer);
                    $(window).on('resize', function () {//
                        //屏幕大小自适应，重置容器高宽
                        resizeMainContainer();
                        mainChart.resize();
                    });
                    var data = splitData(dayData);
                    var option = {
                        backgroundColor: '#000',
                        animation: false,
                        legend: {
                            // bottom: 10,
                            // left: 'center',
                            x: 'top',
                            y: 'center',
                            top: 10,
                            data: ['月线', 'MA5', 'MA10', 'MA30', 'MA60'],
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        tooltip: {
                            // trigger: 'axis',
                            // axisPointer: {
                            //     type: 'cross'
                            // },
                            // backgroundColor: 'rgba(245, 245, 245, 0.8)',
                            // borderWidth: 1,
                            // borderColor: '#ccc',
                            // padding: 10,
                            // textStyle: {
                            //     color: '#000'
                            // },
                            // position: function (pos, params, el, elRect, size) {
                            //     var obj = {top: 10};
                            //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                            //     return obj;
                            // },
                            // extraCssText: 'width: 170px'
                        },
                        axisPointer: {
                            link: { xAxisIndex: 'all' },
                            label: {
                                backgroundColor: '#777'
                            }
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: false
                                },
                                brush: {
                                    type: ['lineX', 'clear']
                                }
                            }
                        },
                        brush: {
                            xAxisIndex: 'all',
                            brushLink: 'all',
                            outOfBrush: {
                                colorAlpha: 0.1
                            }
                        },
                        visualMap: {
                            show: false,
                            seriesIndex: 5,
                            dimension: 2,
                            pieces: [{
                                value: 1,
                                color: upColor
                            }, {
                                value: -1,
                                color: downColor
                            }]
                        },
                        grid: [
                            {
                                left: '10%',
                                right: '8%',
                                height: '45%'
                            },
                            {
                                left: '10%',
                                right: '8%',
                                top: '79%',
                                height: '19%'
                            }
                        ],
                        xAxis: [
                            {
                                type: 'category',
                                data: data.categoryData,
                                scale: true,
                                boundaryGap: false,
                                axisLine: { onZero: false, lineStyle: { color: '#8392A5' } },
                                splitLine: { show: false },
                                splitNumber: 20,
                                min: 'dataMin',
                                max: 'dataMax',
                                axisPointer: {
                                    z: 100
                                }
                            },
                            {
                                type: 'category',
                                gridIndex: 1,
                                data: data.categoryData,
                                scale: true,
                                boundaryGap: false,
                                axisLine: { onZero: false, lineStyle: { color: '#8392A5' } },
                                axisTick: { show: false },
                                splitLine: { show: false },
                                axisLabel: { show: false },
                                splitNumber: 20,
                                min: 'dataMin',
                                max: 'dataMax'
                            }
                        ],
                        yAxis: [
                            {
                                scale: true,
                                splitArea: {
                                    show: true
                                },
                                axisLine: { lineStyle: { color: '#8392A5' } },
                                splitArea: {
                                    show: true,
                                    areaStyle: {
                                        color: ['#000',]
                                    }
                                },
                                splitLine: {
                                    show: false
                                }
                            },
                            {
                                scale: true,
                                gridIndex: 1,
                                splitNumber: 2,
                                axisLabel: { show: false },
                                axisLine: { show: false },
                                axisTick: { show: false },
                                splitLine: { show: false }
                            }
                        ],
                        // dataZoom: [
                        //     {
                        //         type: 'inside',
                        //         xAxisIndex: [0, 1],
                        //         start: 1,
                        //         end: 100
                        //     },
                        //     {
                        //         show: true,
                        //         xAxisIndex: [0, 1],
                        //         type: 'slider',
                        //         top: '85%',
                        //         start: 98,
                        //         end: 100
                        //     }
                        // ],
                        series: [
                            {
                                name: '月线',
                                type: 'candlestick',
                                data: data.values,
                                itemStyle: {
                                    color: downColor,
                                    color0: upColor,
                                    borderColor: null,
                                    borderColor0: null
                                },
                                // tooltip: {
                                //     formatter: function (param) {
                                //         param = param[0];
                                //         return [
                                //             'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                                //             'Open: ' + param.data[0] + '<br/>',
                                //             'Close: ' + param.data[1] + '<br/>',
                                //             'Lowest: ' + param.data[2] + '<br/>',
                                //             'Highest: ' + param.data[3] + '<br/>'
                                //         ].join('');
                                //     }
                                // }
                            },
                            {
                                name: 'MA5',
                                type: 'line',
                                data: calculateMA(5, data),
                                smooth: true,
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: '#fff',
                                            // width:'10px'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'MA10',
                                type: 'line',
                                data: calculateMA(10, data),
                                smooth: true,
                                lineStyle: {
                                    opacity: 0.5,
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgb(255,251,63)'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'MA30',
                                type: 'line',
                                data: calculateMA(30, data),
                                smooth: true,
                                lineStyle: {
                                    opacity: 0.5,
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgb(255,16,251)'
                                        }
                                    }
                                }
                            },
                            {
                                name: 'MA60',
                                type: 'line',
                                data: calculateMA(60, data),
                                smooth: true,
                                lineStyle: {
                                    opacity: 0.5,
                                    normal: {
                                        width: 1
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            color: 'rgb(0,254,55)'
                                        }
                                    }
                                }
                            },
                            {
                                name: '成交量',
                                type: 'bar',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                data: data.volumes
                            }
                        ]
                    }


                    // 使用刚指定的配置项和数据显示图表。
                    mainChart.setOption(option, true);
                }
            })
        }
    }
})

