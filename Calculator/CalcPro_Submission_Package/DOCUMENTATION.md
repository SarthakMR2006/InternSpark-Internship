# CalcPro - JavaScript Calculator App

**Internship Mini Project:** DOM Manipulation using JavaScript  
**Submitted by:** [Your Name]  
**Date:** June 2026

## Project Overview

CalcPro is a mini interactive calculator app built with HTML, CSS, and vanilla JavaScript. The main requirement was to make a calculator using DOM manipulation, so I created a working calculator that updates the screen, handles button clicks, supports keyboard input, stores history, and includes extra scientific and unit conversion features.

I tried to keep the project useful, clean, and easy to understand. Along with normal calculator operations, I added scientific functions, memory buttons, calculation history, copy result, and a unit converter.

## Main Features

- Basic operations: addition, subtraction, multiplication, and division
- Decimal numbers, percentage, plus/minus toggle, square root, and backspace
- Scientific mode with sin, cos, tan, inverse trig, log, ln, powers, factorial, pi, and e
- DEG/RAD angle mode for trigonometry
- Memory buttons: MC, MR, and M+
- Calculation history with clickable results
- Unit converter for length, weight, temperature, speed, area, and data
- Copy result button
- Keyboard support for numbers, operators, Enter, Backspace, Escape, and %
- Error handling for invalid calculations like division by zero

## Extra Improvement Added

One important improvement is that scientific functions can now work in a more natural calculator style.

Example:

- Press `sqrt`, then `8`, then `=` to find the square root of 8
- Press `sin`, then `30`, then `=` to find sin(30)
- Press `cos`, then `60`, then `=` to find cos(60)

This makes the app feel closer to a real scientific calculator because users can select the function first and then enter the number.

## How The Code Works

The calculator is controlled using a few JavaScript variables. These variables remember what is currently on the display and what operation is waiting.

```javascript
let display = '0';
let expression = '';
let justCalc = false;
let memory = null;
let calcHistory = [];
let angleMode = 'DEG';
let currentMode = 'standard';
let pendingOp = null;
let prevVal = null;
let pendingUnary = null;
```

Simple explanation:

- `display` stores the number shown on the calculator screen.
- `expression` stores the small expression text shown above the main result.
- `pendingOp` stores an operation like `+`, `-`, `x`, or `/` after the user presses it.
- `prevVal` stores the first number in a calculation.
- `pendingUnary` stores functions like `sqrt`, `sin`, or `cos` when the user presses the function before entering the number.
- `memory` stores the calculator memory value.
- `calcHistory` stores previous calculations.
- `angleMode` stores whether trig functions use DEG or RAD.

## Display Update

This function updates the calculator screen. Instead of refreshing the page, JavaScript directly changes the text inside the display element.

```javascript
function updateDisplay(val, type) {
  const el = document.getElementById('mainDisplay');
  el.textContent = val;
  el.className = 'main-display' + (type ? ' ' + type : '');
}
```

Why it is important:

- It uses DOM manipulation with `getElementById`.
- It changes the visible result using `textContent`.
- It also changes the display style when the answer is a result or an error.

## Number Input

When a number button is clicked, this function adds that digit to the display.

```javascript
function inputNum(d) {
  if (justCalc) {
    display = d;
    justCalc = false;
  } else {
    if (display === '0' || display === 'Error') display = d;
    else if (display.length < 15) display += d;
  }
  updateDisplay(display);
  updateHistExpr((expression || '') + display);
}
```

Simple explanation:

- If the display is showing a completed result, the next digit starts a new number.
- If the display already has a number, the new digit is added to the end.
- The display is updated immediately after every click.

## Basic Operations

When the user presses an operator button, the app stores the first number and the selected operator.

```javascript
function inputOp(op) {
  if (display === 'Error') return;
  applyPendingUnary();
  const num = parseFloat(display);

  if (prevVal !== null && pendingOp !== null && !justCalc) {
    const chained = applyOp(prevVal, num, pendingOp);
    if (!isFinite(chained)) { showError(); return; }
    prevVal = chained;
    display = formatNum(chained);
    updateDisplay(display);
  } else {
    prevVal = num;
  }

  pendingOp = op;
  expression = formatNum(prevVal) + ' ' + op + ' ';
  justCalc = true;
  updateHistExpr(expression);
}
```

Simple explanation:

- If the user presses `3 +`, the app stores `3` as `prevVal` and `+` as `pendingOp`.
- If the user continues with another operator, the previous operation is completed first.
- This allows chained calculations like `3 + 5 x 2`.

## Final Calculation

This function runs when the user presses `=`.

```javascript
function calculate() {
  if (pendingUnary !== null) {
    applyPendingUnary();
    if (pendingOp === null || prevVal === null) return;
  }
  if (pendingOp === null || prevVal === null) return;

  const b = parseFloat(display);
  const result = applyOp(prevVal, b, pendingOp);
  const exprStr = expression + formatNum(b) + ' =';

  if (!isFinite(result)) {
    addToHistory(exprStr, 'Error');
    updateDisplay('Error', 'error');
    display = 'Error';
  } else {
    const r = formatNum(result);
    addToHistory(exprStr, r);
    display = r;
    updateDisplay(r, 'result');
  }
}
```

