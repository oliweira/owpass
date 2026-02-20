// src/services/session.js
let userMasterKey = null;

export const setSessionKey = (key) => {
  userMasterKey = key;
};
export const getSessionKey = () => userMasterKey;
export const clearSessionKey = () => {
  userMasterKey = null;
};
