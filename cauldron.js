'use strict';


// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь

var Cauldron = function () {
    this._cauldron = document.querySelector('[data-cauldron=cauldron]');
    this._ingredients = document.querySelector('[data-cauldron=ingredients]');
    this._search = document.querySelector('[data-cauldron=search]');
    this._elements = document.querySelectorAll('[data-cauldron] [data-element]');
    this._result = document.querySelector('[data-cauldron=result]');
    this._containers = [this._cauldron, this._ingredients];

    this._prepareDom();
    this._mix();
};

Cauldron.prototype._allowDrop = function (e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover-highlight');
};

Cauldron.prototype._drag = function (e) {
    e.dataTransfer.setData("text", e.target.dataset.element);
};

Cauldron.prototype._drop = function (e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    var node = document.querySelector('[data-element=' + data + ']');
    this._moveElement(node);
    node.parentElement.classList.remove('dragover-highlight');
};

Cauldron.prototype._mix = function () {
    var cauldronEls = document.querySelectorAll('[data-cauldron=cauldron] [data-element]');
    var cauldronNames = [].slice.call(cauldronEls).map(node => node.dataset.element);
    var res = formulas.filter(formula =>
            formula.elements.every(element => cauldronNames.indexOf(element) >= 0))
        .sort((a, b) => b.elements.length - a.elements.length)[0];
    this._result.innerHTML = res ? res.result : '';
};

Cauldron.prototype._setHiddenClass = function (node) {
    var startIndex = node.dataset.value.indexOf(this._search.value);
    if (startIndex < 0) {
        node.classList.add('hidden');
    } else {
        node.classList.remove('hidden');
        var value = node.dataset.value;
        node.innerHTML = value.substring(0, startIndex) + '<span class="highlight">' +
            value.substring(startIndex, this._search.value.length + startIndex) + '</span>' +
            value.substring(this._search.value.length + startIndex);
    }
};

Cauldron.prototype._moveElement = function (node) {
    switch (node.parentElement.dataset.cauldron) {
        case 'cauldron':
            this._cauldron.removeChild(node);
            this._ingredients.appendChild(node);
            this._setHiddenClass(node);
            break;
        case 'ingredients':
            this._ingredients.removeChild(node);
            this._cauldron.appendChild(node);
            node.innerHTML = node.dataset.value;
            break;
    }
    this._mix();
};

Cauldron.prototype._prepareDom = function () {
    this._containers.forEach((cnt) => {
        cnt.addEventListener('dragover', this._allowDrop, false);
        cnt.addEventListener('drop', this._drop.bind(this), false);
        cnt.addEventListener('dragleave', () => cnt.classList.remove('dragover-highlight'), false);
        cnt.addEventListener('click', e => this._moveElement(e.target), false);
    });

    [].slice.call(this._elements).forEach(node => {
        node.addEventListener('dragstart', this._drag, false);
        node.draggable = true;
        node.dataset.value = node.innerHTML;
    });

    this._search.addEventListener('search', () => {
        var ingredientLis = document.querySelectorAll('[data-cauldron=ingredients] [data-element]');
        [].slice.call(ingredientLis).map(this._setHiddenClass, this);
    }, false);
};
