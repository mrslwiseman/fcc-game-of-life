
    // let CURRENT_GRID = gridTemplates.grid1
import SETTINGS from './settings';

    
    // const onGridSelect = (e) => {
    //     console.log(e.target.value);
    //     const selection = e.target.value
    //     CURRENT_GRID = gridTemplates[selection];
    //     grid.next({newGridSelected: CURRENT_GRID})
    // }

    // const grid = () => {
    //     let timer = null;
    //     const loop = () => {
    //         const { REFRESH_RATE } = SETTINGS;
    //         if (timer != null) {
    //             clearInterval(timer)
    //             timer = null;
    //         } else {
    //             timer = setInterval(next, REFRESH_RATE)
    //         }
    //     }
    //     const next = (() => {
    //         // sets initial grid on IIFE call
    //         let prevGrid = CURRENT_GRID;
    //         return ({canvasEdited, newGridSelected} = {}) => {
    //             if(newGridSelected){
    //                 prevGrid = newGridSelected;
    //             } else {
    //                 if(canvasEdited){
    //                     prevGrid = edit(canvasEdited.y, canvasEdited.x, prevGrid)
    //                 } else {
    //                     prevGrid = nextGrid(prevGrid)
    //                 }
    //             }
    //             canvas.renderGrid(prevGrid);
    //         }
      

    //     const edit = (y,x,grid) => {
    //         let newGridSelected = grid;
    //         newGridSelected[y][x] = newGridSelected[y][x] === 1 ? 0 : 1;
    //         return newGridSelected
    //     }


    //     const handleClick = (e) => {
    //         const x = Math.round( (e.offsetX +( 25/2)) /25 -1);
    //         const y = Math.round( (e.offsetY +( 25/2)) /25 -1);
    //         next({canvasEdited: {x,y}})
    //     }

    

    const applyRulesToCell = (y, x, cell, grid) => {
        const alive = cell === 1 ? true : false;
        const nCount = countCellNeighbours(y, x, grid) // returns a number of neighbours
        let change = false;

        if (alive) {
            if (nCount <= 1 || nCount >= 4) {
                change = 0 // dead :(
            }
        } else if (!alive && nCount === 3) {
            change = 1; // comes back to life :)
        }
        return change === false ? cell : change;

    }

    const countCellNeighbours = (i, j, grid) => {
        const {GRID_HEIGHT, GRID_WIDTH} = SETTINGS;
        const isRowAbove = i > 0;
        const isRowBelow = i < GRID_HEIGHT - 1;
        const isColLeft = j > 0;
        const isColRight = j < GRID_WIDTH;
        // let neighbours = 0;

        // if (isRowAbove) {
        //     grid[i - 1][j - 1] === 1 && isColLeft && neighbours++ // top left
        //     grid[i - 1][j + 1] === 1 && isColRight && neighbours++ // top right
        //     grid[i - 1][j] === 1 && neighbours++ // top
        // }

        // if (isRowBelow) {
        //     grid[i + 1][j - 1] === 1 && isColLeft && neighbours++// bottom left
        //     grid[i + 1][j] === 1 && neighbours++ // bottom
        //     grid[i + 1][j + 1] === 1 && isColRight && neighbours++ // bottom right
        // }

        // grid[i][j - 1] === 1 && neighbours++ // left
        // grid[i][j + 1] === 1 && neighbours++ // right
        const back = grid[i - 1], next = grid[i + 1], h = j - 1, k = j + 1;

        const neighbours = (back && back[h] || 0)
                        + (back && back[j] || 0)
                        + (back && back[k] || 0)
                        + (grid[i][h] || 0)
                        + (grid[i][k] || 0)
                        + (next && next[h] || 0)
                        + (next && next[j] || 0)
                        + (next && next[k] || 0);
        return neighbours;
    }

    export const canvas = ((c) => {
        var ctx = null;
    
        const init = () => {
            ctx  = document.querySelector('.grid').getContext('2d');
        }
        // const canvas = document.querySelector('canvas')
        // const ctx = canvas.getContext('2d');
        const { CANVAS_HEIGHT, CANVAS_WIDTH, CELL_SIZE, CELL_ALIVE_COLOUR, CELL_DEAD_COLOUR } = SETTINGS;

        const clear = () => {
            ctx.beginPath()
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.fillStyle = CELL_DEAD_COLOUR
            ctx.fill()
            ctx.closePath()
        }

        // is called when canvas is clicked on
        const drawCell = (x, y) => { 
            ctx.beginPath()
            ctx.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = CELL_ALIVE_COLOUR
            ctx.fill();
            ctx.closePath()
        }
    
        //    create next array with rules applied
    const update = (grid) => {
        return grid.map((row, y) => { // loop over rows
            return row.map((cell, x) => { // loop over cells in row
                return applyRulesToCell(y, x, cell, grid) // returns 1 || 0
            })
        })
    }



    // draws grid to canvas
        const renderGrid = (grid) => {
            clear() // clear canvas between redraws
            return grid.forEach((row, y) => { // loop over rows
                return row.forEach((cell, x) => { // loop over cells in row
                    cell === 1 && drawCell(x, y) // draw only the alive cells
                })
            })
        }
return {
    drawCell,
    renderGrid,
    update,
    init
}
    })()


