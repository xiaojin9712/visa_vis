import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import "./style.css";

class DropzoneAreaExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }
  handleChange(files) {
    this.setState({
      files: files,
    });
  }
  render() {
    return (
      <div id="load">
        <DropzoneArea
          dropzoneText="Load JSON file. Drag and drop a file here or click"
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

export default DropzoneAreaExample;
