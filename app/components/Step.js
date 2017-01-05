import React from 'react';
import { connect } from 'react-redux';
import { getArtifactName } from '../util/Localization';

class Step extends React.Component {
  render() {
    const s = this.props.step;
    return (
      <tr>
        <td className="step step-col1"></td>
        <td className="step step-col2">{s.buy ? "Buy an artifact" : getArtifactName(s.artifact)}</td>
        <td className="step step-col3">{s.levelTo}</td>
        <td className="step step-col4">{s.cost}</td>
      </tr>
    )
  }
}

// function mapStateToProps(state, ownProps) {
//   var step = state.getIn(['steps', ownProps.stepKey]).toJS();
//   return {
//     name: step.key,
//     value: step.value,
//     cost: step.cost
//   }
// }

// export default connect(mapStateToProps)(Step);
export default Step;