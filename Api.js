/*
 * File: Api.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 5:23:58 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Friday, 15th November 2019 10:31:56 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
import {SHOULD_LOG, INITIAL_ENV} from './src/config';
export default class Api {
  constructor(baseUrl, token = {}, customHeaders = {}, env = INITIAL_ENV) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.customHeaders = customHeaders;
    this.env = env;
  }
  request = async request => {
    try {
      const response = await request;
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  withToken = token => new Api(this.baseUrl, token, this.customHeaders);

  changeData = ({
    baseUrl = this.baseUrl,
    token = this.token,
    customHeaders = this.customHeaders,
    env = this.env,
  }) => {
    this.baseUrl = baseUrl;
    this.token = token;
    this.customHeaders = customHeaders;
    this.env = env;
  };

  url = url => `${this.baseUrl}${url}`;
  generateHeader = () => ({
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': this.token.secret,
    
    ...this.customHeaders,
    ...(this.token.jwt ? {
      authorization: `Bearer ${this.token.jwt}`,
      'x-token-app': this.token.jwt
    } : {})
  });
  generateInstance = () => {
    const axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: this.generateHeader(),
    });
    if (SHOULD_LOG) {
      axiosInstance.interceptors.request.use(c => {
        // eslint-disable-next-line no-console
        console.log('[AXIOS request]', c, this.customHeaders);
        return c;
      }, AxiosLogger.errorLogger);

      axiosInstance.interceptors.response.use(c => {
        // eslint-disable-next-line no-console
        console.log('[AXIOS response]', c);
        return c;
      }, AxiosLogger.errorLogger);
    }
    return axiosInstance;
  };
  get = async (url, params) => {
    return this.request(this.generateInstance().get(url, {params}));
  };
  post = async (url, body) => {
    return this.request(this.generateInstance().post(url, body));
  };
  del = async url => this.request(this.generateInstance().delete(url));
  put = async (url, body) =>
    this.request(this.generateInstance().put(url, body));
  patch = async (url, body) => {
    const request = this.request(this.generateInstance().patch(url, body));
    const response = await request;
    return response.data;
  };
}
