import React from 'react'
import { connect } from 'react-redux';
import Step from './Step';

class StepList extends React.Component {
  render() {
    return (
      <div className="step-list">
        <h3>
          Steps
        </h3>
        <table>
          <tbody>
            <tr>
              <th className="step step-header-col0"></th>
              <th className="step step-header-col1">Artifact</th>
              <th className="step step-header-col2">Level To</th>
              <th className="step step-header-col3">Cost</th>
            </tr>
            {
              this.props.steps.map(function(step, i) {
                return <Step key={i} step={step}/>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    steps: state.get("steps").toJS()
  }
}

export default connect(mapStateToProps)(StepList);