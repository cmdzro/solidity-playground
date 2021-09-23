import React from 'react';
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

export class Navigation extends React.Component {
  render() {
    return (
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link as={NavLink} to='/Home'>Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to='/BasicToken'>BasicToken</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}
