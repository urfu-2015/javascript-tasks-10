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
    if (document.querySelector('.result').classList.contains('scale')) {
        document.querySelector('.result').classList.remove('scale');
    }
    console.log(document.querySelector('span').classList, 'begin');
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
                document.querySelector('.result').innerHTML = formulas[i].result;
                document.querySelector('.result').classList.add('scale');
                break;
            }
        }
    }
    console.log(document.querySelector('span').classList, 'end');
}

var availableIngredient = '.available .ingredient';
function filter(input) {
    var text = input.value;
    var ingredients = [].slice.call(document.querySelectorAll(availableIngredient));
    var ingredientsNames = [];
    for (var i in ingredients) {
        ingredientsNames.push(ingredients[i].innerHTML.replace(/(^\s+|\s+$)/g, ''));
    }

    for (var i in ingredientsNames) {
        if (ingredientsNames[i].indexOf(text) === -1) {
            document.querySelectorAll(availableIngredient)[i].style.display = 'none';
        } else if (ingredients[i].style.display === 'none') {
            document.querySelectorAll(availableIngredient)[i].style.display = 'list-item';
        }
    }
}

function reset() {
    document.getElementById('filter').value = '';
    var ingredients = document.querySelectorAll(availableIngredient);
    for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].style.display === 'none') {
            document.querySelectorAll(availableIngredient)[i].style.display = 'list-item';
        }
    }
}
