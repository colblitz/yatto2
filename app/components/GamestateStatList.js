import React from 'react';
import { connect } from 'react-redux';
// import { formatChanged } from '../actions/actions';
import GamestateStatDisplay from './GamestateStatDisplay';

class GamestateStatList extends React.Component {
  render() {
    return (
      <div className='gamestate-stat-list'>
        <h3>
          Statistics
        </h3>
        {
          this.props.stats.map(function(stat, i) {
            return <GamestateStatDisplay key={i} skey={stat} format={this.props.format} />;
          }.bind(this))
        }
      </div>
    );
  }
}

// <input type="radio" value={0} name="format" checked={this.props.format == 0} onChange={this.props.formatChange}/>Scientific
//         <input type="radio" value={1} name="format" checked={this.props.format == 1} onChange={this.props.formatChange}/>Letters

const mapStateToProps = (state) => {
  return {
    stats: Object.keys(state.get('gamestateStats').toJS()).sort(function(k1, k2) {
      return state.getIn(['gamestateStats', k1, 'order'], 0) - state.getIn(['gamestateStats', k2, 'order'], 0);
    }),
    format: state.getIn(['ui', 'format'], 0),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // formatChange: (e) => {
    //   console.log(e.target.value);
    //   console.log(parseInt(e.target.value));
    //   console.log(formatChanged(parseInt(e.target.value)));
    //   dispatch(formatChanged(parseInt(e.target.value)));
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamestateStatList);