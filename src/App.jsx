/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

const URL_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const URL_ACCESS = 'https://github.com/login/oauth/access_token';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
// const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const PROXY_ROOT = import.meta.env.VITE_PROXY_ROOT;
const CALLBACK_URL = import.meta.env.VITE_CALLBACK_URL;

function App() {
  const [codeSt, setCodeSt] = useState('');
  const [userData, setUserData] = useState(null);
  const [reRender, setReRender] = useState(false);
  // const [accessToken, setAccessToken] = useState('');

  // 1е обращение - отсылаем на GH login screen передавая CLIENT_ID
  // после логина пользователь возвращается на сайт, за счет указанной обратной ссылки
  // (Authorization callback URL) и в URL передаётся code
  // при помощи которого и CLIENT_SECRET получаем access token

  function loginWithGithub() {
    window.location.href = `${URL_AUTHORIZE}?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}`;
  }

  async function getUserData() {
    await fetch(`${PROXY_ROOT}/getUser?user=001pv`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('gh.access_token'),
      }
    })
      .then(resp => resp.json())
      .then(data => {
        console.log('userData data: ', data);
        // login: 'aaaa ', id: 6223851, name : "aaa PV"
        setUserData(data);
      });
    // await fetch('http://localhost:4000/getUserData', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': 'Bearer ' + localStorage.getItem('gh.access_token'),
    //   }
    // })
    //   .then(resp => resp.json())
    //   .then(data => {
    //     console.log('userData data: ', data);
    //     // login: 'aaa pv', id: 6223851, name : "aaa PV"
    //     setUserData(data);
    //   });
  }

  useEffect(() => {
    // http://localhost:3000/?code=bbba1f7c6de5b23d15c4
    const qs = window.location.search;
    const urlParams = new URLSearchParams(qs);
    const code = urlParams.get('code');
    console.log('code: ', code, localStorage.getItem('gh.access_token'));
    setCodeSt(code);
    if (code) {
      try {
        history.replaceState(null, null, CALLBACK_URL);
      } catch (e) {
        console.error("history.replaceState Error", e);
      }
    }
    // console.log('CLIENT_SECRET: ', CLIENT_SECRET);
    // console.log('CLIENT_ID: ', CLIENT_ID);


    if (code && (localStorage.getItem('gh.access_token') === null)) {
      console.log('localStorage: ', localStorage.getItem('gh.access_token'));
      async function getAccessToken() {
        await fetch(`${PROXY_ROOT}/getAccess?user=001pv&code=` + code + '&client_id=' + CLIENT_ID, {
          method: 'GET'
        })
          .then(resp => resp.json())
          .then(data => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem('gh.access_token', data.access_token);
              setReRender(p => !p);
              // setAccessToken(data.access_token);
            }
          });
      }
      // async function getAccessToken() {
      //   await fetch('http://localhost:4000/getAccessToken?code=' + code + '&client_id=' + CLIENT_ID, {
      //     method: 'GET'
      //   })
      //     .then(resp => resp.json())
      //     .then(data => {
      //       console.log(data);
      //       if (data.access_token) {
      //         localStorage.setItem('gh.access_token', data.access_token);
      //         setReRender(p => !p);
      //         // setAccessToken(data.access_token);
      //       }
      //     });
      // }
      getAccessToken();
    }

    // попытки получить access token без сервера
    // if (code && (localStorage.getItem('gh.access_token') === null)) {
    //   const url = `${URL_ACCESS}?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
    //   console.log(url);



    //   return;

    //   axios.post(url,
    //     {},
    //     {
    //       headers: {
    //         "Accept": "application/json",
    //       },
    //     });
    //   return;

    //   // var req = new XMLHttpRequest();
    //   // req.open('POST',
    //   //   'https://github.com/login/oauth/access_token',
    //   //   true);
    //   // req.setRequestHeader('Accept', 'application/json');
    //   // req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //   // req.send(`code=${code}` +
    //   //     `&client_id=${CLIENT_ID}` +
    //   //     `&client_secret=${CLIENT_SECRET}`);

    //   axios.post('https://github.com/login/oauth/access_token' + url, {
    //     headers: {
    //       // "Access-Control-Allow-Origin": "*",
    //       "content-type": "application/x-www-form-urlencoded",
    //       // "content-type": "application/json; charset=UTF-8",
    //       "Accept": "application/json",
    //     }
    //   })

    //     // axios('https://github.com/login/oauth/access_token' + url, {
    //     //   headers: {
    //     //     // "Access-Control-Allow-Origin": "*",
    //     //     "content-type": "application/json; charset=UTF-8",
    //     //     "Accept": "application/json",
    //     //   }

    //     // })

    //     // axios.post('https://github.com/login/oauth/access_token', {
    //     //   code,
    //     //   client_id: CLIENT_ID,
    //     //   client_secret: CLIENT_SECRET,
    //     // })
    //     .then(function (response) {
    //       console.log(response);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });

    //   // fetch('https://github.com/login/oauth/access_token' + url, {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     Accept: 'application/json',
    //   //   },
    //   // })
    //   //   .then((response) => response.json())
    //   //   .then((data) => {
    //   //     console.log(data);
    //   //   });
    // }
  }, []);

  return (
    <>
      <div className='App'>
        <div>
          {codeSt && <h1>code: {codeSt}</h1>}

          {localStorage.getItem('gh.access_token') ?
            <>
              <h1>We have access to GitHub
                <button
                  onClick={() => {
                    localStorage.removeItem('gh.access_token');
                    setReRender(p => !p);
                  }}
                >
                  log out
                </button>
                <span className="at">
                  token: {localStorage.getItem('gh.access_token')}
                </span>
              </h1>
              <h3>Get user data
                <button
                  onClick={getUserData}
                >get user data</button>
              </h3>
              {userData && <div className='userDataBlock'>
                <img src={userData.avatar_url} alt="avatar" width="100" />
                <span>name: {userData.name}</span>
                <span>id: {userData.id}</span>
              </div>}

              {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
            </> : <>
              <h1>login with GitHub
                <button
                  onClick={loginWithGithub}
                >do login</button>
              </h1>
            </>
          }
        </div>
      </div>
    </>
  );
}

export default App;
