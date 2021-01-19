import request from 'superagent';
import {getAuthTokens} from './storage';
import {User} from './types';

// Auth API
export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = LoginParams;

export type ResetPasswordParams = {
  password: string;
  passwordConfirmation: string;
};

export const getAccessToken = (): string | null => {
  const tokens = getAuthTokens();

  return (tokens && tokens.token) || null;
};

export const getRefreshToken = (): string | null => {
  const tokens = getAuthTokens();

  return (tokens && tokens.renew_token) || null;
};

export const register = async ({email, password}: RegisterParams) => {
  return request
    .post(`/api/registration`)
    .send({
      user: {
        email,
        password,
        password_confirmation: password,
      },
    })
    .then((res) => res.body.data);
};

export const login = async ({email, password}: LoginParams) => {
  return request
    .post(`/api/session`)
    .send({user: {email, password}})
    .then((res) => res.body.data);
};

export const me = async (token = getAccessToken()): Promise<User> => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .get(`/api/me`)
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const renew = async (token = getRefreshToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .post(`/api/session/renew`)
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const logout = async () => {
  return request.delete(`/api/session`).then((res) => res.body);
};

export const verifyUserEmail = async (verificationToken: string) => {
  return request
    .post(`/api/verify_email`)
    .send({token: verificationToken})
    .then((res) => res.body.data);
};

export const sendPasswordResetEmail = async (email: string) => {
  return request
    .post(`/api/reset_password`)
    .send({email})
    .then((res) => res.body.data);
};

export const attemptPasswordReset = async (
  passwordResetToken: string,
  {password, passwordConfirmation}: ResetPasswordParams
) => {
  return request
    .put(`/api/reset_password`)
    .send({
      password,
      password_confirmation: passwordConfirmation,
      token: passwordResetToken,
    })
    .then((res) => res.body.data);
};

// SRS config APIs
export const fetchSrsConfig = async (token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .get('/api/srs_config')
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const updateSrsConfig = async (
  updates: any,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .put('/api/srs_config')
    .set('Authorization', token)
    .send(updates)
    .then((res) => res.body.data);
};

// Card APIs
export const fetchAllCards = async (token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .get('/api/cards')
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const fetchCardById = async (id: string, token = getAccessToken()) => {
  return request
    .get(`/api/cards/${id}`)
    .set('Authorization', token || '')
    .then((res) => res.body.data);
};

export const updateCard = async (
  id: string,
  updates: any,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .put(`/api/cards/${id}`)
    .set('Authorization', token)
    .send(updates)
    .then((res) => res.body.data);
};
