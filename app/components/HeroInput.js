import React from 'react';
import { connect } from 'react-redux';
import { getHeroName } from '../util/Localization';
import { HeroInfo } from '../util/Hero';
import { heroLevelChanged, heroWeaponChanged } from '../actions/actions';

class HeroInput extends React.Component {
  render() {
    const h = HeroInfo[this.props.hid];
    return (
      <div className='hero-input-box'>
        <input type="number"
               className="input hero-level-input"
               value={this.props.level}
               min="0"
               onChange={(e) => this.props.onHeroLevelChange(this.props.hid, e)}/>
        <input type="number"
               className="input hero-weapon-input"
               value={this.props.weapon}
               min="0"
               onChange={(e) => this.props.onHeroWeaponChange(this.props.hid, e)}/>
        <div className="label hero-label">
          {getHeroName(this.props.hid)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    level: state.getIn(['gamestate', 'heroes', 'levels', ownProps.hid], 0),
    weapon: state.getIn(['gamestate', 'heroes', 'weapons', ownProps.hid], 0),
    hid: ownProps.hid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onHeroLevelChange: (id, e) => {
      var level = parseInt(e.target.value);
      if (!isNaN(level)) {
        dispatch(heroLevelChanged(id, level))
      }
    },
    onHeroWeaponChange: (id, e) => {
      var level = parseInt(e.target.value);
      if (!isNaN(level)) {
        dispatch(heroWeaponChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeroInput);