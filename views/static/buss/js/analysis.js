/**
 * Created by owen on 2017/11/21.
 */


var border_color = '#132849';//图标辅助线颜色
var text_color   = '#b8b8b9';//辅助字体颜色


function pie(id, pie_csv) {
    // 基于准备好的dom，初始化echarts图表
    var myChart   = echarts.init(document.getElementById(id));
    var dataStyle = {
        normal: {
            label    : {show: false},
            labelLine: {show: false}
        }
    };
    //半径
    var pie_int   = 55;
    var option    = {
        title     : {
            text     : pie_csv.top_one,
            x        : 'center',
            y        : 'center',
            itemGap  : 20,
            textStyle: {
                // color : 'rgba(30,144,255,0.8)',
                color   : '#fff',
                // fontFamily : '微软雅黑',
                fontSize: 20,
                // fontWeight : 'bolder'
            }
        },
        tooltip   : {
            show: false
        },
        legend    : {
            show  : false,
            orient: 'vertical',
            x     : 'left',
            top   : '20',
            data  : ['成功次数', '失败次数']
        },
        toolbox   : {
            show: false,
        },
        calculable: false,//是否拖拽重算
        series    : [
            {
                name          : '1',
                type          : 'pie',
                hoverAnimation: false,
                animation     : false,
                clockWise     : false,
                radius        : [(pie_int - 15), pie_int],
                itemStyle     : dataStyle,
                data          : [
                    {
                        value    : pie_csv.top,
                        name     : '成功次数',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color : '#9DCC17'
                                },
                                    {
                                        offset: 1,
                                        color : '#D9241B'
                                    },

                                ]),

                            },
                        }
                    },

                    {
                        value    : pie_csv.bottom,
                        name     : 'invisible',
                        itemStyle: {
                            normal: {
                                color: '#17253F'
                            },
                        }
                    }
                ]
            },

        ]
    };
    // 为echarts对象加载数据
    myChart.setOption(option);
}

