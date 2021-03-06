import React, { Component } from 'react';
import context from '../lib/audio/context';

export default class PlayAudioClip extends Component {

  constructor(props) {
    super(props);

    this.state = { playing: false };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { playing } = this.state;
    return <button onClick={this.playPause}>{playing ? 'pause' : 'play'}</button>;
  }

  playPause = (event) => {
    event.preventDefault();
    this.state.playing ? this.pause() : this.play();
  }

  play = () => {
    const { buffer, config } = this.props;
    const audioNode = context.createBufferSource();
    const gainNode = context.createGain();
    audioNode.buffer = buffer;
    gainNode.gain.value = config.gain;
    audioNode.connect(gainNode);
    gainNode.connect(context.destination);
    audioNode.onended = this.pause;
    audioNode.start();

    this.setState({
      playing: true,
      audioNode
    });
  }

  pause = () => {
    const { audioNode } = this.state;
    if (audioNode) {
      audioNode.disconnect();
      audioNode.stop();
    }

    this.setState({
      audioNode: null,
      playing: false
    });
  }

}
