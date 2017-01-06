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
    stats: Object.keys(state.get('gamestateStats').toJS())
  }
}

export default connect(mapStateToProps)(GamestateStatList);