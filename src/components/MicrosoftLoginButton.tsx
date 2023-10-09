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
      }
    } catch (error) {
      console.error('Ошибка при получении данных о пользователе:', error);
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
