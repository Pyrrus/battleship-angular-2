import { Square } from './square.model';

export class Game{
  public board = {};
  public attempts:number = 0;
  public hitShip: number = 0;
  public gameCompleted: boolean = false;
  public carrierSunk: boolean = false;
  public battleshipSunk: boolean = false;
  public cruiserSunk: boolean = false;
  public submarineSunk: boolean = false;
  public destroyerSunk: boolean = false;

  constructor(public boardRows:number, public boardColumns:number){
    for (var i: number = 0; i < boardRows; i++) {
      this.board[i] = [];
      for (var j: number = 0; j< boardColumns; j++) {
        this.board[i][j] = new Square();
      }
    }
    this.generateShip(0,2); //Destroyer
    this.generateShip(1,3); //Submarine
    this.generateShip(2,3); //Cruiser
    this.generateShip(3,4); //Battleship
    this.generateShip(4,5); //Carrier
  }

  useAI(){
    var randCol:number = 0;
    var randRow:number = 0;
    var guessSuccess:boolean = false;
    var selectedHit:Square = null;
    var moveLeftNext:boolean = true;
    var moveRightNext:boolean = true;
    var moveUpNext:boolean = true;
    var moveDownNext:boolean = true;
    var fireResult:String = "";
    var id = setInterval(()=>{
      guessSuccess = false;
      for (var row: number = 0; row < this.boardRows; row++) {
        for (var col: number = 0; col< this.boardColumns; col++) {
          if (this.board[row][col].hit && !this.board[row][col].sunk) {
            selectedHit = this.board[row][col].hit;
            moveLeftNext = true;
            moveRightNext = true;
            moveUpNext = true;
            moveDownNext = true;
            //move left
            if (col > 0 &&
              this.board[row][col-1].hit === false &&
              this.board[row][col-1].miss === false &&
              moveLeftNext && !guessSuccess) {
              guessSuccess = true;
              fireResult = this.fire(row,col-1);
              if (fireResult !== "hit" || fireResult === "sunk"){
                moveLeftNext = false;
              }
            }
            //move right
            if (col < 9 &&
              this.board[row][col+1].hit === false &&
              this.board[row][col+1].miss === false &&
              moveRightNext && !guessSuccess) {
              guessSuccess = true;
              fireResult = this.fire(row,col+1);
              if (fireResult !== "hit" || fireResult === "sunk"){
                moveRightNext = false;
              }
            }
            //move up
            if (row > 0 &&
              this.board[row-1][col].hit === false &&
              this.board[row-1][col].miss === false &&
              moveUpNext && !guessSuccess) {
              guessSuccess = true;
              fireResult = this.fire(row-1,col);
              if (fireResult !== "hit" || fireResult === "sunk"){
                moveUpNext = false;
              }
            }
            //move down
            if (row < 9 &&
              this.board[row+1][col].hit === false &&
              this.board[row+1][col].miss === false &&
              moveDownNext && !guessSuccess) {
              guessSuccess = true;
              fireResult = this.fire(row+1,col);
              if (fireResult !== "hit" || fireResult === "sunk"){
                moveDownNext = false;
              }
            }
          }
        }
      }
      if(guessSuccess === false){
        var badGuess:boolean = false;
        do{
          randRow = Math.floor(Math.random() * this.boardRows);
          randCol = Math.floor(Math.random() * this.boardColumns);
          badGuess = this.badMove(randRow,randCol);
        }while(badGuess || this.board[randRow][randCol].hit === true ||
                           this.board[randRow][randCol].miss === true)
        this.fire(randRow,randCol);
      }
      if (this.gameCompleted) {
        this.constructor(10,10);
        this.useAI();
        clearInterval(id);
      }
    },100);
  }

