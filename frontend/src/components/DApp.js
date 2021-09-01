import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Navigation } from './Navigation';
import { WalletConnection } from './WalletConnection';
import Home from './Home';
import { BasicToken } from './BasicToken';

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
                <WalletConnection
                  onConnect={(state) => this._onConnect(state)}
                  onDisconnect={() => this._onDisconnect()}
                  onError={(error) => this._onError(error)}
                />
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
              <Route path="/BasicToken" render={() => <BasicToken data={this.state} />}></Route>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  _onError(error) {
    window.alert(error);
  }

  _onConnect(state) {
    console.log("connected: " + state.selectedAddress);
    this.setState({
      selectedAddress: state.selectedAddress
    });
  }

  _onDisconnect() {
    console.log("disconnected");
    this.setState(this.initialState);
  }
}
