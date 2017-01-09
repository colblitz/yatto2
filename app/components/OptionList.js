import React from 'react';
import { connect } from 'react-redux';
import OptionInput from './OptionInput';

class OptionList extends React.Component {
  render() {
    return (
      <div className="optionsList">
        <OptionInput okey="relics" label="Relics"/>
        <OptionInput okey="steps" label="Steps"/>
      </div>
    );
  }
}

export default OptionList;