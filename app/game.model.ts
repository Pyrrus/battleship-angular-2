import { Square } from './square.model';

export class Game{
  public board = {};
  public attempts:number = 0;
  public hitShip: number = 0;
  public gameCompleted: boolean = false;
  public carrier: String = "not-sunk";
  public battleship: String = "not-sunk";
  public cruiser: String = "not-sunk";
  public submarine: String = "not-sunk";
  public destroyer: String = "not-sunk";
  public lastColMove:number = 0;
  public lastRowMove:number = 0;
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
    var id = setInterval(()=>{
      guessSuccess = false;
      if (this.board[this.lastRowMove][this.lastColMove].hit && this.lastColMove < 9) {
        if (this.board[this.lastRowMove][this.lastColMove+1].hit === false &&
            this.board[this.lastRowMove][this.lastColMove+1].miss === false) {
          randCol = this.lastColMove+1;
          randRow = this.lastRowMove;
          guessSuccess = true;
          if (this.board[randRow][randCol].ship) {
            this.lastColMove = randCol;
            this.lastRowMove = randRow;
          }
        }
      }
      if (this.board[this.lastRowMove][this.lastColMove].hit && this.lastColMove > 0) {
        if (this.board[this.lastRowMove][this.lastColMove-1].hit === false &&
            this.board[this.lastRowMove][this.lastColMove-1].miss === false) {
          randCol = this.lastColMove-1;
          randRow = this.lastRowMove;
          guessSuccess = true;
          if (this.board[randRow][randCol].ship) {
            this.lastColMove = randCol;
            this.lastRowMove = randRow;
          }
        }
      }
      if (this.board[this.lastRowMove][this.lastColMove].hit && this.lastRowMove < 9) {
        if (this.board[this.lastRowMove+1][this.lastColMove].hit === false &&
            this.board[this.lastRowMove+1][this.lastColMove].miss === false) {
          randCol = this.lastColMove;
          randRow = this.lastRowMove+1;
          guessSuccess = true;
          if (this.board[randRow][randCol].ship) {
            this.lastColMove = randCol;
            this.lastRowMove = randRow;
          }
        }
      }
      if (this.board[this.lastRowMove][this.lastColMove].hit && this.lastRowMove > 0) {
        if (this.board[this.lastRowMove-1][this.lastColMove].hit === false &&
            this.board[this.lastRowMove-1][this.lastColMove].miss === false) {
          randCol = this.lastColMove;
          randRow = this.lastRowMove-1
          guessSuccess = true;
          if (this.board[randRow][randCol].ship) {
            this.lastColMove = randCol;
            this.lastRowMove = randRow;
          }
        }
      }
      if(guessSuccess === false){
        var badGuess:boolean = false;
        do{
          badGuess = false;
          randCol = Math.floor(Math.random() * this.boardColumns);
          randRow = Math.floor(Math.random() * this.boardRows);
          if (randCol > 0 && randRow > 0 && randCol < 9 && randRow < 9) {
            if (( this.board[randRow-1][randCol].miss === true || this.board[randRow-1][randCol].sunk === true ) &&
                ( this.board[randRow+1][randCol].miss === true || this.board[randRow+1][randCol].sunk === true ) &&
                ( this.board[randRow][randCol-1].miss === true || this.board[randRow][randCol-1].sunk === true ) &&
                ( this.board[randRow][randCol+1].miss === true || this.board[randRow][randCol+1].sunk === true )
            ) {
              badGuess = true;
            }
          }
          else if(randRow === 0 && randCol === 0){
            if ((this.board[0][1].miss || this.board[0][1].sunk) &&
                (this.board[1][0].miss || this.board[1][0].sunk)
             ) {
                badGuess = true;
            }
          }else if(randRow === 0 && randCol === 9){
            if ((this.board[0][8].miss || this.board[0][8].sunk) &&
                (this.board[1][9].miss || this.board[1][9].sunk)
             ) {
                badGuess = true;
            }
          }else if(randRow === 9 && randCol === 9){
            if ((this.board[8][9].miss || this.board[8][9].sunk) &&
                (this.board[9][8].miss || this.board[9][8].sunk)
             ) {
                badGuess = true;
            }
          }else if(randRow === 9 && randCol === 0){
            if ((this.board[8][0].miss || this.board[8][0].sunk) &&
                (this.board[9][1].miss || this.board[9][1].sunk)
             ) {
                badGuess = true;
            }
          }
          else if(randRow === 0 && randCol > 0 && randCol < 9){
            if((this.board[0][randCol-1].miss || this.board[0][randCol-1].sunk) &&
               (this.board[1][randCol].miss || this.board[1][randCol].sunk) &&
               (this.board[0][randCol+1].miss || this.board[0][randCol+1].sunk)
            ){
              badGuess = true;
            }
          }
          else if(randRow > 0 && randRow < 9 && randCol === 9){
            if((this.board[randRow-1][9].miss || this.board[randRow-1][9].sunk) &&
               (this.board[randRow+1][9].miss || this.board[randRow+1][9].sunk) &&
               (this.board[randRow][8].miss || this.board[randRow][8].sunk)
            ){
              badGuess = true;
            }
          }
          else if(randRow === 9 && randCol > 0 && randCol < 9){
            if((this.board[9][randCol-1].miss || this.board[9][randCol-1].sunk) &&
               (this.board[8][randCol].miss || this.board[8][randCol].sunk) &&
               (this.board[9][randCol+1].miss || this.board[9][randCol+1].sunk)
            ){
              badGuess = true;
            }
          }
          else if(randRow > 0 && randRow < 9 && randCol === 0){
            if((this.board[randRow-1][0].miss || this.board[randRow-1][0].sunk) &&
               (this.board[randRow+1][0].miss || this.board[randRow+1][0].sunk) &&
               (this.board[randRow][1].miss || this.board[randRow][1].sunk)
            ){
              badGuess = true;
            }
          }
        }while(badGuess || this.board[randRow][randCol].hit === true ||
             this.board[randRow][randCol].miss === true)
        this.lastColMove = randCol;
        this.lastRowMove = randRow;
      }

      this.fire(randRow,randCol);
      console.log("hello!!");
      if (this.gameCompleted) {
        this.constructor(10,10);
        this.useAI();
        clearInterval(id);
      }
    },1);
  }
  fire(row: number,col: number){
    var selectedSquare:Square = this.board[row][col];
    if (this.gameCompleted) {
      return;
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
          this.destroyer = "sunk";
        } else if(selectedSquare.id === 1) {
          this.submarine = "sunk";
        } else if(selectedSquare.id === 2) {
          this.cruiser = "sunk";
        } else if(selectedSquare.id === 3) {
          this.battleship = "sunk";
        } else {
          this.carrier = "sunk";
        }
      }
    }
    else {
      this.board[row][col].miss = true;
    }
    if (this.hitShip === 17) {
      // setTimeout(function(){ alert("you win"); }, 10);
      this.gameCompleted = true;
    }
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
      }
    }
  }
}
