var displayPanel = document.getElementById("display-main");
let errorConsole = document.getElementById("error-console");
let display = []; //numbers and operators are pushed into this array
let expression; //turn display array into a string inside the calculate function
let operators = ["^", "÷", "×", "-", "+", "."];
var operands;
var notes;
let keypad = document.querySelector(".keypad");//buttons
let cursor = 0;//initial position
let min = 0;

//renders cursor & update the display
function render(){
    let before = display.slice(0, cursor).join("");
    let after = display.slice(cursor).join("");
    displayPanel.innerHTML = before + '<span class="cursor">|</span>' + after;
}
let pushElement = function(element){//push numbers and operators into display array once buttons are clicked
    //check if users aren't putting multiple operators adjascent to each other
    if(operators.includes(element) && operators.includes(display[display.length-1])){//if it was an operator
        errorConsole.textContent = "invalid input";
        return;
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
//function for deleting operators
var updateArray = function(index, index2, result){
    operands.splice(index, 2);
    operands.splice(index, 0, result);
}
  
//collect each operator and its index
var array = [
  [],//squares
  [],//division
  [],//multiply
  [],//addition
  [] //subtraction
];

//commences calculation
let calculate = function(){
    //display an error when there is an operator in the display array 
    if(display.length === 1 && operators.includes(display[0])){
        errorConsole.textContent = "invalid input";
        return;
    }else if(display.length > 1){
    errorConsole.textContent = "";
    expression = display.join("");
    operands = expression.split(/[+\×\÷\^\-]/).map(Number);
    notes = expression.match(/[\+\-\÷\×\^]/g)

//output index of each occurence
notes.forEach(
  (item, index) => {
    if(item == "^"){
      array[0].push(index);
    }else if(item == "÷"){
      array[1].push(index);
    }else if(item == "×"){
      array[2].push(index);
    }else if(item == "+"){
      array[3].push(index);
    }else{
      array[4].push(index);
    }
  })

//calculate squares
array[0].forEach(
  (index, ind) => {
    var result = square(operands[index], operands[index+1]);
    updateArray(index, ind, result);
  })
//calculate division
array[1].forEach(
  (index, ind) => {
    var result = divide(operands[index], operands[index+1]);
    updateArray(index, ind, result);
  })
//calculate multiplication
array[2].forEach(
  (index, ind) => {
    var result = multiply(operands[index], operands[index+1]);
    updateArray(index, ind, result);
  })
//calculate addition
array[3].forEach(
  (index, ind) => {
    var result = add(operands[index], operands[index+1]);
    updateArray(index, ind, result);
  })
//calculate subtraction
array[4].forEach(
  (index, ind) => {
    var result = subtract(operands[index], operands[index+1]);
    updateArray(index, ind, result);
  })
//display result
displayPanel.innerText = operands[0];
//clear all the previous entry
display = [];
//let users start with the result
display.push(operands[0]);
//clear all arrays
array = [ [], [], [], [], [] ];
}

}

