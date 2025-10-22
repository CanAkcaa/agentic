import { FormInstance, TablePaginationConfig } from "antd";
import { ButtonType } from "antd/es/button";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { IUser } from "./users";



export interface ITableQueryParams<T> {
    pagination: TablePaginationConfig;
    filters?: Record<string, FilterValue | null>;
    sorter?: SorterResult<T> | SorterResult<T>[];
    include?: string[];
    typeWithFilters?: string[];
  }

export type TLocale = 'tr' | 'en';
export type TOrderListType = 'table' | 'kanban';

export interface IConfig {
  locale: TLocale;
  user: IUser;
}

export interface IGraphModel {
  value: number;
  label: string;
}

export interface IPieModel {
  value: number;
  label: number|string;
}

export interface ILineModel {
  value: number;
  label: number|string;
  points?:any[]
}

export interface ICommonSelectOption {
  label: string;
  value: string;
}

export interface ICommonResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
}

export interface ICommonResponseWithCount<T> {
  status: boolean;
  count?: number | null;
  message?: string;
  data?: T;
  errors?: any;
  code?: number | string;
}


export interface IModalFunctions<T> {
  handleOk: (modalName: string) => void;
  handleCancel: (modalName: string) => void;
  handleOpen: (modalName: string) => void;
  modalOpen: T;
}

export interface IModalClose {
  modalClose: () => void;
  onCancel?: () => void;
}

export interface IFileUpload {
  file: string;
  size: number;
}

export interface IActionsButtons<T> {
  text: string;
  modalName?: T;
  type?: ButtonType;
  visible?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export interface IModals {
  title: string | React.ReactNode;
  open: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  width?: number;
  content: React.ReactNode;
}

export interface IStatusMessage {
  status?: boolean;
  message?: string;
}

export interface ITableInputSearch {
  filterDropdown?: () => void;
  filterIcon?: () => void;
  onFilter?: (param: any) => void;
}


interface formFields {
  label: string;
  name: string;
  component: React.ReactNode;
  responsive: any;
  rules: { required?: boolean; message?: string }[];
  type?: number;
  children?: formFields[];
  hide?: boolean;
  valuePropName?: string;
  disabled?: boolean;
}

export interface IDynamicForm {
  formFields: formFields[];
  selectedType?: number | null;
  onFinish?: (values: any) => void;
  cancel?: () => void;
  isEdit?: boolean;
  isLoading?: boolean;
  initialValues?: any;
  form?: FormInstance;
  stepButtons?: React.ReactNode;
  className?: string;
  isHiddenBtn?: boolean;
  btnText?: string;
  btnIcon?: React.ReactNode;
  btnSize?: 'small' | 'middle' | 'large';
}

export interface ITableQueryParams<T> {
  pagination: TablePaginationConfig;
  filters?: Record<string, FilterValue | null>;
  sorter?: SorterResult<T> | SorterResult<T>[];
  include?: string[];
  typeWithFilters?: string[];
}

export interface IListComponents {
  className?: string;
  onChange?: (value: any, item: any) => void;
  value?: any;
  maxTagCount?: number;
  showSearch?: boolean;
  mode?: 'multiple' | 'tags';
  allowClear?: boolean;
  disabled?: boolean;
}