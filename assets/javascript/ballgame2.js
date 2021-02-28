const limitInterval = 500;
const ball = document.getElementById("ball");
const espace = document.getElementById("escape");
const time = document.getElementById("time");
const description = document.getElementById("description");
ball.style.left = '100px';
ball.style.top = '250px';

let ballRadius = parseInt(getComputedStyle(ball).width) / 2;
let count = 0;
let currTime = Date.now();
let prevTime = 0;

const handler = (event) => {
    const ballRect = ball.getBoundingClientRect();
    let ballX = (ballRect.left + ballRect.right) / 2;
    let ballY = (ballRect.top + ballRect.bottom) / 2;
    let distance = Math.sqrt((ballX - event.clientX) ** 2 + (ballY - event.clientY) ** 2);

    if(distance <= ballRadius) {
        prevTime = currTime;
        currTime = Date.now();
        let timePass = currTime - prevTime;
        if(timePass < limitInterval && count % 4 === 0 && count !== 0) {
            description.textContent = "Congrats! You have caught the ball!"
            description.style.color = "red";
            document.removeEventListener('mousemove', handler);
            time.textContent = `Time: ${timePass}`;
            return;
        }
        count ++;
        espace.textContent = `Escape: ${count}`;
        time.textContent = `Time: ${timePass}`;
        let randomX = 150 + Math.floor(Math.random() * 500);
        let randomY = 200 + Math.floor(Math.random() * 300);
        ball.style.left = randomX + 'px';
        ball.style.top = randomY + 'px';
        if(count % 4 == 0) {
            ball.style.backgroundColor = 'red';
        } else {
            ball.style.backgroundColor = 'green';
        }

        console.log("current time = ", currTime);
        console.log("previous time = ", prevTime);
        
    }
};

document.addEventListener('mousemove', handler);


