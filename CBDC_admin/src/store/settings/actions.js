import { CHANGE_LOCALE, CHANGE_THEME } from "./actionTypes";

export function changeLocale(locale) {
    localStorage.setItem('currentLanguage', locale);
    return { type: CHANGE_LOCALE, locale };
}

export function changeTheme(path) {
    return { type: CHANGE_THEME, path };
}