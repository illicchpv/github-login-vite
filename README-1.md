>npm create vite@latest .

![alt text](image.png)

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)

![alt text](image-4.png)

[Авторизация приложений OAuth](https://docs.github.com/ru/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

1. Запрос удостоверения GitHub пользователя

  GET https://github.com/login/oauth/authorize
  client_id
  redirect_uri
  state - Случайная строка,

2. Перенаправление пользователей из GitHub обратно на ваш сайт

  POST https://github.com/login/oauth/access_token
  code
  client_id
  client_secret
  redirect_uri
    Accept: application/json

По умолчанию ответ имеет следующую форму: 

    access_token=gho_16C7e42F292c6912E7710c838347Ae178B4a&scope=repo%2Cgist&token_type=bearer

    Вы также можете получить ответ в разных форматах, указав формат в заголовке Accept. Например, Accept: application/json

    {
      "access_token":"gho_16C7e42F292c6912E7710c838347Ae178B4a",
      "scope":"repo,gist",
      "token_type":"bearer"
    }

3. Использование маркера доступа для доступа к API

Authorization: Bearer OAUTH-TOKEN

GET https://api.github.com/user


>npm i axios


https://youtu.be/rRn2EisxPl4?t=1358