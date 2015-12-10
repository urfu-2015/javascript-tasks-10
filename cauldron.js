'use strict';

var formulas = window.formulas;

var i = 0;
var print = document.getElementsByTagName('li');

[].slice.call(print).forEach(element => {
    element.onclick = function () {
        var listName = element.parentElement.getAttribute('class');
        listName = (listName === 'list1') ? 'list2' : 'list1';
        var list = document.getElementsByClassName(listName)[0];
        list.appendChild(element);
        var print = document.querySelector('.list2');
        var children = [].slice.call(print.children);
        var result;
        var elementsMatched = 0;
        for (var formula of formulas) {
            var elements = formula.elements;
            var elementIndex;
            for (var _element of elements) {
                var isElementFound = false;
                for (var child of children) {
                    if (child.getAttribute('data-element') === _element) {
                        var isElementFound = true;
                        break;
                    }
                }
                if (!isElementFound) {
                    break;
                }
            }
            if (isElementFound) {
                if (elements.length > elementsMatched) {
                    result = formula.result;
                    elementsMatched = elements.length;
                }
            }
        }
        var resultNode = document.getElementsByClassName('result')[0];
        resultNode.childNodes[0].nodeValue = result === undefined ? "" : result;
    };
});
