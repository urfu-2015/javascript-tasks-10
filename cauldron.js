'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
var ingredients = [];
formulas.forEach(function (obj) {
    ingredients.push(obj.elements);
});

// Механизмы котла описывать здесь
var findCombo = function() {
    var currentIngredients = [];
    for (var i = 0; i < cauldron.length; i++) {
        currentIngredients.push(cauldron[i].getAttribute('data-element'));
    }
    var interLength = 0;
    var bestMatch = [];
    ingredients.forEach(function (item) {
        var idx = 0;
        var arr = [];
        for (var i = 0; i < item.length; i++) {
            idx = currentIngredients.indexOf(item[i]);
            if (idx >= 0) arr.push(item[i]);
        }
        if ((arr.length > interLength) && (JSON.stringify(arr) === JSON.stringify(item))) {
            interLength = arr.length;
            bestMatch = arr;
        }
    });
    if (interLength > 0) {
        var result = '';
        formulas.forEach(function (rec) {
            if (JSON.stringify(rec.elements) === JSON.stringify(bestMatch)) {
                result = rec.result;
            }
        });
        var resultNode = document.querySelector('.result');
        resultNode.innerHTML = result;

        var elementsNode = document.querySelector('.elements');
        var cauldronNode = document.querySelector('.cauldron');
        //Вставка в левый столбец
        for (var i = 0; i < cauldron.length; i++) {
            var attr = cauldron[i].getAttribute('data-element');
            if (bestMatch.indexOf(attr) >= 0) {
                elementsNode.appendChild(cauldron[i]);
            }
        }
        // Назначение обработчика
        for (var i = 0; i < elements.length; i++) {
            var attr = elements[i].getAttribute('data-element');
            if (bestMatch.indexOf(attr) >= 0) {
                elements[i].onclick = moveToCauldron;
            }
        }
        //Приводим в порядок
        elements = document.querySelectorAll('.elements li');
        cauldron = document.querySelectorAll('.cauldron li');
    }
};
var moveToCauldron = function (e) {
    var cauldronNode = document.querySelector('.cauldron');
    cauldronNode.appendChild(e.target);
    e.target.onclick = moveToElements;
    cauldron = document.querySelectorAll('.cauldron li');
    findCombo();
};

var moveToElements = function (e) {
    var elementsNode = document.querySelector('.elements');
    elementsNode.appendChild(e.target);
    elements = document.querySelectorAll('.elements li');
    e.target.onclick = moveToCauldron;
};

var elements = document.querySelectorAll('.elements li');
var cauldron = document.querySelectorAll('.cauldron li');

for (var i = 0; i < elements.length; i++) {
    elements[i].onclick = moveToCauldron;
}

for (var i = 0; i < cauldron.length; i++) {
    cauldron[i].onclick = moveToElements;
}

var inputNode = document.querySelector('input');
inputNode.onkeyup = function (e) {
    console.log(inputNode.value);
    for (var i = 0; i < elements.length; i++) {
        var inp = inputNode.value;
        var ingredient = elements[i].textContent;
        var match = ingredient.match(inp);
        if (match === null) {
            elements[i].style.display = 'none';
        } else {
            elements[i].style.display = 'list-item';
            elements[i].innerHTML = elements[i].textContent.replace(inp, '<span class="red">' +
                inp + '</span>');
        }
    }
};
