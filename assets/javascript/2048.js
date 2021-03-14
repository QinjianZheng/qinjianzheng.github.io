const board = document.getElementById("board");

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

window.addEventListener("keydown", (event) => {
    event.preventDefault();
    // pop out a random block

    // slide to the sides

    switch (event.key) {
        case "ArrowUp":
            console.log("1");
            break;
        case "ArrowDown":
            console.log("down");
            break;
        case "ArrowLeft":
            break;
        case "ArrowRight":
            break;
        default:
            break;
    }

    popRandom();

});