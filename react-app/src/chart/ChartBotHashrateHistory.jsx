
import React, { Component } from 'react';

import moment from "moment"

import Card from 'antd/lib/card';

// ECharts
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
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
                    data: []
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
            }
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ChartBotHashrateHistory_main'));
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
            //    x2: 10,
           //     y: 10
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
    }

    componentDidUpdate() {
        this.initChart();
    }

    render() {
        return (
            <Card title="机器人算力走势" bordered={false} >
                <div id="ChartBotHashrateHistory_main" style={{ height: 300 }}></div>
            </Card>
        );
    }

}