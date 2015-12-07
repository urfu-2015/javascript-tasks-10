'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь


var allowDrop = ev => {
    ev.preventDefault();
    ev.currentTarget.classList.add('border');
};

var drag = ev => ev.dataTransfer.setData("text", ev.target.dataset.element);

var drop = ev => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var node = document.querySelector('li[data-element=' + data + ']');
    moveElement(node);
    node.parentElement.classList.remove('border');
};

var cauldron = document.getElementById('cauldron');
cauldron.addEventListener('dragover', allowDrop, false);
cauldron.addEventListener('drop', drop, false);
cauldron.addEventListener('dragleave', () => cauldron.classList.remove('border'), false);

var ingredients = document.getElementById('ingredients');
ingredients.addEventListener('dragover', allowDrop, false);
ingredients.addEventListener('drop', drop, false);
ingredients.addEventListener('dragleave', () => ingredients.classList.remove('border'), false);

var search = document.getElementById('search');

var mix = () => {
    var cauldronLis = document.querySelectorAll('#cauldron > li');
    var cauldronElements = [].slice.call(cauldronLis).map(node => node.dataset.element);
    var res = formulas.filter(formula =>
        formula.elements.every(element => cauldronElements.indexOf(element) >= 0))
        .sort((a, b) => b.elements.length - a.elements.length)[0];
    document.getElementById('result').innerHTML = res ? res.result : '';
};

var setHiddenClass = node => {
    var startIndex = node.dataset.value.indexOf(search.value);
    if (startIndex < 0) {
        node.classList.add('hidden');
    } else {
        node.classList.remove('hidden');
        var value = node.dataset.value;
        node.innerHTML = value.substring(0, startIndex) + '<span class="highlight">' +
            value.substring(startIndex, search.value.length + startIndex) + '</span>' +
            value.substring(search.value.length + startIndex);
    }
};

var moveElement = (node) => {
    switch (node.parentElement.id) {
        case 'cauldron':
            cauldron.removeChild(node);
            ingredients.appendChild(node);
            setHiddenClass(node);
            break;
        case 'ingredients':
            ingredients.removeChild(node);
            cauldron.appendChild(node);
            node.innerHTML = node.dataset.value;
            break;
    }
    mix();
};

var lis = document.querySelectorAll('li');
[].slice.call(lis).forEach(node => {
    node.addEventListener('click', moveElement.bind(this, node), false);
    node.addEventListener('dragstart', drag, false);
    node.draggable = true;
    node.dataset.value = node.innerHTML;
});


search.addEventListener('search', () => {
    var ingredientLis = document.querySelectorAll('#ingredients > li');
    [].slice.call(ingredientLis).map(setHiddenClass);
}, false);

mix();