//渐变面积图
function line_line(id, line_csv) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('tu-one'));
    var option  = {
        title     : {
            show: false,//是否显示标题
        },
        grid      : {
            top          : 40,
            bottom       : 40,
            left         : 55,
            right        : 40,
            showAllSymbol: 20,
            borderColor  : border_color
        },
        tooltip   : {
            trigger    : 'axis',
            axisPointer: {
                type : 'shadow',
                label: {
                    backgroundColor: '#333'
                }
            }
        },
        legend    : {
            show : true,
            right: '0',
            top  : '0',
            data : ['增加的资产数量', '删除的资产数量', '更新的资产数量']
        },
        calculable: false,//是否拖拽重算
        xAxis     : [
            {
                type         : 'category',
                boundaryGap  : false,
                splitNumber  : 5,
                name         : '(日)',
                nameTextStyle: {color: text_color},
                axisLine     : {
                    lineStyle: {
                        color: border_color
                    }
                },
                axisTick     : {
                    show: false
                },
                axisLabel    : {
                    textStyle: {
                        color: text_color
                    }
                },
                splitLine    : {
                    show     : true,
                    lineStyle: {
                        color: border_color
                    }
                },
                data         : line_csv.x
            }
        ],
        yAxis     : [
            {
                type         : 'value',
                name         : '(台)',
                splitNumber  : 5,
                // data         : line_csv.y,
                nameTextStyle: {color: text_color},
                axisLabel    : {
                    textStyle: {
                        color: text_color
                    }
                },
                axisTick     : {
                    show: false
                },
                axisLine     : {
                    lineStyle: {
                        color: border_color
                    }
                },
                splitLine    : {
                    show     : true,
                    lineStyle: {
                        color: border_color
                    }
                }
            }
        ],
        series    : [//图表类型
            {
                name          : '增加的资产数量',
                type          : 'line',
                smooth        : true,
                symbol        : 'circle',
                symbolSize    : 4,
                showAllSymbol : true,
                hoverAnimation: true,
                areaStyle     : { //区域填充样式
                    normal: {
                        color      : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //填充的颜色。
                            offset: 0, // 0% 处的颜色
                            color : 'rgba(137, 189, 27, 0.3)'
                        }, {
                            offset: 0.8, // 80% 处的颜色
                            color : 'rgba(137, 189, 27, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)', //阴影颜色。支持的格式同color
                        shadowBlur : 10 //图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果
                    }
                },
                itemStyle     : { //折线拐点标志的样式
                    normal: {
                        color      : 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)', //图形的描边颜色。支持的格式同 color
                        borderWidth: 2 //描边线宽。为 0 时无描边。[ default: 0 ]

                    }
                },
                // markLine: {itemStyle:{normal:{lineStyle:{width:2,color:'#959EBB'}}}},
                data          : line_csv.arr[0]
            },
            {
                name          : '删除的资产数量',
                type          : 'line',
                smooth        : true,
                symbol        : 'circle',
                symbolSize    : 4,
                showAllSymbol : true,
                hoverAnimation: true,
                areaStyle     : {
                    normal: {
                        color      : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color : 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color : 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur : 10
                    }
                },
                itemStyle     : {
                    normal: {
                        color      : 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 1

                    }
                },
                // markLine: {itemStyle:{normal:{lineStyle:{width:2,color:'#959EBB'}}}},
                data          : line_csv.arr[1]
            },
            {
                name          : '更新的资产数量',
                type          : 'line',
                smooth        : true,
                symbol        : 'circle',
                symbolSize    : 4,
                showAllSymbol : true,
                hoverAnimation: true,
                areaStyle     : {
                    normal: {
                        color      : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color : 'rgba(110, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color : 'rgba(110, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(110, 0, 0, 0.1)',
                        shadowBlur : 10
                    }
                },
                itemStyle     : {
                    normal: {
                        color      : 'rgb(110,136,212)',
                        borderColor: 'rgba(110,136,212,0.2)',
                        borderWidth: 1

                    }
                },
                // markLine: {itemStyle:{normal:{lineStyle:{width:2,color:'#959EBB'}}}},
                data          : line_csv.arr[1]
            }
        ]
    };
    // 为echarts对象加载数据
    myChart.setOption(option);
}

