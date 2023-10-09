import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";

interface UserProfile {
  givenName: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

const MicrosoftLoginButton: React.FC = () => {
  const { instance } = useMsal();
  const [userData, setUserData] = useState<UserProfile | null>(null);

  const loginRequest = {
    scopes: ["User.Read"]
  };

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      if (response && response.account) {
        // Получаем данные о пользователе из MS Graph API
        const graphResponse = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: response.account
        });
        const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            'Authorization': `Bearer ${graphResponse.accessToken}`
          }
        });
        const userData: UserProfile = await userResponse.json();
        setUserData(userData);

        sendUserDataToServer(userData);
      }
    } catch (error) {
      console.error('Ошибка при получении данных о пользователе:', error);
    }
  };

  const sendUserDataToServer = async (userData: UserProfile) => {
    try {
      const response = await fetch('https://localhost:7069/api/User/signin-microsoft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Серверный ответ:', data);
      } else {
        console.error('Ошибка при отправке данных о пользователе на сервер:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при отправке данных о пользователе на сервер:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Microsoft</button>
      {userData && (
        <div>
          <h2>Данные о пользователе:</h2>
          <p><strong>Имя:</strong> {userData.givenName}</p>
          <p><strong>Фамилия:</strong> {userData.surname}</p>
          <p><strong>Email:</strong> {userData.userPrincipalName}</p>
          <p><strong>ID:</strong> {userData.id}</p>
        </div>
      )}
    </div>
  );
};

export default MicrosoftLoginButton;
