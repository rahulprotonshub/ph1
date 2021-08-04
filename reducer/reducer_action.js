export const GET_LIST = 'GET_LIST';
export const setReduxList = list => ({
  type: GET_LIST,
  data: {list},
});
