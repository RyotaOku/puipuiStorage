export type inputAction =
  { actionType: 'idInput', payload: string } |
  { actionType: 'passwordInput', payload: string } |
  { actionType: 'successInput', payload: string } |
  { actionType: 'newMailInput', payload: string } |
  { actionType: 'newPasswordInput', payload: string } |
  { actionType: 'newNumberInput', payload: string } |
  { actionType: 'newFirstNameInput', payload: string } |
  { actionType: 'newLastNameInput', payload: string } |
  { actionType: 'newPlanInput', payload: string } |
  { actionType: 'newUserNameInput', payload: string } |
  { actionType: 'loginRequest', payload: string } |
  { actionType: 'loginSuccess', payload: string } |
  { actionType: 'loginFailure', payload: string }

export type userState = {
  userId: string,
  userPassword: string,
  id: string,
}

export type newUserState = {
  userMail: string,
  userPassword: string,
  userNumber: string,
  userFirstName: string,
  userLastName: string,
  userPlan: string,
  userName: string
}

export type loginInfo = {
  userId: string,
  userPassword: string
}

export type loginRequestState = {
  message: string,
  request: string
}

export function userFormChangeReducer(userState: userState, action: inputAction) {
  switch (action.actionType) {
    case 'idInput': return {
      ...userState,
      userId: action.payload
    }
    case 'passwordInput': return {
      ...userState,
      userPassword: action.payload
    }
    case 'successInput': return {
      ...userState,
      id: action.payload
    }
    default:
      return userState;
  }
}

export function newUserFormChangeReducer(newUserState: newUserState, action: inputAction) {
  switch (action.actionType) {
    case 'newMailInput': return {
      ...newUserState,
      userMail: action.payload
    }
    case 'newPasswordInput': return {
      ...newUserState,
      userPassword: action.payload
    }
    case 'newNumberInput': return {
      ...newUserState,
      userNumber: action.payload
    }
    case 'newFirstNameInput': return {
      ...newUserState,
      userFirstName: action.payload
    }
    case 'newLastNameInput': return {
      ...newUserState,
      userLastName: action.payload
    }
    case 'newPlanInput': return {
      ...newUserState,
      userPlan: action.payload
    }
    case 'newUserNameInput': return {
      ...newUserState,
      userName: action.payload
    }
    default:
      return newUserState;
  }
}

export function loginRequestReducer(RequestState: loginRequestState, action: inputAction) {
  switch (action.actionType) {
    case 'loginRequest': return {
      ...RequestState,
      message: 'ログイン試行中',
      request: 'During'
    }
    case 'loginSuccess': return {
      ...RequestState,
      message: 'ログイン成功',
      request: 'Success'
    }
    case 'loginFailure': return {
      ...RequestState,
      message: 'ログイン失敗',
      request: 'Failure'
    }
    default:
      return RequestState;
  }
}