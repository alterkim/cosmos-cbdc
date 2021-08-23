import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

import thunk from 'redux-thunk'
import themes from './settings/themes.middleware'
import { updateTheme } from './settings/themes.middleware'

export default function configureStore() {
    const middleware = [thunk, themes]
    const store = createStore(
        reducers,
        applyMiddleware(
            ...middleware
        )
    );
    
    updateTheme(store.getState());
    return store;
}