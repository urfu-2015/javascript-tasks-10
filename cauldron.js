'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
var ingredients = {
    'земля':'earth',
    'воздух':'air',
    'пыль':'dust',
    'болото':'swamp',
    'энергия':'energy',
    'камень':'stone',
    'жизнь':'life',
    'молоко':'milk',
    'сметанка':'sourcream',
    'огонь':'fire',
    'вода':'water'
};

var usedIngredients = {};

function filterIngredients(substring) {
    var list = document.querySelector('#ingredients');
    list.innerHTML = '';
    var filteredIngredients = [];
    var re = new RegExp("([а-я]*)(" + substring+ ")([а-я]*)","i");
    for (var key in ingredients) {
        var result = re.exec(key);
        if (result && !usedIngredients[key]) {
            var newLi = document.createElement('div');
            var textSpan = document.createElement("SPAN")
            textSpan.className = 'red-text';
            textSpan.innerText = result[2];
            newLi.innerHTML = result[1];
            newLi.appendChild(textSpan);
            newLi.innerHTML += result[3];
            newLi.setAttribute('data-element', ingredients[result[0]]);
            newLi.addEventListener("mousedown", DragAndDrop, false);
            list.appendChild(newLi);
        }
    };
}

document.getElementById('off-filter').onclick = function () {
    var filter = document.getElementById('filter');
    filter.setAttribute('value','');
    filter.value = '';
    filterIngredients('');
}

document.getElementById('filter').onkeyup = function () {
    this.setAttribute('value', this.value);
    filterIngredients(this.value);
}
document.getElementById('remove').onclick = function () {
    document.querySelector('#used-ingredients').innerHTML = '';
    usedIngredients = {};
    filterIngredients(document.getElementById('filter').value);
    createNewElement();
}
var ingredientsLi = document.querySelectorAll('.cauldron div,.box div');
for (var i = 0; i < ingredientsLi.length; i++) {
    ingredientsLi[i].addEventListener("mousedown", DragAndDrop, false);
};

function DragAndDrop(e) {
    var item = this;
    item.style.position = 'absolute';
    item.style.margin = '0';
    moveAt(e);
    function moveAt(e) {
        item.style.left = e.pageX - item.offsetWidth / 2 + 'px';
        item.style.top = e.pageY - item.offsetHeight / 2 + 'px';
    }

    document.onmousemove = function(e) {
        moveAt(e);
    }

    item.onmouseup = function() {
        document.onmousemove = null;
        item.onmouseup = null;
        var text = item.innerText.replace(/(\r\n|\n|\r)/gm,'');
        if (item.parentNode.id === 'used-ingredients')
        {
            delete usedIngredients[text];
            filterIngredients(document.getElementById('filter').value);
        }
        if (item.parentNode.id === 'ingredients')
        {
            usedIngredients[text] = ingredients[text];
            var newLi = document.createElement('div');
            newLi.innerText = item.innerText;
            newLi.setAttribute('data-element', ingredients[text]);
            newLi.addEventListener("mousedown", DragAndDrop, false);
            document.querySelector('#used-ingredients').appendChild(newLi);
            
        }
        item.parentNode.removeChild(item);
        createNewElement();
    }
}

function createNewElement() {
    var result = checkСombination();
    if (!result) {
        if (Object.keys(usedIngredients).length > 0){
            document.getElementById('result').innerText = 'попробуй другую комбинацию';
            return;
        }
        document.getElementById('result').innerText = 'ваш котел пуст';
        return;
    }
    document.getElementById('result').innerText = result;
}

function checkСombination()
{
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
    var vals = Object.keys(usedIngredients).map(function (key) {
        return usedIngredients[key];
    });
    return combination.every(elem => vals.indexOf(elem) !== -1) &&
           combination.length === vals.length;
}
// Механизмы котла описывать здесь
