let input = ["1", "+", "(", "2", "+", "3", ")"];
let stack = [];
let paraCount = 0;
function isCorrect(){
  //if the bracket button was pressed but the previously pushed element was a digit, return false
  if(element === "(" && !operators.includes(display[display.length-1])){
   return false;
}else{
    return true;
}
}
//function for checking whether brackets are properly placed. 
//only checks whether brackets are in pairs and not ")(" like a broken marriage
function bracketsValid(nums){
  nums.forEach((ele) => {
    if(ele === "("){
      paraCount++;
    }else if(ele === ")"){
      if(paraCount === 0){
        return false;
      }
        paraCount --;
    }
    return paraCount = 0;
  })
}

function bracketSolve(token){
  token.forEach((ele, index) => {
    let start;
    if(ele ===  "("){
      start = index;
    }else if(ele === ")"){
      //take out the content of the brackets
      let inner = token.slice(start+1, index);
      token.splice(start, index-start+1); 
      //call solve function
      let result;
      token.splice(start, 0, result);
    }
  })
}


  
