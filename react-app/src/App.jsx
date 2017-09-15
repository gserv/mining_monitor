import React, { Component } from 'react';
import './App.css';

import ChartBalanceHistory from "./chart/ChartBalanceHistory"
import ChartExchangeHistory from "./chart/ChartExchangeHistory"
import ChartBotHashrateHistory from "./chart/ChartBotHashrateHistory"
import InfoSummary from "./chart/InfoSummary"

class App extends Component {

    constructor() {
        super();
        this.state = {
            exchangeArray : null,
            balanceArray : null,
            botsArray : null
        }
    }

    componentDidMount() {
        var comp = this;
        fetch("../api/exchange")
            .then(function(response) {return response.json()})
            .then(function(json) {
                comp.setState({
                    exchangeArray : json
                })
            });
        fetch("../api/balance")
            .then(function(response) {return response.json()})
            .then(function(json) {
                comp.setState({
                    balanceArray : json
                })
            });
        fetch("../api/bots")
            .then(function(response) {return response.json()})
            .then(function(json) {
                comp.setState({
                    botsArray : json
                })
            });
    }

    render() {
        return (
            <div>
                <InfoSummary
                    exchangeArray={this.state.exchangeArray}
                    balanceArray={this.state.balanceArray}
                ></InfoSummary>
                <ChartExchangeHistory
                    exchangeArray={this.state.exchangeArray}
                    balanceArray={this.state.balanceArray}
                ></ChartExchangeHistory>
                <ChartBotHashrateHistory
                    botsArray={this.state.botsArray}
                ></ChartBotHashrateHistory>
          </div>
        );
    }
}

export default App;
