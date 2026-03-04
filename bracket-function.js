let input = ["1", "+", "(", "2", "+", "3", ")"];

function isCorrect(){
  //if the bracket button was pressed but the previously pushed element was a digit, return false
  if(element === "(" && !operators.includes(display[display.length-1])){
   return false;
}else{
    return true;
}
}

let pushElement = function(element){//push numbers and operators into display array once buttons are clicked
    //check if users aren't putting multiple operators adjascent to each other
    if(operators.includes(element) && operators.includes(display[display.length-1])){//if it was an operator
        errorConsole.textContent = "invalid input";
        return;
    }else{
        display.push(element);
    }

    
    //updates displaypanel
    displayPanel.innerText = display.join("");
}

//error check implemented when a bracket button was pressed


  
