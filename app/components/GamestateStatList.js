import React from 'react';
import { connect } from 'react-redux';
import GamestateStatDisplay from './GamestateStatDisplay';

class GamestateStatList extends React.Component {
  render() {
    return (
      <div className='gamestateStatList'>
        <h3>
          Statistics
        </h3>
        {
          this.props.stats.map(function(stat, i) {
            return <GamestateStatDisplay key={i} skey={stat} />;
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stats: Object.keys(state.get('gamestateStats').toJS()).sort(function(k1, k2) {
      return state.getIn(['gamestateStats', k1, 'order'], 0) - state.getIn(['gamestateStats', k2, 'order'], 0);
    })
  }
}

export default connect(mapStateToProps)(GamestateStatList);