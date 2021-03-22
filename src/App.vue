<template>

  <div class="divs">

    <div class="home">



      <div id="title">

        <div>
          <h1>Cell-Game</h1>
          <hr >

        </div>


      </div>

      <div id="board">

        <div id="cells-board">

          <p>{{board}}</p>
     

        </div>

      </div>

      <div id="controls">

        <div class="element-placement-buttons">

          <button>
            <p>Cell</p>
            
          </button>
          <button>
            <p>Food</p>
            
          </button>
          <button>
            <p>Predator</p>
            
          </button>
        
        </div>


        <div class="sliders">



            <div class="slidecontainer1">
              <input type="range" orient="vertical" min="1" max="100" value="50" class="slider" id="myRange">
              <p>Days</p>
            </div>

            <div class="slidecontainer2">
              <input type="range" orient="vertical" min="1" max="100" value="50" class="slider" id="myRange">
              <p>Board size</p>
            </div>

        </div>

        <div class="run-button-div">
          <button @click='f()'>Run Simulation</button>
        </div>
        


      </div>


      <div id="footer">

        <h3>Alejandro Mayorga - 2021</h3>

      </div>


    </div>


    <!--div class="black-div">

    </div>
    <div class="yellow-div">

    </div>

    <div class="pink-div">

    </div-->


  </div>

  <!--div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div-->
</template>

<script>

import Board from './classes/Board'
import Cell from './classes/Cell'
import Food from './classes/Food'
import Predator from './classes/Predator'

