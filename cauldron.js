'use strict';

var formulas = window.formulas;

var allElements = document.getElementsByTagName('li');

[].slice.call(allElements).forEach(element => {
    element.onclick = function () {
        var listName = element.parentElement.getAttribute('class');
        listName = (listName === 'list1') ? 'list2' : 'list1';
        var list = document.getElementsByClassName(listName)[0];
        element.childNodes[1].nodeValue = element.childNodes[0].childNodes[0].nodeValue +
                                        element.childNodes[1].nodeValue;
        element.childNodes[0].childNodes[0].nodeValue = "";
        list.appendChild(element);
        var list2 = document.querySelector('.list2');
        var children = [].slice.call(list2.children);
        var result;
        var elementsMatched = 0;
        for (var formula of formulas) {
            var elements = formula.elements;
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
        sortElements();
    };
});

var searchBox = document.getElementById('searchbox');
for (var _element of [].slice.call(allElements)) {
    var highlighted = document.createElement('span');
    highlighted.setAttribute('class', 'highlighted');
    var text = document.createTextNode('');
    highlighted.appendChild(text);
    _element.insertBefore(highlighted, _element.childNodes[0]);
};

var sortElements = function () {
    var list1 = document.querySelector('.list1');
    var children = [].slice.call(list1.children);
    for (var child of children) {
        var _element = child.childNodes[0].childNodes[0].nodeValue + child.childNodes[1].nodeValue;
        if (searchBox.value === _element.slice(0, searchBox.value.length)) {
            child.style.display = 'list-item';
            child.childNodes[0].childNodes[0].nodeValue = _element.slice(0, searchBox.value.length);
            child.childNodes[1].nodeValue = _element.slice(searchBox.value.length);
        } else {
            child.style.display = 'none';
        }
    }
};

searchBox.oninput = function () {
    sortElements();
};

var closeIcon = document.getElementsByClassName('close')[0];
closeIcon.onclick = function () {
    var list1 = document.querySelector('.list1');
    var children = [].slice.call(list1.children);
    searchBox.value = '';
    for (var child of children) {
        child.style.display = 'list-item';
        child.childNodes[1].nodeValue = child.childNodes[0].childNodes[0].nodeValue +
                                        child.childNodes[1].nodeValue;
        child.childNodes[0].childNodes[0].nodeValue = "";
    }
};
