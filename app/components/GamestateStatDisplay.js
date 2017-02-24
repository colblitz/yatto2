import React from 'react';
import { connect } from 'react-redux';

class GamestateStatDisplay extends React.Component {
  render() {
    return (
      <div className='gamestate-stat-display-box'>
        <label>{this.props.label}</label>
        <input type="text"
               className="input stat-display-input"
               value={this.props.value}
               disabled={true}/>
      </div>
    );
  }
}

function scientific(n) {
  return parseFloat(n.toPrecision(4)).toExponential();
}

function eToLetter(e) {
  if (e % 3 != 0) {
    return "blah";
  }
  if (e < 15) {
    return ["K", "M", "B", "T"][e/3 - 1];
  }
  var t = e/3 - 5;
  console.log(e, t, t/26, t%26, "abcdefghijklmnopqrstuvwxyz"[t / 26], "abcdefghijklmnopqrstuvwxyz"[t % 26]);
  return "abcdefghijklmnopqrstuvwxyz"[Math.floor(t / 26)] + "abcdefghijklmnopqrstuvwxyz"[t % 26];
}

function notation(n) {
  var t = n;
  var e = 0;
  while (Math.pow(10, e) < t) {
    e += 3;
  }
  e -= 3;
  t = t / Math.pow(10, e);
  t = t.toPrecision(4);
  var l = eToLetter(e);
  return t + " " + l;
}

function mapStateToProps(state, ownProps) {
  var v = state.getIn(['gamestateStats', ownProps.skey, 'value'], 0);
  return {
    value: ownProps.format == 0 ? scientific(v) : notation(v),
    label: state.getIn(['gamestateStats', ownProps.skey, 'label'], ""),
  }
}

export default connect(mapStateToProps)(GamestateStatDisplay);