import { inputAction, newUserState, loginInfo } from './loginReducer'
import { Action } from './storageReducer'


async function authenticate(
  userId: string,
  userPassword: string
) {
  const res = await fetch('/api/puiSto/authenticated', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
      userId, userPassword
    })
  })
  const result = await res.json()
  if (result === 'oi') {
    return {
      result: '',
      res: res.status
    }
  }

  const data = {
    result: result.result.rows,
    res: res.status
  }
  return data
}

async function showFiles(
  userId: number,
  parentDirectory: string,
  sort: string
): Promise<{ directoryName: string, id: string, parentDirectory: string, fileSize: string, directoryType: string, extension: string, fileType: string, convertedDirectoryName: string, creation: any, modification: any, version: any, starItem: any, formattedFileSize: string }[]> {
  const res = await fetch('/api/puiSto/showFiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
      userId, parentDirectory, sort
    })
  })
  const result = await res.json();

  return result.result.map((file: any) => ({
    directoryName: file.directoryName,
    id: file.id,
    fileSize: file.fileSize,
    parentDirectory: file.parentDirectory,
    directoryType: file.directoryType,
    extension: file.extension,
    fileType: file.fileType,
    creation: file.creation,
    modification: file.modification,
    version: file.version,
    starItem: file.starItem,
    formattedFileSize: file.formattedFileSize
  }));
}

async function registration(newUserState: newUserState, confirmation: { display: boolean }) {
  const res = await fetch('/api/puiSto/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ newUserState, confirmation })
  })
  const result = await res.json()
  return result
}

export async function inputId(userStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  userStateDispatch({ actionType: 'idInput', payload: inputValue })
}

export async function inputPassword(userStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  userStateDispatch({ actionType: 'passwordInput', payload: inputValue })
}

export async function inputNewMail(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newMailInput', payload: inputValue })
}

export async function inputNewPassword(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newPasswordInput', payload: inputValue })
}

export async function inputNewNumber(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newNumberInput', payload: inputValue })
}

export async function inputNewFirstName(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newFirstNameInput', payload: inputValue })
}

export async function inputNewLastName(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newLastNameInput', payload: inputValue })
}

export async function inputNewPlan(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newPlanInput', payload: inputValue })
}

export async function inputUserName(newUserStateDispatch: React.Dispatch<inputAction>, inputValue: string) {
  newUserStateDispatch({ actionType: 'newUserNameInput', payload: inputValue })
}

export async function fileSize(userId: number): Promise<{ a: any, b: any }> {
  const res = await fetch('/api/puiSto/nowSize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ userId })
  })
  const result = await res.json();

  return result.result
}

export async function changePlan(userId: number, plan: string | number) {
  const res = await fetch('/api/puiSto/changePlan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ userId, plan })
  })
  const result = await res.json();
}

export async function login(userStateDispatch: any, loginDispatch: any, inputUserId: string, inputUserPassword: string) {
  loginDispatch({ actionType: 'loginRequest' })
  const login = await authenticate(inputUserId, inputUserPassword)
  if (login.res === 200) {
    loginDispatch({ actionType: 'loginSuccess' })
    userStateDispatch({ actionType: 'passwordInput', payload: login.result[0].id })
    return
  } else {
    loginDispatch({ actionType: 'loginFailure' })
  }
  loginDispatch({ actionType: 'loginFailure' })
}

export async function showFilesFetch(userId: number | undefined | string, nowDirectory: string, sort: string) {
  if (userId === undefined) {
    return
  }
  if (typeof userId === 'string') {
    userId = parseInt(userId)
  }

  return showFiles(userId, nowDirectory, sort)
}

export async function getUserInformation(dispatch: React.Dispatch<Action>) {
  try {
    const res = await fetch('/api/puiSto/selectUserInformation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      },
    })

    if (res.status !== 200) {

    } else {
      const result = await res.json()
      dispatch({
        actionType: 'getUserSuccess', payload: {
          userInformations: result.result
        }
      })
      return result.result
    }

  } finally {

  }
}

