import { useState, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import { inputId, inputPassword, inputUserName, inputNewMail, inputNewPassword, inputNewNumber, inputNewFirstName, inputNewLastName, inputNewPlan, registrationConfirmation, login } from './actioncreator'
import Style from '@/styles/login.module.css'
import { userFormChangeReducer, newUserFormChangeReducer, loginRequestReducer } from './loginReducer'
import { ProgressSpinner } from 'primereact/progressspinner';

type Data = {
  userName: string[],
  mail: string[],
  pass: string[],
  number: string[],
  firstName: string[],
  lastName: string[]
}

export default function Test() {
  const [userState, userStateDispatch] = useReducer(userFormChangeReducer, {
    userId: '',
    userPassword: '',
    id: ''
  })

  const [checkState, setCheckState] = useState({
    checkResult: false,
    validation: {
      userName: [] as string[],
      mail: [] as string[],
      number: [] as string[],
      pass: [] as string[],
      lastName: [] as string[],
      firstName: [] as string[]
    }
  })

  const [newUserState, newUserStateDispatch] = useReducer(newUserFormChangeReducer, {
    userMail: '',
    userPassword: '',
    userNumber: '',
    userFirstName: '',
    userLastName: '',
    userPlan: '1',
    userName: ''
  })

  const [loginRequestState, loginDispatch] = useReducer(loginRequestReducer, {
    message: '',
    request: ''
  })

  const router = useRouter()

  const [display, setDisplay] = useState({
    display: false
  })

  const [confirmation, setConfirmation] = useState({
    display: false
  })

  useEffect(() => {
    if (loginRequestState.request === 'Success') {
      router.push({
        pathname: '/oku/0029/puiSto',
      })
    }
  }, [loginRequestState.request])

  function Registration() {
    return (
      <div className={Style.confirmationOverlay}>
        <div className={Style.confirmationWrap}>
          <h4>以下の内容で登録します。</h4>
          <label htmlFor="1">アカウントに使用する名前</label>
          <input type="text" readOnly autoComplete='new-password' value={newUserState.userName} id='1' />

          <label htmlFor="2">メールアドレス</label>
          <input type="text" readOnly autoComplete='new-password' value={newUserState.userMail} id='2' />

          <label htmlFor="3">パスワード(セキュリティのため表示されません。)</label>
          <input type="password" readOnly autoComplete='new-password' value={newUserState.userPassword} id='3' />

          <label htmlFor="4">名</label>
          <input type="text" readOnly autoComplete='new-password' value={newUserState.userFirstName} id='4' />

          <label htmlFor="5">姓</label>
          <input type="text" readOnly autoComplete='new-password' value={newUserState.userLastName} id='5' />

          <label htmlFor="6">電話番号</label>
          <input type="text" readOnly autoComplete='new-password' value={newUserState.userNumber} id='6' />

          <label htmlFor="7">選択中のプラン</label>
          <input type="text" readOnly autoComplete='new-password' value={newUserState.userPlan} id='7' />

          <button className={Style.backButton} onClick={() => {
            setConfirmation({
              display: false
            })
          }}>戻る</button>
          <button className={Style.nonBackButton} onClick={async () => {
            await registrationConfirmation(newUserState, confirmation)
            await login(userStateDispatch, loginDispatch, newUserState.userMail, newUserState.userPassword)
            setConfirmation({
              display: false
            })
          }}>会員登録</button>

        </div>
      </div>
    )
  }



  return (
    <>
      <div className={Style.background}>
        <div className={display.display ? Style.formWrap + ' ' + Style.formWrap2 : Style.formWrap}>
          <h2 className={Style.loginTitle}>ぷいぷいストレージ</h2>
          <h3 className={display.display ? Style.signIn + ' ' + Style.signIn2 : Style.signIn}>{display.display ? '会員登録' : 'サインイン'}</h3>
          {loginRequestState.request === 'Failure' && display.display === false && <p className={Style.errorMessage}>{userState.userId === '' && userState.userPassword === '' ? '情報を入力してください。' : 'アカウントが存在しないか、ID・パスワードが間違っています。'}</p>}
          <div className={display.display ? Style.loginWrap + ' ' + Style.loginWrap2 : Style.loginWrap}>
            <input type="email" value={userState.userId} className={Style.userId} placeholder={'ID・メールアドレス'} onChange={(e) => {
              inputId(userStateDispatch, e.target.value)
            }} />
            <input type="password" value={userState.userPassword} className={Style.userPassword} placeholder={'パスワード'} onChange={(e) => {
              inputPassword(userStateDispatch, e.target.value)
            }} />
            <button className={Style.loginButton} onClick={() => {
              login(userStateDispatch, loginDispatch, userState.userId, userState.userPassword)
              console.log(userState);
            }}>ログイン</button>
            <button className={Style.switch} onClick={() => {
              setDisplay({
                display: true
              })
            }}>新規会員登録</button>
          </div>
          <div className={display.display ? Style.registrationWrap + ' ' + Style.registrationWrap2 : Style.registrationWrap}>
            <input type="text" autoComplete='new-password' maxLength={50} value={newUserState.userName} placeholder={'アカウントに使用する名前'} onChange={(e) => {
              inputUserName(newUserStateDispatch, e.target.value)
            }} />
            <p className={Style.errorCheck}>{checkState.validation.userName[0]}</p>
            <input type="email" autoComplete='new-password' maxLength={40} value={newUserState.userMail} placeholder={'メールアドレス'} onChange={(e) => {
              inputNewMail(newUserStateDispatch, e.target.value)
            }} />
            <p className={Style.errorCheck}>{checkState.validation.mail[0]}</p>

            <input type="password" autoComplete='new-password' maxLength={30} value={newUserState.userPassword} placeholder={'パスワード'} onChange={(e) => {
              inputNewPassword(newUserStateDispatch, e.target.value)
            }} />
            <p className={Style.errorCheck}>{checkState.validation.pass[0]}</p>

            <input type="text" className={Style.firstName} autoComplete='new-password' maxLength={20} value={newUserState.userLastName} placeholder={'名'} onChange={(e) => {
              inputNewLastName(newUserStateDispatch, e.target.value)
            }} />
            <p className={Style.errorCheck + ' ' + Style.firstNameError}>{checkState.validation.firstName[0]}</p>

            <input type="text" className={Style.lastName} autoComplete='new-password' maxLength={20} value={newUserState.userFirstName} placeholder={'姓'} onChange={(e) => {
              inputNewFirstName(newUserStateDispatch, e.target.value)
            }} />
            <p className={Style.errorCheck + ' ' + Style.lastNameError}>{checkState.validation.lastName[0]}</p>

            <input type="tel" autoComplete='new-password' maxLength={15} value={newUserState.userNumber} placeholder={'電話番号'} onChange={(e) => {
              if (/[^\d\-]/.test(e.target.value)) {
                return
              }
              inputNewNumber(newUserStateDispatch, e.target.value)
            }} />
            <p className={Style.errorCheck}>{checkState.validation.number[0]}</p>
            <select name="" id="" value={newUserState.userPlan} onChange={(e) => {
              inputNewPlan(newUserStateDispatch, e.target.value)
            }}>
              <option value="0">10GBプラン</option>
              <option value="1">100GBプラン</option>
              <option value="2">1000GBプラン</option>
            </select>
            <p>(1. 50MB / 2. 100MB / 3. 150MB)</p>
            <button className={Style.registrationButton} onClick={async () => {
              const check = await registrationConfirmation(newUserState, confirmation)
              setCheckState({
                ...checkState,
                checkResult: check.checkResult,
                validation: {
                  ...checkState.validation,
                  userName: check.validation.userName,
                  mail: check.validation.mail,
                  number: check.validation.number,
                  pass: check.validation.pass,
                  lastName: check.validation.lastName,
                  firstName: check.validation.firstName
                }
              })

              setConfirmation({
                display: check.checkResult ? true : false
              })
            }}>登録確認画面へ</button>
            <button className={Style.loginTranslateButton} onClick={() => {
              setDisplay({
                display: false
              })
            }}>戻る</button>
          </div>
        </div>
      </div >
      {confirmation.display === true && <Registration />}
      {loginRequestState.request === 'During' && <div className={Style.progress}><ProgressSpinner /></div>}
    </>
  )
}