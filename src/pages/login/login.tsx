import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { loginUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email === '' && password === '') {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
