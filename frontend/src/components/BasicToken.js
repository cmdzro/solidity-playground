import React from 'react';

export class BasicToken extends React.Component {
  render() {
    if (this.props.data.selectedAddress === undefined) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        Basic Token via "{this.props.data.selectedAddress}"
      </div>
    );
  }
}
