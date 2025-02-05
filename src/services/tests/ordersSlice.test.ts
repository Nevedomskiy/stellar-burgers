import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  addBunInOrder,
  addIngredientInOrder,
  downIngredientInOrder,
  getUserOrders,
  initialState,
  orderBurger,
  ordersReducer,
  resetOrder,
  selectConstructorItems,
  selectIsOrdersLoading,
  selectOrderModalData,
  selectOrderRequest,
  selectUserOrders,
  upIngredientInOrder
} from '../slices/ordersSlice';
import { mockStore } from './store.mock';

const expectedResultUserOrders = {
  success: true,
  orders: [
    {
      _id: '6788e8ba133acd001be4a940',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-01-16T11:08:42.450Z',
      updatedAt: '2025-01-16T11:08:43.032Z',
      number: 65661
    },
    {
      _id: '67891f29133acd001be4a9e9',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: '2025-01-16T15:00:57.458Z',
      updatedAt: '2025-01-16T15:00:58.096Z',
      number: 65684
    }
  ],
  total: 66760,
  totalToday: 22
};

const initialOrder: string[] = [
  '643d69a5c3f7b9001cfa093d',
  '643d69a5c3f7b9001cfa0940',
  '643d69a5c3f7b9001cfa093d'
];

const expectedDataOrder = {
  bun: {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  },
  ingredients: [
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      id: '0'
    }
  ]
};

const expectedResultNewOrder = {
  success: true,
  name: 'Флюоресцентный метеоритный бургер',
  order: {
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      },
      {
        _id: '643d69a5c3f7b9001cfa0940',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
      },
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      }
    ],
    _id: '6799eaa5133acd001be4d3f5',
    status: 'done',
    name: 'Флюоресцентный метеоритный бургер',
    createdAt: '2025-01-29T08:45:25.911Z',
    updatedAt: '2025-01-29T08:45:26.525Z',
    number: 67136
  }
};

const initialOrdersState = {
  constructorItems: expectedDataOrder,
  userOrders: expectedResultUserOrders.orders,
  orderRequest: false,
  orderModalData: null,
  isOrdersLoading: false,
  error: null
};

describe('тест успешных асинхронных экшенов', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Сбрасываем все моки после каждого теста
  });

  test('тест загрузки заказов пользователя', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...expectedResultUserOrders }) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции isOrdersLoading = false
    expect(mockStore.getState().orders.isOrdersLoading).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(getUserOrders());
    //проверяем значение isOrdersLoading, при запуске асинхронной функции значение isOrdersLoading меняется на true
    expect(mockStore.getState().orders.isOrdersLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { userOrders, isOrdersLoading } = mockStore.getState().orders;
    //после асинхронной функции isOrdersLoading = false
    expect(isOrdersLoading).toBe(false);
    // Сравниваем состояние из стора с ожидаемым результатом
    // Используем toEqual для строгого сравнения
    expect(userOrders).toEqual(expectedResultUserOrders.orders);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест нового заказа пользователя', async () => {
    // Мокаем глобальный fetch
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...expectedResultNewOrder }) // Возвращаем ожидаемый положительный результат
      })
    );
    //до запуска асинхронной функции orderRequest = false
    expect(mockStore.getState().orders.orderRequest).toBe(false);
    // Запускаем выполнения асинхронного экшена
    const promise = mockStore.dispatch(orderBurger(initialOrder));
    //проверяем значение orderRequest, при запуске асинхронной функции значение orderRequest меняется на true
    expect(mockStore.getState().orders.orderRequest).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Получаем состояние из стора
    const { orderModalData, orderRequest } = mockStore.getState().orders;
    //после асинхронной функции orderRequest = false
    expect(orderRequest).toBe(false);
    // Сравниваем состояние из стора с ожидаемым результатом
    // Используем toEqual для строгого сравнения
    expect(orderModalData).toEqual(expectedResultNewOrder.order);
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
  test('тест неуспешной загрузки заказов пользователя', async () => {
    // Проверяем начальное состояние
    expect(mockStore.getState().orders.isOrdersLoading).toBe(false);
    // Запускаем выполнение асинхронного экшена
    const promise = mockStore.dispatch(getUserOrders());
    // Проверяем, что isOrdersLoading стал true
    expect(mockStore.getState().orders.isOrdersLoading).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Проверяем состояние после завершения
    const { isOrdersLoading, error } = mockStore.getState().orders;
    // Проверяем, что isOrdersLoading стал false
    expect(isOrdersLoading).toBe(false);
    // Проверяем, что ошибка была установлена
    expect(error).toBe(errorMessage);
    // Проверяем, что fetch был вызван один раз
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('тест неуспешного нового заказа', async () => {
    // Проверяем начальное состояние
    expect(mockStore.getState().orders.orderRequest).toBe(false);
    // Запускаем выполнение асинхронного экшена
    const promise = mockStore.dispatch(orderBurger(initialOrder));
    // Проверяем, что orderRequest стал true
    expect(mockStore.getState().orders.orderRequest).toBe(true);
    // Ждем завершения асинхронного экшена
    await promise;
    // Проверяем состояние после завершения
    const { orderRequest, error } = mockStore.getState().orders;
    // Проверяем, что orderRequest стал false
    expect(orderRequest).toBe(false);
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
      orders: ordersReducer
    },
    // указываем начальное состояние стора с ингридиентами
    preloadedState: {
      orders: initialOrdersState
    }
  });
  test('получение всех заказов текущего пользователя по селектору', () => {
    const orders = selectUserOrders(store.getState());
    expect(orders).toEqual(expectedResultUserOrders.orders);
  });
  test('получение состояния загрузки всех заказов пользователя по селектору', () => {
    const isLoading = selectIsOrdersLoading(store.getState());
    expect(isLoading).toEqual(false);
  });
  test('получение состояния загрузки нового заказа пользователя по селектору', () => {
    const orderRequest = selectOrderRequest(store.getState());
    expect(orderRequest).toEqual(false);
  });
  test('получение данных успешного заказа по селектору', () => {
    const orderModalData = selectOrderModalData(store.getState());
    expect(orderModalData).toEqual(null);
  });
  test('получение данных конструктора заказа по селектору', () => {
    const constructorItems = selectConstructorItems(store.getState());
    expect(constructorItems).toEqual(expectedDataOrder);
  });
});

