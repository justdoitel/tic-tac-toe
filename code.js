document.getElementById("start-btn").addEventListener("click",()=>{
    document.getElementById("intro").classList.add("hide");
    document.getElementById("game").classList.remove("hide");
})

const gameBoard = (()=> {
    const boardArray= [[0,0,0],[0,0,0],[0,0,0]];
    const miniBox = document.getElementsByClassName("mini-box");
    const array = (i,j)=>{
        return boardArray[i][j];
    }
   
    const put = (r,c,z)=>{
        if (boardArray[r][c]!=0) return false;
        boardArray[r][c] = z;
        miniBox[(r*3)+c].textContent = z;
        miniBox[(r*3)+c].classList.add("clicked")
        return true;
    }
    const clear = () => {
        for (let i=0;i<boardArray.length;i++){
            for (let j=0;j<boardArray[i].length;j++){
                boardArray[i][j] = 0;
                miniBox[(i*3)+j].textContent = "";
                miniBox[(i*3)+j].classList.remove("clicked")
            }
        }
        return true;
    }
    return {array,put,clear}
})();

const player = ((letter,playerNumber)=>{
    let winCount = 0;
    let z = letter;
    let number = playerNumber;
    function won(){
        winCount++;
        document.querySelectorAll("#game h2")[number-1].childNodes[1].textContent = winCount;
    }
    function getWinCount(){
        return winCount;
    }
    function getLetter(){
        return z;
    }
    function getNumber(){
        return number;
    }
    function drawOn (r,c){
        return gameBoard.put(r,c,z);
    }
    return {getNumber,getLetter,getWinCount,won,drawOn}
})

const displayBoard = (()=>{
    const playerOne = document.querySelectorAll("#game h2")[0];
    const playerTwo = document.querySelectorAll("#game h2")[1];
    
    function getCurrentPlayer(){
        return currentPlayer;
    }
    
    function setCurrentPlayer(number){
        if (number==1){
            currentPlayer=1;
            playerOne.classList.add("current")
            playerTwo.classList.remove("current")
        } else {
            currentPlayer=2;
            playerTwo.classList.add("current")
            playerOne.classList.remove("current")
        }
    }

    function overlay(title,message,time){
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const overlayContent = document.createElement('div');
        overlayContent.classList.add('overlay-content');

        const h2 = document.createElement('h2');
        h2.textContent = title;
        overlayContent.appendChild(h2);

        const p = document.createElement('p');
        p.textContent =  message;
        overlayContent.appendChild(p);

        if(!time){
        const replaybtn = document.createElement('button');
        replaybtn.textContent = 'Replay';
        replaybtn.onclick = replay;
        overlayContent.appendChild(replaybtn);
        }

        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        if(time){
            setTimeout(() => {
                hideOverlay()
            }, time);
        }
    }

    function hideOverlay() {
        const overlay = document.querySelector('.overlay');
        if(overlay){
            overlay.classList.remove('active');
            setTimeout(() => {
            overlay.remove();
            }, 300); 
            }
        }
        return {getCurrentPlayer,setCurrentPlayer,overlay,hideOverlay};
})();


    let playerOne;
    let playerTwo;
    let roundcount;
    replay();

    function check() { //If game is over, it returns roundend(winningLetter)
        for (let r = 0; r < 3; r++) {
            if (gameBoard.array(r,0) !== 0 && gameBoard.array(r,0) === gameBoard.array(r,1) && gameBoard.array(r,1) === gameBoard.array(r,2)) {
                return roundend(gameBoard.array(r,0)); 
            }
        }
    
        for (let c = 0; c < 3; c++) {
            if (gameBoard.array(0,c) !== 0 && gameBoard.array(0,c) === gameBoard.array(1,c) && gameBoard.array(1,c) === gameBoard.array(2,c)) {
                return roundend(gameBoard.array(0,c)); 
            }
        }
    
        if (gameBoard.array(0,0) !== 0 && gameBoard.array(0,0) === gameBoard.array(1,1) && gameBoard.array(1,1) === gameBoard.array(2,2)) {
            return roundend(gameBoard.array(0,0)); 
        }
        
        if (gameBoard.array(0,2) !== 0 && gameBoard.array(0,2) === gameBoard.array(1,1) && gameBoard.array(1,1) === gameBoard.array(2,0)) {
            return roundend(gameBoard.array(0,2)); 
        }
        
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (gameBoard.array(r,c) === 0) {
                    return;
                }
            }
        }
        
        return roundend("draw");
        
    }

    function roundend(winner){
        roundcount++;
        if(winner===playerOne.getLetter()){
            playerOne.won();
            displayBoard.setCurrentPlayer(1);
            gameBoard.clear();
        } else if (winner===playerTwo.getLetter()){
            playerTwo.won();
            displayBoard.setCurrentPlayer(2)
            gameBoard.clear();
        }
        if(playerOne.getWinCount()-playerTwo.getWinCount()===3&&roundcount!=6){
            displayBoard.overlay("Winner","Player one won since playing the next "+(6-roundcount)+" won't change a thing")
            return;
        } else if (playerTwo.getWinCount()-playerOne.getWinCount()===3&&roundcount!=6){
            displayBoard.overlay("Winner","Player two won since playing the next "+(6-roundcount)+" won't change a thing")
            return;
        }

        if(roundcount===6){
            if(playerOne.getWinCount()>playerTwo.getWinCount()){
                displayBoard.overlay("Winner","Player one won")
            } else if (playerOne.getWinCount()<playerTwo.getWinCount()){
                displayBoard.overlay("Winner","Player two won")
            } else {
                displayBoard.overlay("Stalemate","It's a tie")
            }
        } 
        // else if (winner==="draw") { 
        //     displayBoard.overlay("DRAW","It's a draw",800)
        //     setTimeout(() => {
        //         gameBoard.clear()
        //       }, 1000); 
        // } 
    }

    
    for (let box of document.getElementsByClassName("mini-box")){
        box.addEventListener("click",(evt)=>{
            console.log(evt)
            let i = evt.currentTarget.dataset.id;
            if(displayBoard.getCurrentPlayer()==1){
                if(playerOne.drawOn(Math.trunc(i/3),i%3)) displayBoard.setCurrentPlayer(2);
            } else {
                if(playerTwo.drawOn(Math.trunc(i/3),i%3)) displayBoard.setCurrentPlayer(1);
            }
            check ();
        })
    }

    
    function replay(){
        document.querySelectorAll("#game h2")[0].childNodes[1].textContent = "0";
        document.querySelectorAll("#game h2")[1].childNodes[1].textContent = "0";
        roundcount = 1;
        playerOne = player("X",1)
        playerTwo = player("O",2)
        displayBoard.setCurrentPlayer(1);
        displayBoard.hideOverlay();
        gameBoard.clear();
    }
















