
import React, { Component } from 'react';

import moment from "moment"

import Card from 'antd/lib/card';

// ECharts
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/markPoint'
import ecStat from 'echarts-stat'


export default class ChartDifficultyHistory extends Component {

    constructor() {
        super();
        this.state = {
            pickUpStep : 5,
            showLength : 300,
            calculate : 200,        // 预计算力
            multiple : 10000000000  // 倍数，倍数越高，表达式精度越高
        }
    }

    initChart() {
        if (!this.props.balanceArray || this.props.balanceArray.length <= 0) {
            return;
        }
        var dataRaw = [];
        var now = new Date();
        for (var i=0; i < this.props.balanceArray.length; i++) {
            var isStep = i % this.state.pickUpStep === 0;
            var isMax = this.state.showLength * this.state.pickUpStep > i;
            if (isStep && isMax) {
                var time = moment(this.props.balanceArray[i].update_time, "YYYY-MM-DDTHH:mm:ss.SSSS").toDate().getTime()
                var value = this.props.balanceArray[i].difficulty * this.state.calculate * this.state.multiple;
                dataRaw.push([
                    Number(((time - now.getTime()) / 1000).toFixed(0)),        // 现在时间距离目标时间的秒数
                    value
                ])
            }
        }
        // See https://github.com/ecomfe/echarts-stat
        // 函数表达式计算的规则，x轴为目标时间距离现在的时间，已经过去的时间为负数
        // y轴为 算力*时间*倍数
        var myRegression = ecStat.regression('linear', dataRaw);
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
                type: 'value',
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
                            position: 'Bottom',
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
            <Card title={"计算难度走势("+this.state.calculate+"H * 24Hour * "+this.state.multiple+")"} bordered={false} >
                <div id="ChartDifficultyHistory_main" style={{ height: 300 }}></div>
            </Card>
        );
    }

}