import { Square } from './square.model';
import { Move } from './move.model';

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
    var strategy:String = "random";
    var direction:number = 0;
    var move:Move = null;
    var lastRandomMove:Move = null;
    var fireResult:String;
    var id = setInterval(()=>{
      if(strategy === "clockwise"){
      for (let i = 0; i < 4; i++) {
          if(direction === 0){
            if(!this.legalMove(move.row,move.col-1)){
              console.log("illegal move left clockwise row: " + move.row + " col: " + (move.col-1));
              direction = 1;
            }else{
              console.log("firing left row: " + move.row + "col: " + move.col);
              fireResult = this.fire(move.row,move.col-1);
              if (fireResult === "hit") {
                move = new Move(move.row,move.col-1);
                strategy = "lengthwise";
              }else if(fireResult === "sunk"){
                strategy = "random";
              }else{
                direction = 1;
              }
              break;
            }
          }else if(direction === 1){
            if(!this.legalMove(move.row-1,move.col)){
              console.log("illegal move up clockwise row: " + (move.row-1) + " col: " + move.col);
              direction = 2;
            }else{
              console.log("firing up row: " + move.row + "col: " + move.col);
              fireResult = this.fire(move.row-1,move.col);
              if (fireResult === "hit") {
                move = new Move(move.row-1,move.col);
                strategy = "lengthwise";
              }else if(fireResult === "sunk"){
                strategy = "random";
              }else{
                direction = 2;
              }
              break;
            }
          }else if(direction === 2){
            if(!this.legalMove(move.row,move.col+1)){
              console.log("illegal move right clockwise row: " + move.row + " col: " + (move.col+1));
              direction = 3;
            }else{
              console.log("firing right row: " + move.row + "col: " + move.col);
              fireResult = this.fire(move.row,move.col+1);
              if (fireResult === "hit") {
                move = new Move(move.row,move.col+1);
                strategy = "lengthwise";
              }else if(fireResult === "sunk"){
                strategy = "random";
              }else{
                direction = 3;
              }
              break;
            }
          }else if(direction === 3){
            if(!this.legalMove(move.row+1,move.col)){
              console.log("illegal move down clockwise row: " + (move.row+1) + " col: " + move.col);
              direction = 0;
            }else{
              console.log("firing down row: " + move.row + "col: " + move.col);
              fireResult = this.fire(move.row+1,move.col);
              if (fireResult === "hit") {
                move = new Move(move.row+1,move.col);
                strategy = "lengthwise";
              }else if(fireResult === "sunk"){
                strategy = "random";
              }else{
                direction = 0;
              }
              break;
            }
          }else{
            strategy = "random";
          }
        }
      }else if(strategy === "lengthwise"){
        if(direction === 0){
          if(!this.legalMove(move.row,move.col-1)){
            console.log("illegal move left lengthwise");
            strategy = "reverse";
            direction = 2;
          }else{
            console.log("firing left lengthwise row: " + move.row + "col: " + move.col);
            fireResult = this.fire(move.row,move.col-1);
            if (fireResult === "hit") {
              move = new Move(move.row,move.col-1);
            }else if(fireResult === "miss"){
              strategy = "reverse";
              move = lastRandomMove;
              direction = 2;
            }else{
              strategy = "random";
            }
          }
        }else if(direction === 1){
          if(!this.legalMove(move.row-1,move.col)){
            console.log("illegal move up lengthwise");
            strategy = "reverse";
            direction = 3;
          }else{
            console.log("firing up lengthwise row: " + move.row + "col: " + move.col);
            fireResult = this.fire(move.row-1,move.col);
            if (fireResult === "hit") {
              move = new Move(move.row-1,move.col);
            }else if(fireResult === "miss"){
              strategy = "reverse";
              move = lastRandomMove;
              direction = 3;
            }else{
              strategy = "random";
            }
          }
        }else if(direction === 2){
          if(!this.legalMove(move.row,move.col+1)){
            console.log("illegal move right lengthwise");
            strategy = "reverse";
            direction = 0;
          }else{
            console.log("firing right lengthwise row: " + move.row + "col: " + move.col);
            fireResult = this.fire(move.row,move.col+1);
            if (fireResult === "hit") {
              move = new Move(move.row,move.col+1);
            }else if(fireResult === "miss"){
              strategy = "reverse";
              move = lastRandomMove;
              direction = 0;
            }else{
              strategy = "random";
            }
          }
        }else if(direction === 3){
          if(!this.legalMove(move.row+1,move.col)){
            console.log("illegal move down lengthwise row: " + move.row + "col: " + move.col);
            strategy = "reverse";
            direction = 1;
          }else{
            console.log("firing down lengthwise");
            fireResult = this.fire(move.row+1,move.col);
            if (fireResult === "hit") {
              move = new Move(move.row+1,move.col);
            }else if(fireResult === "miss"){
              strategy = "reverse";
              move = lastRandomMove;
              direction = 1;
            }else{
              strategy = "random";
            }
          }
        }
      }else if(strategy === "reverse"){
        console.log("reversing direction is: " + direction);
        if(direction === 0){
          if(!this.legalMove(move.row,move.col-1)){
            console.log("illegal move left");
            strategy = "random";
          }else{
            console.log("firing left");
            fireResult = this.fire(move.row,move.col-1);
            if (fireResult === "hit") {
              move = new Move(move.row,move.col-1);
            }else if(fireResult === "miss"){
              strategy = "random";
            }else{
              strategy = "random";
            }
          }
        }else if(direction === 1){
          if(!this.legalMove(move.row-1,move.col)){
            console.log("illegal move up");
            strategy = "random";
          }else{
            console.log("firing up");
            fireResult = this.fire(move.row-1,move.col);
            if (fireResult === "hit") {
              move = new Move(move.row-1,move.col);
            }else if(fireResult === "miss"){
              strategy = "random";
            }else{
              strategy = "random";
            }
          }
        }else if(direction === 2){
          if(!this.legalMove(move.row,move.col+1)){
            console.log("illegal move right");
            strategy = "random";
          }else{
            console.log("firing right");
            fireResult = this.fire(move.row,move.col+1);
            if (fireResult === "hit") {
              move = new Move(move.row,move.col+1);
            }else if(fireResult === "miss"){
              strategy = "random";
            }else{
              strategy = "random";
            }
          }
        }else if(direction === 3){
          if(!this.legalMove(move.row+1,move.col)){
            console.log("illegal move down");
            strategy = "random";
          }else{
            console.log("firing down");
            fireResult = this.fire(move.row+1,move.col);
            if (fireResult === "hit") {
              move = new Move(move.row+1,move.col);
            }else if(fireResult === "miss"){
              strategy = "random";
            }else{
              strategy = "random";
            }
          }
        }
      }
      else if(strategy === "random"){
        for (var row: number = 0; row < this.boardRows; row++) {
           for (var col: number = 0; col< this.boardColumns; col++) {
            if (this.board[row][col].hit && !this.board[row][col].sunk) {
              console.log("found un-sunken ship at row: " + row + " col: " + col);
              move = new Move(row,col);
              lastRandomMove = move;
              strategy = "clockwise";
              direction = Math.floor(Math.random() * 4);
              break;
            }
          }
        }
        if (strategy === "random") {
          var badGuess:boolean = false;
          do{
            randRow = Math.floor(Math.random() * this.boardRows);
            randCol = Math.floor(Math.random() * this.boardColumns);
            badGuess = this.badMove(randRow,randCol);
          }while(badGuess || this.board[randRow][randCol].hit === true ||
                             this.board[randRow][randCol].miss === true)
          if(this.fire(randRow,randCol) === "hit") {
            strategy = "clockwise";
            direction = Math.floor(Math.random() * 4);
            move = new Move(randRow,randCol);
            lastRandomMove = move;
          }
        }
      }
      if (this.gameCompleted) {
        this.constructor(10,10);
        this.useAI();
        clearInterval(id);
      }
    },1);
  }

  legalMove(row: number,col: number): boolean{
    if(row >= 0 && row <= 9 && col >= 0 && col <= 9){
      return true;
    }else{
      return false;
    }
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
    }else if(row === 0 && col === 0){
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
    }else if(row === 0 && col > 0 && col < 9){
      if((this.board[0][col-1].miss || this.board[0][col-1].sunk) &&
      (this.board[1][col].miss || this.board[1][col].sunk) &&
      (this.board[0][col+1].miss || this.board[0][col+1].sunk)
      ){
        return true;
      }
    }else if(row > 0 && row < 9 && col === 9){
      if((this.board[row-1][9].miss || this.board[row-1][9].sunk) &&
      (this.board[row+1][9].miss || this.board[row+1][9].sunk) &&
      (this.board[row][8].miss || this.board[row][8].sunk)
      ){
        return true;
      }
    }else if(row === 9 && col > 0 && col < 9){
      if((this.board[9][col-1].miss || this.board[9][col-1].sunk) &&
      (this.board[8][col].miss || this.board[8][col].sunk) &&
      (this.board[9][col+1].miss || this.board[9][col+1].sunk)
      ){
        return true;
      }
    }else if(row > 0 && row < 9 && col === 0){
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
          setTimeout(function(){ alert("you win"); }, 10);
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
