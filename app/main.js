const game = (function () {
    "use strict";

    let initialGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    ]

    const SETTINGS = {
        GRID_WIDTH: initialGrid[0].length,
        GRID_HEIGHT: initialGrid.length,
        CELL_SIZE: 25,
        CANVAS_HEIGHT: 600,
        CANVAS_WIDTH: 600,
        CELL_ALIVE_COLOUR: 'yellow',
        CELL_DEAD_COLOUR: 'grey',
        REFRESH_RATE: 500
    }

    const init = () => {
        
        const renderNextBtn = document.querySelector('.controls__next');
        renderNextBtn.addEventListener('click', () => grid.next())

        const playLoop = document.querySelector('.controls__play');
        playLoop.addEventListener('click', (e) =>  grid.loop())

        const canvasElement = document.querySelector('canvas')
        canvasElement.addEventListener('click', grid.handleClick);      
        canvas.renderGrid(initialGrid);
    }
    
    const grid = (() => {
        let timer = null;
        const loop = () => {
            const { REFRESH_RATE } = SETTINGS;
            if (timer != null) {
                clearInterval(timer)
                timer = null;
            } else {
                timer = setInterval(next, REFRESH_RATE)
            }
        }
        const next = (() => {
            let prevGrid = initialGrid;
            return (canvasEdit) => {
                prevGrid = canvasEdit ? edit(canvasEdit.y, canvasEdit.x, prevGrid) : nextGrid(prevGrid)
                canvas.renderGrid(prevGrid);
            }
        })()

        const edit = (y,x,grid) => {
            let newGrid = grid;
            newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1;
            return newGrid
        }

        const handleClick = (e) => {
            const x = Math.round( (e.offsetX +( 25/2)) /25 -1);
            const y = Math.round( (e.offsetY +( 25/2)) /25 -1);
            next({x,y})
        }

        return {
            loop,
            next,
            edit,
            handleClick
        }
    })()

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
        let neighbours = 0;

        if (isRowAbove) {
            grid[i - 1][j - 1] === 1 && isColLeft && neighbours++ // top left
            grid[i - 1][j + 1] === 1 && isColRight && neighbours++ // top right
            grid[i - 1][j] === 1 && neighbours++ // top
        }

        if (isRowBelow) {
            grid[i + 1][j - 1] === 1 && isColLeft && neighbours++// bottom left
            grid[i + 1][j] === 1 && neighbours++ // bottom
            grid[i + 1][j + 1] === 1 && isColRight && neighbours++ // bottom right
        }

        grid[i][j - 1] === 1 && neighbours++ // left
        grid[i][j + 1] === 1 && neighbours++ // right

        return neighbours;
    }

    const canvas = (() => {
        const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext('2d');
        const { CANVAS_HEIGHT, CANVAS_WIDTH, CELL_SIZE, CELL_ALIVE_COLOUR, CELL_DEAD_COLOUR } = SETTINGS;

        const clear = () => {
            ctx.beginPath()
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.fillStyle = CELL_DEAD_COLOUR
            ctx.fill()
            ctx.closePath()
        }

        // is called when canvas is clicked on
        const drawCell = (x, y, cell = 1) => { 
            ctx.beginPath()
            ctx.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = cell === 1 ? CELL_ALIVE_COLOUR : CELL_DEAD_COLOUR
            ctx.fill();
            ctx.closePath()
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
            clear,
            drawCell,
            renderGrid
        }
    })()

    // create next array with rules applied
    const nextGrid = (grid) => {
        return grid.map((row, y) => { // loop over rows
            return row.map((cell, x) => { // loop over cells in row
                return applyRulesToCell(y, x, cell, grid) // returns 1 || 0
            })
        })
    }

    init();

    return {
        next: grid.next,
        loop: grid.loop
    }
})()