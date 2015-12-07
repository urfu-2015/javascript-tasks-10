'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

// Механизмы котла описывать здесь
var left = document.getElementById('left');
var right = document.getElementById('right');
var result = document.getElementById('result');
var filter = document.getElementById('filter');

for(var child of [].slice.call(left.children)) {
    child.onclick = leftToRight.bind(child);
}

for(var child of [].slice.call(right.children)) {
    child.onclick = rightToLeft.bind(child);
}

function leftToRight() {
    right.appendChild(this);
    result.innerText = new_result();
    this.onclick = rightToLeft.bind(this);
}

function rightToLeft() {
    left.appendChild(this);
    result.innerText = new_result();
    this.onclick = leftToRight.bind(this);
}

result.innerText = new_result();

function new_result() {
    if (right.children.length < 2) {
        return '';
    }
    var components = [];
    for(var child of [].slice.call(right.children)) {
        components.push(child.getAttribute('data-element'));
    }
    var length = 0;
    var result = '';
    for(var formula of formulas) {
        var has = true;
        for(var element of formula.elements) {
            var contains = false;
            for (var item of components) {
                if (item === element) {
                    contains = true;
                    break;
                }
            }
            if (!contains) {
                has = false;
                break;
            }
        }
        if (has && formula.elements.length > length) {
            length = formula.elements.length;
            result = formula.result;
        }
    }
    return result;
}

filter.onkeyup = filterOfComponents;
filter.onmousemove = function () {
    if (filter.value === '') {
        filterOfComponents();
    }
};

function filterOfComponents() {
    for(var child of [].slice.call(left.children)) {
        if (child.innerText.indexOf(filter.value) === -1) {
            child.setAttribute('class', 'hide');
        } else {
            child.removeAttribute('class');
            child.innerHTML = child.innerText.replace(filter.value, '<span class="red">' + filter.value + '</span>');
        }
    }
}
