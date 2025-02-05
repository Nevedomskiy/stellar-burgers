import { BurgerConstructorElementUI } from '@ui';
import { FC, memo } from 'react';
import {
  downIngredientInOrder,
  removeIngredientInOrder,
  upIngredientInOrder
} from '../../services/slices/ordersSlice';
import { useDispatch } from '../../services/store/store';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(downIngredientInOrder(index));
    };

    const handleMoveUp = () => {
      dispatch(upIngredientInOrder(index));
    };

    const handleClose = () => {
      dispatch(removeIngredientInOrder(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
