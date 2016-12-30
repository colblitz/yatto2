import React from 'react';
import { connect } from 'react-redux';

class Step extends React.Component {
  render() {
    return (
      <tr>
        <td className="step step-col1"></td>
        <td className="step step-col2">{this.props.name}</td>
        <td className="step step-col3">{this.props.value}</td>
        <td className="step step-col4">{this.props.cost}</td>
      </tr>
    )
  }
}

function mapStateToProps(state, ownProps) {
  console.log("in Step with step: ");
  var step = state.getIn(['steps', ownProps.stepKey]).toJS();
  console.log(step);
  return {
    name: step.key,
    value: step.value,
    cost: step.cost
  }
}

export default connect(mapStateToProps)(Step);