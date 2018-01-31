const game = (function(){
"use strict";

    let grid = [
        [1,0,0],
        [0,1,1],
        [0,0,1]
    
    ]

function init(){
    const renderNextBtn = document.querySelector('.controls__next');
    renderNextBtn.addEventListener('click', (e) => renderGrid() )

    renderGrid();
}

    function applyRules(i, j, cell) {
        const alive = cell === 1 ? true : false;
        const nLength = listNeighbours(i, j)
    
        let result = cell;
        // console.log({i,j, cell, nLength})
        if(alive){
            if(nLength <= 1 || nLength >= 4){
                result = 0 //dead
            } else {
                result = 1;
            }  
        } else {
            if(nLength === 3){
                result = 1;
            }
        }
    return result;
    
    }

    function listNeighbours(i, j) {
        let neighbours = 0;
    
        const currentCellPos = { i, j }
    
        const rowAbove = i > 0;
        const rowBelow = i < grid.length -1;
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

    const updateGrid = () => {
        grid = grid.map((row, i) => {
            return row.map((cell, j) => {
                return applyRules(i, j, cell)
            })
        })
        }
        
    const renderGrid = () => {
        const gridContainer = document.querySelector('.gridContainer');
        // gridContainer.innerHTML = "";
        // ==> array
        const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext('2d');
        const w = 20
        const h = 20
        ctx.clearRect(0,0,60,60) // clear canvas each render
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                ctx.beginPath()
                ctx.rect(x*20,y*20,w,h)
            ctx.fillStyle = cell == 1 ? 'yellow' : 'grey'
            ctx.fill();
            ctx.closePath()
            })
        })
        updateGrid();
    }
init();

return {
    play: renderGrid
}
})()