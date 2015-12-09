'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
var ingredients = {
    'земля': 'earth',
    'воздух': 'air',
    'пыль': 'dust',
    'болото': 'swamp',
    'энергия': 'energy',
    'камень': 'stone',
    'жизнь': 'life',
    'молоко': 'milk',
    'сметанка': 'sourcream',
    'огонь': 'fire',
    'вода': 'water'
};

var usedIngredients = {};

function filterIngredients(substring) {
    var list = document.querySelector('#ingredients');
    list.innerHTML = '';
    var re = new RegExp('([а-я]*)(' + substring + ')([а-я]*)', 'i');
    for (var key in ingredients) {
        var result = re.exec(key);
        if (!result || usedIngredients[key]) {
            continue;
        }
        var newDiv = createNewDiv(ingredients[result[0]]);
        var textSpan = document.createElement('span');
        textSpan.className = 'red-text';
        textSpan.innerText = result[2];
        newDiv.innerHTML = result[1];
        newDiv.appendChild(textSpan);
        newDiv.innerHTML += result[3];
        list.appendChild(newDiv);
    };
}

function createNewDiv(data) {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('data-element', ingredients[result[0]]);
    newDiv.addEventListener('mousedown', drag, false);
    newDiv.addEventListener('mouseup', drop, false);
    newDiv.addEventListener('mousemove', move, false);
    return newDiv;
}
document.getElementById('off-filter').onclick = function () {
    var filter = document.getElementById('filter');
    filter.setAttribute('value', '');
    filter.value = '';
    filterIngredients('');
};

document.getElementById('filter').onkeyup = function () {
    this.setAttribute('value', this.value);
    filterIngredients(this.value);
};

document.getElementById('remove').onclick = function () {
    document.querySelector('#used-ingredients').innerHTML = '';
    usedIngredients = {};
    filterIngredients(document.getElementById('filter').value);
    createNewElement();
};

var ingredientsDiv = document.querySelectorAll('.cauldron div,.box div');
for (var i = 0; i < ingredientsDiv.length; i++) {
    ingredientsDiv[i].addEventListener('mousedown', drag, false);
    ingredientsDiv[i].addEventListener('mouseup', drop, false);
    ingredientsDiv[i].addEventListener('mousemove', move, false);
};

function drag(e) {
    this.style.position = 'absolute';
    this.style.margin = '0';
}

function move(e) {
    this.style.left = e.pageX - 10 + 'px';
    this.style.top = e.pageY - 10 + 'px';
}

function drop(e) {
    document.onmousemove = null;
    this.onmouseup = null;
    var text = this.innerText.replace(/(\r\n|\n|\r)/gm, '');
    if (this.parentNode.id === 'used-ingredients') {
        delete usedIngredients[text];
        filterIngredients(document.getElementById('filter').value);
    }
    if (this.parentNode.id === 'ingredients') {
        usedIngredients[text] = ingredients[text];
        var newDiv = createNewDiv(ingredients[text]);
        newDiv.innerText = this.innerText;
        document.querySelector('#used-ingredients').appendChild(newDiv);
    }
    this.parentNode.removeChild(this);
    createNewElement();
}

function createNewElement() {
    var result = checkСombination();
    if (result) {
        return document.getElementById('result').innerText = result;
    }
    if (Object.keys(usedIngredients).length > 0) {
        return document.getElementById('result').innerText = 'попробуй другую комбинацию';
    }
    return document.getElementById('result').innerText = 'ваш котел пуст';
}

function checkСombination() {
    var combinationLenght = 0;
    var result = '';
    for (var i = 0; i < formulas.length; i++) {
        if (isCombination(formulas[i].elements) &&
            formulas[i].elements.length > combinationLenght) {
            result = formulas[i].result;
        }
    };
    return result;
}

function isCombination(combination) {
    var values = Object.keys(usedIngredients).map(function (key) {
        return usedIngredients[key];
    });
    return combination.every(elem => values.indexOf(elem) !== -1) &&
        combination.length === values.length;
}
// Механизмы котла описывать здесь