  badMove(row: number,col: number): boolean{
    if (col > 0 && row > 0 && col < 9 && row < 9) {
      if (( this.board[row-1][col].miss === true || this.board[row-1][col].sunk === true ) &&
          ( this.board[row+1][col].miss === true || this.board[row+1][col].sunk === true ) &&
          ( this.board[row][col-1].miss === true || this.board[row][col-1].sunk === true ) &&
          ( this.board[row][col+1].miss === true || this.board[row][col+1].sunk === true )
      ) {
        return true;
      }
    }
    else if(row === 0 && col === 0){
      if ((this.board[0][1].miss || this.board[0][1].sunk) &&
          (this.board[1][0].miss || this.board[1][0].sunk)
       ) {
          return true;
      }
    }else if(row === 0 && col === 9){
      if ((this.board[0][8].miss || this.board[0][8].sunk) &&
          (this.board[1][9].miss || this.board[1][9].sunk)
       ) {
          return true;
      }
    }else if(row === 9 && col === 9){
      if ((this.board[8][9].miss || this.board[8][9].sunk) &&
          (this.board[9][8].miss || this.board[9][8].sunk)
       ) {
          return true;
      }
    }else if(row === 9 && col === 0){
      if ((this.board[8][0].miss || this.board[8][0].sunk) &&
          (this.board[9][1].miss || this.board[9][1].sunk)
       ) {
          return true;
      }
    }
    else if(row === 0 && col > 0 && col < 9){
      if((this.board[0][col-1].miss || this.board[0][col-1].sunk) &&
         (this.board[1][col].miss || this.board[1][col].sunk) &&
         (this.board[0][col+1].miss || this.board[0][col+1].sunk)
      ){
        return true;
      }
    }
    else if(row > 0 && row < 9 && col === 9){
      if((this.board[row-1][9].miss || this.board[row-1][9].sunk) &&
         (this.board[row+1][9].miss || this.board[row+1][9].sunk) &&
         (this.board[row][8].miss || this.board[row][8].sunk)
      ){
        return true;
      }
    }
    else if(row === 9 && col > 0 && col < 9){
      if((this.board[9][col-1].miss || this.board[9][col-1].sunk) &&
         (this.board[8][col].miss || this.board[8][col].sunk) &&
         (this.board[9][col+1].miss || this.board[9][col+1].sunk)
      ){
        return true;
      }
    }
    else if(row > 0 && row < 9 && col === 0){
      if((this.board[row-1][0].miss || this.board[row-1][0].sunk) &&
         (this.board[row+1][0].miss || this.board[row+1][0].sunk) &&
         (this.board[row][1].miss || this.board[row][1].sunk)
      ){
        return true;
      }
    }
    return false;
  }

  fire(row: number,col: number): String{
    var selectedSquare:Square = this.board[row][col];
    if (this.gameCompleted) {
      return "complete";
    }
    if (selectedSquare.hit === false && selectedSquare.miss === false){
      this.attempts++;
      if (selectedSquare.ship === true) {
        this.hitShip++;
      }
    }
    var sunkCounter:number = 0;
    var sunkBuffer:String[] = [];
    if (selectedSquare.ship === true) {
      this.board[row][col].hit = true;
      for (var i: number = 0; i < this.boardRows; i++) {
        for (var j: number = 0; j< this.boardColumns; j++) {
          if(this.board[i][j].id === selectedSquare.id && this.board[i][j].hit === true){
            sunkBuffer.push(String(i)+String(j));
            sunkCounter++;
          }
        }
      }
      if (sunkCounter == 2 && selectedSquare.id == 0 ||
          sunkCounter == 3 && selectedSquare.id == 1 ||
          sunkCounter == 3 && selectedSquare.id == 2 ||
          sunkCounter == 4 && selectedSquare.id == 3 ||
          sunkCounter == 5 && selectedSquare.id == 4) {
        for (let i = 0; i < sunkBuffer.length; i++) {
          this.board[parseInt(sunkBuffer[i][0])][parseInt(sunkBuffer[i][1])].sunk = true;
        }
        if (selectedSquare.id === 0) {
          this.destroyerSunk = true;
        } else if(selectedSquare.id === 1) {
          this.submarineSunk = true;
        } else if(selectedSquare.id === 2) {
          this.cruiserSunk = true;
        } else if(selectedSquare.id === 3) {
          this.battleshipSunk = true;
        } else {
          this.carrierSunk = true;
        }
        if (this.hitShip === 17) {
          // setTimeout(function(){ alert("you win"); }, 10);
          this.gameCompleted = true;
        }
        return "sunk";
      }
      return "hit";
    }
    else {
      this.board[row][col].miss = true;
    }
    return "miss";
  }

  generateShip(id:number,size:number){
    var horizontalOrVertical:boolean = !(Math.floor(Math.random() * 2));
    var randomSuccess:boolean = true;
    var randCol = 0;
    var randRow = 0;
    if (horizontalOrVertical) {
      do{
        randCol = Math.floor(Math.random() * this.boardColumns);
        randRow = Math.floor(Math.random() * this.boardRows);
        randomSuccess = true;
        if (randCol + (size-1) < this.boardColumns) {
          for (let i = 0; i < size; i++) {
            if (this.board[randRow][randCol+i].ship) {
              randomSuccess = false;
            }
          }
        }else {
          randomSuccess = false;
        }
      }while(randomSuccess === false)
      for (let i = 0; i < size; i++) {
        this.board[randRow][randCol+i].ship = true;
        this.board[randRow][randCol+i].id = id;
        this.board[randRow][randCol+i].position = i;
        this.board[randRow][randCol+i].rotation = false;
      }
    }
    else {
      do{
        randCol = Math.floor(Math.random() * this.boardColumns);
        randRow = Math.floor(Math.random() * this.boardRows);
        randomSuccess = true;
        if (randRow + (size-1) < this.boardRows) {
          for (let i = 0; i < size; i++) {
            if (this.board[randRow+i][randCol].ship) {
              randomSuccess = false;
            }
          }
          }else {
            randomSuccess = false;
          }
      }while(randomSuccess === false)
      for (let i = 0; i < size; i++) {
        this.board[randRow+i][randCol].ship = true;
        this.board[randRow+i][randCol].id = id;
        this.board[randRow+i][randCol].position = i;
        this.board[randRow+i][randCol].rotation = true;
      }
    }
  }
}
