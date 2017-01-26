import React from 'react';
import { connect } from 'react-redux';
import { getArtifactName } from '../util/Localization';
import { stepApplied, summaryStepApplied } from '../actions/actions';

class Step extends React.Component {
  render() {
    const s = this.props.step;
    return (
      <tr>
        <td className="step step-col0">
          <i className="fa fa-check" onClick={(e) => this.props.onStepApplied(this.props.skey, this.props.summary)}></i>
        </td>
        <td className={"step step-col1 " + (s.buy ? "buy-step" : "")}>{s.buy ? "Buy an artifact" : getArtifactName(s.artifact)}</td>
        <td className="step step-col2">{s.levelTo}</td>
        <td className="step step-col3">{s.cost}</td>
        { s.total &&
          <td className="step step-col4">{s.total}</td>
        }
      </tr>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onStepApplied: (index, isSummary) => {
      if (isSummary) {
        dispatch(summaryStepApplied(index));
      } else {
        dispatch(stepApplied(index));
      }
    }
  }
}

export default connect(null, mapDispatchToProps)(Step);