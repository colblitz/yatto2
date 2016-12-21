import React from 'react';
import Test from './Test';
import FilePicker from './FilePicker';
import ArtifactList from './ArtifactList';

class Home extends React.Component {
  render() {
    return (
      <div className='alert alert-info'>
        <div>~*~*YATTO*~*~</div>
        <FilePicker />
        <ArtifactList />
      </div>
    );
  }
}

export default Home;