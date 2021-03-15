const board = document.getElementById("board");
const score = document.getElementById("score");
const blanks = new Array(4);

for(var i = 0; i < blanks.length; i++) {
    blanks[i] = new Array(4);
}



const popRandom = () => {
    const value = (getRandomInt(10) < 9 ? 2 : 4);
    let placed = false;
    while(!placed) {
        const i = getRandomInt(4);
        const j = getRandomInt(4);
        if(blanks[i][j].innerText === "") {
            blanks[i][j].innerText = `${value}`
            placed = true;
        }
    }
}







const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.ceil(max));
}


for (let i = 0; i < blanks.length; i++) {
    for(let j = 0; j < blanks[i].length; j++) {
        
        blanks[i][j] = document.createElement("div");
        blanks[i][j].className = "blank";
        blanks[i][j].id = `blank${i}.${j}`;
        // blanks[i][j].addEventListener("click", (event) => {
        //     event.target.innerText = ((i + j) ** 2).toString();
        //     const innerValue = Math.log2(parseInt(event.target.innerText, 10));
        //     console.log(innerValue);
        //     event.target.style.backgroundColor = `rgb(${innerValue * 20 + 100}, ${innerValue *50 + 60}, ${innerValue *30 + 90})`;
        // })
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


// const colorControl = (blank) => {
//     blank.style.backgroundColor = 
//     blank.innerText = "2"
// }

const gameOver = () => {
    for(let i = 0; i < blanks.length; i++) {
        for(let j = 0; j < blanks[0].length; j++) {
            if(blanks[i][j].innerText === "") {
                return false;
            }
        }
    }
    return true;
    // blanks.forEach(row => {
    //     row.forEach(blank => {
    //         if(blank.innerText === "") {
    //             return false;
    //         }
    //     })
    // })
    // return true;
}

const keyHandler = (event) => {
    event.preventDefault();
    // pop out a random block

    // slide to the sides

    switch (event.key) {
        case "ArrowUp":
            // demoUP().then(() => {
            //     popRandom();
            // });
            // await sleep(600);
            // popRandom();
            moveAll("UP");
            
            break;
        case "ArrowDown":
            // demoDOWN()
            // await sleep(600);
            // popRandom();
            moveAll("DOWN");
            break;
        case "ArrowLeft":
            // demoLEFT()
            // await sleep(600);
            // popRandom();
            moveAll("LEFT");
            break;
        case "ArrowRight":
            // demoRIGHT()
            // await sleep(600);
            // popRandom();
            moveAll("RIGHT");
            break;
        default:
            break;
    }

}


window.addEventListener("keydown", function load(event) {
    keyHandler(event);
    if(gameOver()) {
        alert("Game Over!");
        window.removeEventListener("keydown", load);
    }
});
    




const sleep = (ms) => {
    return new Promise((resolve) => {
        // console.log("hello");
        setTimeout(resolve, ms)
    });
}

// const sleepPromise = sleep(1000);

// sleepPromise.then(
//     ()=> {
//         console.log("world");
//     }
// );


// blanks[3][2].innerText = '2';
// blanks[3][0].innerText = '2';
// blanks[3][1].innerText = '2';
// blanks[3][3].innerText = '2';
// blanks[1][1].innerText = '4';
// let mergedList = [];
// let ismerged = {id: '2', merged: true};
// mergedList.push(ismerged);



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
const moveOneCell =  (row, nextRow, col, nextCol, mergedList) => {
    if(blanks[row][col].innerText) {
        if(blanks[nextRow][nextCol].innerText === "") {
            // await sleep(250);
            blanks[nextRow][nextCol].innerText = blanks[row][col].innerText;
            blanks[row][col].innerText = "";
        } else if(blanks[row][col].innerText === blanks[nextRow][nextCol].innerText && 
                  !isInMergedList(mergedList, blanks[row][col].innerText)) {
            // await sleep(250);
            blanks[nextRow][nextCol].innerText = (parseInt(blanks[row][col].innerText) * 2).toString();
            scoreInt += parseInt(blanks[nextRow][nextCol].innerText);
            score.innerText = `Score: ${scoreInt}`;
            let ismerged = {id: blanks[row][col].innerText, merged: true};
            mergedList.push(ismerged);
            blanks[row][col].innerText = "";
        }
        
        
    }
}

const move = async (direction, v) => {
    return new Promise( async (resolve, reject) => {
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
        // console.log("done")
    })
};



const demoUP = () => {
    return new Promise( async (resolve, reject) => {

        // do something in the promise
        for(let c = 0; c < blanks[0].length; c++) {
            let ismerged = false;
        
            for(let i = 1; i < blanks.length; i++) {
                // console.log(i);
                let j = i
                while(j > 0) {
                    if(blanks[j][c].innerText) {
                        if(blanks[j-1][c].innerText === "") {
                            await sleep(10);
                            blanks[j-1][c].innerText = blanks[j][c].innerText;
                            await sleep(10);
                            blanks[j][c].innerText = "";
                
                            // console.log(`blanks${j-1}.0 is empty!`);
                        } else if(blanks[j][c].innerText === blanks[j-1][c].innerText && !ismerged) {
                            await sleep(10);
                            blanks[j-1][c].innerText = (parseInt(blanks[j][c].innerText) * 2).toString();
                            await sleep(10);
                            blanks[j][c].innerText = "";
                            ismerged = true;
                        }
                    }
                    j--;
                }
                
    
            }
            // console.log("done");
        }
        resolve();

    })};


async function demoDOWN() {
    for(let c = 0; c < blanks[0].length; c++) {
        let ismerged = false;
    
        for(let i = blanks.length - 2; i >= 0; i--) {
            // console.log(i);
            let j = i
            while(j < blanks.length - 1) {
                if(blanks[j][c].innerText) {
                    if(blanks[j+1][c].innerText === "") {
                        await sleep(20);
                        blanks[j+1][c].innerText = blanks[j][c].innerText;
                        await sleep(20);
                        blanks[j][c].innerText = "";
            
                        // console.log(`blanks${j+1}.0 is empty!`);
                    } else if(blanks[j][c].innerText === blanks[j+1][c].innerText && !ismerged) {
                        await sleep(20);
                        blanks[j+1][c].innerText = (parseInt(blanks[j][c].innerText) * 2).toString();
                        await sleep(20);
                        blanks[j][c].innerText = "";
                        ismerged = true;
                    }
                }
                j++;
            }
            

        }
        // console.log("done");
    }
}

async function demoLEFT() {
    for(let r = 0; r < blanks.length; r++) {
        let ismerged = false;
    
        for(let i = 1; i < blanks[0].length; i++) {
            // console.log(i);
            let j = i
            while(j > 0) {
                if(blanks[r][j].innerText) {
                    if(blanks[r][j-1].innerText === "") {
                        await sleep(20);
                        blanks[r][j-1].innerText = blanks[r][j].innerText;
                        await sleep(20);
                        blanks[r][j].innerText = "";
            
                        // console.log(`blanks${r}.${j-1} is empty!`);
                    } else if(blanks[r][j].innerText === blanks[r][j-1].innerText && !ismerged) {
                        await sleep(20);
                        blanks[r][j-1].innerText = (parseInt(blanks[r][j].innerText) * 2).toString();
                        await sleep(20);
                        blanks[r][j].innerText = "";
                        ismerged = true;
                    }
                }
                j--;
            }
            

        }
        // console.log("done");
    }
}

async function demoRIGHT() {
    for(let r = 0; r < blanks.length; r++) {
        let ismerged = false;
    
        for(let i = blanks[0].length - 2; i >= 0; i--) {
            // console.log(i);
            let j = i
            while(j < blanks.length - 1) {
                if(blanks[r][j].innerText) {
                    if(blanks[r][j+1].innerText === "") {
                        await sleep(20);
                        blanks[r][j+1].innerText = blanks[r][j].innerText;
                        await sleep(20);
                        blanks[r][j].innerText = "";
            
                        // console.log(`blanks${j+1}.0 is empty!`);
                    } else if(blanks[r][j].innerText === blanks[r][j+1].innerText && !ismerged) {
                        await sleep(20);
                        blanks[r][j+1].innerText = (parseInt(blanks[r][j].innerText) * 2).toString();
                        await sleep(20);
                        blanks[r][j].innerText = "";
                        ismerged = true;
                    }
                }
                j++;
            }
            

        }
        // console.log("done");
    }
}



