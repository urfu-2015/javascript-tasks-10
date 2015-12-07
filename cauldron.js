'use strict';

//При этом в названиях доступных элементов подсвечивается набранный текст

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

var cauldronList = '.cauldron';
var availableList = '.available';

function moveIngredient (item) {
    document.querySelector('.result').classList.remove('light');
    if (item.parentNode.classList.contains('available')) {
        var first = document.querySelector(cauldronList).firstChild;
        document.querySelector(cauldronList).insertBefore(item, first);
    } else {
        var first = document.querySelector(availableList).firstChild;
        document.querySelector(availableList).insertBefore(item, first);
    }

    var ingredients = [].slice.call(document.querySelectorAll('.cauldron .ingredient'));
    var ingredientsData = [];
    for (var i in ingredients) {
        ingredientsData.push(ingredients[i].dataset.element);
    }
    if (ingredientsData.length > 1) {
        for (var i in formulas) {
            if (arrayEq(formulas[i].elements, ingredientsData)) {
                var newResult = document.createElement('span');
                var text = document.createTextNode(formulas[i].result);
                newResult.classList.add('result');
                newResult.classList.add('light');
                newResult.appendChild(text);
                document.querySelector('.result').parentElement.
                replaceChild(newResult, document.querySelector('.result'));
                break;
            }
        }
    }
}

var availableIngredients = '.available .ingredient';
function filter(input) {
    var text = input.value;
    var ingredients = [].slice.call(document.querySelectorAll(availableIngredients));
    var ingredientsNames = [];
    for (var i in ingredients) {
        ingredientsNames.push(ingredients[i].textContent.replace(/(^\s+|\s+$)/g, ''));
    }

    for (var i in ingredientsNames) {
        var index = ingredientsNames[i].indexOf(text);
        if (index === -1) {
            document.querySelectorAll(availableIngredients)[i].style.display = 'none';
        } else {
            if (ingredients[i].style.display === 'none') {
                document.querySelectorAll(availableIngredients)[i].style.display = 'list-item';
            }
            document.querySelectorAll(availableIngredients)[i].innerHTML =
                ingredientsNames[i].slice(0, index) +
                '<span class="highlight">' + text + '</span>' +
                ingredientsNames[i].slice(index + text.length);
        }
    }
}

function reset() {
    document.getElementById('filter').value = '';
    var ingredients = document.querySelectorAll(availableIngredients);
    for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].style.display === 'none') {
            document.querySelectorAll(availableIngredients)[i].style.display = 'list-item';
        }
        if (ingredients[i].innerHTML.indexOf('span') + 1) {
            var clearedString =
                ingredients[i].innerHTML.replace(/<span class="highlight">/, '').
                replace(/<\/span>/, '');
            document.querySelectorAll(availableIngredients)[i].innerHTML = clearedString;
        }
    }
}
