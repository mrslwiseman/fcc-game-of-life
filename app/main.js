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
    const CONFIG = {
        CELL_SIZE: 20,
        CANVAS_HEIGHT: 400,
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
        control.next();
    }

    const control = (() => {
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
        const next = () => { grid = nextGrid() }

        return {
            loop,
            next
        }
    })()


    const applyRulesToCell = (y, x, cell) => {
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

    const countNeighbours = (i, j) => {
        let neighbours = 0;
        const isRowAbove = i > 0;
        const isRowBelow = i < grid.length - 1;
        const isColLeft = j > 0;
        const isColRight = j < grid[0].length;

        if (isRowAbove) {
            grid[i - 1][j - 1] === 1 && isColLeft && neighbours++ // top left
            grid[i - 1][j + 1] === 1 && isColRight && neighbours++ // top right
            grid[i - 1][j] === 1 && neighbours++ // top
        }

        if (isRowBelow) {
            grid[i + 1][j - 1] && isColLeft && neighbours++// bottom left
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
        next: control.next,
        loop: control.loop
    }
})()