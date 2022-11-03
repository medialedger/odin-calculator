// display
const display = document.querySelector('.display .main');
const roundTo = 6;
function updateDisplay() {
	console.log(currentNum);
	if(currentNum) {
		if(currentNum.toString().includes('.') && currentNum.length > 1) {
			display.textContent = Math.round((Number(currentNum) + Number.EPSILON) * Math.pow(10,roundTo)) / Math.pow(10,roundTo);
		} else {
			display.textContent = currentNum;
		}
	} else {
		display.textContent = 0;
	}
	checkForMem();
	checkForOperator();
}

// numbers
let currentNum = null;
let tape = [];
let decimalAllowed = true;
const allDigitBtns = document.querySelectorAll('.digits button');
allDigitBtns.forEach(btn => btn.addEventListener('click', doDigit))
function doDigit(digit) {
	if(digit.type === 'click') {
		thisDigit = this.dataset.digit;
	} else {
		thisDigit = digit;
	}
	if(thisDigit === '.' && decimalAllowed === false) {
		return;
	}
	if(currentNum){
		currentNum += thisDigit;
		updateDisplay();
	} else {
		currentNum = thisDigit;
		updateDisplay();
	}
	if(thisDigit === '.' && decimalAllowed === true) {
		decimalAllowed = false;
	}
}

// operations
let currentOperation = null;
function doAdd() {
	currentNum = tape[tape.length-2] + tape[tape.length-1];
	tape.push(Number(currentNum));
}
function doSubtract() {
	currentNum = tape[tape.length-2] - tape[tape.length-1];
	tape.push(Number(currentNum));
}
function doMultiply() {
	currentNum = tape[tape.length-2] * tape[tape.length-1];
	tape.push(Number(currentNum));
}
function doDivide() {
	if(tape[tape.length-1] === 0) {
		display.textContent = 'oops! no div/0';
	}
	currentNum = tape[tape.length-2] / tape[tape.length-1];
	tape.push(Number(currentNum));
}
function doEquals() {
	if(currentNum){
		tape.push(Number(currentNum));
			switch (currentOperation) {
			case 'add':
				doAdd();
				break;
			case 'subtract':
				doSubtract();
				break;
			case 'multiply':
				doMultiply();
				break;
			case 'divide':
				doDivide();
				break;
			default:
				break;
		}
		currentOperation = null;
		updateDisplay();
		currentNum = null;
		decimalAllowed = true;
		checkForOperator();
	}
}
function operate(operation) {
	if(operation.type === 'click') {
		thisOperation = this.dataset.operation;
	} else {
		thisOperation = operation;
	}
	if(thisOperation === 'equals') {
		doEquals();
	} else {
		if(!currentOperation) {
			if(currentNum){
				tape.push(Number(currentNum));
				currentNum = null;
				decimalAllowed = true;
				currentOperation = thisOperation;
				checkForOperator();
			} else if(tape[tape.length-1]) {
				currentOperation = thisOperation;
				checkForOperator();
			}
		} else if(currentOperation === thisOperation) {
			if(currentNum){
				tape.push(Number(currentNum));
				switch (thisOperation) {
					case 'add':
						doAdd();
						break;
					case 'subtract':
						doSubtract();
						break;
					case 'multiply':
						doMultiply();
						break;
					case 'divide':
						doDivide();
						break;
				}
				updateDisplay();
				currentNum = null;
				decimalAllowed = true;
			}
		} else {
			tape.push(Number(currentNum));
			switch (currentOperation) {
				case 'add':
					doAdd();
					break;
				case 'subtract':
					doSubtract();
					break;
				case 'multiply':
					doMultiply();
					break;
				case 'divide':
					doDivide();
					break;
			}
			currentOperation = thisOperation;
			updateDisplay();
			currentNum = null;
			decimalAllowed = true;
		}
	}
}
const allOperatorBtns = document.querySelectorAll('.operators button');
allOperatorBtns.forEach(btn => btn.addEventListener('click', operate))

// highlight operator button / icon
const allUtilityIcons = document.querySelectorAll('.utility li:not(.mem)');
function checkForOperator() {
	allOperatorBtns.forEach(btn => btn.classList.remove('active'));
	allUtilityIcons.forEach(icon => icon.classList.remove('active'));
	if(currentOperation) {
		allOperatorBtns.forEach(btn => {
			if(btn.dataset.operation === currentOperation) {
				btn.classList.add('active');
			}
		});
		allUtilityIcons.forEach(icon => {
			if(icon.classList.contains(currentOperation)) {
				icon.classList.add('active');
			}
		});
	}
}


