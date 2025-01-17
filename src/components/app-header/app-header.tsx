import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { selectUser } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store/store';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUser).name;

  return (
    <>
      <AppHeaderUI userName={userName} />
    </>
  );
};
