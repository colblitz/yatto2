import React from 'react';
import { connect } from 'react-redux';
import { getPetName } from '../util/Localization';
import { porderChanged } from '../actions/actions';
import { PetInfo } from '../util/Pet';
import PetInput from './PetInput';

class PetList extends React.Component {
  renderPetInput(pid) {
    return <PetInput key={pid} pid={pid} />;
  }
  getPets(porder, petLevels) {
    const alphabetical = (a, b) => getPetName(a).localeCompare(getPetName(b));
    const levelOrder = (a, b) => petLevels[b] - petLevels[a]; // descending
    return Object.keys(PetInfo)
                .sort(porder == 0 ? alphabetical : levelOrder)
                .map(function(pid) {
                  return (
                    this.renderPetInput(pid)
                  );
                }.bind(this));
  }
  render() {
    const pets = this.getPets(this.props.porder, this.props.petLevels);
    return (
      <div className='pet-list'>
        Sort by:
        <input type="radio" value={0} name="porder" checked={this.props.porder == 0} onChange={this.props.porderChange}/>Alphabetical
        <input type="radio" value={1} name="porder" checked={this.props.porder == 1} onChange={this.props.porderChange}/>Pet Level
        { pets }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    porder: state.getIn(['options', 'porder'], 0),
    petLevels: state.getIn(['gamestate', 'pets', 'levels'], {}).toJS(),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    porderChange: (e) => {
      dispatch(porderChanged(parseInt(e.target.value)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PetList);