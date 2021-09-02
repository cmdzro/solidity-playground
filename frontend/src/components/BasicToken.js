import React from 'react';
import { appState } from './DApp';

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
  render() {
    super.render();

    if (this.props.data.appState === appState.CONNECTING) {
      return (<div>Loading</div>);
    }

    if (this.props.data.appState === appState.DISCONNECTED) {
      return (<div>Please connect your wallet first!</div>);
    }

    return (
      <div>
        Basic Token via "{this.props.data.selectedAddress}"
      </div>
    );
  }

  onConnect() {
    console.log("start polling");
  }

  onDisconnect() {
    console.log("stop polling");
  }
}
