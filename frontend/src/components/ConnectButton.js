import React from 'react';

export class ConnectButton extends React.Component {
  render() {
    return (
      <button className="btn btn-outline-success me-1" type="button" onClick={this.props.onClick}>Connect Wallet</button>
    );
  }
}
