import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../../../services/slices/userSlice';
import { useSelector } from '../../../services/store/store';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={`/`}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.link_active}` : styles.link
            }
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.link_active}` : styles.link
            }
            to={`/feed`}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
          to={isAuthenticated ? `/profile` : `/login`}
        >
          <div className={styles.link_position_last}>
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {isAuthenticated ? userName : 'Личный кабинет'}
            </p>
          </div>
        </NavLink>
      </nav>
    </header>
  );
};