export async function showFilesConditionalFetch(userId: number, conditions: string): Promise<{ directoryName: string, id: string, parentDirectory: string, fileSize: string, directoryType: string, extension: string, fileType: string, convertedDirectoryName: string, creation: string, modification: string, version: string, starItem: string, formattedFileSize: string }[]> {
  const res = await fetch('/api/puiSto/conditionalShowFiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({
      userId, conditions
    })
  })
  const result = await res.json();
  return result.result.map((file: any) => ({
    directoryName: file.directoryName,
    id: file.id,
    fileSize: file.fileSize,
    parentId: file.parentDirectory,
    directoryType: file.directoryType,
    extension: file.extension,
    fileType: file.fileType,
    creation: file.creation,
    modification: file.modification,
    version: file.version,
    starItem: file.starItem,
    formattedFileSize: file.formattedFileSize
  }));
}

export async function registrationConfirmation(newUserState: newUserState, confirmation: { display: boolean }) {
  const validation = await registration(newUserState, confirmation)

  return {
    checkResult:
      validation.userName.length === 0 &&
      validation.mail.length === 0 &&
      validation.number.length === 0 &&
      validation.pass.length === 0 &&
      validation.lastName.length === 0 &&
      validation.firstName.length === 0,
    validation: validation
  }
}

export async function CreateNewFolder(nowDirectory: string, userId: number) {
  const res = await fetch('/api/puiSto/createFolder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ nowDirectory, userId })
  })
}

export async function deleteFile(directoryName: string, id: string | number) {
  const res = await fetch('/api/puiSto/trashItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ directoryName, id })
  })
  const result = await res.json()
  return result
}

export async function changeFileName(directoryName: string, id: string, fileType: string, parentDirectory: string) {
  const res = await fetch('/api/puiSto/changeFileName', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ directoryName, id, fileType, parentDirectory })
  })
  const result = await res.json()
  return result
}

export async function starTheFile(id: string, starItem: boolean) {
  const res = await fetch('/api/puiSto/starItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ id, starItem })
  })
  const result = await res.json()
  return result
}

export async function allClearAction(userId: number) {
  const res = await fetch('/api/puiSto/allClear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ userId })
  })
  const result = await res.json()
  return result
}

export async function logout(userId: number) {
  const res = await fetch('/api/puiSto/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ userId })
  })
  const result = await res.json()
  return result
}

export async function searchFile(userId: number, searchText: string): Promise<{ directoryName: string, id: string, parentDirectory: string, fileSize: string, directoryType: string, extension: string, fileType: string, convertedDirectoryName: string, creation: any, modification: any, version: any, starItem: any, formattedFileSize: string }[] | undefined> {
  if (searchText === '') {
    return
  }
  const res = await fetch('/api/puiSto/searchFiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ userId, searchText })
  })
  const result = await res.json()
  return result.result.map((file: any) => ({
    directoryName: file.directoryName,
    id: file.id,
    fileSize: file.fileSize,
    parentDirectory: file.parentDirectory,
    directoryType: file.directoryType,
    extension: file.extension,
    fileType: file.fileType,
    creation: file.creation,
    modification: file.modification,
    version: file.version,
    starItem: file.starItem,
    formattedFileSize: file.formattedFileSize
  }));
}

export async function fileUploadAction(userId: number, uploadFile: React.RefObject<HTMLInputElement>, fileName: string | undefined, nowDirectory: string) {
  if (!uploadFile.current || !uploadFile.current.files) {
    // TODO 何らかのエラー処理
    return
  }
  if (fileName === undefined) {
    return
  }

  const formData = new FormData()
  // ファイル
  formData.append('sampleFile', uploadFile.current.files[0])
  formData.append('userId', userId.toString())
  formData.append('directoryName', fileName)
  formData.append('parentDirectory', nowDirectory)
  formData.append('directoryType', 'file')
  formData.append('fileSize', uploadFile.current.files[0].size.toString())

  const res = await fetch('/api/puiSto/upload', {
    method: 'POST',
    headers: {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    },
    body: formData
  })
}