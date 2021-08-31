import React from 'react';
import { Nav } from 'react-bootstrap';

export class Navigation extends React.Component {
  render() {
    return (
      <Nav variant="pills" activeKey={window.location.pathname} className="flex-column">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/BasicToken">BasicToken</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}
