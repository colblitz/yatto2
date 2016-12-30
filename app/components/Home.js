import React from 'react';
import FilePicker from './FilePicker';
import OrderedArtifactList from './OrderedArtifactList';
import StepList from './StepList';
import Test from './Test';

class Home extends React.Component {
  render() {
    return (
      <div className="mainPage">
        <Test />
        <div>~*~*YATTO*~*~</div>
        <FilePicker />
        <OrderedArtifactList />
        <StepList />
      </div>
    );
  }
}

export default Home;