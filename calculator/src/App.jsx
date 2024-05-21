import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DGT: "add-digit",
  CHOOSE_OPP: "choose-opetation",
  CLEAR: "clear",
  DELETE_DGT: "delete-digit",
  EVAL: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DGT:
      if (state.overWrite) {
        return {
          ...state,
          currentOperaned: payload.digit,
          overWrite: false,
        };
      }
      if (payload.digit == "0" && state.currentOperaned === "0") return state;
      if (payload.digit == "." && state.currentOperaned.includes("."))
        return state;
      return {
        ...state,
        currentOperaned: `${state.currentOperaned || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPP:
      if (state.currentOperaned == null && state.previousOperand == null)
        return state;

      if (state.currentOperaned == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperaned,
          currentOperaned: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperaned: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DGT:
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperaned: null,
        };
      }

      if (state.currentOperaned == null) return state;
      if (state.currentOperaned.length === 1) {
        return {
          ...state,
          currentOperaned: null,
        };
      }

      return {
        ...state,
        currentOperaned: state.currentOperaned.slice(0, -1),
      };
    case ACTIONS.EVAL:
      if (
        state.operation == null ||
        state.currentOperaned == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overWrite: true,
        previousOperand: null,
        operation: null,
        currentOperaned: evaluate(state),
      };
  }
}

function evaluate({ currentOperaned, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperaned);

  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
    case "÷":
      computation = prev / current;
      break;
    case "*":
      computation = prev * current;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMAT.format(integer);
  return `${INTEGER_FORMAT.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperaned, previousOperand, operation }, dispatch] =
    useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperaned)}</div>
      </div>

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DGT })}>
        DEL
      </button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />

      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />

      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVAL })}
      >
        =
      </button>
    </div>
  );
}

export default App;
