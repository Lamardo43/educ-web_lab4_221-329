let displayValue = '';

function appendToDisplay(value) {
    displayValue += value;
    document.getElementById('display').value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').value = displayValue;
}

function customEvaluate(expression) {
    const operators = ['+', '-', '*', '/'];
    const outputQueue = [];
    const operatorStack = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    };

    const isOperator = (token) => operators.includes(token);

    const shuntingYard = (tokens) => {
        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                outputQueue.push(parseFloat(token));
            } else if (isOperator(token)) {
                while (operatorStack.length > 0 &&
                    // eslint-disable-next-line max-len
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && 
                    operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            }
        }
        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }
    };

    const evaluateRPN = (tokens) => {
        const stack = [];
        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (isOperator(token)) {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    if (b === 0) {
                        throw new Error('Division by zero');
                    }
                    stack.push(a / b);
                    break;
                default:
                    throw new Error('Unknown operator');
                }
            }
        }
        return stack.pop();
    };

    const tokens = expression.match(/(\d+(\.\d+)?|[+\-*/()])/g);
    if (!tokens) {
        throw new Error('Invalid expression');
    }

    shuntingYard(tokens);
    return evaluateRPN(outputQueue);
}

function calculateResult() {
    try {
        const result = customEvaluate(displayValue);
        document.getElementById('display').value = result;
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}


