'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

var availableElements = [].slice.call(document.querySelectorAll('.available-ingredients .ingredient'));
var blockOfAvailableIngredients = document.querySelector('.available-ingredients .ingredients-list');
var blockOfUsedIngredients = document.querySelector('.used-ingredients .ingredients-list');
var parent = [blockOfAvailableIngredients, blockOfUsedIngredients];

/**
 * Обаботчик событий для доступных и использованных элементов
 * @param element - сам элемент, к которому добавляем обработчик событий
 * @param indexForParent - куда этот элемент вставляем
 */
var addReactForElement = function(element, indexForParent) {
    element.addEventListener('click', function (ingredient) {
        parent[indexForParent].insertBefore(ingredient.target, parent[indexForParent].firstChild);
        addReactForElement(ingredient.target, 1 - indexForParent);
    }, false);
};

/**
 * Обработка доступных ингредиентов
 */
availableElements.forEach(function (element) {
    addReactForElement(element, 1);
});

var usedElements = [].slice.call(document.querySelectorAll('.used-ingredients .ingredient'));
/**
 * Обработка использованных ингредиентов
 */
usedElements.forEach(function (element) {
    addReactForElement(element, 0);
});

var clearCauldron = document.querySelector('.clear-cauldron');
/**
 * Обработка очистки котла
 */
clearCauldron.addEventListener('click', function (clear) {
    var usedElements = [].slice.call(document.querySelectorAll('.used-ingredients .ingredients-list li'));
    usedElements.forEach(function (element) {
        blockOfAvailableIngredients.insertBefore(element, blockOfAvailableIngredients.firstChild);
        addReactForElement(element, 1);
    })
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
            return blockOfUsedIngredients.querySelector('[data-element=' + ingredient + ']');
        });
    });
    var complexity = 0;
    var answer = '';
    resultPotions.forEach(function(potion) {
        if (potion.elements.length > complexity) {
            complexity = potion.elements.length;
            answer = potion.result;
        }
    });
    return answer;
};

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
};

/**
 * Обработка фильтра
 * @type {Element}
 */
var ingredientsFilter = document.querySelector('.ingredients-filter');
ingredientsFilter.addEventListener('keydown', function (inputValue) {
    if (inputValue.keyCode === 8) {
        updateInputIngredients(getCurrentValue('Backspace'));
    }
}, false);
ingredientsFilter.addEventListener('keypress', function (inputValue) {
    if (inputValue.which == null) {
        if (inputValue.keyCode < 32) return null;
        updateInputIngredients(getCurrentValue(String.fromCharCode(inputValue.keyCode)));
    }
    if (inputValue.which != 0 && inputValue.charCode != 0) { // все кроме IE
        if (inputValue.which < 32) return null; // спец. символ
        updateInputIngredients(getCurrentValue(String.fromCharCode(inputValue.which)));
    }
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
};

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
