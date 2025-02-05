import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  feedsReducer,
  getFeeds,
  selectIsLoadingFeeds,
  selectOrders,
  selectTotal,
  selectTotalToday
} from '../slices/feedsSlice';
import { mockStore } from './store.mock';

const expectedResult = {
  orders: [
    {
      _id: '6798d9af133acd001be4d2ab',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Астероидный флюоресцентный spicy био-марсианский бургер',
      createdAt: '2025-01-28T13:20:47.805Z',
      updatedAt: '2025-01-28T13:20:48.518Z',
      number: 67115
    },
    {
      _id: '6798cb2c133acd001be4d29a',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный space бургер',
      createdAt: '2025-01-28T12:18:52.600Z',
      updatedAt: '2025-01-28T12:18:53.329Z',
      number: 67114
    },
    {
      _id: '67989739133acd001be4d262',
      ingredients: ['643d69a5c3f7b9001cfa093d'],
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: '2025-01-28T08:37:13.393Z',
      updatedAt: '2025-01-28T08:37:14.034Z',
      number: 67113
    }
  ],
  total: 111,
  totalToday: 222,
  isFeedsLoading: false,
  error: null
};

describe('тест успешных асинхронных экшенов', () => {
  beforeEach(() => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, ...expectedResult }) // Возвращаем ожидаемый положительный результат
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks(); // Сбрасываем все моки после каждого теста
  });

  test('тест загрузки заказов', async () => {
    //до запуска асинхронной функции isIngredientsLoading = false
    expect(mockStore.getState().feeds.isFeedsLoading).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(getFeeds());
    //проверяем значение isFeedsLoading, при запуске асинхронной функции значение isFeedsLoading меняется на true
    expect(mockStore.getState().feeds.isFeedsLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { orders, isFeedsLoading } = mockStore.getState().feeds;
    // console.log(mockStore.getState().feeds);
    // console.log(initialFeeds.orders);
    //после асинхронной функции isIngredientsLoading = false
    expect(isFeedsLoading).toBe(false);
    // Сравниваем состояние из стора с ожидаемым результатом
    // Используем toEqual для строгого сравнения
    expect(orders).toEqual(expectedResult.orders);
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
  });
  afterEach(() => {
    jest.resetAllMocks(); // Сбрасываем все моки после каждого теста
  });
  test('тест неуспешной загрузки заказов', async () => {
    // Проверяем начальное состояние
    expect(mockStore.getState().feeds.isFeedsLoading).toBe(false);
    // Запускаем выполнение асинхронного экшена
    const promise = mockStore.dispatch(getFeeds());
    // Проверяем, что isFeedsLoading стал true
    expect(mockStore.getState().feeds.isFeedsLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Проверяем состояние после завершения
    const { isFeedsLoading, error } = mockStore.getState().feeds;
    // Проверяем, что isFeedsLoading стал false
    expect(isFeedsLoading).toBe(false);
    // Проверяем, что ошибка была установлена
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('тесты селекторов', () => {
  // создаем начальный стор, из которого будет получать данные
  const store = configureStore({
    reducer: {
      feeds: feedsReducer
    },
    // указываем начальное состояние стора с ингридиентами
    preloadedState: {
      feeds: {
        ...expectedResult
      }
    }
  });
  test('получение заказов по селектору', () => {
    const orders = selectOrders(store.getState());
    expect(orders).toEqual(expectedResult.orders);
  });
  test('получение состояния загрузки по селектору', () => {
    const isLoading = selectIsLoadingFeeds(store.getState());
    expect(isLoading).toEqual(false);
  });
  test('получение общей стоимости по селектору', () => {
    const total = selectTotal(store.getState());
    expect(total).toEqual(expectedResult.total);
  });
  test('получение общей стоимости за сегодня по селектору', () => {
    const totalToday = selectTotalToday(store.getState());
    expect(totalToday).toEqual(expectedResult.totalToday);
  });
});
