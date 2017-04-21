import React from 'react';
import { connect } from 'react-redux';
import { toggleUpdate, saveIfToken } from '../actions/actions';

const lastUpdate = "2017-04-21-1";

class Update extends React.Component {
  render() {
    return (
      <div className="update">
        { this.props.showUpdate &&
          <div className="update-stuff">
            <h3>Update (4/21/2017)</h3>
            Update for 1.3.2 and a few other minor changes. If you see any problems, let me know (don't forget to include your YATTWO username when you contact me if you have one).
            <ul>
              <li>You can now go to a user's YATTWO page with <a href="https://yattwo.me/u/asdf">yattwo.me/u/[insert username here]</a></li>
              <li>Added a textbox with values in a Reddit-friendly format that you can copy into a post or comment. Let me know if you have any suggestions for format</li>
              <li>Fixed an issue caused by a Safari 10.1 bug causing people to get NaNs and bad values (thanks jrh :P)</li>
              <li>A few people have mentioned values being off (thanks <a href="http://www.reddit.com/user/JonSnow84">/u/JonSnow84</a>!)- this should be fixed now after updating the clan multiplier formula for 1.3.1</li>
              <li>Adjusted column widths of a few inputs (thanks <a href="http://www.reddit.com/user/Doly_TTM_GM">/u/Doly_TTM_GM</a>!), and spacing of heroes (thanks <a href="http://www.reddit.com/user/jerbookins">/u/jerbookins</a>!)</li>
              <li>Adjusted a few formulas (thanks <a href="http://www.reddit.com/user/MetxChris">/u/MetxChris</a>!)</li>
              <li>Fixed a bug where if you tried to upload the same save file twice in a row it wouldn't do anything the second time</li>
              <li>Uploading a save file now merges your hero levels instead of replacing them</li>
            </ul>
          </div>
        }
        <div className="update-toggle" onClick={(e) => this.props.onToggleUpdate(!this.props.showUpdate)}>
          { this.props.showUpdate ? (
            <i className="update-icon fa fa-angle-double-up"></i>
          ) : (
            <i className="update-icon fa fa-angle-double-down"></i>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var toggle = state.getIn(['ui', 'update'], false);
  var lastDate = state.getIn(['ui', 'lastUpdate'], "");
  return {
    showUpdate: toggle || (lastUpdate > lastDate),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleUpdate: (show) => {
      dispatch(toggleUpdate(show, lastUpdate));
      dispatch(saveIfToken());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Update);