
import React, { Component } from 'react';
import Button from 'antd/lib/button';

export default class ChartBalanceHistory extends Component {

    render() {
        return (
            <div>
                <Button type="primary" >Button</Button>
                balance : {this.props.balanceArray && this.props.balanceArray.length > 0 ? this.props.balanceArray[0].balance : "-" }
            </div>
        )
    }

}