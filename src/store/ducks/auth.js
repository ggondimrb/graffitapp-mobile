import produce from 'immer';

export const Types = {
  LOGIN_REQUEST: 'auth/SIGN_IN_REQUEST',
  LOGIN_SUCESS: 'auth/SIGN_IN_SUCCESS',
  LOGIN_FAILURE: 'auth/SIGN_IN_FAILURE',
  LOGOUT: 'auth/SIGN_OUT',
};

const INITIAL_STATE = {
  token: null,
  signed: false,
  loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case Types.LOGIN_REQUEST: {
        draft.loading = true;
        break;
      }
      case Types.LOGIN_SUCESS: {
        draft.token = action.payload.token;
        draft.signed = true;
        draft.loading = false;
        break;
      }
      case Types.LOGIN_FAILURE: {
        draft.loading = false;
        break;
      }
      case Types.LOGOUT: {
        draft.token = null;
        draft.signed = false;
        break;
      }
      default:
    }
  });
}

export function signInRequest(email, password) {
  return {
    type: Types.LOGIN_REQUEST,
    payload: {email, password},
  };
}

export function signInSuccess(token, user) {
  return {
    type: Types.LOGIN_SUCESS,
    payload: {token, user},
  };
}

export function signUpRequest(name, email, password) {
  return {
    type: Types.LOGIN_FAILURE,
    payload: {name, email, password},
  };
}

export function signFailure() {
  return {
    type: Types.LOGIN_FAILURE,
  };
}

export function signOut() {
  return {
    type: Types.LOGOUT,
  };
}
