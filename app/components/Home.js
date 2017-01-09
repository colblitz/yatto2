import React from 'react';
import FilePicker from './FilePicker';
import OrderedArtifactList from './OrderedArtifactList';
import OrderedEquipmentList from './OrderedEquipmentList';
import OrderedHeroList from './OrderedHeroList';
import OrderedSkillList from './OrderedSkillList';
import OrderedPetList from './OrderedPetList';
import GamestateStatList from './GamestateStatList';
import OptionList from './OptionList';
import Panel from './Panel';
import StepList from './StepList';
import StepButton from './StepButton';
import Test from './Test';

class Home extends React.Component {
  render() {
    return (
      <div className="mainPage">
        <div>
          <h1>~*~*YATTWO*~*~</h1>
          <h3>As should be glaringly obvious, this is still a work in progress. No guarantees of anything being right, use at your own risk, etc. etc.</h3>
        </div>
        <Panel>
          <FilePicker />
        </Panel>

        <Panel>
          <GamestateStatList />
        </Panel>

        <Panel>
          <OptionList />
          <StepButton />
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