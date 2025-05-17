class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
   this.previousOperandTextElement = previousOperandTextElement;
   this.currentOperandTextElement = currentOperandTextElement;
   this.justComputed = false; // Add a flag to track if = was just pressed
   this.clear();
  }
 
  clear() {
   this.currentOperand = '0';
   this.previousOperand = '';
   this.operation = undefined;
   this.justComputed = false; // Reset flag on clear
   this.updateDisplay();
  }
 
  delete() {
   // If the last action was '=', treat delete like a clear to start fresh
   if (this.justComputed) {
       this.clear();
       return;
   }
   this.currentOperand = this.currentOperand.toString().slice(0, -1);
   if (this.currentOperand === '') {
    this.currentOperand = '0';
   }
    this.justComputed = false; // Reset flag on delete
   this.updateDisplay();
  }
 
  appendNumber(number) {
   // If = was just pressed, start a new number input
   if (this.justComputed) {
    this.currentOperand = number;
    this.previousOperand = ''; // Clear previous history
    this.operation = undefined; // Clear previous operation
    this.justComputed = false; // Reset flag
   } else {
       // Prevent multiple decimals
       if (number === '.' && this.currentOperand.includes('.')) return;
       // Prevent leading zero unless it's just '0.'
       if (this.currentOperand === '0' && number !== '.') {
        this.currentOperand = number;
       } else {
        this.currentOperand = this.currentOperand.toString() + number.toString();
       }
   }
   this.updateDisplay();
  }
 
  chooseOperation(operation) {
   // If the current display is 'Error', clear it before choosing operation
   if (this.currentOperand.toString().includes('Error')) {
      this.clear();
      return;
   }
 
   // If the last action was '=', use the result as the previous operand for a new calculation chain
   if (this.justComputed) {
       this.previousOperand = this.currentOperand;
       this.currentOperand = '0'; // Clear current operand for new input
       this.operation = operation;
       this.justComputed = false; // Reset flag
   } else {
       if (this.currentOperand === '' && this.previousOperand === '') return; // Don't add operator if display is empty
       // If there is a previous operation pending, compute it first
       if (this.previousOperand !== '') {
        this.compute(); // This will update currentOperand with the result and reset justComputed
       }
       this.operation = operation;
       this.previousOperand = this.currentOperand; // The (possibly newly computed) result becomes the previous
       this.currentOperand = '0'; // Clear current operand for new input
   }
    this.justComputed = false; // Reset flag when choosing a new operation
    this.updateDisplay();
  }
 
  compute() {
   let computation;
   const prev = parseFloat(this.previousOperand);
   const current = parseFloat(this.currentOperand);
 
   // Check if there's enough info to compute
   if (this.previousOperand === '' || this.operation === undefined || this.currentOperand === '') return;
   if (isNaN(prev) || isNaN(current)) {
        this.currentOperand = 'Error: NaN';
         this.previousOperand = '';
         this.operation = undefined;
         this.updateDisplay();
         setTimeout(() => this.clear(), 1500);
         return;
   }
 
   switch (this.operation) {
    case '+':
     computation = prev + current;
     break;
    case '−':
     computation = prev - current;
     break;
    case '×':
     computation = prev * current;
     break;
    case '/':
     if (current === 0) {
       this.currentOperand = 'Error: ÷0';
       this.previousOperand = '';
       this.operation = undefined;
       this.updateDisplay();
       setTimeout(() => this.clear(), 1500);
       return; // Stop computation if division by zero
     }
     computation = prev / current;
     break;
    default:
     return; // Should not happen with valid operations
   }
   this.currentOperand = computation.toString();
   this.operation = undefined; // Clear the operation
   this.previousOperand = ''; // Clear the previous operand history
   this.justComputed = true; // Set flag because compute was successful
   this.updateDisplay();
  }
 
  updateDisplay() {
   // Ensure current operand is displayed, and previous is shown with operation
   this.currentOperandTextElement.innerText = this.formatNumber(this.currentOperand);
   if (this.operation != null && this.previousOperand !== '') { // Only show previous if there's an operation AND previous value
    this.previousOperandTextElement.innerText = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
   } else {
    this.previousOperandTextElement.innerText = ''; // Hide previous if no pending operation
   }
  }
 
  formatNumber(number) {
     const stringNumber = number.toString();
 
      // Handle 'Error' text
      if (stringNumber.includes('Error')) return stringNumber;
 
 
      // Format large/small numbers with limited decimal places
      if (Math.abs(parseFloat(number)) > 999999 || (Math.abs(parseFloat(number)) < 0.000001 && parseFloat(number) !== 0)) {
           try { // Use try-catch in case of formatting errors
               return parseFloat(number).toPrecision(10); // More flexible than toExponential or toFixed
           } catch (e) {
               return stringNumber; // Fallback
           }
      }
 
 
      // Formatting for large integers with commas
      if (stringNumber.includes('.') === false) {
          const parts = stringNumber.split('.');
          const integerDisplay = parseFloat(parts[0]).toLocaleString('en', { maximumFractionDigits: 0 });
           return integerDisplay;
      }
 
 
       // Simple limit for decimals in regular numbers
       if (stringNumber.split('.')[1] && stringNumber.split('.')[1].length > 10) {
            // If it's not too big or small (handled above) limit decimal points
            const num = parseFloat(number);
            if (!isNaN(num)) {
                return num.toFixed(10).replace(/\.?0+$/, ''); // To fixed and remove trailing zeros
            }
        }
 
     // Default return the string as is
     return stringNumber;
  }
 
 
  togglePlusMinus() {
   const current = parseFloat(this.currentOperand);
    if (!isNaN(current) && this.currentOperand !== '0') {
        this.currentOperand = (current * -1).toString();
        this.justComputed = false; // Unset flag
        this.updateDisplay();
     }
  }
 
  calculatePercentage() {
    const current = parseFloat(this.currentOperand);
     if (!isNaN(current)) {
      this.currentOperand = (current / 100).toString();
       this.justComputed = false; // Unset flag
      this.updateDisplay();
     }
  }
 
  square() {
    const current = parseFloat(this.currentOperand);
    if (!isNaN(current)) {
      this.currentOperand = Math.pow(current, 2).toString();
       this.justComputed = false; // Unset flag
      this.updateDisplay();
    }
  }
 
  root() {
     const current = parseFloat(this.currentOperand);
     if (!isNaN(current) && current >= 0) {
       this.currentOperand = Math.sqrt(current).toString();
        this.justComputed = false; // Unset flag
       this.updateDisplay();
     } else if (current < 0) {
        this.currentOperand = 'Error: √neg';
        this.updateDisplay();
        setTimeout(() => this.clear(), 1500);
     }
  }
 
  calculateLog() {
      const current = parseFloat(this.currentOperand);
    if (!isNaN(current) && current > 0) {
      this.currentOperand = Math.log10(current).toString();
       this.justComputed = false; // Unset flag
      this.updateDisplay();
    } else if (current <= 0) {
         this.currentOperand = 'Error: log(<=0)';
         this.updateDisplay();
         setTimeout(() => this.clear(), 1500);
      }
  }
 }
 
 // Get elements (selectors remain the same)
 const previousOperandTextElement = document.querySelector('.previous-operand');
 const currentOperandTextElement = document.querySelector('.current-operand');
 const numberButtons = document.querySelectorAll('.number-button');
 const operatorButtons = document.querySelectorAll('.operator-button');
 const equalsButton = document.querySelector('.equals-button');
 const clearButton = document.querySelector('.clear');
 const deleteButton = document.querySelector('.delete');
 const plusMinusButton = document.querySelector('.plus-minus');
 const percentButton = document.querySelector('.percent');
 const decimalButton = document.querySelector('.decimal');
 const darkModeToggle = document.getElementById('darkModeToggle');
 
 // Select the main calculator element for dark mode class toggling
 const calculatorElement = document.querySelector('.calculator');
 const calculatorWrapper = document.querySelector('.calculator-wrapper'); // Keep this if you want to style header/footer based on dark mode wrapper
 const bodyElement = document.body;
 
 
 // New Button Selectors (using specific classes)
 const squareButton = document.querySelector('.function-button.square');
 const rootButton = document.querySelector('.function-button.root');
 const logButton = document.querySelector('.function-button.log');
 const openBracketButton = document.querySelector('.function-button.open-bracket');
 const closeBracketButton = document.querySelector('.function-button.close-bracket');
 
 
 // Instantiate the calculator
 const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
 
 // Add Event Listeners (with checks - most should now exist)
 
 numberButtons.forEach(button => {
  button.addEventListener('click', () => {
   calculator.appendNumber(button.innerText);
  });
 });
 
 // Add operators event listeners BEFORE the calculator object is created IF needed by its logic, but it's fine here
 operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
   calculator.chooseOperation(button.innerText);
  });
 });
 
 if (equalsButton) {
  equalsButton.addEventListener('click', () => {
   calculator.compute();
  });
 }
 
 if (clearButton) {
  clearButton.addEventListener('click', () => {
   calculator.clear();
  });
 }
 
 if (deleteButton) { // Check for deleteButton
  deleteButton.addEventListener('click', () => {
   calculator.delete();
  });
 }
 
 
 if (plusMinusButton) { // Check for plusMinusButton
  plusMinusButton.addEventListener('click', () => {
   calculator.togglePlusMinus();
  });
 }
 
 
 if (percentButton) {
  percentButton.addEventListener('click', () => {
   calculator.calculatePercentage();
  });
 }
 
 if (decimalButton) {
  decimalButton.addEventListener('click', () => {
   calculator.appendNumber('.'); // appendNumber handles the decimal and display
  });
 }
 
 
 // New Button Event Listeners (with checks)
 if (squareButton) {
  squareButton.addEventListener('click', () => {
   calculator.square();
  });
 }
 
 if (rootButton) {
  rootButton.addEventListener('click', () => {
   calculator.root();
  });
 }
 
 if (logButton) {
  logButton.addEventListener('click', () => {
   calculator.calculateLog();
  });
 }
 
 if (openBracketButton) {
  openBracketButton.addEventListener('click', () => {
   calculator.appendNumber('(');
  });
 }
 
 if (closeBracketButton) {
  closeBracketButton.addEventListener('click', () => {
   calculator.appendNumber(')');
  });
 }
 
 
 // Dark Mode Toggle Functionality
 if (darkModeToggle) {
  darkModeToggle.addEventListener('change', () => {
   bodyElement.classList.toggle('dark-mode');
   if (calculatorElement) { // Check if calculator element exists
        calculatorElement.classList.toggle('dark-mode'); // Toggle class on the main calculator div
    }
    if (calculatorWrapper) { // Keep this if you want header/footer affected by toggle on wrapper
       calculatorWrapper.classList.toggle('dark-mode');
    }
  });
 }
 
 
 // Initial Display Update
 calculator.updateDisplay();
 
 
 // Basic Keyboard Support (refined)
 window.addEventListener('keydown', (event) => {
  const key = event.key;
 
  if (/[0-9]/.test(key)) {
   calculator.appendNumber(key);
  } else if (['+', '-', '/', '.'].includes(key)) {
      calculator.chooseOperation(key === '-' ? '−' : key); // Use correct minus symbol
  } else if (key === '*') { // Specific check for keyboard '*' for multiplication
      calculator.chooseOperation('×'); // Use '×' for computation internally
  }
  else if (key === 'Enter' || key === '=') {
   event.preventDefault();
   calculator.compute();
  } else if (key === 'Backspace') {
   event.preventDefault(); // Prevent navigating back in some browsers
   calculator.delete();
  } else if (key === 'c' || key === 'C' || event.key === 'Escape') {
   calculator.clear();
  }
  // Optional: Add keyboard support for scientific functions
  // else if (key === '^') { calculator.square(); }
  // else if (key === 'r') { calculator.root(); }
  // else if (key === 'l') { calculator.calculateLog(); }
  // else if (key === '(') { calculator.appendNumber('('); }
  // else if (key === ')') { calculator.appendNumber(')'); }
 });