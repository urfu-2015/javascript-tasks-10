'use strict';


// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь
function arrayEq(firstArray, secondArray) {
    if (firstArray.length !== secondArray.length) {
        return false;
    }
    for (var i in firstArray) {
        if (secondArray.indexOf(firstArray[i]) === -1) {
            return false;
        }
    }
    return true;
}

function clearFromSpan(ingredients, from) {
    for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].innerHTML.indexOf('highlight') + 1) {
            document.querySelectorAll(from)[i].querySelector('span').classList.remove('highlight');
        }
    }
}

function insertBefore(listToInsert, target) {
    var first = document.querySelector(listToInsert).firstChild;
    document.querySelector(listToInsert).insertBefore(target, first);
}

function getArray(queryString) {
    return [].slice.call(document.querySelectorAll(queryString));
}

var cauldronList = '.cauldron';
var availableList = '.available';
var cauldronIngredients = '.cauldron .ingredient';
var availableIngredients = '.available .ingredient';
function moveIngredient() {
    document.querySelector('.result').classList.remove('light');
    if (event.currentTarget.parentNode.classList.contains('available')) {
        insertBefore(cauldronList, event.currentTarget);
    } else {
        insertBefore(availableList, event.currentTarget);
        if (document.getElementById('filter').value.length) {
            filter(document.getElementById('filter'));
        }
    }

    var ingredients = getArray(cauldronIngredients);
    var ingredientsData = [];
    for (var i in ingredients) {
        ingredientsData.push(ingredients[i].dataset.element);
    }
    clearFromSpan(ingredients, cauldronIngredients);

    if (ingredientsData.length > 1) {
        for (var i in formulas) {
            if (arrayEq(formulas[i].elements, ingredientsData)) {
                var newResult = document.createElement('span');
                var text = document.createTextNode(formulas[i].result);
                newResult.classList.add('result');
                newResult.classList.add('light');
                newResult.appendChild(text);
                document.querySelector('.result')
                    .parentElement
                    .replaceChild(newResult, document.querySelector('.result'));
                break;
            }
        }
    }
}

function filter(input) {
    if (input.target) {
        var text = input.target.value;
    } else if (input.value) {
        var text = input.value;
    } else {
        var text = event.currentTarget.value;
    }
    if (typeof text !== 'undefined') {
        text = text.toLowerCase();
    }

    var ingredients = getArray(availableIngredients);
    var ingredientsNames = [];
    for (var i in ingredients) {
        ingredientsNames.push(ingredients[i].textContent.replace(/(^\s+|\s+$)/g, ''));
    }

    for (var i in ingredientsNames) {
        var index = ingredientsNames[i].indexOf(text);
        if (index === -1) {
            document.querySelectorAll(availableIngredients)[i].classList.add('hidden');
            continue;
        }
        if (ingredients[i].classList.contains('hidden')) {
            document.querySelectorAll(availableIngredients)[i].classList.remove('hidden');
        }
        document.querySelectorAll(availableIngredients)[i].innerHTML =
            ingredientsNames[i].slice(0, index) +
            '<span class="highlight">' + text + '</span>' +
            ingredientsNames[i].slice(index + text.length);

    }
}

function reset() {
    document.getElementById('filter').value = '';
    var ingredients = getArray(availableIngredients);
    for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].classList.contains('hidden')) {
            document.querySelectorAll(availableIngredients)[i].classList.remove('hidden');
        }
        clearFromSpan(ingredients, availableIngredients);
    }
}

var allIngredients = document.querySelectorAll('.ingredient');
for (var i = 0; i < allIngredients.length; i++) {
    allIngredients[i].addEventListener('click', moveIngredient, false);
}

document.getElementById('filter').addEventListener('input', filter, false);
document.querySelector('.cross').addEventListener('click', reset, false);
