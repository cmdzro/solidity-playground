import React from 'react';
import { appState } from './DApp';
import { ethers } from "ethers";

import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";

class ContentComponent extends React.Component {
  isConnected = false;
  constructor(props) {
    super(props);
    this.isConnected = false;
    this._checkConnectivityStatus();
  }

  render() {
    this._checkConnectivityStatus();

    return;
  }

  _checkConnectivityStatus() {
    if (this.props.data.selectedAddress !== undefined) {
      this._setConnected();
    } else {
      this._setDisconnected();
    }
  }

  _setConnected() {
    if (this.isConnected) {
      return;
    }
    this.isConnected = true;
    this.onConnect();
  }

  _setDisconnected() {
    if (!this.isConnected) {
      return;
    }
    this.isConnected = false;
    this.onDisconnect();
  }

  onConnect() {
    // abstract
  }

  onDisconnect() {
    // abstract
  }
}

export class BasicToken extends ContentComponent {
  constructor(props) {
    super(props);

    this.initialState = {
      tokenData: undefined,
      balance: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    super.render();

    if (this.props.data.appState === appState.CONNECTING || !this.state.balance || !this.state.tokenData) {
      return (<div>Loading</div>);
    }

    if (this.props.data.appState === appState.DISCONNECTED) {
      return (<div>Please connect your wallet first!</div>);
    }

    return (
      <div>
        Basic Token via "{this.props.data.selectedAddress}"<br/>
        Balance: {this.state.balance.toString()} {this.state.tokenData.symbol}
      </div>
    );
  }

  onConnect() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );

    this._getTokenData();
    this._startPollingData();
  }

  onDisconnect() {
    this._stopPollingData();
  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.props.data.selectedAddress);
    this.setState({ balance: balance });
  }
}
