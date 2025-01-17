import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  orderBurger,
  resetOrder,
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/ordersSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store/store';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    console.log(!isAuthenticated);
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const itemsId = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun?._id
    ].filter(Boolean);

    dispatch(orderBurger(itemsId));
  };
  const closeOrderModal = () => {
    dispatch(resetOrder());
    navigate('/feed');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
