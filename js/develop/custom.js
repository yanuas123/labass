'use strict';

var timers = {};

// прибавит время выполнения f к таймеру timers[timer]
function timingDecorator(f, timer) {
  return function() {
    var start = performance.now();

    var result = f.apply(this, arguments); // (*)

    if (!timers[timer]) timers[timer] = 0;
    timers[timer] += performance.now() - start;

    return result;
  }
}

// функция может быть произвольной, например такой:
var fibonacci = function f(n) {
  return (n > 2) ? f(n - 1) + f(n - 2) : 1;
}

console.log( fibonacci );
// использование: завернём fibonacci в декоратор
fibonacci = timingDecorator(fibonacci, "fibo");

console.log( fibonacci );

// неоднократные вызовы...
console.log( fibonacci(10) ); // 55
console.log( fibonacci(20) ); // 6765
// ...

// в любой момент можно получить общее количество времени на вызовы
console.log( timers.fibo + 'мс' );