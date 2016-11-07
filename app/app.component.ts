import { Component, AfterViewInit } from '@angular/core';
import { Square } from './square.model';
import { Game } from './game.model';
import { Http, Response, Jsonp } from '@angular/http';
import {Observable} from 'rxjs/Rx';

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
          <li *ngIf = "data.login == false"><a href='/auth/github'>Sign in with Github!</a></li>
          <li *ngIf = "data.login == true"><a href='/logout'>Hello {{user.name}} Sign out</a></li>
        </ul>
      </div>
    </nav>

    <img id="banner" src="../resources/img/Banner.png">

    <div class="well" id="map-well">
      <table id="game-board" align="center">
        <tr>
          <td [class.border]="true" align="center"><span class="glyphicon glyphicon glyphicon-star" aria-hidden="true"></span></td>
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
          <td (click)=fire(row,col) align="center"
          *ngFor=" let currentSquare of myGame.board[row]; let col = index"
          [class.tugboatHit0]="myGame.board[row][col].hit && myGame.board[row][col].id == 0 && myGame.board[row][col].position == 0"
          [class.tugboatHit1]="myGame.board[row][col].hit && myGame.board[row][col].id == 0 && myGame.board[row][col].position == 1"
          [class.submarineHit0]="myGame.board[row][col].hit && myGame.board[row][col].id == 1 && myGame.board[row][col].position == 0"
          [class.submarineHit1]="myGame.board[row][col].hit && myGame.board[row][col].id == 1 && myGame.board[row][col].position == 1"
          [class.submarineHit2]="myGame.board[row][col].hit && myGame.board[row][col].id == 1 && myGame.board[row][col].position == 2"
          [class.cruiserHit0]="myGame.board[row][col].hit && myGame.board[row][col].id == 2 && myGame.board[row][col].position == 0"
          [class.cruiserHit1]="myGame.board[row][col].hit && myGame.board[row][col].id == 2 && myGame.board[row][col].position == 1"
          [class.cruiserHit2]="myGame.board[row][col].hit && myGame.board[row][col].id == 2 && myGame.board[row][col].position == 2"
          [class.battleshipHit0]="myGame.board[row][col].hit && myGame.board[row][col].id == 3 && myGame.board[row][col].position == 0"
          [class.battleshipHit1]="myGame.board[row][col].hit && myGame.board[row][col].id == 3 && myGame.board[row][col].position == 1"
          [class.battleshipHit2]="myGame.board[row][col].hit && myGame.board[row][col].id == 3 && myGame.board[row][col].position == 2"
          [class.battleshipHit3]="myGame.board[row][col].hit && myGame.board[row][col].id == 3 && myGame.board[row][col].position == 3"
          [class.carrierHit0]="myGame.board[row][col].hit && myGame.board[row][col].id == 4 && myGame.board[row][col].position == 0"
          [class.carrierHit1]="myGame.board[row][col].hit && myGame.board[row][col].id == 4 && myGame.board[row][col].position == 1"
          [class.carrierHit2]="myGame.board[row][col].hit && myGame.board[row][col].id == 4 && myGame.board[row][col].position == 2"
          [class.carrierHit3]="myGame.board[row][col].hit && myGame.board[row][col].id == 4 && myGame.board[row][col].position == 3"
          [class.carrierHit4]="myGame.board[row][col].hit && myGame.board[row][col].id == 4 && myGame.board[row][col].position == 4"
          [class.rotate]=" myGame.board[row][col].rotation"
          [class.ship]="myGame.board[row][col].ship"
          [class.miss]="myGame.board[row][col].miss"
          [class.beautify-background]="true"
          >
          </td>
        </tr>
      </table>
    </div>
    <div class= "well" id="score-board">
    <div class="well" id="ships" align="center">
      <ul>
        <li>Carrier: {{ myGame.carrier}}</li>
        <li>Battleship: {{ myGame.battleship}}</li>
        <li>Cruiser: {{ myGame.cruiser}}</li>
        <li>Submarine: {{ myGame.submarine}}</li>
        <li>Destroyer: {{ myGame.destroyer}}</li>
      </ul>
    </div>
    <div class="well" id="attempts">
      <ul>
        <li>Attempts: {{myGame.attempts}}</li>
        <li>Total hits: {{myGame.hitShip}}</li>
        <li>Total misses: {{myGame.attempts - myGame.hitShip}}</li>
      </ul>
    </div>
      <button class="btn" (click)="newGame()">New Game</button><br><br>
      <button class="btn" (click)="useAI()">Use AI</button>
    </div>
  </div>
  `
})

export class AppComponent {
  constructor (private http: Http) {}
  public dummyArray = new Array(10);
  public letterArray:String[] = ["A","B","C","D","E","F","G","H","I","J"];
  public myGame:Game = new Game(10,10);
  public audio = new Audio();
  public data = {"login" : false};
  public user = {};
  fire(row: number,col: number){
    this.myGame.fire(row,col);
    this.audio.src = "../../resources/sounds/torpedo.wav";
    this.audio.play();
  }
  newGame(){
    this.myGame = new Game(10,10);
      this.audio.src = "../../resources/sounds/allhandstobattle.wav";
      this.audio.load();
      this.audio.play();
  }
  useAI(){
    this.myGame.useAI();
  }
  ngOnInit(): void {
     this.http.request('/login')
        .subscribe((res: Response) => {
          this.data = res.json();
      });

      this.http.request('/user')
        .subscribe((res: Response) => {
          this.user = res.json();
      });
  }
}

//BDD to-do list
//Add attempt limit to get losing screen
//add winning sounds
//add "sunk" and "hit" instances in order to pair the sounds
//cut winning sound to be short
//cut battlestation .wav to just have "all hands to battlestations"
//place explosion gif when sunk (repeat along ship squares)
