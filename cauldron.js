'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
formulas = formulas.sort(function(formula1, formula2) {
    return formula1.elements.length - formula2.elements.length;
});

// Механизмы котла описывать здесь
var field = getElement("in");
var list = getElement("list");
var cauldron = getElement("cauldron");
var result = getElement("result");

function getElement(className) {
    return document.getElementsByClassName(className)[0];
}

list.addEventListener('click', addToCauldron);
cauldron.addEventListener('click', addToList);
field.addEventListener('input', updateList);

function addToCauldron(e) {
    var element = e.target;
    if (element.matches('span.color')) {
        element = element.parentElement;
    }
    if (element.hasAttribute('data-element')) {
        cauldron.appendChild(element);
        removeBacklight(element);
        changeResult();
    }
}

function addToList(e) {
    var element = e.target;
    if (element.matches('span.color')) {
        element = element.parentElement;
    }
    if (element.hasAttribute('data-element')) {
        list.appendChild(element);
        setBacklight(field.value, element);
        changeResult();
        updateList();
    }
}

function changeResult() {
    result.textContent = getResult() || 'Уупс :(';
}

function updateList() {
    var value = field.value;
    for (var i = 0; i < list.children.length; i++) {
        var child = list.children[i];
        var text = child.textContent;
        if (value.length > 0 && text.indexOf(value) === -1) {
            child.style.display = 'none';
        } else {
            child.style.display = 'block';
            setBacklight(value, child);
        }
    }
}

function getResult() {
    var names = [];
    for (var i = 0; i < cauldron.children.length; i++) {
        names.push(cauldron.children[i].dataset.element);
    }
    for (var j = 0; j < formulas.length; j++) {
        var elements = formulas[j].elements;
        if (contains(names, elements)) {
            return formulas[j].result;
        }
    }
    return '';
}

function contains(elements, values) {
    return values.every(value => elements.indexOf(value) !== -1);
}

function setBacklight(value, element) {
    var re = new RegExp(value, 'g');
    element.innerHTML = element.textContent.replace(re, '<span class="color">' + value + '</span>');
}

function removeBacklight(element) {
    element.innerHTML = element.textContent;
}
