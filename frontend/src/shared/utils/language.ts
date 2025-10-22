import { LanguageTextType } from "../enums/language-text";

export const getTextForPageAndDataIndex = (
    page: LanguageTextType,
    dataIndex: string,
    t: any,
    isMin: boolean = false,
    isMax: boolean = false,
    isStartDate: boolean = false,
    isEndDate: boolean = false
  ) => {
    let suffix = '';
    
    if (isMin) {
      suffix = '_MIN';
    } else if (isMax) {
      suffix = '_MAX';
    } else if (isStartDate) {
      suffix = '_START_DATE';
    } else if (isEndDate) {
      suffix = '_END_DATE';
    }
    
    return t(`FILTER.${page}.${dataIndex}${suffix}`);
  }