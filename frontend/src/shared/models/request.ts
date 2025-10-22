export interface IRequest {
    Filters?: any;
    PageNumber?: number;
    PageSize?: number;
    Sort?:any
    showRequest?: boolean
    showResponse?: boolean
}

export interface IRequestNonSkipAndLimit {
    where?: any;
    skip?: number;
    limit?: number;
    include?:any
}
export interface IRequestAutoComplate {
    searchText: string
}