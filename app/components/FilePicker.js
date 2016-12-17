import React from 'react';
import FileInput from 'react-file-input';
import { ReadSavefile } from '../util/Savefile';
import { fromSaveFile } from '../util/GameState';
import { printBonuses } from '../util/BonusType';

class FilePicker extends React.Component {
  handleChange(e) {
    console.log('Selected file:', e.target.files[0]);
    ReadSavefile(e.target.files[0], function(saveJSON) {
      console.log("Create gamestate");
      var g = fromSaveFile(saveJSON);
      console.log("Game state created");
      console.log(g);
      printBonuses(g.getBonuses());
    });

  }

  render() {
    return (
      <form>
        <FileInput name="saveFilePicker"
                   accept=".fadat,.adat"
                   placeholder="ASDF"
                   className="inputClass"
                   onChange={this.handleChange} />
      </form>
    );
  }
}

export default FilePicker;