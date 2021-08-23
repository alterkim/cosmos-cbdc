import { CHANGE_THEME } from './actionTypes';

const LINK_ID = 'theme-stylesheet';

const createLink = () => {
    let link = document.getElementById(LINK_ID)
    if (!link) {
        const head = document.getElementsByTagName('head')[0];
        link = document.createElement('link');
        link.id = LINK_ID;
        link.rel = 'stylesheet';
        head.appendChild(link);
    }
    return link;
}

const injectStylesheet = stylesheet => {
    const linkTag = createLink();
    if (stylesheet)
        linkTag.href = stylesheet;
}

export const updateTheme = state => {
    if(state.settings.path !== '')
         injectStylesheet(state.settings.path)
}

const themes = store => next => action => {
    let result = next(action)
    if (action.type === CHANGE_THEME) {
        updateTheme(store.getState())
    }
    return result
}

export default themes;