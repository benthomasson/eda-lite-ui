import React, { useState } from 'react';
import axios from 'axios';
import { LoginForm, LoginPage } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';
import Logo from '@app/bgimages/Patternfly-Logo.svg';
import { loginUser } from '@app/api/auth';

function Login(props) {
  const history = useHistory();

  const [showHelperText, setShowHelperText] = useState(false);
  const [usernameValue, setUsernameValue] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [passwordValue, setPasswordValue] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handleUsernameChange = (value) => {
    setUsernameValue(value);
  };

  const handlePasswordChange = (passwordValue) => {
    setPasswordValue(passwordValue);
  };

  const onLoginButtonClick = (event) => {
    event.preventDefault();
    setIsValidUsername(!!usernameValue);
    setIsValidPassword(!!passwordValue);
    setShowHelperText(!usernameValue || !passwordValue);
    if (!!usernameValue && !!passwordValue) {
      const details = {
        username: usernameValue,
        password: passwordValue,
      };

      const formBodyItems: string[] = [];
      for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBodyItems.push(encodedKey + '=' + encodedValue);
      }
      const formBody = formBodyItems.join('&');
      loginUser(formBody).then((response) => {
        if (!(response.statusText === 'OK')) {
          setIsValidUsername(false);
          setIsValidPassword(false);
          setShowHelperText(true);
        } else {
          localStorage.setItem('token', response.data.access_token);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
          history.push('/reactions');
        }
      });
    }
  };

  const helperText = (
    <React.Fragment>
      <ExclamationCircleIcon />
      &nbsp;Invalid login credentials.
    </React.Fragment>
  );

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText={helperText}
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Username"
      usernameValue={usernameValue}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Password"
      passwordValue={passwordValue}
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Log in"
    />
  );

  const images = {
    lg: '/assets/images/pfbg_2000.jpg',
    sm: '/assets/images/pfbg_768.jpg',
    sm2x: '/assets/images/pfbg_768@2x.jpg',
    xs: '/assets/images/pfbg_576.jpg',
    xs2x: '/assets/images/pfbg_576@2x.jpg',
  };

  return (
    <LoginPage
      brandImgAlt="Ansible Platform"
      style={{
        backgroundColor: 'var(--pf-global--BackgroundColor--dark-100)',
      }}
      backgroundImgAlt="Images"
      brandImgSrc={Logo}
      loginTitle="Log in to your account"
      loginSubtitle="Enter your sign-on credentials."
    >
      {loginForm}
    </LoginPage>
  );
}

export { Login };
