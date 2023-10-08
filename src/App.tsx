import './App.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

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
    <div className="App">

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
    </div>
  );
}

export default App;
