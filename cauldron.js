'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь

var cauldron = document.getElementsByClassName('cauldron')[0];
var elements = document.getElementsByClassName('elements')[0];
var newElement = document.getElementById('newElement');
var filter = document.getElementById('filter');

elements.addEventListener('click', toCauldron);
cauldron.addEventListener('click', toBook);
filter.addEventListener('input', bookFilter);


function toCauldron(event) {
    move(event.target, elements, cauldron);
}

function toBook(event) {
    move(event.target, cauldron, elements);
}

function move(element, from, to) {
    if (!element.hasAttribute('data-element')) {
        if (element.parentNode.hasAttribute('data-element')) {
            element = element.parentNode;
        } else {
            return;
        }
    }
    from.removeChild(element);
    to.appendChild(element);
    update();
    bookFilter();
}

function update() {
    var cauldronElements = [];
    for (var index = 0; index < cauldron.children.length; index++) {
        var element = cauldron.children[index];
        cauldronElements.push(element.getAttribute('data-element'));
    }
    newElement.textContent = '';
    for (var index = 0; index < formulas.length; index++) {
        if (isFormula(cauldronElements.sort(), formulas[index].elements.sort())) {
            newElement.textContent = formulas[index].result;
        }
    }
}

function isFormula(inCauldron, formulas) {
    if (inCauldron.length !== formulas.length) {
        return false;
    }
    for (var index = 0; index < formulas.length; index++) {
        if (inCauldron[index] !== formulas[index]) {
            return false;
        }
    }
    return true;
}

function bookFilter(event) {
    for (var index = 0; index < elements.children.length; index++) {
        var element = elements.children[index];
        if (filter.value.length > 0) {
            if (element.textContent.indexOf(filter.value) === -1) {
                element.style.display = 'none';
            } else {
                element.style.display = 'block';
                element.innerHTML = element.textContent.replace(filter.value, '<span>' + filter.value + '</span>');
            }
        } else {
            element.style.display = 'block';
            element.innerHTML = element.textContent;
        }
    }
}
