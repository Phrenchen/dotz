import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reduce from './reducers/index';
import './css/index.scss';

import AppStatemachine from './appStates/AppStatemachine';


//let store = createStore(counter);
let store = createStore(reduce);

// log initial store state
//console.log(store.getState());

// debug helper: log every store change
store.subscribe(() => {
    //console.log("************** STATE CHANGED ***************");
    //console.log(store.getState());
  }
)

ReactDOM.render(
  <Provider store={store}>
    <AppStatemachine />
  </Provider>, 
  
  document.getElementById('root')
);