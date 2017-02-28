import React from 'react';
import { connect } from 'react-redux';
import { scientific, notation } from '../util/Localization';

class GamestateStatDisplay extends React.Component {
  render() {
    return (
      <div className='gamestate-stat-display-box'>
        <label>{this.props.label}</label>
        <input type="text"
               className="input stat-display-input"
               value={this.props.value}
               disabled={true}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  var v = state.getIn(['gamestateStats', ownProps.skey, 'value'], 0);
  return {
    value: ownProps.format == 0 ? scientific(v) : notation(v),
    label: state.getIn(['gamestateStats', ownProps.skey, 'label'], ""),
  }
}

export default connect(mapStateToProps)(GamestateStatDisplay);