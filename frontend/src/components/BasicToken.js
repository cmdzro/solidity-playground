import React from 'react';

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

    if (!this.isConnected) {
      return (<div>Loading</div>);
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
