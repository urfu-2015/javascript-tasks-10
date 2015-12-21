'use strict';
var formulas = window.formulas;

var freeElementContainer = document.getElementsByClassName('free-elements')[0];
var boilerContainer = document.getElementsByClassName('in-boiler')[0];
var resultTable = document.getElementsByClassName('result-ingredient')[0];
var filter = document.getElementById('filter');
var ingredients = document.getElementsByClassName('element');

function sortFormulas(a, b) {
    return a.elements.length - b.elements.length;
}

function prepareRecipes() {
    formulas.sort(sortFormulas);
    formulas.forEach(function (formula) {
        formula.counter = 0;
    })
}

function findResult(argument, isNew) {
    var tempResult = "";
    for (var i = 0; i < formulas.length; i++) {
        var formula = formulas[i];
        if (formula.elements.indexOf(argument) !== -1) {
            var counter = isNew ? 1 : -1;
            formula.counter += counter;
        }
        if (formula.counter === formula.elements.length) {
            tempResult = formula.result.toUpperCase();
        } else {
           resultTable.innerHTML = 'Ничего не вышло';
       }
    };
    if (tempResult != "") {
        resultTable.innerHTML = tempResult;
    }
}

var preValue = '';
function filterFunction () {
    var value = this.value;
    getFilteredElements(value);
    preValue = value;
}

filter.addEventListener("keyup", filterFunction);

function getFilteredElements(value) {
    ingredients = [].slice.call(ingredients);
    for (var i = 0; i < ingredients.length; i++) {
        var ingredient = ingredients[i];
        if (ingredient.parentNode.className !== 'free-elements') {
            continue;
        }
        if (preValue) {
            ingredient.innerHTML = ingredient.innerHTML
            .replace('<span class="find">' + preValue + '</span>', preValue);
        }
        if (ingredient.textContent.indexOf(value) === -1) {
            ingredient.classList.add('hide');
        } else {
            ingredient.classList.remove('hide');
            if (value !== '') {
                ingredient.innerHTML = ingredient.innerHTML
                .replace(value, '<span class="find">' + value + '</span>');
            }
        }
    }
}

function changePosition(ingredient) {
    var parentClasses = [].slice.call(ingredient.parentNode.classList);
    if (parentClasses.indexOf('free-elements') !== -1)
    {
        ingredient.parentNode.removeChild(ingredient);
        boilerContainer.appendChild(ingredient);
        findResult(ingredient.getAttribute('data-element'), true);

    } else {
        ingredient.parentNode.removeChild(ingredient);
        freeElementContainer.appendChild(ingredient);
        findResult(ingredient.getAttribute('data-element'), false);
        getFilteredElements(preValue);
    }
};


function appendEvent() {
    ingredients = [].slice.call(ingredients);
    ingredients.forEach(function (ingredient) {
        ingredient.addEventListener('click', function(){changePosition(ingredient)});
    });
};

function main() {
    prepareRecipes();
    appendEvent();
}

main();
