import React from 'react';
import { connect } from 'react-redux';
import { getStepsAction } from '../actions/actions';
import { callWorker } from '../handler';
import { Progress } from 'semantic-ui-react'

class StepButton extends React.Component {
  render() {
    return (
      <div className="step-button">
        { (this.props.stepsMessage != '') &&
          <div className="step-message">{this.props.stepsMessage}</div>
        }
        <button onClick={this.props.getSteps} disabled={this.props.calculatingSteps}>Get Steps</button>
        { this.props.calculatingSteps &&
          <Progress percent={this.props.progress} size='small' active/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    calculatingSteps: state.getIn(['ui', 'calculatingSteps'], false),
    progress: state.getIn(['ui', 'stepsProgress'], 0),
    stepsMessage: state.getIn(['ui', 'stepsMessage'], ''),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSteps: () => {
      // callWorker();
      dispatch(getStepsAction());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StepButton);