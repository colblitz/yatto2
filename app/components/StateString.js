import React from 'react';
import { connect } from 'react-redux';

class StateString extends React.Component {
  render() {
    return (
      <div className="state-string">
        <h3>Reddit-friendly Summary</h3>
        <div className="state-string-box">
          <textarea className="state-string-textarea" value={this.props.stateString}></textarea>
          <button onClick={(e) => this.props.copyToClipboard()} >Copy to Clipboard</button>
        </div>
      </div>
    );
  }
}

// var asdf = "lkjaljsldkfjljald\n\n\nalkjsdlkfj";

// function directCopy(str){
//   var temp = document.createElement("textarea");
//   temp.value=str;
//   temp.select();
//   document.execCommand('copy');


//   // //based on http://stackoverflow.com/a/12693636
//   // document.oncopy = function(event) {
//   //   event.clipboardData.setData("Text", str);
//   //   event.preventDefault();
//   // };
//   // document.execCommand("Copy");
//   // document.oncopy = undefined;
// }


// { this.props.stateString &&
//           <textarea value={this.props.stateString.split('\n').map((item, key) => {
//                             return <span key={key}>{item}<br/></span>
//                           })}></textarea>
//         }

const mapStateToProps = (state) => {
  return {
    stateString: state.get('stateString')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    copyToClipboard: () => {
      $("#asdf").select();
      document.execCommand('copy');
      // directCopy(asdf);
      // window.prompt("Copy to clipboard: Ctrl+C, Enter", asdf);

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateString);