import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import BasicToken from './BasicToken';
import { ConnectButton } from './ConnectButton';
import { Navigation } from './Navigation';

const HARDHAT_NETWORK_ID = '1337';

export class DApp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      connected: undefined,
      selectedAddress: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    return (
      <Router>
        <div className="container-fluid">
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">Solidity Playground</a>
              <form className="d-flex">
                <ConnectButton onClick={() => this._connectWallet()}/>
              </form>
            </div>
          </nav>
          <hr/>
          <div className="row">
            <div className="col-2">
              <Navigation></Navigation>
            </div>
            <div className="col">
              <Route exact path="/" component={Home}></Route>
              <Route path="/BasicToken" component={BasicToken}></Route>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.enable();

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();

      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize() {
  }

  _stopPollingData() {
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: 'Please connect Metamask to Localhost:8545'
    });

    return false;
  }

  _resetState() {
    this.setState(this.initialState);
  }
}
