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
        if (ingredients[i].innerHTML.indexOf('span') + 1) {
            var clearedString =
                ingredients[i].innerHTML.replace(/<span class="highlight">/, '')
                    .replace(/<\/span>/, '');
            document.querySelectorAll(from)[i].innerHTML = clearedString;
        }
    }
}

var cauldronList = '.cauldron';
var availableList = '.available';
var cauldronIngredients = '.cauldron .ingredient';
var availableIngredients = '.available .ingredient';
function moveIngredient() {
    document.querySelector('.result').classList.remove('light');
    if (event.currentTarget.parentNode.classList.contains('available')) {
        var first = document.querySelector(cauldronList).firstChild;
        document.querySelector(cauldronList).insertBefore(event.currentTarget, first);
    } else {
        var first = document.querySelector(availableList).firstChild;
        document.querySelector(availableList).insertBefore(event.currentTarget, first);
        if (document.getElementById('filter').value.length) {
            filter(document.getElementById('filter'));
        }
    }

    var ingredients = [].slice.call(document.querySelectorAll(cauldronIngredients));
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
                document.querySelector('.result').parentElement
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

    var ingredients = [].slice.call(document.querySelectorAll(availableIngredients));
    var ingredientsNames = [];
    for (var i in ingredients) {
        ingredientsNames.push(ingredients[i].textContent.replace(/(^\s+|\s+$)/g, ''));
    }

    for (var i in ingredientsNames) {
        var index = ingredientsNames[i].indexOf(text);
        if (index === -1) {
            document.querySelectorAll(availableIngredients)[i].style.display = 'none';
            continue;
        }
        if (ingredients[i].style.display === 'none') {
            document.querySelectorAll(availableIngredients)[i].style.display = 'list-item';
        }
        document.querySelectorAll(availableIngredients)[i].innerHTML =
            ingredientsNames[i].slice(0, index) +
            '<span class="highlight">' + text + '</span>' +
            ingredientsNames[i].slice(index + text.length);

    }
}

function reset() {
    document.getElementById('filter').value = '';
    var ingredients = document.querySelectorAll(availableIngredients);
    for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].style.display === 'none') {
            document.querySelectorAll(availableIngredients)[i].style.display = 'list-item';
        }
        clearFromSpan(ingredients, availableIngredients);
    }
}

var allIngredients = document.querySelectorAll('.ingredient');
for (var i = 0; i < allIngredients.length; i++) {
    allIngredients[i].onclick = moveIngredient;
}
document.getElementById('filter').oninput = filter;
document.querySelector('.cross').onclick = reset;
