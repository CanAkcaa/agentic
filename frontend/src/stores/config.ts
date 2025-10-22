import { atom } from 'recoil';
import { LocalStorageUtils } from '../utils/localstorage';
import { CONFIG, EKEYS } from '../config';
import { IUser } from '../shared/models/users';
import { IConfig, TLocale } from '../shared/models/common';


const initialState: IConfig = {
  locale: (LocalStorageUtils.getItem(EKEYS.languageKey)! || CONFIG.defaultLang) as TLocale,
  user: (LocalStorageUtils.getItem(EKEYS.userKey) as IUser) || {},
};

export const configState = atom({
  key: 'configState',
  default: initialState,
});