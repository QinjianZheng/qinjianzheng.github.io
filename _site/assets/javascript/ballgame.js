const ball = document.getElementById("ball");

ball.style.left = '300px';
ball.style.top = '300px';


let cursorInBallOffsetX = 0;
let cursorInBallOffsetY = 0;

const onMouseMove = (event) => {
    event.preventDefault();
    ball.style.left = event.clientX - cursorInBallOffsetX + 'px';
    ball.style.top = event.clientY - cursorInBallOffsetY + 'px';
};
  
ball.addEventListener('mousedown', (event) => {
    document.addEventListener('mousemove', onMouseMove);
    const ballRect = ball.getBoundingClientRect();
    cursorInBallOffsetX = event.clientX - ballRect.left;
    cursorInBallOffsetY = event.clientY - ballRect.top;
});
  
ball.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
});
  