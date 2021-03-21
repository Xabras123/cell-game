const Cell = require('./Cell');
const Food = require('./Food');
const Board = require('./Board');
const Predator = require('./Predator');


function initializeBoard(board, boardSize) {

    let basicBoard = [];

    for(var i = 0; i < boardSize; i++){

        let column = [];
        for(var j = 0; j < boardSize; j++){
            column.push(null);

        }
        basicBoard.push(column);

    }    

    return basicBoard;
    
}

function printBoard(board){
    const boardSize = board.length;
    let printedBoard = '';

    console.log("-----------------------------------")
    for(var i = 0; i < boardSize; i++){

        
        for(var j = 0; j < boardSize; j++){
           
                if(board[i][j] == null){
                    printedBoard += 0;
                    ///console.log('\x1b[33m%s\x1b[0m', '0');
                    
                    process.stdout.write('0 ');

                }else if(board[i][j].type == 'cell') {
                    printedBoard += 1;
                    //console.log("\x1b[32m", '1');
                    process.stdout.write(['\033[', '\x1b[32m', '', '1 ', '\033[0m'].join(''));


                }else if(board[i][j].type == 'food') {
                    printedBoard += 2;
                    //console.log('\x1b[33m%s\x1b[0m', '2');
                    process.stdout.write(['\033[', '\x1b[33m', '', '2 ', '\033[0m'].join(''));


                }else if(board[i][j].type == 'predator') {
                    printedBoard += 3;
                    //console.log("\x1b[34m", '3');
                    process.stdout.write(['\033[', '\x1b[34m', '', '3 ', '\033[0m'].join(''));


                }else{
                    printedBoard += '-';
                }
                printedBoard += ' '
        }

        console.log('')

        //printedBoard += '\n';
        

    }
    console.log("-----------------------------------")

    //console.log(printedBoard);
    
}

function beginLifetime(daysAmount, board, speed){

    for(var i = 0; i < daysAmount; i ++){
        console.log("Day: " + i)

        board = updateBoard(board);
        printBoard(board.board); 
        sleep(speed * 100);
        if(board.cellsAmount < 1){
            break;
        }

    }

    return board;
}

