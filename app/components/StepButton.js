import React from 'react';
import { connect } from 'react-redux';
import { getStepsAction, methodChanged } from '../actions/actions';
import { optimizationType, optimizationLabels } from '../util/Calculator';

class StepButton extends React.Component {
  getOption(value, label, method, methodChange) {
    // return <option key={eid} value={eid}>{getEquipmentName(eid)}</option>;
    return (
      <div key={value}>
        <input type="radio" value={value} name="method" checked={method == value} onChange={methodChange}/>
        {label}
      </div>
    );
  }
  getOptimizationOptions(method, methodChange) {
    return Object.keys(optimizationType)
      .sort(function(a, b) { return optimizationType[a] - optimizationType[b]; })
      .map(function(os) {
        return (
          this.getOption(optimizationType[os], optimizationLabels[os], method, methodChange)
        );
      }.bind(this));
  }
  render() {
    return (
      <div className="step-button">
        <button onClick={this.props.getSteps} disabled={this.props.calculatingSteps}>Get Steps</button>
        {this.getOptimizationOptions(this.props.method, (e) => this.props.methodChanged(e))}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    relics: state.getIn(['options', 'relics'], 0),
    calculatingSteps: state.get('calculatingSteps'),
    method: state.getIn(['options', 'method'], 0),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSteps: () => {
      dispatch(getStepsAction());
    },
    methodChanged: (e) => {
      dispatch(methodChanged(parseInt(e.target.value)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StepButton);