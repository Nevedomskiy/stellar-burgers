import { ProfileMenuUI } from '@ui';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetOrder } from '../../services/slices/ordersSlice';
import { logoutUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(resetOrder());
      navigate('/');
    } catch (err) {
      console.error('Logout failed: ', err);
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
