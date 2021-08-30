import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './Home';
import BasicToken from './BasicToken';
import Button from 'react-bootstrap/Button';

function DApp() {
  return (
    <Router>
      <Button type="Button" class="btn btn-primary">
        Connect Wallet
      </Button>
      <div className="DApp">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/BasicToken">Basic Token</Link>
          </li>
        </ul>
      </div>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/BasicToken">
          <BasicToken />
        </Route>
      </Switch>
    </Router>
  );
}

export default DApp;
