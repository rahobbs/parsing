// Based on http://en.wikipedia.org/wiki/Recursive_descent_parser

function Calculator(expression) {
  this.expressionToParse = expression.replace(/\s+/g, '').split('');
}

Calculator.prototype.run = function () {
  return this.expression();
}

Calculator.prototype.peek = function () {
  return this.expressionToParse[0] || '';
};

Calculator.prototype.get = function () {
  return this.expressionToParse.shift();
}

/*
  Grammar Rule:
  number = [0-9] {[0-9.]+}
  Hint: remember this means we need to get the first number
    followed by any number of numbers (or the period .)
 */
Calculator.prototype.number = function () {
  var nextChar = this.peek();
  if (!nextChar.match(/[0-9.]/)){
    return '';
  } else {
    if (nextChar === '.'){
      return this.get() + this.number();
    }
    return Number(this.get() + this.number());
  }
}

/* Grammar Rule:
  factor = number
          | "(" expression ")"
          | - factor
  Hints:
    - If we see a number, produce a number
    - If we see a (  then consume it and an expression
    - If we see a "-", return the negative of the factor
 */
Calculator.prototype.factor = function () {

  var nextChar = this.peek();

  if (nextChar.match(/[0-9.]/)){
    return this.number();
  } else if (nextChar === '-'){
    this.get();
    return 0 - this.number();
  } else if (nextChar === '('){
    nextChar = this.get();
    var innerExp = '';
    while (nextChar !== ')'){
      nextChar = this.get();
      innerExp += nextChar;
    }
    if (innerExp.slice(innerExp.length - 1 === ')')){
      innerExp = innerExp.slice(0,innerExp.length - 1);
    }

    return Number(innerExp);
  }
}

/*
  term = factor {(*|/) factor}
 */
Calculator.prototype.term = function () {
  var result = this.factor();
  while (this.peek() == '*' || this.peek() == '/') {
    if (this.get() == '*') {
      result *= this.factor();
    } else {
      result /= this.factor();
    }
  }
  return result;


  // var nextChar = this.peek();
  // if (nextChar !== '*' || nextChar !== '/'){
  //   return this.number();
  // } else if{
  //   var result = this.number();
  //   while (this.peek() == '*' || this.peek() == '/') {
  //     if (this.get() == '*') {
  //       result *= this.number();
  //     } else {
  //       result /= this.term();
  //     }
  //   }
  //   return result;
  // }
  // return this.factor();
}

/* Grammar Rules
    expression = term {(+|-) term}
*/
Calculator.prototype.expression = function () {
  var result = this.term();
  while (this.peek() == '+' || this.peek() == '-') {
    if (this.get() == '+') {
      result += this.term();
    } else {
      result -= this.term();
    }
  }
  return result;
}
