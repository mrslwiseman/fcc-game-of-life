import React, { Component } from 'react';
import './Canvas.css';
import {canvas} from '../scripts/canvas'

// function rect(props) {
//     const { ctx, x, y, width, height } = props;
//     ctx.fillStyle = 'red'
//     ctx.fillRect(x, y, width, height);
//     ctx.closePath()
// }

class Canvas extends Component {

    componentWillUpdate(nextProps, nextState){
        canvas.renderGrid(nextProps.grid)
    }

    render() {
        const {onCanvasClick} = this.props;
        console.log('canvas rendering')
        return (
            <canvas ref={(canvas) => { this.canvas = canvas }} onClick={onCanvasClick} width="600" height="600" className="grid"></canvas>
        )
    }
}


export default Canvas;