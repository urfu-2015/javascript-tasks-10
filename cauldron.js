'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;
// Механизмы котла описывать здесь
var cards = document.querySelectorAll('.card');
cards = [].slice.call(cards);
cards.forEach(
  function (elem) {
      elem.onmousedown = mouseDownHandler;
      elem.ondragstart = function() {
          return false;
      };
  }
);


if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

function PossibleResult() {
    this._answers = [];
}

PossibleResult.prototype.clear = function () {
    this._answers = [];
};

function allElementAre(elementsRequired, allElements) {
    for (var i = 0; i < elementsRequired.length; i++) {
        var resultSearch = allElements.find(
            function (elem) {
                return elementsRequired[i] === elem;
            }) ;
        if (resultSearch === undefined) {
            return false;
        }
    }
    if (elementsRequired.length === allElements.length) {
        return true;
    } else {
        return false;
    }
}

PossibleResult.prototype.setAnswer = function (elementsInCauldron) {
    if (elementsInCauldron.length === 0) {
        return 'Не жадничай, пора творить чудеса';
    }
    formulas.forEach(
        function(formula) {
            if (allElementAre(formula.elements, elementsInCauldron)) {
                this._answers.push(formula);
            }
        }, this
    );
    this._answers.sort(
        function (elem1, elem2) {
            return elem2.elements.length - elem1.elements.length;
        }
    );
    if (this._answers.length > 0) {
        return this._answers[0].result;
    } else {
        return 'Сочетания такого нет';
    }
};


var rightSide = document.querySelector('.right_list');
var leftSide = document.querySelector('.left_list');
var coordsCauldron = getCoords(document.querySelector('.cauldron_img'));
var result = document.querySelector('.result');

var posResults = new PossibleResult();

function reload(curElem, adding) {
    posResults.clear();
    var ourCreature;
    var mixtureElements = [].slice.call(rightSide.querySelectorAll('.card'));
    mixtureElements = mixtureElements.map(
        function(elem) {
            return elem.dataset.element;
        }
    );
    ourCreature = posResults.setAnswer(mixtureElements);
    result.innerText = ourCreature;
}

reload();

var filterRemover = document.querySelector('.filterRemover');

filterRemover.addEventListener('click', function () {
    console.log('here');
    var mixtureElements = [].slice.call(leftSide.querySelectorAll('.card'));
    mixtureElements.forEach(
        function (elem) {
            elem.style.display = 'block';
        }
    );
}, false);

var filterTextArea = document.getElementById('filter');
filterTextArea.addEventListener('input', function () {
        if (filterTextArea.value.length === 0)
        {
            filterRemover.click();
            return;
        }
        [].slice.call(leftSide.querySelectorAll('.card')).forEach(
            function (elem) {
                if (!elem.innerText.startsWith(filterTextArea.value)) {
                    elem.style.display = 'none';
                } else {
                    elem.style.display = 'block';
                }
            }
        );
    }, false);

function mouseDownHandler(e) {
    var curElem = e.target;
    var coords = getCoords(curElem);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    curElem.style.position = 'absolute';
    curElem.style.cursor = '-webkit-grabbing';
    curElem.style.cursor = '-moz-grabbing.';
    document.body.appendChild(curElem);
    moveAt(e);

    curElem.style.zIndex = 1000;

    function moveAt(e) {
        curElem.style.left = e.pageX - shiftX + 'px';
        curElem.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function(e) {
        moveAt(e);
    };

    curElem.onmouseup = function(e) {
        document.body.removeChild(curElem);
        document.onmousemove = null;
        if (coordsCauldron.left >= e.pageX || coordsCauldron.right <= e.pageX){
            curElem.style.position = 'static';
            leftSide.appendChild(curElem);
            reload();
        } else {
            curElem.style.position = 'static';
            rightSide.appendChild(curElem);
            reload();
        }
        curElem.onmouseup = null;
    };
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
        right: box.right + pageXOffset
    };
}

