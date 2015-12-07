'use strict';

var formulas = window.formulas;

function dragStart(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('Text', ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target, 50, 25);
    return true;
}

function dragEnter(ev) {
    event.preventDefault();
    return true;
}

function dragOver(ev) {
    event.preventDefault();
}

function dragDrop(ev) {
    var data = ev.dataTransfer.getData('Text');
    if (ev.target.getAttribute('id') === 'boiler' ||
        ev.target.getAttribute('id') === 'cauldron' ||
        ev.target.parentNode.getAttribute('id') === 'boiler') {
        var boilerList = document.getElementById('boiler');
        var newChild = document.getElementById(data);
        boilerList.appendChild(newChild);
        for (var i = 0; i < newChild.children.length; i++) {
            newChild.children[i].style.color = "#000";
        }
    }
    if (ev.target.getAttribute('id') === 'elements' ||
        ev.target.parentNode.getAttribute('id') === 'elements') {
        var elementsList = document.getElementById('elements');
        elementsList.appendChild(document.getElementById(data));
        FindWords();
    }
    ev.stopPropagation();
    createSmth();
    return false;
}

function createSmth() {
    var items = document.querySelectorAll('#boiler > li');
    var inBoiler = [].map.call(items, function (li) {
        return li.dataset.element;
    });
    var i = formulas.length - 1;
    while (i >= 0) {
        var res = formulas[i].elements.every(function (element) {
            return inBoiler.indexOf(element) != -1;
        });
        /*res = res && inBoiler.every(function (element) {
            return formulas[i].elements.indexOf(element) != -1;
        });*/
        var resultText = document.getElementById('result').innerText;
        if (res) {
            resultText = formulas[i].result;
            break;
        } else {
            result.innerText = '';
        }
        i--;
    }
}

var containers = document.querySelectorAll('ul');
[].forEach.call(containers, function (cont) {
    cont.addEventListener('drop', dragDrop, false);
    cont.addEventListener('dragenter', dragEnter, false);
    cont.addEventListener('dragover', dragOver, false);
});

var cauldronImg = document.getElementById('cauldron');
cauldronImg.addEventListener('drop', dragDrop, false);
cauldronImg.addEventListener('dragenter', dragEnter, false);
cauldronImg.addEventListener('dragover', dragOver, false);

var lis = document.querySelectorAll('li');
[].forEach.call(lis, function (li) {
    li.addEventListener('dragstart', dragStart, false);
    li.setAttribute('draggable', true);
    li.setAttribute('id', li.dataset.element);
});

var input = document.querySelector('input');
input.oninput = FindWords;
function FindWords() {
    var lis = document.querySelectorAll('#elements li');
    [].forEach.call(lis, function(li) {
        var word = input.value.toLowerCase();
        var index = li.innerText.indexOf(word);
        if (word.length > 0) {
            if (index != -1) {
                li.style.display = 'block';
                var textBefore = li.innerText.substring(0, index);
                var textAfter = li.innerText.substring(index + word.length);
                var spanB = document.createElement('span');
                spanB.appendChild(document.createTextNode(textBefore));
                var spanA = document.createElement('span');
                spanA.appendChild(document.createTextNode(textAfter));
                var spanFound = document.createElement('span');
                spanFound.appendChild(document.createTextNode(word));
                spanFound.style.color = '#f00';
                li.innerText = '';
                li.appendChild(spanB);
                li.appendChild(spanFound);
                li.appendChild(spanA);
            } else {
                li.style.display = 'none';
            }
        } else {
            li.style.display = 'block';
            var spans = document.querySelectorAll('li span');
            [].forEach.call(spans, function (span) {
                span.style.color = '#000';
            });
        }
    });
};

document.getElementById('close').onclick = function () {
    input.value = '';
    FindWords();
}

document.getElementById('out').onclick = ClearInput;
function ClearInput() {
    var elementsList = document.getElementById('elements');
    var boilerList = document.getElementById('boiler');
    while (boilerList.children.length > 0) {
        elementsList.appendChild(boilerList.children[0]);
        FindWords();
    }
}
