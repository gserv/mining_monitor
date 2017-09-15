
import React, { Component } from 'react';

import moment from "moment"

import Card from 'antd/lib/card';

// ECharts
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/scatter';
import ecStat from 'echarts-stat'


export default class ChartDifficultyHistory extends Component {

    constructor() {
        super();
        this.state = {
            pickUpStep : 5,
            showLength : 300
        }
    }

    initChart() {
        if (!this.props.balanceArray || this.props.balanceArray.length <= 0) {
            return;
        }
        var dataRaw = [];
        for (var i=0; i < this.props.balanceArray.length; i++) {
            var isStep = i % this.state.pickUpStep === 0;
            var isMax = this.state.showLength * this.state.pickUpStep > i;
            if (isStep && isMax) {
                var time = moment(this.props.balanceArray[i].update_time, "YYYY-MM-DDTHH:mm:ss.SSSS").toDate().getTime()
                var value = this.props.balanceArray[i].difficulty * 200;
                dataRaw.push([
                    time,
                    value
                ])
            }
        }
        // See https://github.com/ecomfe/echarts-stat
        var myRegression = ecStat.regression('linear', dataRaw);
        myRegression.points.sort(function(a, b) {
            return a[0] - b[0];
        });
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('ChartDifficultyHistory_main'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            },
            series: [{
                name: 'scatter',
                type: 'scatter',
                label: {
                    emphasis: {
                        show: true,
                        position: 'left',
                        textStyle: {
                            color: 'blue',
                            fontSize: 16
                        }
                    }
                },
                data: dataRaw
            }, {
                name: 'line',
                type: 'line',
                showSymbol: false,
                data: myRegression.points,
                markPoint: {
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'left',
                            formatter: myRegression.expression,
                            textStyle: {
                                color: '#333',
                                fontSize: 14
                            }
                        }
                    },
                    data: [{
                        coord: myRegression.points[myRegression.points.length - 1]
                    }]
                }
            }]
        });
    }

    componentDidUpdate() {
        this.initChart();
    }

    render() {
        return (
            <Card title="计算难度走势(200H * 24Hour)" bordered={false} >
                <div id="ChartDifficultyHistory_main" style={{ height: 300 }}></div>
            </Card>
        );
    }

}