import { Component } from '@angular/core';
import { Square } from './square.model';
import { Game } from './game.model';

@Component({
  selector: 'my-app',
  template: `
  <div class="container">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <ul class="nav navbar-nav navbar-left">
          <li><a href="/" class="navbar-brand">Battleship</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a href='/auth/github'>Sign in with Github!</a></li>
          <li><a href='/logout'>Sign out</a></li>
        </ul>
      </div>
    </nav>
    <div class="well" id="map-well">
      <table align="center">
        <tr>
          <td [class.border]="true"w></td>
          <td align="center" *ngFor="let foo of dummyArray; let index = index"
          [class.border]="true"
          >
            {{index+1}}
          </td>
        </tr>
        <tr *ngFor="let letter of letterArray; let row = index">
          <td align="center"
          [class.border]="true"
          >{{letter}}</td>
          <td (click)=fire(myGame.board[row][col],row,col) align="center"
          *ngFor=" let currentSquare of myGame.board[row]; let col = index"
          [class.hit]="myGame.board[row][col].hit"
          [class.ship]="myGame.board[row][col].ship"
          [class.miss]="myGame.board[row][col].miss"
          [class.sunk]="myGame.board[row][col].sunk"
          >
          </td>
        </tr>
      </table>
    </div>
    <div class= "well score-board" id="score-board">
      <h3>Attempts:{{myGame.attempts}}</h3>
      <h3>Total hits:{{myGame.hitShip}}</h3>
      <h3>Total misses:{{myGame.attempts - myGame.hitShip}}</h3>
      <button class="btn" (click)="newGame()">New Game</button>
    </div>
  </div>
  `
})

export class AppComponent {
  public myGame:Game = new Game(10,10);
  public dummyArray = new Array(10);
  public letterArray:String[] = ["A","B","C","D","E","F","G","H","I","J"];
  fire(selectedSquare:Square,row: number,col: number){
    this.myGame.fire(selectedSquare,row,col);
  }
  newGame(){
    this.myGame = new Game(10,10);
  }
}
