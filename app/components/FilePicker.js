import React from 'react';
import { connect } from 'react-redux';
import FileInput from 'react-file-input';
import { ReadSavefile } from '../util/Savefile';
import { fromSaveFile, getDiff } from '../util/GameState';
import { getGoldSteps, getRelicSteps } from '../util/Calculator';
import { printHeroLevels } from '../util/Hero';
import { printArtifactLevels } from '../util/Artifact';
import { newGameState, newStateMessage } from '../actions/actions';

import store from '../store';

class FilePicker extends React.Component {
  handleChange(e) {
    ReadSavefile(e.target.files[0], function(error, saveJSON) {
      if (error) {
        store.dispatch(newStateMessage("Error reading save file, try grabbing your save file again [" + error.message + "]"));
      } else {
        var g = fromSaveFile(saveJSON);
        store.dispatch(newGameState(g));
      }
    });
  }

  render() {
    return (
      <form>
        <div className="file-chooser-div">
          <input type="file"
                 accept=".fadat,.adat"
                 placeholder="Load Information From File"
                 className="file-chooser"
                 onChange={this.handleChange}>
          </input>
          { this.props.stateMessage &&
            <div className="state-message">{this.props.stateMessage}</div>
          }
        </div>
      </form>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    stateMessage: state.getIn(['ui', 'stateMessage'], ""),
  }
}

export default connect(mapStateToProps)(FilePicker);