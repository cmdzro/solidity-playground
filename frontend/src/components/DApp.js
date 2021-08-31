import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import BasicToken from './BasicToken';
import { Navigation } from './Navigation';

export class DApp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
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
                <button className="btn btn-outline-success me-1" type="button">Connect Wallet</button>
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
}