describe('тесты синхронных экшенов', () => {
  test('добавить булку в конструктор заказа', () => {
    // меняем bun с помощью addBunInOrder, должно измениться в initialOrdersState
    const newState = ordersReducer(
      initialOrdersState,
      addBunInOrder({
        _id: '123d',
        name: 'Проверочная булка',
        type: 'bun',
        proteins: 434,
        fat: 236,
        carbohydrates: 852,
        calories: 6432,
        price: 9828,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      })
    );
    // достаем bun из состояния
    const { bun } = newState.constructorItems;

    // сравниваем то что получилось с ожидаемым результатом (bun заменена той, которую передали в action)
    expect(bun).toEqual({
      _id: '123d',
      name: 'Проверочная булка',
      type: 'bun',
      proteins: 434,
      fat: 236,
      carbohydrates: 852,
      calories: 6432,
      price: 9828,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    });
  });

  test('добавить ингридиент в конструктор заказа', () => {
    // меняем ingredient с помощью addIngredientInOrder, должно измениться в initialOrdersState
    const newState = ordersReducer(
      initialOrdersState,
      addIngredientInOrder({
        _id: '123d',
        name: 'Проверочный ингридиент',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
      })
    );
    // достаем ingredients из состояния конструктора заказа
    const { ingredients } = newState.constructorItems;
    // сравниваем то что получилось с ожидаемым результатом
    expect(ingredients).toEqual([
      {
        _id: '643d69a5c3f7b9001cfa093e',
        name: 'Филе Люминесцентного тетраодонтимформа',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        id: '0'
      },
      {
        _id: '123d',
        name: 'Проверочный ингридиент',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        id: '1'
      }
    ]);
  });

  test('переместить ингридиент в конструкторе заказа вниз по массиву(прибавить index)', () => {
    // Сначала добавляем в initialOrdersState второй элемент
    const newStateIndexOne = ordersReducer(
      initialOrdersState,
      addIngredientInOrder({
        _id: '123d',
        name: 'Проверочный ингридиент',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
      })
    );
    // достаем ingredients из состояния конструктора заказа
    let { ingredients } = newStateIndexOne.constructorItems;
    // проверяем, что 'Проверочный ингридиент' имеет index 1
    expect(ingredients[1].name).toEqual('Проверочный ингридиент');
    const newStateIndexZero = ordersReducer(
      newStateIndexOne,
      //опускаем 0 элемент на позицию 1 (повышаем индекс), значит 'Проверочный ингридиент' сместится на 0 позицию
      downIngredientInOrder(0)
    );
    // проверяем, что 'Проверочный ингридиент' имеет index 0(переместился вниз по списку ingredients)
    expect(newStateIndexZero.constructorItems.ingredients[0].name).toEqual(
      'Проверочный ингридиент'
    );
  });

  test('переместить ингридиент в конструкторе заказа вверх по массиву(убавить index)', () => {
    // Сначала добавляем в initialOrdersState второй элемент
    const newStateIndexOne = ordersReducer(
      initialOrdersState,
      addIngredientInOrder({
        _id: '123d',
        name: 'Проверочный ингридиент',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
      })
    );
    // достаем ingredients из состояния конструктора заказа
    let { ingredients } = newStateIndexOne.constructorItems;
    // проверяем, что 'Проверочный ингридиент' имеет index 1
    expect(ingredients[1].name).toEqual('Проверочный ингридиент');
    const newStateIndexZero = ordersReducer(
      newStateIndexOne,
      //поднимаем 1(понижаем индекс) элемент на позицию 0
      upIngredientInOrder(1)
    );
    // проверяем, что 'Проверочный ингридиент' имеет index 1(переместился вверх по списку ingredients)
    expect(newStateIndexZero.constructorItems.ingredients[0].name).toEqual(
      'Проверочный ингридиент'
    );
  });

  test('проверяем приведение текущего state к initialState', () => {
    // initialOrdersState есть заполененные поля ingredients
    const newState = ordersReducer(
      initialOrdersState,
      //после вызова resetOrder state будет приведён к значению initialState из ordersReducer
      resetOrder()
    );
    // проверяем, что сброшенный newState равен его начальному состоянию initialState из ordersReducer
    expect(newState).toEqual(initialState);
  });
});
