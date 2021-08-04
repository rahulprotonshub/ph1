import {combineReducers} from 'redux';
import {GET_LIST} from './reducer_action';

let dataState = {list: []};
const dataReducer = (state = dataState, action) => {
  switch (action.type) {
    case GET_LIST:
      let {list} = action.data;
      return {...state, list};
    default:
      return state;
  }
};
const rootReducer = combineReducers({dataReducer});
export default rootReducer;
