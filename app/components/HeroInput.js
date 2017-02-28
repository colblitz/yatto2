import React from 'react';
import { connect } from 'react-redux';
import { getHeroName, scientific, notation } from '../util/Localization';
import { HeroInfo } from '../util/Hero';
import { heroLevelChanged, heroWeaponChanged } from '../actions/actions';

class HeroInput extends React.Component {
  render() {
    const h = HeroInfo[this.props.hid];
    return (
      <div className='hero-input-box'>
        <input type="number"
               className={"input hero-level-input hero-type-" + h.getTypeString()}
               value={this.props.level}
               min="0"
               onChange={(e) => this.props.onHeroLevelChange(this.props.hid, e)}/>
        <input type="number"
               className={"input hero-weapon-input hero-type-" + h.getTypeString()}
               value={this.props.weapon}
               min="0"
               onChange={(e) => this.props.onHeroWeaponChange(this.props.hid, e)}/>
        { this.props.showDamage &&
          <input type="text"
               className={"input hero-damage-input hero-type-" + h.getTypeString()}
               value={this.props.damage}
               disabled={true}/>
        }
        <div className="label hero-label">
          {getHeroName(this.props.hid)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  var v = 0;
  var damageMap = state.get('heroDamageMap', {});
  if (ownProps.hid in damageMap) {
    v = damageMap[ownProps.hid];
  }
  var format = state.getIn(['ui', 'format'], 0);
  return {
    damage: format == 0 ? scientific(v) : notation(v),
    showDamage: state.getIn(['options', 'showHeroDamage'], false),
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