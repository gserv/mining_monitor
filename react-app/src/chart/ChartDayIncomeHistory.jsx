
import React, { Component } from 'react';

import moment from "moment"

import Card from 'antd/lib/card';

// ECharts
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

export default class ChartDayIncomeHistory extends Component {

    constructor() {
        super();
        this.state = {
            pickUpStep : 5,
            showLength : 100
        }
    }

    initChart() {
        if (!this.props.exchangeArray || this.props.exchangeArray.length <= 0) {
            return;
        }
        var dataRaw = [];
        for (var i=0; i < this.props.exchangeArray.length; i++) {
            var isStep = i % this.state.pickUpStep === 0;
            var isMax = this.state.showLength * this.state.pickUpStep > i;
            if (isStep && isMax) {
                var time = moment(this.props.exchangeArray[i].log_time, "YYYY-MM-DDTHH:mm:ss.SSSS").toDate()
                var value = parseFloat(this.props.exchangeArray[i].xmr_cny).toFixed(2);
                dataRaw.push({
                    name: time.toString(),
                    value: [
                        time,
                        value
                    ]
                })
            }
        }
        dataRaw.reverse();
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ChartBalanceHistory_main'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            grid:{
                x2: 10,
                y: 10
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '30%'],
                scale: true,
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: 'XMR-CNY',
                type: 'line',
                radius: '100%',
                showSymbol: false,
                hoverAnimation: false,
                data: dataRaw
            }]
        });
    }

    componentDidUpdate() {
        this.initChart();
    }

    render() {
        return (
            <Card title="每日收益走势" bordered={false} >
                <div id="ChartDayIncomeHistory_main" style={{ height: 300 }}></div>
            </Card>
        );
    }

}