// functions
function doAllClear() {
	currentNum = null;
	tape = [];
	currentOperation = null;
	decimalAllowed = true;
	updateDisplay();
}
function doNegate() {
	if(currentNum) {
		currentNum *= -1;
	} else {
		currentNum = tape[tape.length-1] * -1;
	}
	updateDisplay();
}
function doPercent() {
	if(currentNum) {
		currentNum *= .01;
	} else {
		currentNum = tape[tape.length-1] * .01;
	}
	updateDisplay();
}
function doBackspace() {
	if(currentNum) {
		currentNum = currentNum.slice(0, currentNum.length - 1) ;
		updateDisplay();
	}
}
const allFunctionBtns = document.querySelectorAll('.functions button');
allFunctionBtns.forEach(btn => {
	switch (btn.dataset.operation) {
		case 'allClear':
			btn.addEventListener('click',doAllClear)
			break;
		case 'negate':
			btn.addEventListener('click',doNegate)
			break;
		case 'percent':
			btn.addEventListener('click',doPercent)
			break;
		case 'backspace':
			btn.addEventListener('click',doBackspace)
			break;
		default:
			break;
	}
})


// memory
const memIcon = document.querySelector('.utility .mem');
function doMemoryClear() {
	if(sessionStorage.getItem('mem')) {
		sessionStorage.removeItem('mem');
		updateDisplay();
		memIcon.classList.remove('active');
	}
}
function doMemoryAdd() {
	if(sessionStorage.getItem('mem')) {
		if(currentNum) {
			sessionStorage.setItem('mem', Number(sessionStorage.getItem('mem')) + currentNum);
		} else if(tape[tape.length-1]) {
			sessionStorage.setItem('mem', Number(sessionStorage.getItem('mem')) + tape[tape.length-1]);
		}
	} else {
		if(currentNum) {
			sessionStorage.setItem('mem', currentNum);
		} else if(tape[tape.length-1]) {
			sessionStorage.setItem('mem', tape[tape.length-1]);
		}
	}
	tape.push(Number(currentNum));
	updateDisplay()
}
function doMemorySubtract() {
	if(sessionStorage.getItem('mem')) {
		if(currentNum) {
			sessionStorage.setItem('mem', Number(sessionStorage.getItem('mem')) - currentNum);
		} else if(tape[tape.length-1]) {
			sessionStorage.setItem('mem', Number(sessionStorage.getItem('mem')) - tape[tape.length-1]);
		}
	} else {
		if(currentNum) {
			sessionStorage.setItem('mem', currentNum);
		} else if(tape[tape.length-1]) {
			sessionStorage.setItem('mem', tape[tape.length-1]);
		}
	}
	tape.push(Number(currentNum));
	updateDisplay()
}
function doMemoryRecall() {
	if(sessionStorage.getItem('mem')) {
		currentNum = sessionStorage.getItem('mem');
		tape.push(Number(currentNum));
		updateDisplay();
	}
}
function checkForMem() {
	if(sessionStorage.getItem('mem')) {
		memIcon.classList.add('active');
	}
}
const allMemoryBtns = document.querySelectorAll('.memory button');
allMemoryBtns.forEach(btn => {
	switch (btn.dataset.operation) {
		case 'memoryClear':
			btn.addEventListener('click',doMemoryClear)
			break;
		case 'memoryAdd':
			btn.addEventListener('click',doMemoryAdd)
			break;
		case 'memorySubtract':
			btn.addEventListener('click',doMemorySubtract)
			break;
		case 'memoryRecall':
			btn.addEventListener('click',doMemoryRecall)
			break;
		default:
			break;
	}
})

// keyboard
document.addEventListener('keydown', function(event) {
	if(Number(event.key) >= 0 && Number(event.key) <= 9) {
		doDigit(event.key);
	} else if(event.key === '.') {
		doDigit(event.key);
	}
	 else if(event.key === 'Backspace') {
		doBackspace();
	} else if(event.key === '=' || event.key === 'Enter') {
		doEquals();
	} else if(event.key === '-') {
		operate('subtract');
	} else if(event.key === '/') {
		event.preventDefault();
		operate('divide');
	} else if(event.key === '*') {
		operate('multiply');
	} else if(event.key === '+') {
		operate('add');
	} else if(event.key === 'c') {
		doAllClear();
	} else if(event.key === '%') {
		doPercent();
	}
});

// on load functions
updateDisplay();


// gotchas:
	// Display a snarky error message if the user tries to divide by 0… and don’t let it crash your calculator!

// extra credit:
	// Users can get floating point numbers if they do the math required to get one, but they can’t type them in yet. Add a . button and let users input decimals! Make sure you don’t let them type more than one though: 12.3.56.5. It is hard to do math on these numbers. (disable the decimal button if there’s already one in the display)
	// Add keyboard support! You might run into an issue where keys such as (/) might cause you some trouble. Read the MDN documentation for event.preventDefault to help solve this problem.
