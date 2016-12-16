import React from 'react';
import Test from './Test';
import FilePicker from './FilePicker';

class Home extends React.Component {
  render() {
    return (
      <div className='alert alert-info'>
        Hello from Home Component
        <Test />
        <FilePicker />
      </div>
    );
  }
}

export default Home;