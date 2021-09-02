import React from 'react';

const supportedChains = {
  '1337': 'Localhost'
}

export class WalletConnection extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      initialized: false,
      selectedAddress: undefined,
      chainId: undefined,
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
        <button className="btn btn-outline-secondary" disabled>{this._currentChainLabel()}</button>
      );
    } else {
      return (<div></div>);
    }
  }

  async _connectWallet() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  _isMetaMaskInstalled() {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  async _initializeAccounts() {
    const { ethereum } = window;

    this.props.onConnecting();

    ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress !== this.state.selectedAddress
        && this.state.selectedAddress !== undefined) {
        this._disconnect();
      }

      if (newAddress !== undefined) {
        this._connectTo(newAddress);
      }
    });

    ethereum.on("chainChanged", ([_chainId]) => {
      window.location.reload();
    });

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length === 0) {
      this._disconnect();
    } else {
      this._connectTo(accounts[0], chainId);
    }
  }

  _connectTo(address, chainId) {
    this.setState({
      initialized: true,
      network: "Localhost", // TODO make dynamic later
      selectedAddress: address,
      chainId: parseInt(chainId)
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

  _currentChainLabel() {
    const name = supportedChains[this.state.chainId];

    if (name === undefined) {
      return 'Unsupported Chain';
    }

    return 'Connected to ' + name;
  }

  componentDidMount() {
    this._initializeAccounts();
  }
}
