describe('проверяем доступность приложения', function () {
  this.beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('Проверяем взаимодействие с списком ингридиентов и конструктором заказов', function () {
    //проверяем, что в конструкторе заказа 2 пустых элемента bun
    cy.get('[data-cy="noBuns"]').should('exist').should('have.length', 2);
    //проверим добавились ли внутри внутри списка булок 2 элемента
    cy.get('[data-cy="Булки"]')
      .should('exist') // Проверяем, что элемент существует
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        // Проверяем, что внутри <ul> есть ровно 2 элемента <li>
        cy.get('li').should('have.length', 2);
      });
    //ищем кнопку добавить ингридиента bun1 и сразу нажимаем её
    cy.get(`[data-cy="bun1"]`) // Находим элемент по data-cy
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        cy.contains('button', 'Добавить') // Ищем кнопку с текстом "Добавить"
          .should('exist') // Проверяем, что кнопка существует
          .click(); // Нажимаем на кнопку
      });
    // Проверяем, что в конструкторе заказа больше нет пустых элементов noBuns
    cy.get('[data-cy="noBuns"]').should('not.exist');
    //ищем элемент bun1 в конструкторе заказа
    cy.get('[data-cy="order bun1"]')
      .should('exist') // Проверяем, что элемент существует
      .should('have.length', 2);
    //ищем кнопку добавить ингридиента bun2 и сразу нажимаем её
    cy.get(`[data-cy="bun2"]`) // Находим элемент по data-cy
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        cy.contains('button', 'Добавить') // Ищем кнопку с текстом "Добавить"
          .should('exist') // Проверяем, что кнопка существует
          .click(); // Нажимаем на кнопку
      });
    //ищем элемент bun1 в конструкторе заказа(отсутствует, его должен заменить bun2)
    cy.get('[data-cy="order bun1"]').should('not.exist'); // Проверяем, что элемента нет
    //ищем элемент bun2 в конструкторе заказа
    cy.get('[data-cy="order bun2"]')
      .should('exist') // Проверяем, что элемент существует
      .should('have.length', 2);

    //проверяем, что в конструкторе заказа поле ингридиентов пустое
    cy.get('[data-cy="noFilling"]').should('exist');
    //проверим добавились ли внутри внутри списка начинкок 2 элемента
    cy.get('[data-cy="Начинки"]')
      .should('exist') // Проверяем, что элемент существует
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        // Проверяем, что внутри <ul> есть ровно 2 элемента <li>
        cy.get('li').should('have.length', 2);
      });
    //проверим добавились ли внутри внутри списка соусы 2 элемента
    cy.get('[data-cy="Соусы"]')
      .should('exist') // Проверяем, что элемент существует
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        // Проверяем, что внутри <ul> есть ровно 2 элемента <li>
        cy.get('li').should('have.length', 2);
      });
    //ищем кнопку добавить начинку main1 и сразу нажимаем её
    cy.get(`[data-cy="main1"]`) // Находим элемент по data-cy
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        cy.contains('button', 'Добавить') // Ищем кнопку с текстом "Добавить"
          .should('exist') // Проверяем, что кнопка существует
          .click(); // Нажимаем на кнопку
      });
    //ищем кнопку добавить соус sauce2 и сразу нажимаем её
    cy.get(`[data-cy="sauce2"]`) // Находим элемент по data-cy
      .within(() => {
        // Ограничиваем область поиска внутри этого элемента
        cy.contains('button', 'Добавить') // Ищем кнопку с текстом "Добавить"
          .should('exist') // Проверяем, что кнопка существует
          .click(); // Нажимаем на кнопку
      });
    //проверяем, что в конструкторе заказа отсутствует заглушка 'Выберите начинку'
    cy.get('[data-cy="noFilling"]').should('not.exist');
    // Находим список ингредиентов проверяем наличиие main1 и sauce2(контролируем начальный index, чтобы можно было проверить перемещение вниз и вверх по списку)
    cy.get('[data-cy="ingredientsList"]')
      .should('exist')
      .within(() => {
        // Проверяем элемент с data-cy="order main1" и index 0
        cy.get('[data-cy="order main1"]')
          .should('exist')
          .and('have.attr', 'item-index', '0');
        // Проверяем элемент с data-cy="order sauce2" и index 1
        cy.get('[data-cy="order sauce2"]')
          .should('exist')
          .and('have.attr', 'item-index', '1');
      });
    //в втором элементе списка проверяем, что вторая кнопка в состоянии disabled(это последний элемент списка), затем нажмём кнопку переместить вверх
    cy.get('[data-cy="order sauce2"]')
      .should('exist')
      .within(() => {
        //ищем кнопку без состояния disabled(у кнопки в конце списака будет только одна кнопка 'вверх')
        cy.get('button.move_button').eq(0).should('not.be.disabled').click();
      });
    //проверяем как изменился список ингредиентов
    cy.get('[data-cy="ingredientsList"]')
      .should('exist')
      .within(() => {
        // Проверяем элемент с data-cy="order main1" и index 1
        cy.get('[data-cy="order main1"]')
          .should('exist')
          .and('have.attr', 'item-index', '1');
        // Проверяем элемент с data-cy="order sauce2" и index 0
        cy.get('[data-cy="order sauce2"]')
          .should('exist')
          .and('have.attr', 'item-index', '0')
          .within(() => {
            //после нажатия ингредиент sauce2 поднимается на позицию 0 и первая кнопка move_button должна стать не активной
            cy.get('button.move_button').eq(0).should('be.disabled');
          });
      });
    //снова ищем кнопку добавить начинку main1 и сразу нажимаем её
    cy.get(`[data-cy="main1"]`) // Находим элемент по data-cy
      .within(() => {
        //мы уже добавляли этот элемент, поэтому значение counter__num должно быть равно 1
        cy.get('p.counter__num')
          .should('exist') // Проверяем, что элемент существует
          .should('have.text', '1');
        // Ограничиваем область поиска внутри этого элемента
        cy.contains('button', 'Добавить') // Ищем кнопку с текстом "Добавить"
          .should('exist')
          .click(); // Нажимаем на кнопку
        //это второе нажатие на кнопку доавить элемента main1, значит в корзине их теперь 2 штуки и списке ингредиентов тоже показано это значение
        cy.get('p.counter__num')
          .should('exist') // Проверяем, что элемент существует
          .should('have.text', '2');
      });
    //проверим список ингредиентов с заказе
    cy.get('[data-cy="ingredientsList"]')
      .should('exist')
      .within(() => {
        // Проверяем элементов с data-cy="order main1" 2 штуки
        cy.get('[data-cy="order main1"]')
          .should('exist')
          .should('have.length', 2);
      });
    //проверим кнопку удаления элемента из заказа
    cy.get('[data-cy="order sauce2"]')
      .should('exist')
      .within(() => {
        //ищем кнопку удалить внутри элемента заказа и нажимаем её
        cy.get('span.constructor-element__action').should('exist').click();
      });
    //проверяем, что этого элемента больше нет в заказе
    cy.get('[data-cy="order sauce2"]').should('not.exist');
    //убеждаемся, что счётчик в ингредиентах тоже удалён
    cy.get(`[data-cy="sauce2"]`) // Находим элемент по data-cy
      .within(() => {
        //Проверяем, что элемент отсутствует
        cy.get('p.counter__num').should('not.exist');
      });
  });
});
export {};
