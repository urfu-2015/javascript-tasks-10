'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
var ingredients = [];
formulas.forEach(function (obj) {
    ingredients.push(obj.elements);
});

// Механизмы котла описывать здесь

//Обработчик ввода в поле поиска
var inputHandler = function(e) {
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

//Проверка на существование комбинации в котле
//Если комбинация найдена, выводит название получившегося предмета и забрасывает ингредиенты обратно на стол
var findCombo = function() {
    //Получение ингредиентов из котла
    var currentIngredients = [];
    for (var i = 0; i < cauldron.length; i++) {
        currentIngredients.push(cauldron[i].getAttribute('data-element'));
    }

    //Поиск наибольшей комбинации
    var bestMatch = [];
    ingredients.forEach(function (item) {
        var idx = 0;
        var arr = [];
        for (var i = 0; i < item.length; i++) {
            idx = currentIngredients.indexOf(item[i]);
            if (idx >= 0) arr.push(item[i]);
        }
        if ((arr.length > bestMatch.length) && (JSON.stringify(arr) === JSON.stringify(item))) {
            bestMatch.length = arr.length;
            bestMatch = arr;
        }
    });

    //Если нашли комбинацию, то показываем получившийся предмет
    if (bestMatch.length > 0) {
        //Ищем название предмета по формуле
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

        //Приводим в порядок
        elements = document.querySelectorAll('.elements li');
        cauldron = document.querySelectorAll('.cauldron li');

        // Назначение обработчика
        for (var i = 0; i < elements.length; i++) {
            var attr = elements[i].getAttribute('data-element');
            if (bestMatch.indexOf(attr) >= 0) {
                elements[i].onclick = moveToCauldron;
            }
        }
    }
};
var moveToCauldron = function (e) {
    var cauldronNode = document.querySelector('.cauldron');
    var node = e.target;

    //Убираем выделение span-ом
    if (node.tagName.toLowerCase() == 'span') {
        node = node.parentNode;
        node.innerHTML = node.textContent;
    }
    node.innerHTML = node.textContent;
    cauldronNode.appendChild(node);
    node.onclick = moveToElements;

    elements = document.querySelectorAll('.elements li');
    cauldron = document.querySelectorAll('.cauldron li');

    //Сбрасываем поле ввода
    inputNode.value = '';
    inputHandler();

    //Ищем комбинацию
    findCombo();
};

var moveToElements = function (e) {
    var elementsNode = document.querySelector('.elements');
    elementsNode.appendChild(e.target);
    e.target.onclick = moveToCauldron;

    elements = document.querySelectorAll('.elements li');
    cauldron = document.querySelectorAll('.cauldron li');
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
inputNode.onkeyup = inputHandler;
