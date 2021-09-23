import React from "react";
import { Navbar } from 'react-bootstrap'
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Navigation } from './Navigation';
import { WalletConnection } from './WalletConnection';
import Home from './Home';
import { BasicToken } from './BasicToken';
import { appState } from '../core/constants.js';

export class DApp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      appState: appState.DISCONNECTED,
      selectedAddress: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    return (
      <Router>
        <div className="container-fluid">
          <Navbar className="navbar navbar-light bg-light">
            <div className="container-fluid">
              <Navbar.Brand className="navbar-brand" as={Link} to="/Home">Solidity Playground</Navbar.Brand>
              <form className="d-flex">
                <WalletConnection
                  onConnecting={() => this._onConnecting()}
                  onConnect={(state) => this._onConnect(state)}
                  onDisconnect={() => this._onDisconnect()}
                  onError={(error) => this._onError(error)}
                />
              </form>
            </div>
          </Navbar>
          <hr />
          <div className="row">
            <div className="col-2">
              <Navigation></Navigation>
            </div>
            <div className="col">
              <Route exact path="/" render={() => { return (<Redirect to="/Home" />) }} />
              <Route exact path="/Home" component={Home}></Route>
              <Route exact path="/BasicToken" render={() => <BasicToken data={this.state} />}></Route>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  _onError(error) {
    window.alert(error);
  }

  _onConnecting() {
    console.log("connecting...");
    this.setState({
      appState: appState.CONNECTING
    });
  }

  _onConnect(state) {
    console.log("connected: " + state.selectedAddress);
    this.setState({
      appState: appState.CONNECTED,
      selectedAddress: state.selectedAddress
    });
  }

  _onDisconnect() {
    console.log("disconnected");
    this.setState(this.initialState);
  }
}
