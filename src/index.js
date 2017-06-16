import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import setAuthorizationToken from './utils/setAuthorizationToken'
import {setCurrentUser} from './actions/action'
import jwtDecode from 'jwt-decode'

const store = createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(thunk)
	)
);
if(localStorage.jwtToken){
    setAuthorizationToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}


ReactDOM.render(
	<BrowserRouter>
		<Provider store = {store}>
			<App/>
		</Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