function updateBoard(boardIn){

    var board = boardIn.board
    const boardSize = boardIn.board.length;
    var neightbours = [];
    var survivalChance = 0;
    var reproductionChance = 0;

    for(var i = 0; i < boardSize; i++){

        
        for(var j = 0; j < boardSize; j++){
           
            
            if(board[i][j] !== null){

                if(board[i][j].type == 'cell'){

                    neightbours = getNeightbors(board, i, j);

                    //console.log(neightbours)
                    survivalChance = calculateSurvivalChance(board[i][j], neightbours);
                    //console.log(survivalChance)
                    if(evaluateChance(survivalChance) === true && board[i][j].state > 0){
                        
                        reproductionChance = calculateReproductionChance(board[i][j], neightbours);
                        //console.log(reproductionChance)
                        if(evaluateChance(reproductionChance) == true){

                            //printBoard(board);
                            boardIn.cellsAmount ++;
                            var newCellData = reproduceCell(board, i, j, neightbours);
                            board[newCellData.row][newCellData.column] = newCellData.newCell;
                            
                        }
                    }else if(evaluateChance(survivalChance) === true && board[i][j].state == 0){
                        board[i][j].state = 1;
                    }else{
                        board[i][j] = null;
                        boardIn.cellsAmount --;

                    }

                    //printBoard(board)
                    


                }else if (board[i][j].type == 'predator' && board[i][j].state > 0){
                    
                        if(evaluateChance(board[i][j].moventProbability)){
                            var predator = movePredator(board, i, j, getNeightbors(board, i, j));


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

}
//Math.ceil(Math.random() * 90) - 1;
function calculateSurvivalChance(cell, neightbours){

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

}

function calculateReproductionChance(cell, neightbours){

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

}

function evaluateChance(chance){


    var array = [];
    for(var i = 0; i < 1000; i++){
        array.push(false);

    }
    for(var i = 0; i < Math.ceil(chance * 1000); i++){
        array[i] = true;
    }
    return array[Math.ceil(Math.random() * (1000 - 1))];
}

function reproduceCell(board, parentCellRow, parentCellColumn, parentNeightbours){

    var availablePositions = [];

    for(var i = 0; i < parentNeightbours.length; i++){ 

        if(parentNeightbours[i] === null){
            availablePositions.push(i);
        }
        
    }


    var childPosition = getNewPosition(availablePositions[Math.floor(Math.random() * availablePositions.length)], parentCellRow, parentCellColumn);
    let newCell = board[parentCellRow][parentCellColumn];
    newCell.state = 0;

    return {row : childPosition.row, column: childPosition.column, newCell: newCell};


}

function getNewPosition(i, parentCellRow, parentCellColumn){

  

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

}

function getNeightbors(board, x, y){

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

}

function addElementToBoard(board, x, y, element){

    
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

}


function movePredator(board, x, y, neightbours){


    var availablePositions = [];

    for(var i = 0; i < neightbours.length; i++){ 

        if(neightbours[i] === null){
            availablePositions.push(i);
        }

        
    }

    var newPosition = getNewPosition(availablePositions[Math.floor(Math.random() * availablePositions.length)], x, y);
    board[x][y].state = 0;

    return {row : newPosition.row, column: newPosition.column, predator: board[x][y]};


}

function sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

function profile1(){


    var board = new Board();
    board.board = initializeBoard(board, 30)
    const cell = new Cell('Levadura', 2.5, 0.2, 0.99, 0.6, 20, 10, 'cell', 1);
    const food = new Food('Azucar', 20, 1, 'food');
    const predator = new Predator('pred-1', 1,  1, 'predator');
    
    
    board = addElementToBoard(board, 8, 8, cell);
    board = addElementToBoard(board, 8, 7, cell);
    board = addElementToBoard(board, 9, 8, cell);
    board = addElementToBoard(board, 9, 7, cell);
    board = addElementToBoard(board, 7, 9, cell);
    board = addElementToBoard(board, 9, 9, cell);
    board = addElementToBoard(board, 7, 8, cell);
    board = addElementToBoard(board, 24, 24, cell);
    board = addElementToBoard(board, 23, 23, cell);
    board = addElementToBoard(board, 23, 24, cell);
    board = addElementToBoard(board, 23, 23, cell);
    board = addElementToBoard(board, 22, 23, cell);
    board = addElementToBoard(board, 23, 22, cell);
    board = addElementToBoard(board, 23, 21, cell);
    
    
    
    board = addElementToBoard(board, 7, 7, food);
    board = addElementToBoard(board, 1, 9, food);
    board = addElementToBoard(board, 8, 1, food);
    board = addElementToBoard(board, 6, 5, food);
    board = addElementToBoard(board, 24, 23, food);
    
    
    board = addElementToBoard(board, 6, 6, predator);
    board = addElementToBoard(board, 1, 1, predator);
    board = addElementToBoard(board, 5, 3, predator);
    board = addElementToBoard(board, 20, 10, predator);
    board = addElementToBoard(board, 19, 19, predator);
    board = addElementToBoard(board, 5, 22, predator);
    board = addElementToBoard(board, 12, 23, predator);
    board = addElementToBoard(board, 23, 11, predator);
    board = addElementToBoard(board, 24, 0, predator);
    board = addElementToBoard(board, 0, 24, predator);
    board = addElementToBoard(board, 15, 15, predator);
    board = addElementToBoard(board, 15, 16, predator);
    board = addElementToBoard(board, 14, 16, predator);
    board = addElementToBoard(board, 16, 16, predator);
    board = addElementToBoard(board, 14, 16, predator);
    board = addElementToBoard(board, 16, 15, predator);
    board = addElementToBoard(board, 10, 12, predator);
    board = addElementToBoard(board, 12, 10, predator);
    board = addElementToBoard(board, 15,  4, predator);
    board = addElementToBoard(board, 5, 15, predator);
    board = addElementToBoard(board, 2, 2, predator);
    return board;
}


function profile2(){


    var board = new Board();
    board.board = initializeBoard(board, 25)
    const cell = new Cell('Levadura', 1.0, 0.2, 0.99, 10, 20, 10, 'cell', 1);
    const food = new Food('Azucar', 20, 1, 'food');
    const predator = new Predator('pred-1', 0,7, 1, 'predator');
    
    
    board = addElementToBoard(board, 8, 8, food);
    board = addElementToBoard(board, 8, 7, cell);
    board = addElementToBoard(board, 9, 8, cell);
    board = addElementToBoard(board, 9, 7, cell);
    board = addElementToBoard(board, 7, 9, cell);
    board = addElementToBoard(board, 9, 9, cell);
    board = addElementToBoard(board, 7, 8, cell);
    board = addElementToBoard(board, 24, 24, cell);
    board = addElementToBoard(board, 23, 23, cell);
    board = addElementToBoard(board, 23, 24, cell);
    board = addElementToBoard(board, 23, 23, cell);
    board = addElementToBoard(board, 22, 23, cell);
    board = addElementToBoard(board, 23, 22, cell);
    board = addElementToBoard(board, 23, 21, cell);
    
    
    
    board = addElementToBoard(board, 7, 7, food);
    board = addElementToBoard(board, 1, 9, food);
    board = addElementToBoard(board, 8, 1, food);
    board = addElementToBoard(board, 2, 2, food);
    board = addElementToBoard(board, 10, 9, food);
    board = addElementToBoard(board,11, 15, food);
    board = addElementToBoard(board, 6, 5, food);
    board = addElementToBoard(board, 24, 23, food);
    board = addElementToBoard(board, 11, 11, food);

    board = addElementToBoard(board, 12, 12, food);
    board = addElementToBoard(board, 13, 13, food);
    board = addElementToBoard(board, 14, 13, food);
    board = addElementToBoard(board, 15, 13, food);
    board = addElementToBoard(board, 20, 14, food);
    board = addElementToBoard(board, 17, 12, food);

    board = addElementToBoard(board, 17, 13, food);
    board = addElementToBoard(board, 18, 13, food);
    board = addElementToBoard(board, 20, 13, food);

    
    
    board = addElementToBoard(board,  23, 11, predator);
    board = addElementToBoard(board,  24, 0, predator);
    board = addElementToBoard(board,  0, 24, predator);
    board = addElementToBoard(board,  15, 16, predator);
    board = addElementToBoard(board,  16, 15, predator);
    board = addElementToBoard(board,  12, 10, predator);
    board = addElementToBoard(board,  15,  4, predator);
    board = addElementToBoard(board,  2, 2, predator);
    return board;
}




function profile3(){


    var board = new Board();
    board.board = initializeBoard(board, 35)
    const cell = new Cell('Levadura', 1.2, 0.2, 0.99, 90, 20, 20, 'cell', 1);
    const food = new Food('Azucar', 20, 1, 'food');
    const predator = new Predator('pred-1', 0.3,  1, 'predator');



    board = addElementToBoard(board, 2, 22, food);
    board = addElementToBoard(board, 2, 21, food);
    board = addElementToBoard(board, 2, 20, food);
    board = addElementToBoard(board, 2, 19, food);
    board = addElementToBoard(board, 2, 18, food);
    board = addElementToBoard(board, 2, 17, food);
    board = addElementToBoard(board, 2, 16, food);
    board = addElementToBoard(board, 2, 15, food);
    board = addElementToBoard(board, 2, 14, food);
    board = addElementToBoard(board, 2, 13, food);
    board = addElementToBoard(board, 2, 12, food);
    board = addElementToBoard(board, 2, 11, food);
    board = addElementToBoard(board, 2, 10, food);
    board = addElementToBoard(board, 2, 9, food);
    board = addElementToBoard(board, 2, 8, food);
    board = addElementToBoard(board, 2, 7, food);
    board = addElementToBoard(board, 2, 6, food);
    board = addElementToBoard(board, 2, 5, food);
    board = addElementToBoard(board, 2, 4, food);
    board = addElementToBoard(board, 2, 3, food);
    board = addElementToBoard(board, 2, 2, food);
    board = addElementToBoard(board, 3, 2, food);
    board = addElementToBoard(board, 4, 2, food);
    board = addElementToBoard(board, 5, 2, food);
    board = addElementToBoard(board, 6, 2, food);
    board = addElementToBoard(board, 7, 2, food);
    board = addElementToBoard(board, 8, 2, food);
    board = addElementToBoard(board, 9, 2, food);
    board = addElementToBoard(board, 10, 2, food);
    board = addElementToBoard(board, 11, 2, food);
    board = addElementToBoard(board, 12, 2, food);
    board = addElementToBoard(board, 13, 2, food);
    board = addElementToBoard(board, 14, 2, food);
    board = addElementToBoard(board, 15, 2, food);
    board = addElementToBoard(board, 16, 2, food);
    board = addElementToBoard(board, 17, 2, food);
    board = addElementToBoard(board, 18, 2, food);
    board = addElementToBoard(board, 19, 2, food);
    board = addElementToBoard(board, 20, 2, food);
    board = addElementToBoard(board, 21, 2, food);
    board = addElementToBoard(board, 22, 2, food);
    

    board = addElementToBoard(board, 3,  22, food);
    board = addElementToBoard(board, 4,  22, food);
    board = addElementToBoard(board, 5,  22, food);
    board = addElementToBoard(board, 6,  22, food);
    board = addElementToBoard(board, 7,  22, food);
    board = addElementToBoard(board, 8,  22, food);
    board = addElementToBoard(board, 9,  22, food);
    board = addElementToBoard(board, 10, 22, food);
    board = addElementToBoard(board, 11, 22, food);
    board = addElementToBoard(board, 12, 22, food);
    board = addElementToBoard(board, 13, 22, food);
    board = addElementToBoard(board, 14, 22, food);
    board = addElementToBoard(board, 15, 22, food);
    board = addElementToBoard(board, 16, 22, food);
    board = addElementToBoard(board, 17, 22, food);
    board = addElementToBoard(board, 18, 22, food);
    board = addElementToBoard(board, 19, 22, food);
    board = addElementToBoard(board, 20, 22, food);
    board = addElementToBoard(board, 21, 22, food);
    board = addElementToBoard(board, 22, 22, food);

    board = addElementToBoard(board, 2, 23, cell);
    board = addElementToBoard(board, 3, 23, cell);
    board = addElementToBoard(board, 3, 22, cell);
    board = addElementToBoard(board, 2, 22, cell);


    
    
    board = addElementToBoard(board,12, 12, predator);

    return board;
}

var board = profile1();
console.log("Board Initialized")
printBoard(board.board);



//constructor(name, socialBias, sofocationBias, reproductionBias, foodBias, predatorBias, temperatureBias, type, state) {




console.log("Elements Added")
printBoard(board.board);

var days = 90;
board = beginLifetime(days, board, 1);

console.log("Life Initializated" + "Days passed: " + days)
printBoard(board.board);



