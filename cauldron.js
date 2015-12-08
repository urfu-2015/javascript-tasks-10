'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;


/**
 * Обработка доступных ингредиентов
 */
var availableIngredients = document.querySelector('.available-ingredients .ingredients-list');
availableIngredients.addEventListener('click', function (ingredient) {
    usedIngredients.insertBefore(ingredient.target, usedIngredients.firstChild);
}, false);

/**
 * Обработка использованных ингредиентов
 */
var usedIngredients = document.querySelector('.used-ingredients .ingredients-list');
usedIngredients.addEventListener('click', function (ingredient) {
    availableIngredients.insertBefore(ingredient.target, availableIngredients.firstChild);
}, false);

/**
 * обновление того, что варится в котле
 */
setInterval(function() {
    showPotion(findResultPotion());
}, 50);

/**
 * Поиск формулы, и потом определение сложнейшей
 * @returns {string}
 */
var findResultPotion = function() {
    var resultPotions =  formulas.filter(function(formula) {
        return formula.elements.every(function(ingredient) {
            return usedIngredients.querySelector('[data-element=' + ingredient + ']');
        });
    });
    var complexity = 0;
    var answer = '';
    resultPotions.forEach(function(potion) {
        if (potion.elements.length > complexity) {
            complexity = potion.elements.length;
            answer = potion.result;
        }
    })
    return answer;
}

/**
 * Вывод полученного зелья
 * @param potion
 */
var showPotion = function(potion) {
    var currentPotion = document.querySelector('.potion');
    var newPotion = document.createElement('p');
    var text = document.createTextNode(potion);
    newPotion.appendChild(text);
    currentPotion.replaceChild(newPotion, currentPotion.children[0]);
}


/**
 * Обработка фильтра
 * @type {Element}
 */
var ingredientsFilter = document.querySelector('.ingredients-filter');
ingredientsFilter.addEventListener('keydown', function (inputValue) {
    updateInputIngredients(getCurrentValue(inputValue.key));
}, false);

/**
 * Вспомогательная функция. Определяет какие доступные элементы нужно оттображать
 * @param inputValue
 */
var updateInputIngredients = function(inputValue) {
    var availableElements = [].slice.call(document.querySelectorAll('.available-ingredients .ingredient'));
    availableElements.forEach(function(ingredient) {
        if (ingredient.innerHTML.indexOf(inputValue) === -1) {
            ingredient.classList.add('invisible-ingredient');
        } else {
            ingredient.classList.remove('invisible-ingredient');
        }
    });
};

/**
 * Вспомогательная функция. Определяет текущее значение в фильтре
 * @type {string}
 */
var currentValue = '';
var getCurrentValue = function(char) {
    if (char === 'Backspace') {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue += char;
    }
    return currentValue
}

/**
 * Обработка очищения фильтра
 * @type {Element}
 */
var filterExit = document.querySelector('#filter-exit');
filterExit.addEventListener('click', function (event) {
    ingredientsFilter.value = '';
    currentValue = '';
    updateInputIngredients(ingredientsFilter.value);
}, false);
