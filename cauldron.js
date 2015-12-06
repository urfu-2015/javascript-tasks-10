'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь

var cauldron = getByClass('cauldron');
var elements = getByClass('elements');
var cauldronResult = getByClass('result');
var filter = getByClass('filter');

renderResult();
formulas = sortFormulasByLength(formulas);

elements.addEventListener('click', moveToCauldron);
cauldron.addEventListener('click', moveBack);
filter.addEventListener('input', filterElements);


function sortFormulasByLength(formulas) {
    return formulas.sort(function (elem1, elem2) {
        return elem1.elements.length - elem2.elements.length;
    });
}

function getByClass(classname) {
    return document.getElementsByClassName(classname)[0];
}

function moveToCauldron(e) {
    move(e.target, elements, cauldron);
}

function moveBack(e) {
    move(e.target, cauldron, elements);
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
    renderResult();
    filterElements();
}

function renderResult() {
    var elementsInCauldron = [];
    for (var i = 0; i < cauldron.children.length; i++) {
        var node = cauldron.children[i];
        elementsInCauldron.push(node.getAttribute('data-element'));
    }
    var result = getResult(elementsInCauldron);
    cauldronResult.textContent = result || '-';
}

function getResult(elements) {
    for (var i = 0; i < formulas.length; i++) {
        if (isArrayContains(elements, formulas[i].elements)) {
            return formulas[i].result;
        }
    }
}

function isArrayContains(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) === -1) {
            return false;
        }
    }
    return true;
}

function filterElements(e) {
    for (var i = 0; i < elements.children.length; i++) {
        if (filter.value.length > 0) {
            var node = elements.children[i];
            if (node.textContent.indexOf(filter.value) === -1) {
                hide(node);
            } else {
                show(node);
                markText(node, filter.value);
            }
        } else {
            node = elements.children[i];
            show(node);
            unmarkText(node);
        }
    }
}

function hide(node) {
    node.style.display = 'none';
}

function show(node) {
    node.style.display = 'block';
}

function markText(node, text) {
    node.innerHTML = node.textContent.replace(text, '<span>' + text + '</span>');
}

function unmarkText(node) {
    node.innerHTML = node.textContent;
}
