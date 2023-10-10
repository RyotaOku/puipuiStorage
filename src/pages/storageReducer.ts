export type userInformation = {
  userAccountName: string,
  userId: string,
  userPassword: string,
  userNumber: string,
  userFirstName: string,
  userLastName: string,
  userSelectedPlan: string,
  id: number
}

export type userInformationArray = {
  userInformations: userInformation[];
};

export type Action =
  | { actionType: 'getUserRequest' }
  | { actionType: 'getUserSuccess', payload: { userInformations: userInformation[] } }
  | { actionType: 'getUserFailure' };


export function reducer(state: userInformationArray, action: Action): userInformationArray {
  switch (action.actionType) {
    case 'getUserRequest': return state
    case 'getUserSuccess':

      return {
        ...state,
        userInformations: action.payload.userInformations
      }
    case 'getUserFailure': return state

  }
}