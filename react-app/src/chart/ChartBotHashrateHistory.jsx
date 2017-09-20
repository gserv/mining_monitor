
import React, { Component } from 'react';

import moment from "moment"

import Card from 'antd/lib/card';

// ECharts
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
import  'echarts/lib/chart/gauge';
import 'echarts/lib/component/tooltip';
import  'echarts/lib/component/title';
import  'echarts/lib/component/legend';

export default class ChartBotHashrateHistory extends Component {

    constructor() {
        super();
        this.state = {
            maxShow : 50
        }
    }

    initChart() {
        if (!this.props.botsArray || this.props.botsArray.length <= 0) {
            return;
        }
        var series = []
        var legends = []
        for (var i=0; i < this.props.botsArray.length; i++) {
            var time = moment(this.props.botsArray[i].log_time, "YYYY-MM-DDTHH:mm:ss.SSSS").toDate()
            var value = parseFloat(this.props.botsArray[i].hashrate).toFixed(2);
            var address = this.props.botsArray[i].address.substring(this.props.botsArray[i].address.indexOf(".")+1, this.props.botsArray[i].address.length);
            var find = null;
            for (var j=0; j<series.length; j++) {
                if (series[j].name === address) {
                    find = series[j];
                    break;
                }
            }
            if (!find) {
                find = {
                    name: address,
                    stack: '总量',
                    type: 'bar',
                    barWidth : 5,
                    data: [],
                    value: 0            // sum
                }
                series.push(find);
                legends.push(address);
            }
            if (find.data.length < this.state.maxShow) {
                find.data.push({
                    name: time.toString(),
                    value: [
                        time,
                        value
                    ]
                })
                find.value += Number(value)
                calSum += Number(value)
            }
        }
        // 统计每个单位时间所有机器人算力
        var calSum = 0;
        var maxCal = 0;
        var minCal = -1;
        for (var ci=0; ci<series[0].data.length; ci++) {
            var sum = 0;
            for (var cj=0; cj<series.length; cj++) {
                sum += Number(series[0].data[ci].value[1]);
            }
            calSum += sum;
            if (sum > maxCal) maxCal = sum;
            if (minCal < 0 || minCal > sum) minCal = sum;
        }
        var mtime = (series[0].data[0].value[0].getTime() - series[0].data[series[0].data.length-1].value[0].getTime()) / 1000 / 60
        var averageCal = (calSum / mtime)       // 总算力 / 分钟数
        if (!this.props.hashrate) {
            this.props.onCalculatedHashrate(averageCal)
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ChartBotHashrateHistory_main'));
        var myChartPieCalDistributed = echarts.init(document.getElementById('ChartBotHashrateHistory_pie_cal_distributed'));
        var myChartPieCalAverage = echarts.init(document.getElementById('ChartBotHashrateHistory_pie_cal_average'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                y: 'bottom',
                data:legends
            },
            calculable : true,
            grid:{
                x : 5,
                x2 : 10,
                y : 5,
                containLabel: true
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                scale: true,
                splitLine: {
                    show: false
                }
            },
            series: series
        });
        myChartPieCalDistributed.setOption({
            title : {
                text : "算力分布",
                top : 5,
                left : 10,
                textStyle : {
                    fontWeight : 'normal',
                    fontSize : 10,
                }
            },
            series : [
                {
                    name:'算力分布',
                    type:'pie',
                    label : {
                        normal : {
                            position : "inside"
                        }
                    },
                    data:series
                }
            ]
        })
        myChartPieCalAverage.setOption({
            title : {
                text : "平均算力：" + Math.ceil(averageCal),
                top : 5,
                right : 10,
                textStyle : {
                    fontWeight : 'normal',
                    fontSize : 10,
                }
            },
            series : [
                {
                    name:'平均算力',
                    type:'gauge',
                    min : Math.ceil(minCal),
                    max : Math.ceil(maxCal),
                    splitNumber : 6,
                    axisLabel : {
                        formatter : function (value) {
                            return Math.ceil(value);
                        }
                    },
                    title : false,
                    detail : {show : false},
                    data:[{value: Math.ceil(averageCal), name: '平均算力'}]
                }
            ]
        })
        echarts.connect([myChart, myChartPieCalDistributed]);
    }

    componentDidUpdate() {
        this.initChart();
    }

    render() {
        return (
            <Card title="机器人算力分析" bordered={false} >
                <div>
                    <div id="ChartBotHashrateHistory_pie_cal_distributed" style={{ height: document.body.clientWidth / 2, width: '50%', display: 'inline-table' }}></div>
                    <div id="ChartBotHashrateHistory_pie_cal_average" style={{ height: document.body.clientWidth / 2, width: '50%', display: 'inline-table', float:'right' }}></div>
                </div>
                <div id="ChartBotHashrateHistory_main" style={{ height: 300 }}></div>
            </Card>
        );
    }

}