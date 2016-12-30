import React from 'react'
import { connect } from 'react-redux';
import Step from './Step';

class StepList extends React.Component {
  render() {
    return (
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
              console.log(stepKey);
              return <Step key={stepKey} stepKey={stepKey}/>
            })
          }
        </tbody>
      </table>
    )
  }
}


function mapStateToProps(state) {
  console.log("all steps");
  console.log(state.get("steps").toJS());
  return {
    steps: state.get("steps").toJS()
  }
}

export default connect(mapStateToProps)(StepList);