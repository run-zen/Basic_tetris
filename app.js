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

    const thetetromino = [jtetromino,stetromino,itetromino,ztetromino,ltetromino,ttetromino,otetromino];
    let currentPosition = 8;
    let currentRotation = 0;

    let random = Math.floor(Math.random() * 7);

    let current = thetetromino[random][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }
    
    
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    let timerId = setInterval(moveDown,600);

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));

            // start new tetromino
            random = Math.floor(Math.random() * 7);
            current = thetetromino[random][currentRotation];
            currentPosition = Math.floor(Math.random() * 17);
            draw();
        }
    }
})
