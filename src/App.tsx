import './App.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChakraProvider } from '@chakra-ui/react';

import { MsalProvider  } from "@azure/msal-react";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import MicrosoftLoginButton from './components/MicrosoftLoginButton';

function App() {

  const configuration: Configuration = {
    auth: {
        clientId: "6f3a64ab-773a-4691-b7c9-e0cd0ab763bf",
        authority: "https://login.microsoftonline.com/f279ae35-8d38-4338-a34e-902cd8bee2b1",
        redirectUri: "http://localhost:3000",
    }
  };
  const msalInstance = new PublicClientApplication(configuration);

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
        
      <MsalProvider instance={msalInstance}>
        <MicrosoftLoginButton />
      </MsalProvider>
    </div>

  );
}

export default App;
