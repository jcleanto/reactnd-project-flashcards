import { RECEIVE_DECKS, ADD_DECK, DELETE_DECK, ADD_CARD } from '../actions';

function decks(state = {}, action) {
  const { decks, deck } = action
  switch (action.type) {
    case RECEIVE_DECKS:
      return {
        ...state,
        ...decks,
      };
    case ADD_DECK:
      return {
        ...state,
        ...deck,
      };
    case DELETE_DECK:
      return {
        ...state,
        decks: {
          [deck.title]: null,
        },
      };
    case ADD_CARD:
      return {
        ...state,
        ...deck,
      };
    default:
      return state;
  }
}
export default decks;