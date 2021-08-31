import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { DApp } from './components/DApp';

ReactDOM.render(
  <React.StrictMode>
    <DApp />
  </React.StrictMode>,
  document.getElementById('root')
);

