import SETTINGS from './settings';

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
    const back = grid[i - 1], next = grid[i + 1], h = j - 1, k = j + 1;

    const neighbours = ((back && back[h]) || 0)
        + ((back && back[j]) || 0)
        + ((back && back[k]) || 0)
        + (grid[i][h] || 0)
        + (grid[i][k] || 0)
        + ((next && next[h]) || 0)
        + ((next && next[j]) || 0)
        + ((next && next[k]) || 0);
    return neighbours;
}

export const canvas = ((c) => {
    var ctx = null;

    const init = () => {
        ctx = document.querySelector('.grid').getContext('2d');
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
        console.log('rendering grid...');
        console.log(grid)
        clear() // clear canvas between redraws
        return grid.forEach((row, y) => { // loop over rows
            return row.forEach((cell, x) => { // loop over cells in row
                cell === 1 && drawCell(x, y) // draw only the alive cells
            })
        })
    }
    // public
    return {
        drawCell,
        renderGrid,
        update,
        init
    }
})()


