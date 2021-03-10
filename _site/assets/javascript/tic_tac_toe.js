const turn = document.getElementById("turn");
const board = document.getElementById("board");
const startBox = document.getElementById("start-box");
const startButton = document.getElementById("start-button");
const nameInput1 = document.getElementById("name-input1");
const nameInput2 = document.getElementById("name-input2");
const firstRadioButtons = document.querySelectorAll("input[name=first]");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
let selectValue = "";

let player1 = false;
let player1win = false;
let player2win = false;
let player1Score = 0;
let player2Score = 0;

const radioButtonCheck = () => {

    for (const rb of firstRadioButtons) {
        if (rb.checked) {
            selectValue = rb.value;
            break;
        }
    }
    return selectValue;
};



startButton.addEventListener("click", () => {
    startBox.style.display = "none";
    turn.style.display = "block";
    turn.innerText = `Turn: ${(selectValue === "player1" ? nameInput1.value : nameInput2.value)}`
    player1 = (selectValue === "player1" ? false : true);
    board.style.display = "grid";
    score1.style.display = "block";
    score2.style.display = "block";
    score1.innerText = `${nameInput1.value} Score: ${player1Score}`;
    score2.innerText = `${nameInput2.value} Score: ${player2Score}`;
});


const startButtonCheck = () => {
    if(nameInput1.value !== "" && 
        nameInput2.value !== "" && 
          radioButtonCheck() !== "") {
              startButton.removeAttribute("disabled");
    } else {
        startButton.setAttribute("disabled", "");
    }
    
};


nameInput1.addEventListener("keyup", startButtonCheck);
nameInput2.addEventListener("keyup", startButtonCheck);
firstRadioButtons.forEach(item => {
    item.addEventListener("click", startButtonCheck)});



const changeTurn = () => {
    if(player1) {
        player = `${nameInput1.value}`;
    } else {
        player = `${nameInput2.value}`;
    }
    player1 = !player1;
    turn.innerText = `Turn: ${player}`;
};

const blanks = new Array(3);

for(var i = 0; i < blanks.length; i++) {
    blanks[i] = new Array(3);
}

const checkWin = (blanks, row, col) => {
    var OCount;
    var XCount;
    // row check
    for(var i = 0; i < row; i++) {
        OCount = 0;
        XCount = 0;
        for(var j = 0; j < col; j++) {
            if(blanks[i][j].innerText === "O") {
                OCount++;
            } else if(blanks[i][j].innerText === "X") {
                XCount++;
            }
        }
        if(OCount === 3) {
            player1win = true;
            return;
        } 
        if(XCount === 3) {
            player2win = true;
            return;
        }
    }
    // col check
    for(var j = 0; j < col; j++) {
        OCount = 0;
        XCount = 0;
        for(var i = 0; i < row; i++) {
            if(blanks[i][j].innerText === "O") {
                OCount++;
            } else if(blanks[i][j].innerText === "X") {
                XCount++;
            }
        }
        if(OCount === 3) {
            player1win = true;
            return;
        } 
        if(XCount === 3) {
            player2win = true;
            return;
        }
    }
    // diagonal check

    OCount = 0;
    XCount = 0;
    for(var i = 0; i < row; i++) {
        if(blanks[i][i].innerText === "O") {
            OCount++;
        } else if(blanks[i][i].innerText === "X") {
            XCount++;
        }
    }
    if(OCount === 3) {
        player1win = true;
        return;
    } 
    if(XCount === 3) {
        player2win = true;
        return;
    }
    OCount = 0;
    XCount = 0;
    for(var i = 0; i < row; i++) {
        if(blanks[i][row-i-1].innerText === "O") {
            OCount++;
        } else if(blanks[i][row-i-1].innerText === "X") {
            XCount++;
        }
    }
    if(OCount === 3) {
        player1win = true;
        return;
    } 
    if(XCount === 3) {
        player2win = true;
        return;
    }
}

const checkFull = (blanks, row, col) => {
    var count = 0;
    for(var i = 0; i < row; i++) {
        for(var j = 0; j < col; j++) {
            if(blanks[i][j].innerText !== "") {
                count ++;
            }
        }
    }
    if(count === 9) {
        return true;
    } else {
        return false;
    }
}

const reset = (box, blanks, nrow, ncol) => {
    box.style.display = "none";
    turn.innerText = `Turn: ${nameInput1.value}`;
    player1 = false;
    player1win = false;
    player2win = false;
    blanks.forEach(item => {
        item.forEach(blank => {
            console.log(blank);
            blank.innerText = "";
            blank.style.color = "black";
            blank.style.fontSize = "90pt";
            blank.removeAttribute("cleanup");
            blank.addEventListener("click", function load(event) {
                event.target.removeEventListener("click", load, true);
                clickHandler(event, blanks, nrow, ncol, load);   
            }, true);
        })
    });
    document.body.removeChild(box);
};


const MessageBox = (text, blanks,nrow, ncol) => {
    const box = document.createElement('div');
    box.classList.add("centered", "message-box");

    const message = document.createElement('div');
    message.className = "message-content";
    message.innerText = text;
    box.appendChild(message);

    const restartButton = document.createElement('button');
    restartButton.className = "restart-button";
    restartButton.innerText = "Restart";
    restartButton.addEventListener("click", () => {
        reset(box, blanks, nrow, ncol);
    });
    box.appendChild(restartButton);
    document.body.appendChild(box);
}

const cleanup = (blanks, nrow, ncol) => {
    for(var i = 0; i < nrow; i++) {
        for(var j = 0; j < ncol; j++) {
            if(blanks[i][j].innerText === "") {
                blanks[i][j].innerText = "😊";
                blanks[i][j].style.color = "#61dafb";
                blanks[i][j].style.fontSize = "80pt";
            }
        }
    }
};


const clickHandler = (event, blanks, nrow, ncol, handler) => {
    if(!event.target.innerText) {
        if(player1) {
            event.target.innerText = "X";
        } else {
            event.target.innerText = "O";
        }
        
        console.log(event.target);
        checkWin(blanks, nrow, ncol);
        if(player1win) {
            MessageBox(`${nameInput1.value} wins!`,blanks, nrow, ncol);
            cleanup(blanks, nrow, ncol);
            player1Score++;
            score1.innerText = `${nameInput1.value} Score: ${player1Score}`;
            
            
        } else if(player2win) {
            MessageBox(`${nameInput2.value} wins!`,blanks, nrow, ncol);
            cleanup(blanks, nrow, ncol);
            player2Score++;
            score2.innerText = `${nameInput2.value} Score: ${player2Score}`;

        } else {
            if(checkFull(blanks, nrow, ncol)) {
                MessageBox("Draw",blanks, nrow, ncol);
                cleanup(blanks, nrow, ncol);
            } else {
                changeTurn();
            }
        }
        
    }
};



for (let i = 0; i < blanks.length; i++) {
    for(let j = 0; j < blanks[i].length; j++) {
        blanks[i][j] = document.createElement("div");
        blanks[i][j].className = "blank";
        blanks[i][j].id = `blank${i}.${j}`;
        board.appendChild(blanks[i][j]);
        blanks[i][j].addEventListener("click", function load(event) {
            event.target.removeEventListener("click", load, true);
            clickHandler(event, blanks, blanks.length, blanks[0].length, load);   
        }, true);
    }
}

