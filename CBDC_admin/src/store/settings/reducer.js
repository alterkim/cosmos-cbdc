import { defaultLocale, localeOptions } from '../../constants/defaultValues'
import * as types from './actionTypes';

const initialState = {
    path: 'themes/theme-light.css',
    locale: (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale,
}

export default function common(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_THEME:
            return {
                ...state,
                path: action.path
            };
        case types.CHANGE_LOCALE:
            return {
                ...state,
                locale: action.locale
            }
        default:
            return state;
    }
}