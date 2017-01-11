import React from 'react';
import FileInput from 'react-file-input';
import { ReadSavefile } from '../util/Savefile';
import { fromSaveFile, getDiff } from '../util/GameState';
import { getGoldSteps, getRelicSteps } from '../util/Calculator';
import { printHeroLevels } from '../util/Hero';
import { printArtifactLevels } from '../util/Artifact';
import { newGameState } from '../actions/actions';

import store from '../store';

class FilePicker extends React.Component {
  handleChange(e) {
    ReadSavefile(e.target.files[0], function(saveJSON) {
      var g = fromSaveFile(saveJSON);
      store.dispatch(newGameState(g));
    });
  }

  render() {
    return (
      <form>
        <div className="file-chooser-div">
          <input type="file"
                 accept=".fadat,.adat"
                 placeholder="Choose File"
                 className="file-chooser"
                 onChange={this.handleChange}>
          </input>
        </div>
      </form>
    );
  }
}

export default FilePicker;