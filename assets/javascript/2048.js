const board = document.getElementById("board");
const score = document.getElementById("score");
const winOverlay = document.getElementsByClassName('win');
winOverlay[0].style.display = 'none';
const lostOverlay = document.getElementsByClassName('lost');
lostOverlay[0].style.display = 'none';
const blanks = new Array(4);
const buttons = document.getElementsByTagName('button');
for(var i = 0; i < blanks.length; i++) {
    blanks[i] = new Array(4);
}

const resetGame = () => {
    for (let i = 0; i < blanks.length; i++) {
        for(let j = 0; j < blanks[i].length; j++) {
            blanks[i][j].innerText = '';
            blanks[i][j].className = `blank empty`;
        }
    }
    winOverlay[0].style.display = 'none';
    lostOverlay[0].style.display = 'none';
    window.addEventListener("keydown", load);
    popRandom();
};

for (const button of buttons) {
    button.addEventListener('click', resetGame);
}

const popRandom = () => {
    const emptyBlankList = [];
    const value = (getRandomInt(10) < 9 ? 2 : 4);
    

    for (let i = 0; i < blanks.length; i++) {
        for(let j = 0; j < blanks[i].length; j++) {
            if (! blanks[i][j].innerText) {
                emptyBlankList.push({row: i, col: j});
            }
        }
    }
    
    if (emptyBlankList.length) {
        const randomCell = emptyBlankList[getRandomInt(emptyBlankList.length - 1)];
        const i = randomCell.row;
        const j = randomCell.col;
        blanks[i][j].innerText = `${value}`;
        blanks[i][j].className = `blank style-${value}`;
        placed = true;
    }

        
}



const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.ceil(max));
}


for (let i = 0; i < blanks.length; i++) {
    for(let j = 0; j < blanks[i].length; j++) {
        blanks[i][j] = document.createElement("div");
        blanks[i][j].className = 'blank empty';
        blanks[i][j].id = `blank${i}.${j}`;
        board.appendChild(blanks[i][j]);
        blanks[i][j].click();
        
    }
}

if(getRandomInt(10) < 6) {
    popRandom();
    popRandom()
} else {
    popRandom();
}
const gameWon = () => 
{
    for(let i = 0; i < blanks.length; i++) {
        for(let j = 0; j < blanks[0].length; j++) {
            if(blanks[i][j].innerText === '2048') {
                return true;
            }
        }
    }
    return false;
}
const gameOver = () => {
    for(let i = 0; i < blanks.length; i++) {
        for(let j = 0; j < blanks.length; j++) {
            
            if(blanks[i][j].innerText === "") {
                console.log(i,j, 'is empty');
                return false;
            }
        }
    }
    for(let i = 0; i < blanks.length; i++) {
        for(let j = 0; j < blanks[0].length - 1; j++) {
            if (blanks[i][j].innerText === blanks[i][j + 1].innerText) {
                console.log(i,j, 'is the same as', i, j+1);
                return false;
            }
            if (blanks[j][i].innerText === blanks[j + 1][i].innerText) {
                console.log(j,i, 'is the same as', j+1, i);
                return false;
            }
        }
    }
    return true;
}

const keyHandler = (event) => {
    // event.preventDefault();
    // pop out a random block
    // slide to the sides
    switch (event.key) {
        case "ArrowUp":
            moveAll("UP");
            break;
        case "ArrowDown":
            moveAll("DOWN");
            break;
        case "ArrowLeft":
            moveAll("LEFT");
            break;
        case "ArrowRight":
            moveAll("RIGHT");
            break;
        default:
            break;
    }
}

const load = (event) => {
    keyHandler(event);
    if (gameWon()) {
        winOverlay[0].style.display = 'flex';
        window.removeEventListener("keydown", load);
    }
    if(gameOver()) {
        lostOverlay[0].style.display = 'flex';
        window.removeEventListener("keydown", load);
    }
}

window.addEventListener("keydown", load);
    

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}

const isInMergedList = (mergedList, id) => {
    mergedList.forEach(item => {
        if(item.id === id && item.merged === true) {
            return true;
        }
    })
    return false;
}

let scoreInt = 0;

/*
    if UP or DOWN, nextCol is equal to col
    if LEFT or RIGHT, nextRow is equal to row
*/
const moveOneCell = (row, nextRow, col, nextCol, mergedList) => {
    if(blanks[row][col].innerText) {
        if(blanks[nextRow][nextCol].innerText === "") {
            blanks[nextRow][nextCol].innerText = blanks[row][col].innerText;
            blanks[nextRow][nextCol].className = `blank style-${blanks[nextRow][nextCol].innerText}`;
            blanks[row][col].innerText = "";
            blanks[row][col].className = 'blank empty';
        } else if(blanks[row][col].innerText === blanks[nextRow][nextCol].innerText && 
                  !isInMergedList(mergedList, blanks[row][col].innerText)) {
            blanks[nextRow][nextCol].innerText = (parseInt(blanks[row][col].innerText) * 2).toString();
            blanks[nextRow][nextCol].className = `blank style-${blanks[nextRow][nextCol].innerText}`;
            scoreInt += parseInt(blanks[nextRow][nextCol].innerText);
            score.innerText = `Score: ${scoreInt}`;
            let ismerged = {id: blanks[row][col].innerText, merged: true};
            mergedList.push(ismerged);
            blanks[row][col].innerText = "";
            blanks[row][col].className = 'blank empty';
        } 
    } 
}

const move = (direction, v) => {
    return new Promise( (resolve, reject) => {
        let mergedList = [];
        if(direction === "UP" || direction === "LEFT") {
            for(let i = 1; i < blanks.length; i++) {
                let j = i
                while(j > 0) {
                    if(direction === "UP") {
                        moveOneCell(j, j-1, v, v, mergedList);
                    } else {
                        moveOneCell(v, v, j, j-1, mergedList);
                    }
                    j--;
                }
            }
        } else if(direction === "DOWN" || direction === "RIGHT") {
            for(let i = blanks.length - 2; i >= 0; i--) {
                let j = i
                while(j < blanks.length - 1) {
                    if(direction === "DOWN") {
                        moveOneCell(j, j+1, v, v, mergedList);
                    } else {
                        moveOneCell(v, v, j, j+1, mergedList);
                    }
                    j++;
                }
            }
        }
        resolve();
    });
};

const moveAll = (direction) => {
    Promise.all([
        move(direction, 0),
        move(direction, 1),
        move(direction, 2),
        move(direction, 3)
    ]).then(() => {
        popRandom();
    })
};
