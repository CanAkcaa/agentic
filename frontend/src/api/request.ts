import { TablePaginationConfig, notification } from 'antd';
import Axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { CookieUtils } from '../utils/cookie';
import { EKEYS } from '../config';
import { IRequest } from '../shared/models/request';
import { StringKeyOf } from 'type-fest';
import axios from 'axios';




export enum ApiConfig {
  STRUCTER = 'structer',
  AGENTIC = 'agentic',
}

const API_URLS = {
  [ApiConfig.STRUCTER]: import.meta.env.VITE_STRUCTER_URL,
  [ApiConfig.AGENTIC]: import.meta.env.VITE_AGENTIC_URL,
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationParams<T = any> {
  endfix?: string | number; // URL sonuna eklenecek id veya path
  body?: T;                 // request body
}

interface listParams {
  limit?: number;
  offset?: number;
  where?: any;
  order?: string;
  include?: { relation: string }[];
}

export const createAxiosInstance = (config: ApiConfig = ApiConfig.STRUCTER, isFileConfig: boolean = false) => {
  const baseURL = API_URLS[config];
  if (!baseURL) {
    console.error(`API URL for config ${config} is not defined in .env file`);
  }
  
  const instance = axios.create({
    baseURL,
    timeout: Number(import.meta.env.VITE_AXIOS_TIMEOUT),
    headers: {
      ...(isFileConfig ? {
      } : {
        'Content-Type': 'application/json'
      }),
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Request-ID': Date.now().toString(),

      // ✅ Security Headers
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'no-referrer-when-downgrade'
    },
  });

  instance.interceptors.request.use((config) => {
    const token = CookieUtils.getCookie(EKEYS.tokenKey);
    if (token && token !== undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (isFileConfig) {
        return response;
      }
      const data = response?.data;
      return data;
    },
    async (error) => {
      return {
        ...error?.response?.data
      }
    }
  );

  return instance;
};

const flattenQuery = (obj: any, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const prefixedKey = prefix ? `${prefix}[${key}]` : key;
    
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      // Eğer değer bir nested object ise recursive olarak düzleştir
      Object.assign(acc, flattenQuery(obj[key], prefixedKey));
    } else if (Array.isArray(obj[key])) {
      // Eğer değer bir array ise her elemanı ayrı ayrı ekle
      obj[key].forEach((item: any, index: number) => {
        if (item !== null && typeof item === 'object') {
          Object.assign(acc, flattenQuery(item, `${prefixedKey}[${index}]`));
        } else {
          acc[`${prefixedKey}[${index}]`] = String(item);
        }
      });
    } else if (obj[key] !== undefined) {
      // Değer basit bir tip ise direkt ekle
      acc[prefixedKey] = String(obj[key]);
    }
    
    return acc;
  }, {});
};


const useCustomMutation = <TResponse = any, TRequest = any>(
  url: string,
  method: HttpMethod = "GET",
  config: ApiConfig = ApiConfig.STRUCTER,
  isStream: boolean = false
) => {
  return useMutation<TResponse, unknown, MutationParams<TRequest>>(async ({ endfix, body }: MutationParams<TRequest>) => {
    const instance = createAxiosInstance(config);
    const targetUrl = endfix ? `${url}/${endfix}` : url;

    switch (method) {
      case "GET": {
        const flatQuery = flattenQuery(body);
        const queryParams = new URLSearchParams();
        Object.entries(flatQuery).forEach(([k, v]) => queryParams.append(k, v));
        const queryString = queryParams.toString();
        return (await instance.get<TResponse>(`${targetUrl}?${queryString}`)) as TResponse;
      }
      case "POST":
        // STREAM DESTEĞİ EKLE
        if (isStream) {
          const response = await fetch(`${instance.defaults.baseURL}${targetUrl}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CookieUtils.getCookie(EKEYS.tokenKey)}`,
            },
            body: JSON.stringify(body)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          return {
            success: true,
            data: {
              reader: response.body?.getReader()
            }
          } as TResponse;
        }
        return (await instance.post<TResponse>(targetUrl, body)) as TResponse;
      case "PUT":
        return (await instance.put<TResponse>(targetUrl, body)) as TResponse;
      case "PATCH":
        return (await instance.patch<TResponse>(targetUrl, body)) as TResponse;
      case "DELETE":
        return (await instance.delete<TResponse>(targetUrl, { data: body })) as TResponse;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  });
};

export {
  useCustomMutation
};

export default axios;
