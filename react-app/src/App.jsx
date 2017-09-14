import React, { Component } from 'react';
import './App.css';

import ChartBalanceHistory from "./chart/ChartBalanceHistory"
import ChartExchangeHistory from "./chart/ChartExchangeHistory"
import InfoSummary from "./chart/InfoSummary"

class App extends Component {

    constructor() {
        super();
        this.state = {
            exchangeArray : null,
            balanceArray : null
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
          </div>
        );
    }
}

export default App;
