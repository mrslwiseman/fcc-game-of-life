const game = (function () {
    "use strict";

    let grid = [
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
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    ]

    const CELL_SIZE = 20;
    const CANVAS_HEIGHT = 400;
    const CANVAS_WIDTH = 600;
    const CELL_ALIVE_COLOUR = 'yellow'
    const CELL_DEAD_COLOUR = 'grey'

    function init() {
        const renderNextBtn = document.querySelector('.controls__next');
        renderNextBtn.addEventListener('click', (e) => { updateGrid() })
        updateGrid();
    }

    function updateGrid() {
        grid = nextGrid();
    }


    function applyRulesToCell(y, x, cell) {
        const alive = cell === 1 ? true : false;
        const neighboursCount = countNeighbours(y, x) // returns a number of neighbours
        let change = false;

        if (alive) {
            if (neighboursCount <= 1 || neighboursCount >= 4) {
                change = 0 // dead :(
            } 
        } else if (!alive && neighboursCount === 3) { 
            change = 1; // comes back to life :)
        }
        return change === false ? cell : change;

    }

    function countNeighbours(i, j) {
        let neighbours = 0;

        const currentCellPos = { i, j }

        const rowAbove = i > 0;
        const rowBelow = i < grid.length - 1;
        const colLeft = j > 0;
        const colRight = j < grid[0].length;

        // ROW ABOVE ------------------------------------

        if (rowAbove) {
            if (colLeft) {
                // topLeft alive?
                if (grid[i - 1][j - 1] === 1) {
                    neighbours++
                }
            }
            if (colRight) {
                // topRight?
                if (grid[i - 1][j + 1] === 1) {
                    neighbours++
                }
            }
            // top alive?
            if (grid[i - 1][j] === 1) {
                neighbours++
            }
        }

        // ROW BELOW ------------------------------------
        if (rowBelow) {
            if (colLeft) {
                // bottomLeft alive?
                if (grid[i + 1][j - 1] === 1) {
                    neighbours++
                }

            }
            if (colRight) {
                // bottomRight alive?
                if (grid[i + 1][j + 1] === 1) {
                    neighbours++
                }
            }
            // bottom alive?
            if (grid[i + 1][j] === 1) {
                neighbours++
            }

        }

        // LEFT AND RIGHT ------------------------------------
        if (colLeft) {
            // left alive?
            if (grid[i][j - 1] === 1) {
                neighbours++
            }

        }
        if (colRight) {
            // right alive?
            if (grid[i][j + 1] === 1) {
                neighbours++
            }

        }
        // return length of neighbour cells that are ALIVE
        return neighbours;
    }


    const canvas = (function () {
        const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext('2d');

        const clear = () => {
            ctx.beginPath()
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.fillStyle = CELL_DEAD_COLOUR
            ctx.fill()
            ctx.closePath()
        }

        const drawAliveCell = (x, y) => {
            ctx.beginPath()
            ctx.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = CELL_ALIVE_COLOUR
            ctx.fill();
            ctx.closePath()
        }
        return {
            clear,
            drawAliveCell
        }
    })()

    const nextGrid = () => {
        canvas.clear() // clear canvas between redraws
        return grid.map((row, y) => { // loop over rows
            return row.map((cell, x) => { // loop over cells in row
                cell === 1 && canvas.drawAliveCell(x, y) // draw only the alive cells
                return applyRulesToCell(y, x, cell) // returns 1 || 0
            })
        })
    }

    init();

    return {
        next: updateGrid
    }
})()