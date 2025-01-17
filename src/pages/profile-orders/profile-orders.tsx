import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  getUserOrders,
  selectIsOrdersLoading,
  selectUserOrders
} from '../../services/slices//ordersSlice';
import { getFeeds } from '../../services/slices/feedsSlice';
import { useDispatch, useSelector } from '../../services/store/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isOrdersLoading = useSelector(selectIsOrdersLoading);

  useEffect(() => {
    dispatch(getUserOrders());
    dispatch(getFeeds());
  }, []);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
