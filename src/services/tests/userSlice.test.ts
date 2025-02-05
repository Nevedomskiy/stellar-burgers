import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  checkAuthUser,
  loginUser,
  logoutUser,
  registerUser,
  resetUserState,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectIsLoadingUser,
  selectIsSuccessRegistration,
  selectUser,
  updateUserInfo,
  userReducer
} from '../slices/userSlice';
import { mockStore } from './store.mock';

const expectedResultRegistration = {
  success: true,
  user: {
    email: '123qweasd@qwe.ru',
    name: '123qweasd'
  },
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};

describe('тест успешных асинхронных экшенов', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Сбрасываем все моки после каждого теста
  });

  test('тест регистрации', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResultRegistration) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции isSuccessRegistration = false
    expect(mockStore.getState().user.isSuccessRegistration).toBe(false);
    // Запускаем выполнения асинхронного экшена
    await mockStore.dispatch(
      registerUser({
        email: '123qweasd@qwe.ru',
        name: '123qweasd',
        password: 'qweqweqwe'
      })
    );
    // Получаем состояние из стора
    const { isSuccessRegistration } = mockStore.getState().user;
    //после выполнения асинхронной функции registerUser isSuccessRegistration = true
    expect(isSuccessRegistration).toBe(true);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест авторизации', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(expectedResultRegistration) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    //до запуска асинхронной функции isAuthenticated = false
    expect(mockStore.getState().user.isAuthenticated).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(
      loginUser({
        email: '123qweasd@qwe.ru',
        password: 'qweqweqwe'
      })
    );
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isAuthenticated, isUserLoading } = mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен ожидаемому результату
    expect(user).toEqual(expectedResultRegistration.user);
    //проверяем, что isAuthenticated изменился на true после успешной аутентификации
    expect(isAuthenticated).toBe(true);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест выход из системы', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: 'Successful logout'
          }) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    //до запуска асинхронной функции isAuthenticated = true(т.к. в прошлом тесте мы авторизовались)
    expect(mockStore.getState().user.isAuthenticated).toBe(true);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(logoutUser());
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isAuthenticated, isUserLoading } = mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен ожидаемому результату
    console.log(user);
    expect(user).toEqual({ email: '', name: '' });
    //проверяем, что isAuthenticated изменился на false после успешной выхода из системы
    expect(isAuthenticated).toBe(false);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест проверки авторизации через токен', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              email: '123qweasd@qwe.ru',
              name: '123qweasd'
            }
          }) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    //до запуска асинхронной функции isAuthenticated = false
    expect(mockStore.getState().user.isAuthenticated).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(checkAuthUser());
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isAuthenticated, isUserLoading } = mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен ожидаемому результату
    expect(user).toEqual(expectedResultRegistration.user);
    //проверяем, что isAuthenticated изменился на true после успешной аутентификации
    expect(isAuthenticated).toBe(true);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест изменения данных пользователя', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              email: '123qweasd@qwe.ruu',
              name: '123qweasd'
            }
          }) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(
      updateUserInfo({
        email: '123qweasd@qwe.ruu',
        name: '123qweasd'
      })
    );
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isAuthenticated, isUserLoading } = mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен ожидаемому результату
    expect(user).toEqual({
      email: '123qweasd@qwe.ruu',
      name: '123qweasd'
    });
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('тест неуспешных асинхронных экшенов', () => {
  const errorMessage = 'Ошибка загрузки данных';
  beforeEach(() => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }) // Возвращаем ожидаемый отрицательный результат
      })
    );
    //до начала теста сбрасываем state
    mockStore.dispatch(resetUserState());
  });
  afterEach(() => {
    jest.resetAllMocks(); // Сбрасываем все моки после каждого теста
  });

  test('тест ошибки регистрации', async () => {
    //до запуска асинхронной функции isSuccessRegistration = false
    expect(mockStore.getState().user.isSuccessRegistration).toBe(false);
    //до запуска у error нет значения
    expect(mockStore.getState().user.error).toBe(null);
    // Запускаем выполнения асинхронного экшена
    await mockStore.dispatch(
      registerUser({
        email: '123qweasd@qwe.ru',
        name: '123qweasd',
        password: 'qweqweqwe'
      })
    );
    // Получаем состояние из стора
    const { error, isSuccessRegistration } = mockStore.getState().user;
    //после выполнения неуспешной асинхронной функции registerUser isSuccessRegistration = false
    expect(isSuccessRegistration).toBe(false);
    //у error появилось значение
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест ошибки авторизации', async () => {
    //до запуска у error нет значения
    expect(mockStore.getState().user.error).toBe(null);
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    //до запуска асинхронной функции isAuthenticated = false
    expect(mockStore.getState().user.isAuthenticated).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(
      loginUser({
        email: '123qweasd@qwe.ru',
        password: 'qweqweqwe'
      })
    );
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isAuthenticated, isUserLoading, error } =
      mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен ожидаемому результату
    expect(user).toEqual({ email: '', name: '' });
    //проверяем, что isAuthenticated не изменился на true после успешной аутентификации
    expect(isAuthenticated).toBe(false);
    //у error появилось значение
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест ошибки выхода из системы', async () => {
    //до запуска у error нет значения
    expect(mockStore.getState().user.error).toBe(null);
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(logoutUser());
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { error, isUserLoading } = mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //у error появилось значение
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест проверки авторизации через токен', async () => {
    //до запуска у error нет значения
    expect(mockStore.getState().user.error).toBe(null);
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    //до запуска асинхронной функции isAuthenticated = false
    expect(mockStore.getState().user.isAuthenticated).toBe(false);
    //до запуска асинхронной функции isAuthChecked = false
    expect(mockStore.getState().user.isAuthChecked).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(checkAuthUser());
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isAuthenticated, isUserLoading, error } =
      mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен ожидаемому результату
    expect(user).toEqual({ email: '', name: '' });
    //проверяем, что isAuthenticated изменился на false после успешной аутентификации
    expect(isAuthenticated).toBe(false);
    //до запуска асинхронной функции isAuthChecked = false
    expect(mockStore.getState().user.isAuthChecked).toBe(true);
    //у error появилось значение
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест изменения данных пользователя', async () => {
    //до запуска у error нет значения
    expect(mockStore.getState().user.error).toBe(null);
    //до запуска асинхронной функции isUserLoading = false
    expect(mockStore.getState().user.isUserLoading).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(
      updateUserInfo({
        email: '123qweasd@qwe.ruu',
        name: '123qweasd'
      })
    );
    //после запуска асинхронной функции isUserLoading = true
    expect(mockStore.getState().user.isUserLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { user, isUserLoading, error } = mockStore.getState().user;
    //после выполнения асинхронной функции isUserLoading = false
    expect(isUserLoading).toBe(false);
    //проверяем, что user из стейта равен исходному результату
    expect(user).toEqual({ email: '', name: '' });
    //у error появилось значение
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('тесты селекторов', () => {
  //создаем ожидаемый стор пользователя
  const expectedStoreData = {
    user: { email: '123', name: '123' },
    isAuthChecked: true,
    isAuthenticated: true,
    isUserLoading: true,
    isSuccessRegistration: true,
    error: 'текст ошибки'
  };
  // создаем начальный стор, из которого будет получать данные
  const store = configureStore({
    reducer: {
      user: userReducer
    },
    // указываем начальное состояние стора
    preloadedState: {
      user: expectedStoreData
    }
  });
  test('получение данных пользователя', () => {
    const user = selectUser(store.getState());
    expect(user).toEqual(expectedStoreData.user);
  });
  test('получение состояния загрузки данных пользователя', () => {
    const isLoading = selectIsLoadingUser(store.getState());
    expect(isLoading).toEqual(true);
  });
  test('получение состояния проверка авторизации', () => {
    const isAuthChecked = selectIsAuthChecked(store.getState());
    expect(isAuthChecked).toEqual(true);
  });
  test('получение данных успешной регистрации по селектору', () => {
    const isSuccessRegistration = selectIsSuccessRegistration(store.getState());
    expect(isSuccessRegistration).toEqual(true);
  });
  test('получение данных авторизации', () => {
    const isAuthenticated = selectIsAuthenticated(store.getState());
    expect(isAuthenticated).toEqual(true);
  });
});
