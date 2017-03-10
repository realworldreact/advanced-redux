import { createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';

import reducer, { epics } from './redux.js';

export default function createAppStore({
  devTools = (f => f),
  deps,
  wrapEpic = (f => f)
}) {
  const rootEpic = wrapEpic(combineEpics(...epics));
  console.log('rootEpic: ', rootEpic);
  const epicMiddleware = createEpicMiddleware(rootEpic);
  const middleware = applyMiddleware(
    thunk.withExtraArgument(deps),
    epicMiddleware
  );


  const storeEnhancer = compose(
    middleware,
    devTools
  );

  const store = createStore(
    reducer,
    storeEnhancer
  );

  return {
    store,
    rootEpic
  };
}
