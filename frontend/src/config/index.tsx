import { TablePaginationConfig } from "antd";

export const EKEYS = {
    languageKey: 'LANGUAGE',
    tokenKey: 'TOKEN',
    refreshTokenKey: 'TOKEN',
    userKey: 'USER',
  };

  export const CONFIG = {
    defaultLang: 'en-EN',
};

  export const TABLE_PAGINATION: TablePaginationConfig = {
    showSizeChanger: true,
    current: 1,
    pageSize: 10,
    defaultCurrent: 1,
  };