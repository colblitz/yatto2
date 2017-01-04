import React from 'react';
import FilePicker from './FilePicker';
import OrderedArtifactList from './OrderedArtifactList';
import OrderedEquipmentList from './OrderedEquipmentList';
import OrderedHeroList from './OrderedHeroList';
import OrderedSkillList from './OrderedSkillList';
import OrderedPetList from './OrderedPetList';
import Panel from './Panel';
import StepList from './StepList';
import Test from './Test';

class Home extends React.Component {
  render() {
    return (
      <div className="mainPage">
        <Test />
        <div>~*~*YATTO*~*~</div>
        <FilePicker />

        <Panel>
          <StepList />
        </Panel>
        <Panel>
          <OrderedArtifactList />
          <OrderedHeroList />
          <OrderedPetList />
          <OrderedSkillList />
          <OrderedEquipmentList />
        </Panel>
      </div>
    );
  }
}

export default Home;