//右侧的柱状图
function right_bar_one(id, data) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById(id));
    var option  = {
        title     : {
            show: false
        },
        grid      : {
            left         : 80,
            top          : 30,
            bottom       : 45,
            showAllSymbol: 10,
            right        : 40,
            borderColor  : border_color
        },
        tooltip   : {
            // trigger: 'axis',
            trigger        : 'item',
            axisPointer    : {
                type: 'none'
            },
            backgroundColor: 'rgba(0,193,222,0.5)',
            formatter      : '{a}:{c}%',
            textStyle      : {
                fontSize: 12
            }
        },
        legend    : {
            show     : false,
            // color:'#fff';
            top      : 30,
            textStyle: {
                color: text_color
            },
            data     : ['高级', '中级', '低级']
        },
        toolbox   : {
            show: false
        },
        calculable: false,
        xAxis     : [
            {
                // type: 'category',
                type         : 'value',
                name         : '',
                splitNumber  : 5,
                nameTextStyle: {color: text_color},
                axisLine     : {
                    lineStyle: {
                        color: border_color
                    }
                },
                axisTick     : {
                    show: false
                },
                axisLabel    : {
                    textStyle: {
                        color: text_color
                    }
                },
                splitLine    : {
                    show     : true,
                    lineStyle: {
                        color: border_color
                    }
                },
                data         : data.y
            }
        ],
        yAxis     : [
            {
                type         : 'category',
                // type: 'value',
                name         : '',
                splitNumber  : 5,
                // boundaryGap:[0,1],
                data         : data.x,
                nameTextStyle: {color: text_color},
                axisLine     : {
                    lineStyle: {
                        color: border_color
                    }
                },
                axisTick     : {
                    show: false
                },
                axisLabel    : {
                    textStyle: {
                        color: text_color
                    }
                },
                splitLine    : {
                    show     : true,
                    lineStyle: {
                        color: border_color
                    }
                }
            }
        ],
        series    : [
            {
                name          : '负载',
                type          : 'bar',
                itemStyle     : {normal: {color: "#318395"}},
                barWidth      : 18,
                barCategoryGap: 5,

                data: [
                    {
                        value    : data.y[0],
                        itemStyle: {
                            normal: {color: '#318395'}
                        }
                    },
                    {
                        value    : data.y[1],
                        itemStyle: {
                            normal: {color: '#266560'}
                        }
                    }
                ]
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
}

function right_pie(id, sort_pie) {
    // 基于准备好的dom，初始化echarts图表
    var myChart   = echarts.init(document.getElementById(id));
    var dataStyle = {
        normal: {
            label    : {show: false},
            labelLine: {show: false}
        }
    };
    //半径
    var pie_int   = 65;
    var option    = {
        title     : {
            text     : '',
            x        : '10',
            left     : '20',
            y        : 'center',
            itemGap  : 20,
            textStyle: {
                color   : '#e2e2e2',
                fontSize: 20,
            }
        },
        tooltip   : {
            show: true
        },
        legend    : {
            show     : true,
            color    : '#e2e2e2',
            orient   : 'vertical',
            x        : '200',
            top      : '20',
            textStyle: {
                color   : text_color,
                fontSize: 14
            },
            data     : sort_pie.names
        },
        toolbox   : {
            show: false
        },
        calculable: false,
        series    : [
            {
                name          : ' ',
                center        : ['35%', '50%'],
                type          : 'pie',
                hoverAnimation: false,
                animation     : false,
                clockWise     : false,
                radius        : [(pie_int - 15), pie_int],
                itemStyle     : dataStyle,
                data          : []
            }
        ]
    };
    for (var i = 0; i < sort_pie.rawDate.length; i++) {
        option.series[0].data.push({
            value: sort_pie.rawDate[i]['count'],
            name : sort_pie.rawDate[i]['type']
        });
    }
    console.dir(option)
    myChart.setOption(option);
}

function big_bar(id, csv) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById(id));
    var option  = {
        title     : {
            show: false
        },
        grid      : {
            top          : 40,
            bottom       : 60,
            left         : 55,
            right        : 80,
            showAllSymbol: 20,
            borderColor  : border_color
        },
        tooltip   : {
            // trigger: 'axis',
            trigger        : 'item',
            axisPointer    : {
                type: 'none'
            },
            backgroundColor: 'rgba(0,193,222,0.5)',
            formatter      : '{a}:{c}',
            textStyle      : {
                fontSize: 12
            }
        },
        legend    : {
            show     : false,
            top      : 40,
            textStyle: {
                color: text_color
            },
        },
        toolbox   : {
            show: true
        },
        calculable: true,
        xAxis     : [
            {
                type         : 'category',
                name         : '时间/day',
                splitNumber  : 5,
                nameTextStyle: {color: text_color},
                axisLine     : {
                    lineStyle: {
                        color: border_color
                    }
                },
                axisTick     : {
                    show: false
                },
                axisLabel    : {
                    rotate   : 60,
                    textStyle: {
                        color: text_color
                    }
                },
                splitLine    : {
                    show     : true,
                    lineStyle: {
                        color: border_color
                    }
                },
                data         : csv.x
            }
        ],
        yAxis     : [
            {
                type         : 'value',
                name         : '(数量)',
                splitNumber  : 8,
                // boundaryGap:[0,1],
                // data         : csv.y,
                nameTextStyle: {color: text_color},
                axisLine     : {
                    lineStyle: {
                        color: border_color
                    }
                },
                axisTick     : {
                    show: false
                },
                axisLabel    : {
                    textStyle: {
                        color: text_color
                    }
                },
                splitLine    : {
                    show     : true,
                    lineStyle: {
                        color: border_color
                    }
                }
            }
        ],
        series    : [
            {
                name          : '数量',
                type          : 'bar',
                itemStyle     : {normal: {color: "#318395"}},
                barWidth      : 20,
                barCategoryGap: 25,
                data          : csv.y
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
}


$(function () {


    $.get("/analysis/json", function (data, status) {
        console.dir(data);

        var ip     = data.ip || 0;
        // 收集记录总数
        var record = data.record || 0;

        var task = data.task || 0;

        var plugin = data.plugin || 0;

        //这里是饼图---比例
        var pie_csv_ip = {
            "top"    : "100",
            "bottom" : "0",
            "top_one": ip,
        };
        pie('pie-one', pie_csv_ip);

        var pie_csv_record = {
            "top"    : "100",
            "bottom" : "0",
            "top_one": record,
        };
        pie('pie-two', pie_csv_record);

        var pie_csv_task = {
            "top"    : "100",
            "bottom" : "0",
            "top_one": task,
        };
        pie('pie-three', pie_csv_task);

        var pie_csv_plug = {
            "top"    : "100",
            "bottom" : "0",
            "top_one": plugin,
        };
        pie('pie-four', pie_csv_plug);


        //面积图
        var line_csv = {
            "x"  : ["11.02", "12.02", "13.02", "14.02", "15.02", "16.02", "17.02"],
            "arr": [
                [200, 211, 215, 313, 142, 413, 310],
                [200, 211, 215, 313, 142, 413, 310],
                [50, 80, 120, 150, 102, 313, 210]
            ]
        };
        var trend    = data.trend;

        line_csv.x      = trend.map(function (o) {
            return o.time
        });
        line_csv.arr[0] = trend.map(function (o) {
            return o.add
        });
        line_csv.arr[1] = trend.map(function (o) {
            return o.delete
        });
        line_csv.arr[2] = trend.map(function (o) {
            return o.update
        });
        //渐变面积图
        line_line('tu-one', line_csv);


        // 右侧第一个柱图
        var csv_right_bar = {
            "y": [30, 50],
            "x": ['扫描引擎', '爬虫引擎'],
        };
        //右侧的柱状图
        right_bar_one('tu-right-one', csv_right_bar);


        var server_type = [
            {y: 'ssh', a: 20,},
            {y: 'telnet', a: 2,},
            {y: 'rdp', a: 2,},
            {y: 'mysql', a: 1,},
            {y: 'dns', a: 1,},
            {y: 'pptp', a: 1,},
            {y: 'rsync', a: 1,},
            {y: 'mssql', a: 1,},
            {y: 'pop3', a: 1,},
            {y: 'smtps', a: 1,},
        ];
        var web_type    = [
            {y: 'apache', a: 8,},
            {y: 'iis', a: 8,},
            {y: 'nginx', a: 4,},
            {y: 'aspx', a: 3,},
            {y: 'php', a: 1,},
        ];

        server_type = data.server_type.result || [];
        web_type    = data.web_type.result || [];

        var csv_big_bar = {
            server_type: {
                x: server_type.map(function (type) {
                    return type._id;
                }),
                y: server_type.map(function (type) {
                    return type.count;
                })
            },
            web_type   : {
                x: web_type.map(function (type) {
                    return type._id;
                }),
                y: web_type.map(function (type) {
                    return type.count;
                })
            }
        };

        // ????
        big_bar('tu-serve', csv_big_bar.server_type);
        big_bar('tu-web', csv_big_bar.web_type);


        // 饼图-- - 分类
        var sort_pie = {
            rawDate: data.vultype,
            names  : data.vultype.map(function (o) {
                return o.type
            }),
            values : data.vultype.map(function (o) {
                return o.count;
            })
        };
        //饼图----分类
        right_pie('tu-two', sort_pie);


    });


});
