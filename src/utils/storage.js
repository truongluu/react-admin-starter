import { parseJwt } from './utils';

function setJwtToken(token) {
  if (token) {
    window.localStorage.setItem('token', token);
  } else {
    window.localStorage.removeItem('token');
  }
}

const storage = {
  getJwtToken() {
    const token = window.localStorage.getItem('token');

    if (!token) {
      return null;
    }

    if (parseJwt(token).exp < Date.now() / 1000) {
      setJwtToken(null);
      return null;
    }
    return token;
  },
  setJwtToken,
};

export default storage;
