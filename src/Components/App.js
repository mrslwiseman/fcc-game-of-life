import React, { Component } from 'react';
import Canvas from './Canvas';
import './App.css';
import { canvas } from '../scripts/canvas';
import SETTINGS from '../scripts/settings';
import grids from '../grids';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: grids.ten_cell_row,
      looping: false,
      speed: 300
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
    console.log(nextGrid);
    
    this.setState({ grid: nextGrid }, console.log('finished setting state'));
  }

  play = () => {
    return (() => {
      let timer;
      if (this.state.looping === true) {
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

  onGridSelect = (e) => {
    console.log(e.target.value);
    this.setState({
      grid: grids[e.target.value]
    })
    //this.state.grid = e.target.value;
  }

  render() {

    return (
      <div className="App">
        <Canvas 
          grid={this.state.grid}
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

          <select
          type="select"
          onChange={this.onGridSelect}
          >
          value={this.state.grid}
          <option value="ten_cell_row">10 Cell Row</option>
          <option value="glider">Glider</option>
          <option value="small_exploder">Small Exploder</option>
          <option value="rhok">RHOK</option>
          </select>
      </div>
    );
  }
}

export default App;
