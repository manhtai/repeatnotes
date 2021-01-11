export const isDev = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export const isHostedProd = window.location.hostname === 'repeatnotes.com';

export const REACT_URL = process.env.REACT_APP_URL || 'repeatnotes.com';

export const BASE_URL = isDev
  ? 'http://localhost:4000'
  : `https://${REACT_URL}`;
