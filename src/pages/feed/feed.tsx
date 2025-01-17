import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getFeeds,
  selectIsLoadingFeeds,
  selectOrders
} from '../../services/slices/feedsSlice';
import { useDispatch } from '../../services/store/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const ordersIsLoading = useSelector(selectIsLoadingFeeds);

  // const orders: TOrder[] = [];
  // console.log(orders);
  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  if (ordersIsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
