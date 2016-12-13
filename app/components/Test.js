import React from 'react';
import { test2 } from '../util/Calculator';


class Test extends React.Component {
  handleClick() {
    console.log('this is:', this);
    test2();
  }

  render() {
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}

export default Test;