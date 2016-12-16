import React from 'react';
import FileInput from 'react-file-input';
import { ReadSavefile } from '../util/Savefile';

class FilePicker extends React.Component {
  handleChange(e) {
    console.log('Selected file:', e.target.files[0]);
    ReadSavefile(e.target.files[0]);
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