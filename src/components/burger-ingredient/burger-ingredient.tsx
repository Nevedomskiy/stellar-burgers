import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import {
  addBunInOrder,
  addIngredientInOrder
} from '../../services/slices/ordersSlice';
import { useDispatch } from '../../services/store/store';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBunInOrder(ingredient));
      } else {
        dispatch(addIngredientInOrder(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
