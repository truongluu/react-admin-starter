import { isArray } from './utils';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('authority') : str;
  // authorityString could be authentication, "authentication", ["authentication"]
  let authority;

  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (authority && isArray(authority)) {
    return authority.join(',');
  }

  return authority;
}

export function setAuthority(authority) {
  const proAuthority = isArray(authority) ? authority.join(',') : authority;
  return localStorage.setItem('authority', JSON.stringify(proAuthority));
}

export function removeAuthority() {
  localStorage.removeItem('authority');
}
