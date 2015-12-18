'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь
var warehouse = {
    get elems() {
        return document.querySelectorAll('tr td:nth-child(1) ul li');
    },
    get node() {
        return document.querySelector('tr td:nth-child(1) ul');
    }
};

var warehouseCopy = {
    earth: 'земля',
    air: 'воздух',
    dust: 'пыль',
    swamp: 'болото',
    energy: 'энергия',
    stone: 'камень',
    life: 'жизнь',
    milk: 'молоко',
    sourcream: 'сметанка',
    fire: 'огонь',
    water: 'вода'
};

var cauldron = {
    get elems() {
        return document.querySelectorAll('tr td:nth-child(2) ul li');
    },
    get node() {
        return document.querySelector('tr td:nth-child(2) ul');
    }
};
var newElemNode = document.querySelector('thead th span');
var inputNode = document.querySelector('input');

console.log(warehouse.elems);
console.log(warehouse.node);
console.log(cauldron.elems);
console.log(cauldron.node);

function warehouseElemHandler(event) {
    console.log('warehouse -> cauldron');
    console.log(event.target.parentNode.nodeName);
    var nodeToTransfer = null;
    // Если попадаем на выделенную часть мышкой
    if (event.target.parentNode.nodeName === 'LI') {
        nodeToTransfer = event.target.parentNode;
    } else {
        nodeToTransfer = event.target;
    }
    nodeToTransfer.innerHTML = warehouseCopy[nodeToTransfer.dataset.element];
    cauldron.node.appendChild(nodeToTransfer);
    nodeToTransfer.onclick = cauldronElemHandler;
    combinationChecker();
}

function cauldronElemHandler(event) {
    console.log('cauldron -> warehouse');
    warehouse.node.appendChild(event.target);
    event.target.onclick = warehouseElemHandler;
    combinationChecker();
    inputHandler();
}

for (var i = 0; i < warehouse.elems.length; ++i) {
    warehouse.elems[i].onclick = warehouseElemHandler;
}

for (var i = 0; i < cauldron.elems.length; ++i) {
    cauldron.elems[i].onclick = cauldronElemHandler;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        for (var j = 0; j < b.length; ++j) {
            if (a[i] !== b[j]) return false;
        }
    }
    return true;
}

// if a in b
function arraySubset(a, b) {
    var result = true;
    a.forEach(function (elem, i) {
        if (b.indexOf(elem) === -1) {
            result = false;
        }
    });
    return result;
}

// The most difficult combo
// Максимум по количеству элементов
function diffCombo(possibleCombinations) {
    var ans = {};
    var ansLength = 0;
    possibleCombinations.forEach(function (elem) {
        if (elem.elements.length >= ansLength) {
            ans = elem;
            ansLength = elem.elements.length;
        }
    });
    return ans;
}

function combinationChecker() {
    var possibleCombo = [];
    var currentCauldron = [];
    for (var i = 0; i < cauldron.elems.length; ++i) {
        var elemType = cauldron.elems[i].dataset;
        currentCauldron.push(elemType.element);
    }
    formulas.forEach(function (elem) {
        //console.log(arraysEqual(elem.elements, currentCauldron), arraySubset(elem.elements, currentCauldron));
        if (arraysEqual(elem.elements, currentCauldron) ||
            arraySubset(elem.elements, currentCauldron)) {
            possibleCombo.push(elem);
        }
    });
    console.log(currentCauldron);
    console.log(possibleCombo);
    console.log(diffCombo(possibleCombo));
    if (!Object.keys(diffCombo(possibleCombo)).length) {
        newElemNode.innerHTML = '';
    } else {
        newElemNode.innerHTML = diffCombo(possibleCombo).result;
    }
}

function inputHandler(event) {
    console.log(inputNode.value);
    for (var i = 0; i < warehouse.elems.length; ++i) {
        warehouse.elems[i].innerHTML = warehouseCopy[warehouse.elems[i].dataset.element];
        var currElem = warehouse.elems[i].innerHTML;
        if (currElem.search(inputNode.value) === -1) {
            warehouse.elems[i].style.display = 'none';
        } else {
            warehouse.elems[i].style.display = 'list-item';
            var subPos = currElem.search(inputNode.value);
            var newHtml = currElem.slice(0, subPos);
            newHtml += '<span id=highlight>';
            newHtml += currElem.slice(subPos, subPos + inputNode.value.length);
            newHtml += '</span>';
            newHtml += currElem.slice(subPos + inputNode.value.length, currElem.length);
            console.log(newHtml);
            warehouse.elems[i].innerHTML = newHtml;
        }
    }
}
inputNode.onkeyup = inputHandler;
