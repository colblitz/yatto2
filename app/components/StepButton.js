import React from 'react';
import { connect } from 'react-redux';
import { stepsRequested, stepsChanged } from '../actions/actions';
import { getRelicSteps } from '../util/Calculator';
import { getInStore, getGameState } from '../store';

class StepButton extends React.Component {
  render() {
    return (
      <div className="step-button">
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
        var gamestate = getGameState();
        var relics = getInStore(['options', 'relics'], 0);
        var maxstage = getInStore(['options', 'maxstage'], 0);
        var results = getRelicSteps(gamestate, relics);

        dispatch(stepsChanged(results.steps, results.summarySteps));
      }, 0);
    }
  }
}

// what
export default connect(mapStateToProps, mapDispatchToProps)(StepButton);