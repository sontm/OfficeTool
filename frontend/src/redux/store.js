import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import UserReducer from './reducers/UserReducer';
import TeamReducer from './reducers/TeamReducer';
import AbsenceReducer from './reducers/AbsenceReducer';

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: UserReducer,
  team: TeamReducer,
  absence:AbsenceReducer
});

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(reducers, initialState, enhancer);

export default store;
