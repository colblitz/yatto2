import React from 'react'
import { getPetName } from '../util/Localization';
import { PetInfo } from '../util/Pet';
import PetInput from './PetInput';

class PetList extends React.Component {
  renderPetInput(pid) {
    return <PetInput key={pid} pid={pid} />;
  }
  getPets() {
    return Object.keys(PetInfo)
                .sort(function(a, b) { return getPetName(a).localeCompare(getPetName(b)); })
                .map(function(pid) {
                  return (
                    this.renderPetInput(pid)
                  );
                }.bind(this));
  }
  render() {
    const pets = this.getPets();
    return (
      <div className='pet-list'>
        <h3>
          Pets
        </h3>
        { pets }
      </div>
    );
  }
}

export default PetList;
