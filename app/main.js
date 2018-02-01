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
    // let grid = [
    //     [0,0,0],
    //     [0,1,0],
    //     [0,0,0]
    // ]
    const CONFIG = {
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
        renderNextBtn.addEventListener('click', (e) => { control.next() })
        const playLoop = document.querySelector('.controls__play');
        playLoop.addEventListener('click', (e) => { control.loop() })
        const canvasElement = document.querySelector('canvas')
        canvasElement.addEventListener('click', canvas.onClick);      
        renderGrid(initialGrid);
    }

    const nextgrid = function() {
        let prevGrid = initialGrid;
        return function() {
            prevGrid = nextGrid(prevGrid)
            renderGrid(prevGrid);
        }
    }
    
    
    const control = (() => {
        const next = nextgrid()
        let timer = null;
        const loop = () => {
            const { REFRESH_RATE } = CONFIG;
            if (timer != null) {
                clearInterval(timer)
                timer = null;
            } else {
                timer = setInterval(control.next, REFRESH_RATE)
            }
        }
        return {
            loop,
            next
        }
    })()

    

    const applyRulesToCell = (y, x, cell, grid) => {
        const alive = cell === 1 ? true : false;
        const neighboursCount = countNeighbours(y, x, grid) // returns a number of neighbours
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

    const countNeighbours = (i, j, grid) => {
        const {GRID_HEIGHT, GRID_WIDTH} = CONFIG;
        let neighbours = 0;
        const isRowAbove = i > 0;
        const isRowBelow = i < GRID_HEIGHT - 1;
        const isColLeft = j > 0;
        const isColRight = j < GRID_WIDTH;

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
        const { CANVAS_HEIGHT, CANVAS_WIDTH, CELL_SIZE, CELL_ALIVE_COLOUR, CELL_DEAD_COLOUR } = CONFIG;

        const onClick = (e) => {
            // console.log('canvas clicked on');
            // console.dir(e);
            const x = Math.round( (e.offsetX +( 25/2)) /25 -1);
            const y = Math.round( (e.offsetY +( 25/2)) /25 -1);
            // edit the array
            console.log({y, x})
            console.log(grid[y][x] === 1)
            grid[y][x] = grid[y][x] === 1 ? 0 : 1;
            setTimeout(() => console.log(grid), 500)
            // draw the modifed cell
             drawCell(x,y, grid[y][x])

        }

        const clear = () => {
            ctx.beginPath()
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.fillStyle = CELL_DEAD_COLOUR
            ctx.fill()
            ctx.closePath()
        }

        const drawCell = (x, y, cell = 1) => {
            ctx.beginPath()
            ctx.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            ctx.fillStyle = cell === 1 ? CELL_ALIVE_COLOUR : CELL_DEAD_COLOUR
            ctx.fill();
            ctx.closePath()
        }
        return {
            clear,
            drawCell,
            onClick
        }
    })()

    const renderGrid = (grid) => {
        canvas.clear() // clear canvas between redraws
        return grid.forEach((row, y) => { // loop over rows
            return row.forEach((cell, x) => { // loop over cells in row
                cell === 1 && canvas.drawCell(x, y) // draw only the alive cells
            })
        })
    }

    const nextGrid = (grid) => {
        return grid.map((row, y) => { // loop over rows
            return row.map((cell, x) => { // loop over cells in row
                return applyRulesToCell(y, x, cell, grid) // returns 1 || 0
            })
        })
    }

    init();

    return {
        next: control.next,
        loop: control.loop
    }
})()