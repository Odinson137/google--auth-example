import './App.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChakraProvider } from '@chakra-ui/react';

function App() {

  const sendRequestToServer = (credentialResponse: CredentialResponse) => {
    // Отправляем POST-запрос на сервер с данными авторизации
    fetch('https://localhost:7069/api/User/signin-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Серверный ответ:', data);
    })
    .catch(error => {
      console.error('Ошибка при отправке запроса на сервер:', error);
    });
  };

  return (
    <div>
      <GoogleOAuthProvider clientId="535136865130-874a69c1agfpvrvdhmfe27s6f0ucg2be.apps.googleusercontent.com">
        <ChakraProvider>
          <GoogleLogin
            theme="filled_black"
            shape="pill"
            onSuccess={credentialResponse => {
              console.log("Good")
              console.log(credentialResponse)

              sendRequestToServer(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            />
          </ChakraProvider>
        </GoogleOAuthProvider>
        <div>Hello</div>
    </div>

  );
}

export default App;
