import React from 'react';
import FilePicker from './FilePicker';
import OrderedArtifactList from './OrderedArtifactList';
import OrderedEquipmentList from './OrderedEquipmentList';
import OrderedHeroList from './OrderedHeroList';
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
        <OrderedEquipmentList />
        <OrderedHeroList />
        <StepList />
      </div>
    );
  }
}

export default Home;