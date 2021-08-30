import './DApp.css';
import Button from 'react-bootstrap/Button';

function DApp() {
  return (
    <div className="DApp">
      <header className="DApp-header">
        <p>
          Edit <code>src/DApp.js</code> and save to reload.
        </p>
        <Button
          type="Button"
          class="btn btn-primary"
          className="DApp-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </Button>
      </header>
    </div>
  );
}

export default DApp;
