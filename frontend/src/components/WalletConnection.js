import React from 'react';

const HARDHAT_NETWORK_ID = '31337';

export class WalletConnection extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      initialized: false,
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
    } else if (this.state.initialized && this.state.selectedAddress === undefined) {
      return (
        <button className="btn btn-outline-primary me-1" type="button" onClick={() => this._connectWallet()}>Connect Wallet</button>
      );
    } else if (this.state.initialized) {
      return (
        <button className="btn btn-outline-secondary" disabled>Connected to {this.state.network}</button>
      );
    } else {
      return (<div></div>);
    }
  }

  async _connectWallet() {
    const { ethereum } = window;
    const [selectedAddress] = await ethereum.request({ method: 'eth_requestAccounts' });

    if (!this._checkNetwork()) {
      return;
    }

    this._connectTo(selectedAddress);
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

  async _initializeAccounts() {
    const { ethereum } = window;

    ethereum.on("accountsChanged", ([newAddress]) => {
      this.props.onDisconnect();

      this._connectTo(newAddress);
    });

    ethereum.on("chainChanged", ([networkId]) => {
      this._disconnect()
    });

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length === 0) {
      this._disconnect();
    } else {
      this._connectTo(accounts[0]);
    }
  }

  _connectTo(address) {
    this.setState({
      initialized: true,
      network: "Localhost", // TODO make dynamic later
      selectedAddress: address
    });
    this.props.onConnect(this.state);
  }

  _disconnect() {
    this.setState({
      initialized: true,
      selectedAddress: undefined,
      network: undefined
    });
    this.props.onDisconnect();
  }

  componentDidMount() {
    this._initializeAccounts();
  }
}
