import React from 'react';
import { connect } from 'react-redux';
import { stepsRequested, stepsChanged } from '../actions/actions';
import { getRelicSteps } from '../util/Calculator';
import { getGameState } from '../store';

class StepButton extends React.Component {
  render() {
    return (
      <div className="stepButton">
        <button onClick={this.props.getSteps}>Get Steps</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSteps: () => {
      dispatch(stepsRequested());
      setTimeout(function() {
        console.log("getting gamestate");
        var gamestate = getGameState();
        console.log("getting results");
        var results = getRelicSteps(gamestate, 10000);
        console.log(results);
      }, 0);


    }
  }
}

export default connect(null, mapDispatchToProps)(StepButton);