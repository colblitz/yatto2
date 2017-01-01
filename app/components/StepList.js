import React from 'react'
import { connect } from 'react-redux';
import Step from './Step';

class StepList extends React.Component {
  render() {
    return (
      <div className="stepList">
        <h3>
          Steps
        </h3>
        <table>
          <tbody>
            <tr>
              <th className="step stepHeader-col0"></th>
              <th className="step stepHeader-col1">Artifact</th>
              <th className="step stepHeader-col2">Level To</th>
              <th className="step stepHeader-col3">Cost</th>
            </tr>
            {
              Object.keys(this.props.steps).map(function(stepKey) {
                return <Step key={stepKey} stepKey={stepKey}/>
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