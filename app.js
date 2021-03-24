document.addEventListener('DOMContentLoaded', () => {
    const width = 20;
    const grid  = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const displayScore = document.querySelector('#score');
    const startBtn = document.querySelector('#start-game');
    const upNextSquares = Array.from(document.querySelectorAll('.upNext div'));

    const jtetromino = [
        [1,width+1,width*2+1,width*2],
        [0,width,width+1,width+2],
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2]
    ];

    const stetromino = [
        [width+1,width+2,width*2,width*2+1],
        [1,width+1,width+2,width*2+2],
        [width+1,width+2,width*2,width*2+1],
        [1,width+1,width+2,width*2+2]
    ];

    const itetromino = [
        [2,width+2,width*2+2,width*3+2],
        [width*2,width*2+1,width*2+2,width*2+3],
        [2,width+2,width*2+2,width*3+2],
        [width*2,width*2+1,width*2+2,width*2+3]
    ];

    const ztetromino = [
        [width,width+1,width*2+1,width*2+2],
        [1,width+1,width,width*2],
        [width,width+1,width*2+1,width*2+2],
        [1,width+1,width,width*2]
    ];

    const ltetromino = [
        [1,width+1,width*2+1,width*2+2],
        [width,width+1,width+2,width*2],
        [0,1,width+1,width*2+1],
        [width,width+1,width+2,2]
    ];

    const ttetromino = [
        [width,width+1,width+2,width*2+1],
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
    let currentPosition = 8;
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

    drawNext();

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

    let timerId = setInterval(moveDown,800);

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
            currentPosition = 8;
            console.log(prevColor,randomColor);
            draw();
            drawNext();
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
        if(current.some(index => (currentPosition+index)%width > 17)) {
            rightBreak = temp.some(index => (currentPosition+index)%width < 13);
            while(rightBreak) {
                move--;
                rightBreak = temp.some(index => (currentPosition+index + move)%width < 13);
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
})
