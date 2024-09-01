/* eslint-disable no-unused-vars */
import {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [count, setCount] = useState(0);

  // 1е обращение - отсылаем на GH login screen передавая CLIENT_ID
  // после логина пользователь возвращается на сайт, за счет указанной обратной ссылки
  // (Authorization callback URL) и в URL передаётся code
  // при помощи которого и CLIENT_SECRET получаем access token

  function loginWithGithub() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
  }

  useEffect(() => {
    // http://localhost:3000/?code=bbba1f7c6de5b23d15c4
    const qs = window.location.search;
    const urlParams = new URLSearchParams(qs);
    const code = urlParams.get('code');
    console.log('code: ', code);

  }, []);

  return (
    <>
      <div className='App'>
        <div>
          <h1>login with GitHub
            <button
              onClick={loginWithGithub}
            >do</button>
          </h1>
        </div>
      </div>
    </>
  );
}

export default App;
