var displayPanel = document.getElementById("display-main");
let errorConsole = document.getElementById("error-console");
let display = []; //numbers and operators are pushed into this array
let expression; //turn display array into a string inside the calculate function
let operators = ["^", "÷", "×", "-", "+", "."];
let curlies = ["(", ")"];
var operands;
var notes;
let keypad = document.querySelector(".keypad");//buttons
let cursor = 0;//initial position
let min = 0;

//checks if the brackets are in valid positions
//excute when equal button was pressed
function rBracketsValid(array){
    let paraCount = 0;
      array.forEach((ele) => {
        if(ele === "("){
          paraCount ++;
        }else if(ele === ")"){
          if(paraCount === 0){
            return false;
          }else{
            paraCount --;
          }
        }
      })
      return paraCount === 0;
}

//renders cursor & update the display
function render(){
    let before = display.slice(0, cursor).join("");
    let after = display.slice(cursor).join("");
    displayPanel.innerHTML = before + '<span class="cursor">|</span>' + after;
}
let pushElement = function(element){//push numbers and operators into display array once buttons are clicked
    //is the last element operator?
    if(display.length > 0){

        let lastEle = display[display.length-1];
        let isLastOp = operators.includes(lastEle);
        let isItOp = operators.includes(element); 
        //check if users aren't putting multiple operators adjascent to each other
        if(isLastOp && isItOp){
            errorConsole.textContent = "invalid input";
            return;
        //check if there is a digit before an initial bracket
        }else if(!isLastOp && element === "("){
            errorConsole.textContent = "invalid input";
            return;
        }else if(!isItOp && lastEle === ")"){
            errorConsole.textContent = "invalid input";
            return;
        }else{
            //add the element to the display array
        display.splice(cursor, 0, element);
        //moves the cursor to its current position
        cursor+=1;
        }
    }else{
        display.splice(cursor, 0, element);
        cursor+=1;
    }
    //updates displaypanel
    render();
}

let deleteEle = function(){
    display.pop();
    render();
}
let deleteAll = function(){
    display = [];
    render();
    errorConsole.textContent = "";
}


//pushes element when buttons are pressed
keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if(!btn)return;
    const value = btn.dataset.value;
    const type = btn.dataset.type;
    if(type === "digit" || type === "operator" || type === "decimal"){
        pushElement(value);
    }
})

//navigates the cursor when arrow buttons are pressed
window.addEventListener("keydown", (event)=> {
    if(event.key === "ArrowLeft"){
            cursor = Math.max(cursor -1, min);
            render();
        }else if(event.key === "ArrowRight"){
            let max = display.length;
            cursor = Math.min(max, cursor+1);
            render();
        }else if(event.key === "Backspace"){
            if(cursor>0){
                display.splice(cursor-1, 1);
                cursor-=1;
            }
            render();
        }
})
const solveBtn = document.getElementById("solve");
solveBtn.addEventListener("click", bracketSolve(display));

//system for calculating numbers
var multiply = function(num, num2){
  return num*num2;
}
var divide = function(num, num2){
  return num/num2;
}
var add = function(num, num2){
  return num + num2;
}
var subtract = function(num, num2){
  return num - num2;
}
var square = function(num, num2){
  return num**num2;
}

//a function for updating the calculated part
function updArray(array, index, result){
  //delete the already calculated part
    array.splice(index, 2);
    //insert the result
    array.splice(index, 0, result);
}
  
function displayResult(result){
    display = [];
    display = [result];
    //bring the cursor to the initial position
    cursor = 0;
    render();
    
}

//rewriting calculation function
function calc(array){
    //parameter array is the part that is calculated
    if(!array || Array.isArray(array)){
        console.log("received a wrong array");
        return;
    }
    //check if there at least one set of two operands and one operator
    //and if neither the first input nor the last input is an operator
    if(array.length === 0 || operators.includes(array[0]) || operators.includes(array[array.length-1])){
      errorConsole.textContent = "Invalid Input";
      return;
    }else{
      //delete the error message
      errorConsole.textContent = "";
      //get the target expression
    let expre = array.join("");
    //seperate operators from operands
    let notes = expre.match(/[\+\-\^\÷\×]/g) || [];
    let numbers = expre.split(/[\+\-\^\÷\×]/).map(Number);

        //if there is only one number
        if(notes.length === 0){
            return numbers[0];
        }
    //loop through operands and calculate
    for(let i=0; i<notes.length; i++){
        //if it's squares
        let note = notes[i];
        let num1 = numbers[0];
        let num2 = numbers[1];
        let result;
        if(note === "^"){
           result = square(num1, num2);
        }else if(note === "×"){
           result = multiply(num1, num2);
        }else if(note === "÷"){
          result = divide(num1, num2);
        }else if(note === "+"){
          result = add(num1, num2);
        }else{
          result = subtract(num1, num2);
        }
        updArray(numbers, 0, result);
    }
    //return the answer
    
    return numbers[0];
    }  
}


//stores positions of opening brackets
function bracketSolve(array){
  console.log("commence calc");
    let stack = [];
    //if there is no brackets in the array, just calculate normally
  if(!array.includes(")") && !array.includes(")")){
    console.log(calc(array));
    displayResult(calc(array));
    //display the result
  }else{
  
  if(!rBracketsValid(array)){
    errorConsole.textContent = "invalid input";
    //start calculation
  }else{

    while(array.includes("(")){

        stack = [];

        for(let i = 0; i < array.length; i++){

            if(array[i] === "("){
                stack.push(i);
            }

            else if(array[i] === ")"){

                let start = stack.pop();
                let inner = array.slice(start + 1, i);
                let res = calc(inner);
                console.log(inner);
                if(res === undefined){
                    console.log("something went wrong");
                    return;
                }
                array.splice(start, i - start + 1, res);

                break; // restart the whole scan cleanly
            }
        }
    }
    //returns a clean array without brackets
    console.log(calc(array));
    displayResult(calc(array));
  }
  }
}

