document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const grid  = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const displayScore = document.querySelector('#score');
    const startBtn = document.querySelector('#start-game');
    const newGameBtn = document.querySelector('#new-game');
    const upNextSquares = Array.from(document.querySelectorAll('.upNext div'));
    let score = 0;
    let timerId = null;

    const jtetromino = [
        [1,width+1,width*2+1,width*2],
        [0,width,width+1,width+2],
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2]
    ];

    const stetromino = [
        [1, 2,width,width +1],
        [0,width,width+1,width*2+1],
        [1, 2,width,width +1],
        [0,width,width+1,width*2+1],
    ];

    const itetromino = [
        [0,width,width*2,width*3],
        [0, 1, 2, 3],
        [0,width,width*2,width*3],
        [0, 1, 2, 3],
    ];

    const ztetromino = [
        [0, 1,width +1,width +2],
        [1,width+1,width,width*2],
        [0, 1,width +1,width +2],
        [1,width+1,width,width*2]
    ];

    const ltetromino = [
        [1,width+1,width*2+1,width*2+2],
        [width,width+1,width+2,width*2],
        [0,1,width+1,width*2+1],
        [width,width+1,width+2,2]
    ];

    const ttetromino = [
        [0, 1, 2,width+1],
        [width,width+1,1,width*2+1],
        [width,width+1,1,width+2],
        [width*2+1,width+1,1,width+2]
    ];

    const otetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const colors = ['red','green','blue','brown','yellow','orange','purple']

    const thetetromino = [jtetromino,stetromino,itetromino,ztetromino,ltetromino,ttetromino,otetromino];
    let currentPosition = 4;
    let nextRotation = 0;
    let currentRotation = 0;
    let nextposition = 1;

    let prev = Math.floor(Math.random() * 7);
    let random = Math.floor(Math.random() * 7);
    let randomColor = Math.floor(Math.random() * 7);
    let prevColor  = Math.floor(Math.random() * 7);

    let current = thetetromino[random][currentRotation];
    let next = thetetromino[prev][nextRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add(colors[randomColor]);
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove(colors[randomColor]);
        })
    }
    
    function drawNext() {
        next.forEach(index => {
            let m = index%width;
            let n = (index- m)/width;
            index = index - n*width + (n+1)*6;
            upNextSquares[nextposition +index].classList.add(colors[prevColor]);
        })
    }


    function undrawNext() {
        next.forEach(index => {
            let m = index%width;
            let n = (index- m)/width;
            index = index - n*width + (n+1)*6;
            upNextSquares[nextposition + index].classList.remove(colors[prevColor]);
        })
    }

    function moveDown() {
        freeze();
        undraw();
        currentPosition += width;
        draw();
    }


    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        }
        else if(e.keyCode === 38) {
            rotate();
        } 
        else if(e.keyCode === 39) {
            moveRight();
        }
        else if(e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keydown',control);

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));

            // start new tetromino
            undrawNext();
            random = prev;
            prev = Math.floor(Math.random() * 7);
            randomColor = prevColor;
            prevColor = Math.floor(Math.random()*7);
            currentRotation = nextRotation;
            nextRotation = Math.floor(Math.random() * 4)
            next = thetetromino[prev][nextRotation];
            current = thetetromino[random][currentRotation];
            currentPosition = 4;
            gameOver();
            draw();
            drawNext();
            addScore();
        }
    }

    function moveLeft() {
        undraw();

        const isAtRightEdge = current.some(index => (currentPosition + index)%width === 0);

        if(!isAtRightEdge)
            currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }
    function moveRight() {
        undraw();

        const isAtLeftEdge = current.some(index => (currentPosition + index)%width === width-1);

        if(!isAtLeftEdge)
            currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        let temp = thetetromino[random][(currentRotation+1)%4];
        
        let isRotatable = temp.some(index => squares[currentPosition + index].classList.contains('taken'));
        let rightBreak,leftBreak, move = 0;
        console.log({current, currentPosition})
        if(current.some(index => (currentPosition+index)%width > 7)) {
            rightBreak = temp.some(index => (currentPosition+index)%width < 3);
            while(rightBreak) {
                move--;
                rightBreak = temp.some(index => (currentPosition+index + move)%width < 3);
            }
        }
        else if(current.some(index => (currentPosition+index)%width < 2)){
            leftBreak = temp.some(index => (currentPosition+index)%width > 6);
            while(leftBreak) {
                move++;
                leftBreak = temp.some(index => (currentPosition+index + move)%width > 6);
            }
        }

        

        if(!isRotatable) {
            undraw();
            currentPosition += move
            currentRotation = (currentRotation+1)%4;
            current = thetetromino[random][currentRotation];
            draw();
        }
    }

    function startGame() {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        else {
            draw();
            timerId = setInterval(moveDown, 800);
            drawNext();
        }
    }

    startBtn.addEventListener('click', startGame)   

    newGameBtn.addEventListener('click', () => {
        window.location.reload('refresh');
    })

    function addScore() {
        for(let i=0;i<150;i+= width) {
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                displayScore.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove(...colors);
                })
                const removedSquares = squares.splice(i,width);
                squares = removedSquares.concat(squares);
                squares.forEach(cell => grid.append(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            clearInterval(timerId);
            current = null;
            playMusic();
            alert("Game Over! \nYou scored : " + score);

        }
    }
    //music
    let myMusic = new Audio('music/theme.mp3');
    const musicBtn = document.querySelector('#musicBtn');
    let playing = false;
    myMusic.loop = true;
    musicBtn.innerHTML = "Music Off";
    function playMusic() {
        if(playing) {
            myMusic.pause();
            playing = !playing;
            musicBtn.innerHTML = "Music Off";
        }
        else {
            myMusic.play();
            myMusic.loop = true;
            playing = !playing;
            musicBtn.innerHTML = "Music On";
        }
    }

    musicBtn.addEventListener('click', playMusic);
})
