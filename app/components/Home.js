import React from 'react';
import Test from './Test';

class Home extends React.Component {
  render() {
    return (
      <div className='alert alert-info'>
        Hello from Home Component
        <Test />
      </div>
    );
  }
}

export default Home;