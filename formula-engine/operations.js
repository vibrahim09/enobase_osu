const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

function calculate(requestBody) {
    const { operand1, operand2, operator } = requestBody;

    let result;
    let formula;

    switch (operator) {
        case "add":
            result = operand1 + operand2;
            formula = `${operand1} + ${operand2}`;
            break;

        case "subtract":
            result = operand1 - operand2;
            formula = `${operand1} - ${operand2}`;
            break;

        case "multiply":
            result = operand1 * operand2;
            formula = `${operand1} * ${operand2}`;
            break;

        case "divide":
            if (operand2 === 0) {
                return {
                    result: null,
                    formula: `${operand1} / ${operand2}`,
                    success: false,
                    error: "Cannot divide by zero"
                };
            }
            result = operand1 / operand2;
            formula = `${operand1} / ${operand2}`;
            break;
        
        default:
            return {
                result: null,
                formula: "",
                success: false,
                error: "Invalid operator"
            };
        }

    return {
        result: result,
        formula: formula,
        success: true,
        error: null
    };
}

app.post('/calculate', (req, res) => {
    const result = calculate(req.body);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});