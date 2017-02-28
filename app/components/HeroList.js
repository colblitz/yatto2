import React from 'react'
import { connect } from 'react-redux';
import { HeroInfo } from '../util/Hero';
import HeroInput from './HeroInput';
import { toggleHeroDamage } from '../actions/actions';

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
      <div className='hero-list'>
        <h3>Level - Weapons</h3>
        <input type="checkbox"
               className="input option-check"
               checked={this.props.showDamage}
               onChange={this.props.toggleHeroDamage}/> Show Hero Damage Column
        <div>(Orange is melee, green is ranged, blue is spell)</div>
        { heroes }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showDamage: state.getIn(['options', 'showHeroDamage'], false),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleHeroDamage: (e) => {
      dispatch(toggleHeroDamage(e.target.checked));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeroList);