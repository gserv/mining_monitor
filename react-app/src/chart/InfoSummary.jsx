
import React, { Component } from 'react';
import Table from 'antd/lib/table';
import Card from 'antd/lib/card';

export default class ChartBalanceHistory extends Component {

    render() {
        let propArray = [];
        let readyBalance = (this.props.balanceArray && this.props.balanceArray.length > 0);
        let readyExchange = (this.props.exchangeArray && this.props.exchangeArray.length > 0);
        if (readyBalance) {
            propArray.push({
                key: '未支付余额',
                value: this.props.balanceArray[0].balance
            })
        }
        if (readyExchange) {
            propArray.push({
                key: 'XMR -> CNY',
                value: this.props.exchangeArray[0].xmr_cny
            })
        }
        if (readyBalance && readyExchange) {
            propArray.push({
                key: '账户资金价值（CNY）',
                value: Number(this.props.exchangeArray[0].xmr_cny) * Number(this.props.balanceArray[0].balance)
            })
        }
        if (readyBalance) {
            propArray.push({
                key: '难度（200H * 24hour）',
                value: Number(this.props.balanceArray[0].difficulty) * 200
            })
            propArray.push({
                key: '支付阈值',
                value: this.props.balanceArray[0].thold
            })
        }
        if (readyBalance && this.props.hashrate) {
            propArray.push({
                key: '预计下次支付（天）',
                value: (Number(this.props.balanceArray[0].thold) - Number(this.props.balanceArray[0].balance)) / (Number(this.props.balanceArray[0].difficulty) * this.props.hashrate)
            })
        }
        return (
            <Card title="数据预览" bordered={false} >
                <Table
                    className="ChartBalanceHistory_PropertiesTable"
                    showHeader={false}
                    pagination={false}
                    bordered={true}
                    dataSource={propArray}
                    columns={[{
                        title: '属性名',
                        dataIndex: 'key'
                    }, {
                        title: '属性值',
                        dataIndex: 'value'
                    }]}
                ></Table>
            </Card>
        )
    }

}