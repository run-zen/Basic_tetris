document.addEventListener('DOMContentLoaded', () => {
    const width = 20;
    const grid  = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const displayScore = document.querySelector('#score');
    const startBtn = document.querySelector('#start-game');
    console.log(width, squares); 
    
    const jtetromino = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [0,width,width+1,width+2]
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
        [width,width+1,width+2,2],
        [1,2,width+2,width*2+2],
        [width,width+1,width+2,width*2]
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
    let currentRotation = 0;

    let random = Math.floor(Math.random() * 7);
    let randomColor = Math.floor(Math.random() * 7);


    let current = thetetromino[random][currentRotation];

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
    
    
    function moveDown() {
        freeze();
        undraw();
        currentPosition += width;
        draw();
    }

    let timerId = setInterval(moveDown,700);

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
            random = Math.floor(Math.random() * 7);
            randomColor = Math.floor(Math.random()*7);
            current = thetetromino[random][currentRotation];
            currentPosition = Math.floor(Math.random() * 17);
            draw();
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

        if(!isRotatable) {
            undraw();
            currentRotation = (currentRotation+1)%4;
            current = thetetromino[random][currentRotation];
            draw();
        }
    }
})
