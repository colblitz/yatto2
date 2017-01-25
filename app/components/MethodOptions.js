import React from 'react';
import { connect } from 'react-redux';
import { methodChanged } from '../actions/actions';
import { optimizationType, optimizationLabels } from '../util/Calculator';

class MethodOptions extends React.Component {
  getOption(value, label, method, methodChange) {
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
      <div className="method-options">
        <h3>Optimization Methods</h3>
        {this.getOptimizationOptions(this.props.method, (e) => this.props.methodChanged(e))}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    method: state.getIn(['options', 'method'], 0),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    methodChanged: (e) => {
      dispatch(methodChanged(parseInt(e.target.value)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MethodOptions);