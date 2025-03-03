import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as AxiosLogger from 'axios-logger'; // For debugging
import { PaparaResponse } from './interfaces';

export default class PaparaHttp {
  private get BASE_URL() {
    if (this.testEnv) {
      return 'https://merchant-api.test.papara.com';
    } else {
      return 'https://merchant-api.papara.com';
    }
  }
  private testEnv: boolean;
  private axios: AxiosInstance;

  constructor({ API_KEY, debug = false, testEnv = false }: { API_KEY: string; debug?: boolean; testEnv?: boolean }) {
    this.testEnv = testEnv;
    this.axios = axios.create();

    this.axios.interceptors.request.use((req) => {
      req.headers.ApiKey = API_KEY;
      return req;
    });

    if (debug) {
      this.axios.interceptors.request.use((req) => AxiosLogger.requestLogger(req));
      this.axios.interceptors.response.use((res) => AxiosLogger.responseLogger(res));
    }
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<PaparaResponse<T>> {
    try {
      const response = await this.axios.get<PaparaResponse<T>>(this.BASE_URL + path, config);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async post<T>(path: string, body: { [key: string]: any }, config?: AxiosRequestConfig): Promise<PaparaResponse<T>> {
    try {
      const response = await this.axios.post<PaparaResponse<T>>(this.BASE_URL + path, body, config);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async put<T>(path: string): Promise<PaparaResponse<T>> {
    try {
      const response = await this.axios.put<PaparaResponse<T>>(this.BASE_URL + path);
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}
