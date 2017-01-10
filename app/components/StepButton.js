import React from 'react';
import { connect } from 'react-redux';
import { stepsRequested, stepsChanged } from '../actions/actions';
import { getRelicSteps } from '../util/Calculator';
import { getInStore, getGameState } from '../store';

class StepButton extends React.Component {
  render() {
    return (
      <div className="stepButton">
        <button onClick={this.props.getSteps} disabled={this.props.calculatingSteps}>Get Steps</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    relics: state.getIn(['options', 'relics'], 0),
    calculatingSteps: state.get('calculatingSteps')
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
        var relics = getInStore(['options', 'relics'], 0);
        console.log("using relics: " + relics);
        var results = getRelicSteps(gamestate, relics);

        console.log("got results");
        //console.log(results);
        console.log(results.steps);
        dispatch(stepsChanged(results.steps));
      }, 0);


    }
  }
}

// what
export default connect(mapStateToProps, mapDispatchToProps)(StepButton);