export default {


  data() {

    return{
      board: {},
      printedBoard: '',
    }
  },

  mounted() {


  },

  created(){

    this.board = this.profile1();
    console.log("Board Initialized")
    this.printBoard(this.board.board);



    //constructor(name, socialBias, sofocationBias, reproductionBias, foodBias, predatorBias, temperatureBias, type, state) {




    console.log("Elements Added")
    this.printBoard(this.board.board);

    var days = 90;
    //board = this.beginLifetime(days, this.board, 1);

    console.log("Life Initializated" + "Days passed: " + days)
    this.printBoard(this.board.board);

  },

  methods:{

        f(){
          
          var days = 30;
          this.board = this.beginLifetime(days, this.board, 1);
          this.board = this.printBoard(this.board.board)
        },


        initializeBoard(board, boardSize) {

            let basicBoard = [];

            for(var i = 0; i < boardSize; i++){

                let column = [];
                for(var j = 0; j < boardSize; j++){
                    column.push(null);

                }
                basicBoard.push(column);

            }    

            return basicBoard;
            
        },

        printBoard(board){
            const boardSize = board.length;
            let printedBoard = '';

            console.log("-----------------------------------")
            for(var i = 0; i < boardSize; i++){

                
                for(var j = 0; j < boardSize; j++){
                  
                        if(board[i][j] == null){
                            printedBoard += 0;
                            ///console.log('\x1b[33m%s\x1b[0m', '0');
                            
                            //process.stdout.write('0 ');

                        }else if(board[i][j].type == 'cell') {
                            printedBoard += 1;
                            //console.log("\x1b[32m", '1');
                            //process.stdout.write(['\033[', '\x1b[32m', '', '1 ', '\033[0m'].join(''));


                        }else if(board[i][j].type == 'food') {
                            printedBoard += 2;
                            //console.log('\x1b[33m%s\x1b[0m', '2');
                            //process.stdout.write(['\033[', '\x1b[33m', '', '2 ', '\033[0m'].join(''));


                        }else if(board[i][j].type == 'predator') {
                            printedBoard += 3;
                            //console.log("\x1b[34m", '3');
                            //process.stdout.write(['\033[', '\x1b[34m', '', '3 ', '\033[0m'].join(''));


                        }else{
                            printedBoard += '-';
                        }
                        printedBoard += '   '
                }

                console.log('')

                printedBoard += '\n';
                

            }
            console.log(printedBoard);
            console.log("-----------------------------------")
            return printedBoard;
            
            
        },


        
        beginLifetime(daysAmount, board, speed){

            for(var i = 0; i < daysAmount; i ++){
                console.log("Day: " + i)

                board = this.updateBoard(board);
                //this.printBoard(board.board); 
                this.sleep(speed * 100);
                if(board.cellsAmount < 1){
                    break;
                }

            }

            return board;
        },

        updateBoard(boardIn){

            var board = boardIn.board
            const boardSize = boardIn.board.length;
            var neightbours = [];
            var survivalChance = 0;
            var reproductionChance = 0;

            for(var i = 0; i < boardSize; i++){

                
                for(var j = 0; j < boardSize; j++){
                  
                    
                    if(board[i][j] !== null){

                        if(board[i][j].type == 'cell'){

                            neightbours = this.getNeightbors(board, i, j);

                            //console.log(neightbours)
                            survivalChance = this.calculateSurvivalChance(board[i][j], neightbours);
                            //console.log(survivalChance)
                            if(this.evaluateChance(survivalChance) === true && board[i][j].state > 0){
                                
                                reproductionChance = this.calculateReproductionChance(board[i][j], neightbours);
                                //console.log(reproductionChance)
                                if(this.evaluateChance(reproductionChance) == true){

                                    //printBoard(board);
                                    boardIn.cellsAmount ++;
                                    var newCellData = this.reproduceCell(board, i, j, neightbours);
                                    board[newCellData.row][newCellData.column] = newCellData.newCell;
                                    
                                }
                            }else if(this.evaluateChance(survivalChance) === true && board[i][j].state == 0){
                                board[i][j].state = 1;
                            }else{
                                board[i][j] = null;
                                boardIn.cellsAmount --;

                            }

                            //printBoard(board)
                            


                        }else if (board[i][j].type == 'predator' && board[i][j].state > 0){
                            
                                if(this.evaluateChance(board[i][j].moventProbability)){
                                    var predator = this.movePredator(board, i, j, this.getNeightbors(board, i, j));


                                    board[i][j] = null;
                                    board[predator.row][predator.column] = predator.predator;
                                }

                        }else if (board[i][j].type == 'predator' && board[i][j].state < 1){
                            
                                var predator = board[i][j];
                                predator.state = 1;
                                board[i][j] = predator;
                        }
                    }
                }
            
            }

            boardIn.board = board

            return boardIn;

        },
        //Math.ceil(Math.random() * 90) - 1;
        calculateSurvivalChance(cell, neightbours){

            var amountOfFood = 0;
            var amountOfCellsNeighbors = 0;
            var amountOfPredators = 0;
            var amountOfEmptySpace = 0;

            var cellProbability = 0.125;

            for(var i = 0; i < neightbours.length; i++ ){

                if(neightbours[i] == null){
                    amountOfEmptySpace ++;
                }else if(neightbours[i].type == 'food'){
                    amountOfFood ++;
                }else if(neightbours[i].type == 'cell'){
                    amountOfCellsNeighbors ++;
                }else if(neightbours[i].type == 'predator'){
                    amountOfPredators ++;
                }
            }

            var foodProbability = cell.foodBias * (amountOfFood / neightbours.length);
            var sofocationProbability =  cell.sofocationBias * (amountOfCellsNeighbors / neightbours.length);
            var socialWellnesProbability = cell.socialBias * (amountOfCellsNeighbors / neightbours.length);
            var predatorProbability =  cell.predatorBias * (amountOfPredators / neightbours.length);

            //console.log("food probability: " + foodProbability)
            //console.log("sofocation probability: " + sofocationProbability)
            //console.log("social wellness probability: " + socialWellnesProbability)
            //console.log("predator probability: " + predatorProbability)
            var total = (socialWellnesProbability + foodProbability - sofocationProbability - predatorProbability);
            //console.log("---- Survival chance: " + total);
            if(total > 1)
                total = 1;
            return total;

        },

        calculateReproductionChance(cell, neightbours){

            var amountOfCellsNeighbors = 0;
            var amountOfEmptySpace = 0;
            for(var i = 0; i < neightbours.length; i++ ){

                if(neightbours[i] == null){
                    amountOfEmptySpace ++;
                }else if(neightbours[i].type == 'cell'){
                    amountOfCellsNeighbors ++;
                }
            }

            if(amountOfEmptySpace < 1){
                return 0;
            }

            var reproductionChance = cell.reproductionBias * (amountOfCellsNeighbors / neightbours.length )
            //console.log("---- Reproduction Chance: " + reproductionChance)
            return  reproductionChance;

        },

        evaluateChance(chance){


            var array = [];
            for(var i = 0; i < 1000; i++){
                array.push(false);

            }
            for(var i = 0; i < Math.ceil(chance * 1000); i++){
                array[i] = true;
            }
            return array[Math.ceil(Math.random() * (1000 - 1))];
        },

        reproduceCell(board, parentCellRow, parentCellColumn, parentNeightbours){

            var availablePositions = [];

            for(var i = 0; i < parentNeightbours.length; i++){ 

                if(parentNeightbours[i] === null){
                    availablePositions.push(i);
                }
                
            }


            var childPosition = this.getNewPosition(availablePositions[Math.floor(Math.random() * availablePositions.length)], parentCellRow, parentCellColumn);
            let newCell = board[parentCellRow][parentCellColumn];
            newCell.state = 0;

            return {row : childPosition.row, column: childPosition.column, newCell: newCell};


        },

        getNewPosition(i, parentCellRow, parentCellColumn){

          

            if(i == 0){

                return {row: parentCellRow - 1, column: parentCellColumn - 1} 

            }else if(i == 1){
                return {row: parentCellRow, column: parentCellColumn - 1} 

            }else if(i == 2){
                return {row: parentCellRow + 1, column: parentCellColumn - 1} 

            }else if(i == 3){
                return {row: parentCellRow - 1, column: parentCellColumn} 
                
            }else if(i == 4){
                return {row: parentCellRow + 1, column: parentCellColumn} 

            }else if(i == 5){
                return {row: parentCellRow - 1, column: parentCellColumn + 1} 
                
            }else if(i == 6){
                return {row: parentCellRow, column: parentCellColumn + 1} 
                
            }else if(i == 7){
                return {row: parentCellRow + 1, column: parentCellColumn + 1} 
                
            }else{
                return {row: parentCellRow, column: parentCellColumn}
            }

        },

        getNeightbors(board, x, y){

            let cellNeightbors = [];

            let cellNeightborsWithoutNulls = [];

            if(board[x - 1] !== undefined && board[x - 1][y - 1] !== undefined){
                cellNeightbors.push(board[x - 1][y - 1]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x] !== undefined && board[x][y - 1] !== undefined){
                cellNeightbors.push(board[x][y - 1]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x + 1] !== undefined && board[x + 1][y - 1] !== undefined){
                cellNeightbors.push(board[x + 1][y - 1]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x - 1] !== undefined && board[x - 1][y] !== undefined){
                cellNeightbors.push(board[x - 1][y]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x + 1] !== undefined && board[x + 1][y] !== undefined){
                cellNeightbors.push(board[x + 1][y]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x - 1] !== undefined && board[x - 1][y + 1] !== undefined){
                cellNeightbors.push(board[x - 1][y + 1]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x] !== undefined && board[x][y + 1] !== undefined){
                cellNeightbors.push(board[x][y + 1]);
            }else{
                cellNeightbors.push(undefined);
            }

            if(board[x + 1] !== undefined && board[x + 1][y + 1] !== undefined){
                cellNeightbors.push(board[x + 1][y + 1]);
            }else{
                cellNeightbors.push(undefined);
            }


            return cellNeightbors;

            /*

            for(var i = 0; i < cellNeightbors.length; i++){
                if(cellNeightbors[i] !== null){
                    cellNeightborsWithoutNulls.push(cellNeightbors[i]);
                }
            }

            return cellNeightborsWithoutNulls;

            */

        },

        addElementToBoard(board, x, y, element){

            
            if(x < board.board.length && x >= 0  && y >= 0 && y < board.board.length){

                var previousValue = board.board[x][y];

                if(element.type == 'cell' ){
                    board.cellsAmount ++;
                }else if(element.type == 'food') {
                    board.foodAmount ++;
            
                }else if(element.type == 'predator') {
                    board.predatorsAmount ++;
            
                }

                if (previousValue === null){

                    1;

                } else if(previousValue.type == 'cell'  ){
                    board.cellsAmount --;
                }else if(previousValue.type == 'food') {
                    board.foodAmount --;
            
                }else if(previousValue.type == 'predator') {
                    board.predatorsAmount --;
            
                }

                board.board[x][y] = element;
            }

            return board;

        },


        movePredator(board, x, y, neightbours){


            var availablePositions = [];

            for(var i = 0; i < neightbours.length; i++){ 

                if(neightbours[i] === null){
                    availablePositions.push(i);
                }

                
            }

            var newPosition = this.getNewPosition(availablePositions[Math.floor(Math.random() * availablePositions.length)], x, y);
            board[x][y].state = 0;

            return {row : newPosition.row, column: newPosition.column, predator: board[x][y]};


        },

        sleep(miliseconds) {
            var currentTime = new Date().getTime();
        
            while (currentTime + miliseconds >= new Date().getTime()) {
            }
        },


        profile1(){


            var board = new Board();
            board.board = this.initializeBoard(board, 30)
            const cell = new Cell('Levadura', 2.5, 0.2, 0.99, 0.6, 20, 10, 'cell', 1);
            const food = new Food('Azucar', 20, 1, 'food');
            const predator = new Predator('pred-1', 1,  1, 'predator');
            
            
            board = this.addElementToBoard(board, 8, 8, cell);
            board = this.addElementToBoard(board, 8, 7, cell);
            board = this.addElementToBoard(board, 9, 8, cell);
            board = this.addElementToBoard(board, 9, 7, cell);
            board = this.addElementToBoard(board, 7, 9, cell);
            board = this.addElementToBoard(board, 9, 9, cell);
            board = this.addElementToBoard(board, 7, 8, cell);
            board = this.addElementToBoard(board, 24, 24, cell);
            board = this.addElementToBoard(board, 23, 23, cell);
            board = this.addElementToBoard(board, 23, 24, cell);
            board = this.addElementToBoard(board, 23, 23, cell);
            board = this.addElementToBoard(board, 22, 23, cell);
            board = this.addElementToBoard(board, 23, 22, cell);
            board = this.addElementToBoard(board, 23, 21, cell);
            
            
            
            board = this.addElementToBoard(board, 7, 7, food);
            board = this.addElementToBoard(board, 1, 9, food);
            board = this.addElementToBoard(board, 8, 1, food);
            board = this.addElementToBoard(board, 6, 5, food);
            board = this.addElementToBoard(board, 24, 23, food);
            
            
            board = this.addElementToBoard(board, 6, 6, predator);
            board = this.addElementToBoard(board, 1, 1, predator);
            board = this.addElementToBoard(board, 5, 3, predator);
            board = this.addElementToBoard(board, 20, 10, predator);
            board = this.addElementToBoard(board, 19, 19, predator);
            board = this.addElementToBoard(board, 5, 22, predator);
            board = this.addElementToBoard(board, 12, 23, predator);
            board = this.addElementToBoard(board, 23, 11, predator);
            board = this.addElementToBoard(board, 24, 0, predator);
            board = this.addElementToBoard(board, 0, 24, predator);
            board = this.addElementToBoard(board, 15, 15, predator);
            board = this.addElementToBoard(board, 15, 16, predator);
            board = this.addElementToBoard(board, 14, 16, predator);
            board = this.addElementToBoard(board, 16, 16, predator);
            board = this.addElementToBoard(board, 14, 16, predator);
            board = this.addElementToBoard(board, 16, 15, predator);
            board = this.addElementToBoard(board, 10, 12, predator);
            board = this.addElementToBoard(board, 12, 10, predator);
            board = this.addElementToBoard(board, 15,  4, predator);
            board = this.addElementToBoard(board, 5, 15, predator);
            board = this.addElementToBoard(board, 2, 2, predator);
            return board;
        }
  }


}
</script>

