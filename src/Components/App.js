import React, { Component } from 'react';
import Canvas from './Canvas';
import './App.css';
import { canvas } from '../scripts/canvas';
import SETTINGS from '../scripts/settings';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      looping: false,
      speed: 500
    }
  }

  componentDidMount() {
    // let canvas function get the context of canvas in dom
    canvas.init();
    // draw initial grid.
    canvas.renderGrid(this.state.grid)

  }

  next = () => {
    const nextGrid = canvas.update(this.state.grid);
    this.setState({ grid: nextGrid });
  }

  play = () => {
    return (() => {
      let timer;
      if (this.state.looping == true) {
        this.next();
        timer = setTimeout(this.play, this.state.speed);
      } else {
        clearInterval(timer);
      }
    })()
  }

  // draws next iteration
  handleNextClick = () => {
    this.next();
  }

  handleLoopClick = () => {
    if (!this.state.looping) {
      this.setState({ looping: true }, this.play)
    } else {
      this.setState({ looping: false })
    }
  }

  updateSpeed = () => {
    const speed = this.speedInput.value;

    this.setState({
      speed
    })
    
  }

  onCanvasClick = (e) => {
    const cellSize = SETTINGS.CELL_SIZE;
    const x = Math.round((e.nativeEvent.offsetX + (cellSize / 2)) / cellSize - 1);
    const y = Math.round((e.nativeEvent.offsetY + (cellSize / 2)) / cellSize - 1);

    let newGrid = this.state.grid;
    newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1;

    this.setState({
      grid:newGrid
    });
    
  }


  render() {

    return (
      <div className="App">
        <Canvas grid={this.state.grid}
        onCanvasClick={this.onCanvasClick} />
        <button onClick={this.handleNextClick}>
          Next
        </button>
        <button onClick={this.handleLoopClick}>

          {
            this.state.looping ? "Pause" : "Play"
          }
        </button>
        <input
          style={{ direction: 'rtl' }}
          ref={input => this.speedInput = input}
          onChange={this.updateSpeed}
          value={this.state.speed}
          step="50"
          type="range"
          min="0"
          max="1000" />
      </div>
    );
  }
}

export default App;
