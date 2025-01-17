import { TRegisterData } from '@api';
import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  registerUser,
  selectIsSuccessRegistration
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store/store';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const isSuccessRegistration = useSelector(selectIsSuccessRegistration);
  // console.log(isSuccessRegistration);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect(() => {
  // console.log(isSuccessRegistration);
  if (isSuccessRegistration) {
    return <Navigate to={'/login'} />;
  }
  // }, [isSuccessRegistration]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      return;
    }
    const data: TRegisterData = {
      name: userName,
      email: email,
      password: password
    };
    dispatch(registerUser(data));
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
