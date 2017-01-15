import React from 'react';
import { connect } from 'react-redux';
import { getArtifactName } from '../util/Localization';

class Step extends React.Component {
  render() {
    const s = this.props.step;
    return (
      <tr>
        <td className="step step-col0"></td>
        <td className="step step-col1">{s.buy ? "Buy an artifact" : getArtifactName(s.artifact)}</td>
        <td className="step step-col2">{s.levelTo}</td>
        <td className="step step-col3">{s.cost}</td>
        { s.total &&
          <td className="step step-col4">{s.total}</td>
        }
      </tr>
    )
  }
}

export default Step;