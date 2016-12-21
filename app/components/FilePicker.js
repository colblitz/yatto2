import React from 'react';
import FileInput from 'react-file-input';
import { ReadSavefile } from '../util/Savefile';
import { fromSaveFile } from '../util/GameState';
import { getGoldSteps, getRelicSteps } from '../util/Calculator';

class FilePicker extends React.Component {
  handleChange(e) {
    console.log('Selected file:', e.target.files[0]);
    ReadSavefile(e.target.files[0], function(saveJSON) {
      console.log("Create gamestate");
      var g = fromSaveFile(saveJSON);
      console.log("Game state created");
      g.printStats();

      // for (var i = 1e3; i < 1e60; i*=1e3) {
      //   console.log("" + i + "  ------------");
      //   getGoldSteps(g, i, 20);
      // }
      var newG = getGoldSteps(g, 1e45, 20);
      getRelicSteps(newG.getCopy(), 600, 20);
      getRelicSteps(newG.getCopy(), 6000, 20);
      getRelicSteps(newG.getCopy(), 60000, 20);
      getRelicSteps(newG.getCopy(), 600000, 20);
    });
  }

  render() {
    return (
      <form>
        <FileInput name="saveFilePicker"
                   accept=".fadat,.adat"
                   placeholder="Choose File"
                   className="inputClass"
                   onChange={this.handleChange} />
      </form>
    );
  }
}

export default FilePicker;