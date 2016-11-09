![banner](https://github.com/Pyrrus/battleship-angular-2/blob/master/resources/img/Banner.png)

#### _The Legend of Battleship, November 7th-November 10th 2016_

#### By _Amber Farrington, Yusuf Qedan, Jonathan Toler, and Adam Gorbahn_

## Description

_This app is a Battleship game using the Angular 2 framework! Play against another person or watch the AI play! "You Sunk my Battleship!"_

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)

## Installation

* `git clone <repository-url>` this repository
* `cd <repository-url>`
* `npm install`
* `bower install`


## Running / Development
(Note: This app uses Express! The steps below will help you load this app!)

* `gulp build`
* Open a new tab (Alt + T for Mac, have to open a new terminal window for Windows using "start cmd .exe"), and execute the command `node server js` (Keep this tab open)
* Visit your app at [http://localhost:30000](http://localhost:30000).

## Specs

* Example Input: Click game square
* Example Output: You miss!

* Example Input: Click game square
* Example Output: You hit!

* Example Input: Player clicks all the squares needed for a ship
* Example Output: Explosion sound and gif image

* Example Input: Player sinks all ships
* Example Output: Win Sound plays and Alert Pops

* Example Input: Player can view the total high score by clicking the 'show highscore' button.
* Example Output: Will show a list of the every score stored in the database. Scores are displayed in order of best with a timestamp for when the score was reached.

* Example Input: Player can view their own person stats by clicking the 'show user score' button.
* Example Output: shows the user's all time highscores, hit ratio, and timestamp for when the they reach that score.

* Example Input: Player can let the AI playout games by pressing the 'use AI' button.
* Example Output: The AI will keep playing games, from which the player can view. 

### License

*This application is licensed under the MIT license*

Copyright (c) 2016 **Amber Farrington, Yusuf Qedan, Jonathan Toler, and Adam Gorbahn**
