'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
formulas = formulas.sort(function(formula1, formula2) {
    return formula1.elements.length - formula2.elements.length;
});

// Механизмы котла описывать здесь
var field = document.getElementById("in");
var list = document.getElementsByClassName("list")[0];
var cauldron = document.getElementsByClassName("cauldron")[0];
var cross = document.getElementsByClassName("close")[0];
var result = document.getElementsByClassName("result")[0];

list.addEventListener('click', addToCauldron);
cauldron.addEventListener('click', addToList);
field.addEventListener('input', updateList);
cross.addEventListener('click', clear);

function addToCauldron(e) {
    var element = e.target;
    cauldron.appendChild(element);
    changeResult();
    removeBacklight(element);
}

function addToList(e) {
    var element = e.target;
    list.appendChild(element);
    changeResult();
}

function changeResult() {
    var res = getResult();
    if (res.length !== 0) {
        result.textContent = res;
    } else {
        result.textContent = 'Уупс :(';
    }
}

function updateList(e) {
    var value = field.value;
    for (var i = 0; i < list.children.length; i++) {
        var text = list.children[i].textContent;
        if (value.length > 0 && text.indexOf(value) === -1) {
            list.children[i].style.display = 'none';
        } else {
            list.children[i].style.display = 'block';
            setBacklight(value, list.children[i]);
        }
    }
}

function clear(e) {
    field.value = "";
    updateList(e);
}

function getResult() {
    var names = [];
    for (var i = 0; i < cauldron.children.length; i++) {
        names.push(cauldron.children[i].getAttribute('data-element'));
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
    element.innerHTML = element.textContent.replace(value, '<span class="color">' + value + '</span>');
}

function removeBacklight(element) {
    element.innerHTML = element.textContent;
}
