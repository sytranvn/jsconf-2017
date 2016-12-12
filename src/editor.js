import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import DragAndDropReveicer from './files/drag-and-drop-receiver';
import Loader from './lib/loader';
import uuid from 'uuid';
import './editor.css';

import { addFile } from './data/files';
import midi from './lib/midi';
import scheduler from './lib/scheduler';
import audioGraph from './lib/audio-graph';
import store from './lib/store';
import { readConfig, persistStorePeriodically } from './lib/files';

class Editor extends Component {
  componentDidMount() {
    const { params: {project_id } } = this.props;
    const config = readConfig(project_id);

    // initialize the editor
    this.props.initEditor(config);

    // initialize everything under the hood
    audioGraph.init(store);
    scheduler.init(store);
    midi.init(store, scheduler.handleManualSchedule);

    // persist project config
    persistStorePeriodically(project_id, store);
  }

  render() {
    const { children, onDrop, params: { project_id } } = this.props;
    return (
      <div className="app">
        <div className="app__container">
          <div className="app__navigation">
            <Link to={`/project/${project_id}/pads`} activeClassName="m-active" className="app__navigationItem">
              Pads
            </Link>
            <Link to={`/project/${project_id}/tracks`} activeClassName="m-active" className="app__navigationItem">
              Tracks
            </Link>
            <Link to={`/project/${project_id}/files`} activeClassName="m-active" className="app__navigationItem">
              Files
            </Link>
          </div>
          <div className="app__content">
            { children }
          </div>
        </div>
        <Loader projectId={project_id} />
        <DragAndDropReveicer onDrop={onDrop} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onDrop: () => {
    const id = uuid.v4();
    dispatch(addFile(id, { name: 'dropped file', location: 'mysound.mp3' }));
  },

  initEditor: (config) => {
    dispatch({ type: 'init', state: config });
  }
});

export default connect(null, mapDispatchToProps)(Editor);