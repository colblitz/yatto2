import React from 'react';
import { connect } from 'react-redux';
import OptionInput from './OptionInput';

class OptionList extends React.Component {
  render() {
    return (
      <div className="options-list">
        <OptionInput okey={['options', 'relics']} label="Relics"/>
        <OptionInput okey={['options', 'steps']} label="Steps"/>
        <OptionInput okey={['options', 'maxstage']} label="Approx MS"/>
        <OptionInput okey={['gamestate', 'swordmaster', 'level']} label="Swordmaster"/>
        <OptionInput okey={['gamestate', 'clan', 'score']} label="Clan Quest"/>
      </div>
    );
  }
}

export default OptionList;