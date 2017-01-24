import React from 'react';
import { connect } from 'react-redux';
import OptionInput from './OptionInput';
import OptionCheck from './OptionCheck';

class OptionList extends React.Component {
  render() {
    return (
      <div className="options-list">
        <OptionInput okey={['options', 'relics']} label="Relics"/>
        <OptionInput okey={['options', 'steps']} label="Steps"/>
        <OptionInput okey={['options', 'maxstage']} label="Approx MS"/>
        <OptionInput okey={['gamestate', 'swordmaster', 'level']} label="Swordmaster"/>
        <OptionInput okey={['gamestate', 'clan', 'score']} label="Clan Quest"/>
        <h3>Advanced</h3>
        <OptionInput okey={['options', 'tps']} label="Taps/second"/>
        <OptionCheck okey={['options', 'useAll']} label="Use all relics"/>
        <OptionCheck okey={['options', 'optimize']} label="Optimize first"/>
        <OptionCheck okey={['options', 'actives']} label="Consider Actives"/>
      </div>
    );
  }
}

export default OptionList;