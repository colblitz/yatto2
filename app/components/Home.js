import React from 'react';
import FilePicker from './FilePicker';
import StateOptions from './StateOptions';
import OrderedArtifactList from './OrderedArtifactList';
import OrderedEquipmentList from './OrderedEquipmentList';
import OrderedHeroList from './OrderedHeroList';
import OrderedSkillList from './OrderedSkillList';
import OrderedPetList from './OrderedPetList';
import GamestateStatList from './GamestateStatList';
import OptionList from './OptionList';
import AdvancedOptionList from './AdvancedOptionList';
import StepList from './StepList';
import StepButton from './StepButton';
import MethodOptions from './MethodOptions';
import DisplayOptions from './DisplayOptions';
import TabbedPanel from './TabbedPanel';
import Update from './Update';
import StateString from './StateString';
import Test from './Test';

class Home extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div className="main-page home-page">
        <div className="panels">
          <div className="panel-col">
            <div className="panel update-panel panel-row">
              <Update />
            </div>
            <div className="panel-row">
              <div className="panel-col">
                <div className="panel-row">
                  <div className="panel-col">
                    <div className="panel panel-row">
                      <FilePicker />
                      <StateOptions />
                    </div>
                    <div className="panel panel-row panel-grow">
                      <div className="panel-col">
                        <OptionList />
                        <AdvancedOptionList />
                      </div>
                      <div className="panel-col">
                        <MethodOptions />
                        <DisplayOptions />
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-col">
                    <GamestateStatList />
                    <StateString />
                  </div>
                </div>
                <div className="panel panel-row">
                  <TabbedPanel>
                    <OrderedSkillList tabLabel="Skills"/>
                    <OrderedHeroList tabLabel="Heroes"/>
                    <OrderedEquipmentList tabLabel="Equipment"/>
                    <OrderedPetList tabLabel="Pets"/>
                    <OrderedArtifactList tabLabel="Artifacts"/>
                  </TabbedPanel>
                </div>
              </div>
              <div className="panel panel-col">
                <StepButton />
                <StepList />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;