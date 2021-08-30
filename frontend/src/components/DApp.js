import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './Home';
import BasicToken from './BasicToken';

function DApp() {
  return (
    <Router>
      <div class="container-fluid">
        <nav class="navbar navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">Solidity Playground</a>
            <form class="d-flex">
              <button class="btn btn-outline-success me-1" type="button">Connect Wallet</button>
            </form>
          </div>
        </nav>
        <hr/>
        <div class="row">
          <div class="col-2">
            <nav class="nav flex-column">
              <Link class="nav-link" href="/BasicToken">Basic Token</Link>
            </nav>
          </div>
          <div class="col">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/BasicToken">
                <BasicToken />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default DApp;
