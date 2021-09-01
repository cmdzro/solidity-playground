import React from 'react';

const HARDHAT_NETWORK_ID = '31337';

export class WalletConnection extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      network: undefined
    }

    this.state = this.initialState;
  }

  render() {
    if (!this._isMetaMaskInstalled()) {
      return (
        <button className="btn btn-outline-warning me-1" type="button" disabled>Install MetaMask First</button>
      );
    } else if (this.state.selectedAddress === undefined) {
      return (
        <button className="btn btn-outline-primary me-1" type="button" onClick={() => this._connectWallet()}>Connect Wallet</button>
      );
    } else {
      return (
        <div className="btn-group" role="group" aria-label="connected group">
          <button className="btn btn-outline-secondary" disabled>{this.state.network}</button>
          <button className="btn btn-outline-success" type="button" onClick={() => this._disconnect()}>Disconnect Wallet</button>
        </div>
      );
    }
  }

  async _connectWallet() {
    const { ethereum } = window;
    const [selectedAddress] = await ethereum.enable();

    if (!this._checkNetwork()) {
      return;
    }

    this.setState({
      network: "Localhost", // TODO make dynamic later
      selectedAddress: selectedAddress
    });

    this.props.onConnect(this.state);

    ethereum.on("accountsChanged", ([newAddress]) => {
      this.props.onDisconnect();

      this.setState({
        network: "Localhost",
        selectedAddress: selectedAddress
      });

      this.props.onConnect(this.state);
    });

    ethereum.on("chainChanged", ([networkId]) => {
      this._disconnect()
    });
  }

  _disconnect() {
    this.setState(this.initialState);
    this.props.onDisconnect();
  }

  _isMetaMaskInstalled() {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.props.onError('Please connect Metamask to Localhost:8545 (current network: ' + window.ethereum.networkVersion + ')');

    return false;
  }

  componentWillUnmount() {
    console.log("will unmount");
  }
}
