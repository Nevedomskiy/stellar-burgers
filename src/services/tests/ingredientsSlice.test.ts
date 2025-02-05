import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  getIngredients,
  ingredientsReducer,
  selectIngredients,
  selectIsLoadingIngredients
} from '../slices/ingredientsSlice';
import { mockStore } from './store.mock';

const expectedIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    __v: 0
  }
];

describe('тест успешных асинхронных экшенов', () => {
  beforeEach(() => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, data: expectedIngredients }) // Возвращаем ожидаемый положительный результат
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks(); // Сбрасываем все моки после каждого теста
  });

  test('тест загрузки заказов', async () => {
    //до запуска асинхронной функции isIngredientsLoading = false
    expect(mockStore.getState().ingredients.isIngredientsLoading).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(getIngredients());
    //проверяем значение isIngredientsLoading, при запуске асинхронной функции значение isIngredientsLoading меняется на true
    expect(mockStore.getState().ingredients.isIngredientsLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { isIngredientsLoading, ingredients } =
      mockStore.getState().ingredients;
    //после асинхронной функции isIngredientsLoading = false
    expect(isIngredientsLoading).toBe(false);
    // Сравниваем состояние из стора с ожидаемым результатом
    // Используем toEqual для строгого сравнения
    expect(ingredients).toEqual(expectedIngredients);
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
    expect(mockStore.getState().ingredients.isIngredientsLoading).toBe(false);
    // Запускаем выполнение асинхронного экшена
    const promise = mockStore.dispatch(getIngredients());
    // Проверяем, что isIngredientsLoading стал true
    expect(mockStore.getState().ingredients.isIngredientsLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Проверяем состояние после завершения
    const { isIngredientsLoading, error } = mockStore.getState().ingredients;
    // Проверяем, что isIngredientsLoading стал false
    expect(isIngredientsLoading).toBe(false);
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
      ingredients: ingredientsReducer
    },
    // указываем начальное состояние стора с ингридиентами
    preloadedState: {
      ingredients: {
        ingredients: expectedIngredients,
        isIngredientsLoading: false,
        error: null
      }
    }
  });
  test('получение ингридиентов по селектору', () => {
    // получаем ингридиенты с помощью селектора
    const ingredients = selectIngredients(store.getState());
    expect(ingredients).toEqual(expectedIngredients);
  });
  test('получение состояния загрузки по селектору', () => {
    // получаем ингридиенты с помощью селектора
    const isLoading = selectIsLoadingIngredients(store.getState());
    expect(isLoading).toEqual(false);
  });
});
