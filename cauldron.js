'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь

var cauldron = document.getElementsByClassName('cauldron')[0];
var elements = document.getElementsByClassName('elements')[0];
var cauldronResult = document.getElementById('result');
var filter = document.getElementById('filter');

resultInCauldron();

elements.addEventListener('click', moveToCauldron, true);
cauldron.addEventListener('click', moveBack, true);

function moveToCauldron(e) {
    move(e.target, elements, cauldron);
}

function moveBack(e) {
    move(e.target, cauldron, elements);
}

function move(element, from, to) {
    if (element.parentNode.hasAttribute('data-element')) {
        element = element.parentNode;
        unmarkText(element);
    }
    if (element.hasAttribute('data-element')) {
        from.removeChild(element);
        to.appendChild(element);
    }
    resultInCauldron();
}

function resultInCauldron() {
    var elementsInCauldron = [];
    var result;
    var resultIngredients;
    for (var i = 0; i < cauldron.children.length; i++) {
        var node = cauldron.children[i];
        elementsInCauldron.push(node.getAttribute('data-element'));
    }
    for (i = 0; i < formulas.length; i++) {
        if (isArraysEqual(formulas[i].elements, elementsInCauldron)) {
            if (resultIngredients) {
                if (formulas[i].elements.length > resultIngredients.length) {
                    resultIngredients = formulas[i].elements;
                    result = formulas[i].result;
                }
            } else {
                resultIngredients = formulas[i].elements;
                result = formulas[i].result;
            }
        }
    }
    if (result) {
        cauldronResult.textContent = result;
    } else {
        cauldronResult.textContent = '-';
    }
}

function isArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1.indexOf(arr2[i]) === -1 || arr2.indexOf(arr1[i]) === -1) {
            return false;
        }
    }
    return true;
}

function filterElements(e) {
    if (filter.value.length > 0) {
        for (var i = 0; i < elements.children.length; i++) {
            var node = elements.children[i];
            if (node.textContent.indexOf(filter.value) !== 0) {
                node.style.display = 'none';
            } else {
                node.style.display = 'block';
                markText(node, filter.value);

            }
        }
    } else {
        for (i = 0; i < elements.children.length; i++) {
            node = elements.children[i];
            node.style.display = 'block';
            node.textContent = node.textContent.replace('<span>', '').replace('</span>', '');
        }
    }
}

function markText(node, text) {
    var boldedText = document.createElement('span');
    var commonText = document.createElement('span');
    boldedText.textContent = text;
    commonText.textContent = node.textContent.replace(text, '');
    node.textContent = '';
    node.appendChild(boldedText);
    node.appendChild(commonText);
    node.firstChild.style.color = 'red';
}

function unmarkText(node) {
    var text = node.textContent;
    if (node.children.length !== 0) {
        node.removeChild(node.firstChild);
        node.removeChild(node.firstChild);
        node.innerHTML = text;
    }
}

function resetFilter(e) {
    filter.value = '';
    filter.oninput(e);
}
