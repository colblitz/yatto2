import React from 'react'
import { HeroInfo } from '../util/Hero';
import HeroInput from './HeroInput';

class HeroList extends React.Component {
  renderHeroInput(hid) {
    return <HeroInput key={hid} hid={hid} />;
  }
  getHeroes() {
    return Object.keys(HeroInfo)
                .sort(function(a, b) { return HeroInfo[a].order - HeroInfo[b].order; })
                .map(function(hid) {
                  return (
                    this.renderHeroInput(hid)
                  );
                }.bind(this));
  }
  render() {
    const heroes = this.getHeroes();
    return (
      <div className='heroList'>
        <h3>
          Heroes
        </h3>
        { heroes }
      </div>
    );
  }
}

export default HeroList;