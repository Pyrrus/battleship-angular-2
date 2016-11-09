import { Component, AfterViewInit } from '@angular/core';
import { Square } from './square.model';
import { Game } from './game.model';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
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
          <li *ngIf = "data.login == true"><a href='/logout'>Hello {{user.displayName}} Sign out</a></li>
        </ul>
      </div>
    </nav>

    <img id="banner" src="../resources/img/Banner.png"><br>
      <h3><strong>Click the play button to hear the theme!</strong></h3>
      <audio controls>
        <source src="../../resources/sounds/GreatSeaWW.mp3" type="audio/mp3">
      </audio>

    <div class="well" id="map-well">

      <div *ngIf = "hideHigh">
      	<div class="well">
      	 <h2>Highscore for the battleship</h2>
      	 <ol>
      	 	<li *ngFor = "let highScore of highScore">Attempts: {{highScore.attempts}} by {{highScore.name}} at {{highScore.time}}</li>
      	 </ol>
      	</div>
      </div>
      <div *ngIf = "hideUser">
      	<div class="well">
      	<h2>{{user.displayName}} score for the battleship</h2>
        <h3>Hit ratio: {{userScore | avg }}%</h3>
      	 <ol>
      	 	<li *ngFor = "let userScore of userScore">Attempts: {{userScore.attempts}} by {{userScore.name}} at {{userScore.time}}</li>
      	 </ol>
      	</div>
      </div>
      <table *ngIf = "!hideHigh && !hideUser" id="game-board" class="table-responsive" align="center">
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
          [class.beautify-background]="true"
          >
          <i style="font-size:47px;color:#ff6666;" *ngIf="myGame.board[row][col].miss" class="fa fa-times-circle" aria-hidden="true"></i>
          </td>
        </tr>
      </table>
      <br>
      <button *ngIf= "!hideHigh" class="btn pull-left btn-information" (click)="showHigh()">Show Highscore</button>
      <button *ngIf= "hideHigh" class="btn pull-left" (click)="closeHigh()">Close Highscore</button>
      <span *ngIf = "data.login == true">
	      <button *ngIf= "!hideUser" class="btn pull-right" (click)="showUser()">Show User Score</button>
	      <button *ngIf= "hideUser" class="btn pull-right" (click)="closeUser()">Close User Score</button>
      </span>
    </div>
    <div class= "well" id="score-board">
    <div class="well" id="ships" align="center">
      <ul>
        <li>Destroyer:
        <img *ngIf = "!myGame.destroyerSunk" class="img-responsive" src="../../resources/img/2X1.png">
        <img *ngIf = "myGame.destroyerSunk" class="img-responsive" src="../../resources/img/SunkTug.png">
        </li>
        <li>Submarine:
        <img *ngIf = "!myGame.submarineSunk" class="img-responsive" src="../../resources/img/submarine.png">
        <img *ngIf = "myGame.submarineSunk" class="img-responsive" src="../../resources/img/SunkSub.png">
        </li>
        <li>Cruiser:
        <img *ngIf = "!myGame.cruiserSunk" class="img-responsive" src="../../resources/img/Cruiser.png">
        <img *ngIf = "myGame.cruiserSunk" class="img-responsive" src="../../resources/img/SunkCruiser.png">
        </li>
        <li>Battleship:
        <img *ngIf = "!myGame.battleshipSunk" class="img-responsive" src="../../resources/img/BattleCruiser.png">
        <img *ngIf = "myGame.battleshipSunk" class="img-responsive" src="../../resources/img/SunkBattleship.png">
        </li>
        <li>Carrier:
        <img *ngIf = "!myGame.carrierSunk" class="img-responsive" src="../../resources/img/Ship1.png">
        <img *ngIf = "myGame.carrierSunk" class="img-responsive" src="../../resources/img/SunkTanker.png">
        </li>
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
  <div class="container" id="license">
  <p><strong>The music and images are originally licensed by Nintendo. The images are digitally vectored re-creations of the original game art for Legend of Zelda: Wind Waker. This game and the media are being used for educational purposes only! Enjoy the game!</strong></p>
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
  public user = "";
  public save = "";
  public highScore = "";
  public userScore = "";
  public hideHigh = false;
  public hideUser = false;
  fire(row: number,col: number){
    if(!this.myGame.gameCompleted){
      var x = this.myGame.fire(row,col);
      if(x === "miss") {
        this.audio.src = "../../resources/sounds/splash.mp3";
        this.audio.play();
      }else if(x === "sunk" && !this.myGame.gameCompleted){
        this.audio.src = "../../resources/sounds/explosion.mp3";
        this.audio.play();
      }else if(x === "hit"){
        this.audio.src = "../../resources/sounds/torpedo.wav";
        this.audio.play();
      }else if (this.myGame.gameCompleted) {
        this.audio.src = "../../resources/sounds/winner.mp3";
        this.audio.play();
        var that = this;
        setTimeout(function(){ alert("you win"); that.audio.pause(); }, 1000);
  	    this.win();

  	  }
    }
  }
  win() {
  	if (this.data.login) {
  	  var body = '?attempts=' + this.myGame.attempts;
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	      this.http
	        .post('/savescore' + body, {
	            headers: headers
	          })
	          .subscribe((res: Response) => {
		          this.save = res.json();
		      }, error => {
	              console.log(JSON.stringify(error.json()));
	          });
  	}
  }
  closeHigh() {
  	this.hideHigh = false;
  }
  closeUser() {
  	this.hideUser = false;
  }
  showHigh() {
  	this.http.request('/highscore')
	      .subscribe((res: Response) => {
	        this.highScore = res.json(),
	        this.hideHigh = true
	  });
	  this.hideUser = false;
  }
  showUser() {
  	this.http.request('/userscore')
	      .subscribe((res: Response) => {
	        this.userScore = res.json(),
	        this.hideUser = true
	  });
	 this.hideHigh = false;
  }
  newGame(){
    this.myGame = new Game(10,10);
    this.audio.src = "../../resources/sounds/newgame.mp3";
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
    // this.audio.src = "../../resources/sounds/GreatSeaWW.mp3";
    // this.audio.play();
  }
}
//BDD to-do list
//Add attempt limit to get losing screen
//place explosion gif when sunk (repeat along ship squares)