<style>

  *{
      padding: 0;
      margin: 0;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }


  .home{

      height: 100%;
      font-family: 'Lato', sans-serif;

      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(10, 1fr);
   
      grid-template-areas: 
      "title     title     title     title     title     title    title"
      "title     title     title     title     title     title    title"
      "board     board     board     board     controls  controls controls"
      "board     board     board     board     controls  controls controls"
      "board     board     board     board     controls  controls controls"
      "board     board     board     board     controls  controls controls"
      "board     board     board     board     controls  controls controls"
      "board     board     board     board     controls  controls controls"
      "board     board     board     board     controls  controls controls"
      "footer    footer    footer    footer    footer    footer   footer"
      ;
  }

  #title {

    grid-area: title;
    /*background-color: #EDAE00;*/
    display: flex;
    justify-content: center;
    align-items:flex-end;
    padding-bottom: 0.7em;
  }

  #title h1{
    font-weight: 500;
    margin: 0 0 0.2em 0;
    color: #000000;
    margin: 0;
  }

  #title hr{

    width: 100%;
    color: #000000;
    display: inline-block;
    margin-bottom: 1em;

  }

  #board{
    grid-area: board;
    /*background-color: #DC8B70;*/
    display: flex;
    flex-direction: row-reverse;

    

  }

  #cells-board{
    background-color: #DFC894;
    border: 3px solid #DC8B70;
    padding: 1em;

    border-radius: 7px;
    height: 92%;
    width: 70%;
    white-space: pre-wrap;


  }

  #cells-board p{

    font-size: 0.75em;



  }

  #controls{
    grid-area: controls;
    /*background-color: #106591;*/

    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-template-areas: 
      "element-placement-buttons"
      "element-placement-buttons"
      "sliders"
      "sliders"
      "sliders"
      "run-simulation"
      ;
  }

  

  .element-placement-buttons {

    grid-area: element-placement-buttons;

  }

  .element-placement-buttons button{
    margin: 0 0 1em 2em;
    padding: 0.6em 0 0.6em 0;
    width: 33%;
    display: block;
    border: 0.16em solid #106591;
    color: #106591;
    background-color: #68FFFA;
    border-radius: 5px;
    font-weight: 500;
    height: 25%;
   
  }

  button p{

    font-size: 100%;
  }




  .sliders{
    grid-area: sliders;
    display: flex;
    padding-top: 1em;
    padding-left: 1em;
  }

  .sliders .slidecontainer1 {
    margin: 0 0 1em  0.6em ;
    display: flex;
    

  }


  .sliders .slidecontainer2{
    margin: 0 0 1em  3em ;
        display: flex;
    

  }


  button:hover{

    background-color: #bef8f6;
    border: 2px solid #000000;
    color: #000000;
    border-radius: 5px;
    font-weight: 600;
    
  }

  .run-button-div{

    grid-area: run-simulation;
    display: flex;
    align-items:flex-end;

  }

  .run-button-div button{
    margin: 0 0 0 2em ;
    padding: 0.8em 0 0.8em 0;
    width: 33%;
    height: 25%;
    border: 2px solid #EDAE00;
    background-color: #EDAE00;
    color: azure;
    font-weight: 600;
    border-radius: 5px;

  }


  .run-button-div button:hover{

    border: 2px solid #EDAE00;
    background-color: #f8c32f;
    font-weight: 700;
    border-radius: 5px;

  }

  #footer{
    grid-area: footer;
    /*background-color: #68FFFA;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }

    #footer h3{

    margin-top: 1em;
    color: white;
    font-weight: 300;
    text-shadow: 2px 2px 4px #000000;
  }



  .divs{
    overflow: hidden;
    height: 100vh;
    background-image: url("./assets/background2.svg");
    background-repeat: no-repeat;
  }

  .black-div{
    	background-color: black;
	    transform: skewY(-60deg);
      position: relative;
      height: 100%;
      z-index: -200;
      bottom: 330%;
  }

  .yellow-div{
    	background-color: #EDAE00;
	    transform: skewY(-80deg);
      position: relative;
      height: 500vh;
      z-index: -300;
      bottom: 750%;
  }

  .pink-div{
    	background-color: #DC8B70;
	    transform: skewY(20deg);
      position: relative;
      height: 100vh;
      z-index: -100;
      bottom: 4000px;
  }






#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}


</style>
