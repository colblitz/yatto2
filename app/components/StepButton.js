import React from 'react';
import { connect } from 'react-redux';
import { stepsRequested, stepsChanged, getStepsAction } from '../actions/actions';

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
      dispatch(getStepsAction());
    }
  }
}

// what
export default connect(mapStateToProps, mapDispatchToProps)(StepButton);