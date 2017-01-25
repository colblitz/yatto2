import React from 'react'
import { connect } from 'react-redux';
import Step from './Step';

class StepList extends React.Component {
  render() {
    return (
      <div className="step-list">
        <button>Apply All</button>
        <button>Reset Steps</button>
        <h3>Summary Steps</h3>
        <table>
          <tbody>
            <tr>
              <th className="step step-header-col0"></th>
              <th className="step step-header-col1">Artifact</th>
              <th className="step step-header-col2">Level To</th>
              <th className="step step-header-col3">Cost</th>
            </tr>
            {
              this.props.summarysteps.map(function(step, i) {
                return <Step key={i} skey={i} step={step} summary={true}/>
              })
            }
          </tbody>
        </table>

        <h3>Steps</h3>
        <table>
          <tbody>
            <tr>
              <th className="step step-header-col0"></th>
              <th className="step step-header-col1">Artifact</th>
              <th className="step step-header-col2">Level To</th>
              <th className="step step-header-col3">Cost</th>
              <th className="step step-header-col4">Total</th>
            </tr>
            {
              this.props.steps.map(function(step, i) {
                return <Step key={i} skey={i} step={step} summary={false}/>
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
    steps: state.get("steps").toJS(),
    summarysteps: state.get("summarysteps").toJS(),
  }
}

export default connect(mapStateToProps)(StepList);