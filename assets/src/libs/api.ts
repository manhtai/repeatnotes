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

export const answerCard = async (
  id: string,
  answer: any,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .post(`/api/cards/${id}/answer`)
    .set('Authorization', token)
    .send(answer)
    .then((res) => res.body.data);
};

// Note APIs
export const fetchAllNotes = async (params = {}, token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .get('/api/notes')
    .query(params)
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const fetchNoteById = async (id: string, token = getAccessToken()) => {
  return request
    .get(`/api/notes/${id}`)
    .set('Authorization', token || '')
    .then((res) => res.body.data);
};

export const fetchRandomNote = async (token = getAccessToken()) => {
  return request
    .get(`/api/random`)
    .set('Authorization', token || '')
    .then((res) => res.body.data);
};

export const createNote = async (data: any, token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .post('/api/notes')
    .set('Authorization', token)
    .send(data)
    .then((res) => res.body.data);
};

export const updateNote = async (
  id: string,
  updates: any,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .put(`/api/notes/${id}`)
    .set('Authorization', token)
    .send(updates)
    .then((res) => res.body.data);
};

export const patchNote = async (
  id: string,
  updates: any,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .patch(`/api/notes/${id}/action`)
    .set('Authorization', token)
    .send(updates)
    .then((res) => res.body.data);
};

export const deleteNote = async (id: string, token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .delete(`/api/notes/${id}`)
    .set('Authorization', token)
    .then(() => {});
};

// Upload APIs
export const uploadFile = async (file: File, token = getAccessToken()) => {
  return request
    .post(`/api/upload`)
    .set('Authorization', token || '')
    .attach('file', file)
    .then((res) => res.body.data);
};

// Tag APIs
export const fetchAllTags = async (params = {}, token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .get('/api/tags')
    .query(params)
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const fetchTagById = async (id: string, token = getAccessToken()) => {
  return request
    .get(`/api/tags/${id}`)
    .set('Authorization', token || '')
    .then((res) => res.body.data);
};

export const createTag = async (data: any, token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .post('/api/tags')
    .set('Authorization', token)
    .send(data)
    .then((res) => res.body.data);
};

export const updateTag = async (
  id: string,
  updates: any,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .put(`/api/tags/${id}`)
    .set('Authorization', token)
    .send(updates)
    .then((res) => res.body.data);
};

export const deleteTag = async (id: string, token = getAccessToken()) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .delete(`/api/tags/${id}`)
    .set('Authorization', token)
    .then(() => {});
};

// Note tags
export const fetchNotesByTag = async (id: string, token = getAccessToken()) => {
  return request
    .get(`/api/tags/${id}/notes`)
    .set('Authorization', token || '')
    .then((res) => res.body.data);
};

export const addTag = async (
  noteId: string,
  tagId: string,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .post(`/api/notes/${noteId}/tags`)
    .send({tag_id: tagId})
    .set('Authorization', token)
    .then((res) => res.body.data);
};

export const removeTag = async (
  noteId: string,
  tagId: string,
  token = getAccessToken()
) => {
  if (!token) {
    throw new Error('Invalid token!');
  }

  return request
    .delete(`/api/notes/${noteId}/tags/${tagId}`)
    .set('Authorization', token)
    .then(() => {});
};
