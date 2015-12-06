'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
var cauldron = document.getElementById('cauldron');
var components = document.getElementById('components');

Array.prototype.forEach.call(components.children, function (child) {
    child.onclick = moveToCauldron.bind(child);
});

Array.prototype.forEach.call(cauldron.children, function (child) {
    child.onclick = removeFromCauldron.bind(child);
});

checkFormulas(cauldron.children);

function moveToCauldron() {
    cauldron.appendChild(this);
    this.onclick = removeFromCauldron.bind(this);
    this.innerHTML = this.innerText;
    checkFormulas(cauldron.children);
}

function removeFromCauldron() {
    components.appendChild(this);
    this.onclick = moveToCauldron.bind(this);
    filterElements();
    checkFormulas(cauldron.children);
}

function checkFormulas(elementsInCauldron) {
    var countElements = 0;
    var resFormula = null;
    formulas.forEach(function (formula) {
        if (formula.elements.every(function (element) {
            return Array.prototype.some.call(elementsInCauldron, function (elementInCauldron) {
                    if (elementInCauldron.getAttribute('data-element') === element) {
                        return true;
                    }
                });

        }) && formula.elements.length > countElements) {
            countElements = formula.elements.length;
            resFormula = formula;
        }
    });
    var resSpan = document.getElementById('result');
    if (resFormula) {
        resSpan.innerText = resFormula.result;
    } else {
        resSpan.innerText = 'Ничего =(';
    }
}

function filterElements() {
    var filter = document.getElementById('filter');
    var value = filter.value;
    Array.prototype.forEach.call(components.children, function (filter) {
        var startIndex = filter.innerText.indexOf(value);
        if (startIndex == -1) {
            filter.setAttribute('style', 'display: none;');
        } else {
            filter.setAttribute('style', 'display: list-item;');
            highlight(filter, value.length, startIndex);
        }
    });
}

function highlight(element, length, startIndex) {
    var innerText = element.innerText;
    if (length > 0) {
        element.innerHTML = innerText.substr(0, startIndex) +
        '<span class="highlight">' +
        innerText.substr(startIndex, length) +
        '</span>' +
        innerText.substr(startIndex + length);
    } else {
        element.innerHTML = innerText;
    }
}

function clearFilter() {
    var filter = document.getElementById('filter');
    filter.value = '';
    filterElements(filter);
}
