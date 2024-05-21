import { ACTIONS } from "./App";

function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DGT, payload: { digit } })}
    >
      {digit}
    </button>
  );
}

export default DigitButton;
