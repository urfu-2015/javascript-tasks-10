'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

function getResult(ingredientsInBoiler) {
    if (ingredientsInBoiler.length === 0) {
        return 'В котле пусто!';
    }
    var result = getArray(formulas.length);
    for (var i = 0; i < ingredientsInBoiler.length; i++) {
        var ingredient = ingredientsInBoiler[i];
        for (var index in formulas) {
            var formula = formulas[index];
            if (formula.elements.indexOf(ingredient) != -1) {
                result[index].push(ingredient);
            }
        }
    }
    var maxLength = 0;
    var current = 'Пока ничего не получилось';
    for (var i = 0; i < formulas.length; i++) {
        if (!result[i]) {
            continue;
        }
        var length = result[i].length;
        if (length == formulas[i].elements.length) {
            if (maxLength < length) {
                maxLength = length;
                current = formulas[i].result;
            }
        }
    }
    return current;
}

function setFormula() {
    var boiler = document.getElementsByClassName('to');
    var ingredientsInBoiler = [];
    for (var i = 0; i < boiler.length; i++) {
        ingredientsInBoiler.push(boiler[i].getAttribute('data-element'));
    }
    var result = getResult(ingredientsInBoiler);
    document.getElementsByClassName('result')[0].textContent = result;
}

function getArray(size) {
    var arr = [];
    for (var i = 0; i < size; i++) {
        arr.push([]);
    }
    return arr;
}

function filterInput (text) {
    if (!text) {
        addClass(closing, 'noDisplay');
    } else {
        removeClass(closing, 'noDisplay');
    }
    var ing = document.getElementsByClassName('from');
    for (var i = 0; i < ing.length; i++) {
        var node = ing[i];
        node.innerHTML = node.textContent;
        var content = node.innerHTML;
        var index = content.indexOf(text);
        if (index != -1) {
            removeClass(node, 'noDisplay');
            node.innerHTML = node.textContent.replace(text, '<span class="marked">' + text + '</span>');
        } else {
            addClass(node, 'noDisplay')
        }
    }
}

function addClass(object, className) {
    object.classList.add(className);
}

function removeClass(object, className) {
    object.classList.remove(className);
}

function move(e) {
    var ingredient = e.target;
    if (ingredient.matches('span.marked')) {
        ingredient = ingredient.parentElement;
    }
    var parent = ingredient.parentElement;
    var coords = getCoords(ingredient);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;
    ingredient.style.position = 'absolute';
    insertEmpty(ingredient, parent);
    document.body.appendChild(ingredient);
    moveAt(e);
    function moveAt(e) {
        ingredient.style.left = e.pageX - shiftX + 'px';
        ingredient.style.top = e.pageY - shiftY + 'px';
    }
    document.onmousemove = function(e) {
        moveAt(e);
    };
    ingredient.onmouseup = function() {
        ingredient.innerHTML = ingredient.textContent;
        parent.removeChild(emptyElement);
        var border = 600;
        ingredient.style.position = 'static';
        var parentClass = '';
        if (border <= parseInt(ingredient.style.left)){
            addClass(ingredient, 'to');
            removeClass(ingredient, 'from');
            parentClass = 'boiler';
        } else {
            addClass(ingredient, 'from');
            removeClass(ingredient, 'to');
            parentClass = 'ingredients';
            filterInput(filterValue);
        }
        document.getElementsByClassName(parentClass)[0].appendChild(ingredient);
        setFormula();
        ingredient.onmouseup = null;
    };
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function indexOf(parentNodes, child) {
    for (var i = 0; i < parentNodes.length; i++) {
        if (parentNodes[i] == child)
        {
            return i;
        }
    }
    return -1;
}

function insertEmpty(ingredient, parent) {
    var className = parent.className == 'ingredients' ? 'from' : 'to';
    var listCurIngredients = document.getElementsByClassName(className);
    var index = indexOf(listCurIngredients, ingredient);
    addClass(emptyElement, className);
    ingredient = parent.insertBefore(emptyElement, listCurIngredients[index]);
    removeClass(emptyElement, className);
}

var filterValue = '';
document.getElementById('filter').onkeyup = function () {
    filterValue = this.value;
    this.setAttribute('value', filterValue);
    filterInput(filterValue);
}

var closing = document.getElementsByClassName('close')[0];
closing.onclick = function () {
    var f = document.getElementById('filter');
    filterValue = '';
    f.setAttribute('value', filterValue);
    f.value = filterValue;
    filterInput(filterValue);
}

var emptyElement = document.createElement('div');
addClass(emptyElement, 'ingredient');
var ingredients = document.getElementsByClassName('ingredient');
for (var i = 0; i < ingredients.length; i++) {
    var ingredient = ingredients[i];
    ingredient.onmousedown = function (e) {
        move(e);
    }
    ingredient.ondragstart = function() {
        return false;
    };
    ingredient.onselectstart = function () {
        return false;
    }
}