Simple explanation:

- It checks if a scientific function like `sqrt` or `sin` is waiting.
- Then it calculates the final answer.
- If the answer is invalid, it shows `Error`.
- If the answer is valid, it updates the display and saves the calculation in history.

## Scientific Function Fix

The most important logic is the `pendingUnary` system. A unary function is a function that needs only one number, like `sqrt(8)` or `sin(30)`.

```javascript
function setPendingUnary(op) {
  if (display === 'Error') return;
  pendingUnary = op;
  justCalc = true;
  updateHistExpr((expression || '') + op + '(');
}

function applyPendingUnary() {
  if (pendingUnary === null || display === 'Error') return;
  const n = parseFloat(display);
  const op = pendingUnary;
  pendingUnary = null;
  finishUnary(op + '(' + display + ')', runUnary(op, n));
}
```

Simple explanation:

- If the user presses `sqrt` first, the app remembers that `sqrt` is waiting.
- When the user enters `8` and presses `=`, the app applies square root to `8`.
- This also works for `sin`, `cos`, `tan`, inverse trig, log, ln, and other one-number functions.

## Running Scientific Functions

This function contains the actual formulas for scientific operations.

```javascript
function runUnary(op, n) {
  const isRad = (angleMode === 'RAD');

  switch (op) {
    case 'sqrt': return Math.sqrt(n);
    case 'sin': return Math.sin(isRad ? n : toRad(n));
    case 'cos': return Math.cos(isRad ? n : toRad(n));
    case 'tan': return Math.tan(isRad ? n : toRad(n));
    case 'asin': return isRad ? Math.asin(n) : toDeg(Math.asin(n));
    case 'acos': return isRad ? Math.acos(n) : toDeg(Math.acos(n));
    case 'atan': return isRad ? Math.atan(n) : toDeg(Math.atan(n));
    case 'log': return Math.log10(n);
    case 'ln': return Math.log(n);
    case 'x²': return n * n;
    case 'x³': return n * n * n;
    case '10ˣ': return Math.pow(10, n);
    case 'eˣ': return Math.exp(n);
    case '1/x': return 1 / n;
    case '|x|': return Math.abs(n);
    case 'n!': return factorial(n);
    default: return NaN;
  }
}
```

Simple explanation:

- JavaScript's built-in `Math` functions do the real calculation.
- For trigonometry, the app converts degrees to radians when DEG mode is selected.
- The `switch` statement chooses the correct formula based on the button clicked.

## History Feature

The history feature stores the latest calculations and creates history rows using JavaScript.

```javascript
function addToHistory(expr, result) {
  calcHistory.unshift({ expr, result });
  if (calcHistory.length > 30) calcHistory.pop();
  renderHistory();
}
```

Simple explanation:

- New calculations are added to the top of the history list.
- The app stores only the latest 30 calculations.
- The history is rebuilt on the page using DOM manipulation.

## Unit Converter

For most units, the app converts by using a base unit.

```javascript
result = (fromVal * cat[fromUnit]) / cat[toUnit];
```

Simple explanation:

- Each unit has a conversion factor.
- The input is first converted to a base unit.
- Then it is converted from the base unit to the target unit.

Temperature is handled separately because Celsius, Fahrenheit, and Kelvin need formulas with offsets.

```javascript
function convertTemp(val, from, to) {
  let c;
  if (from === 'C') c = val;
  else if (from === 'F') c = (val - 32) * 5 / 9;
  else c = val - 273.15;

  if (to === 'C') return c;
  if (to === 'F') return c * 9 / 5 + 32;
  return c + 273.15;
}
```

## DOM Manipulation Used

| DOM Technique | Where It Is Used |
|---|---|
| `getElementById()` | Display, history, converter inputs |
| `querySelectorAll()` | Mode tabs and history rows |
| `textContent` | Updating display text |
| `classList.add()` / `classList.remove()` / `classList.toggle()` | Tabs, history panel, memory badge, toast |
| `createElement()` | Creating history items |
| `appendChild()` | Adding history items to the page |
| `addEventListener()` | Keyboard support |
| `style.display` | Switching between standard and scientific mode |

## Testing Done

- Checked addition, subtraction, multiplication, and division
- Checked decimal input and percentage
- Checked division by zero shows `Error`
- Checked backspace and clear all
- Checked memory add, recall, and clear
- Checked history stores previous answers
- Checked unit converter calculations
- Checked keyboard input
- Checked scientific functions after typing the number
- Checked scientific functions before typing the number, like `sqrt` then `8` then `=`

## Conclusion

This project helped me understand how JavaScript can control a webpage through DOM manipulation. The calculator is not only a basic calculator, but also includes useful extra features like scientific mode, history, memory, and unit conversion. The main focus was to keep the app interactive, easy to use, and reliable for submission.
