'use strict';

var formulas = window.formulas;

var allElements = document.getElementsByTagName('li');

[].slice.call(allElements).forEach(element => {
    element.onclick = function () {
        var listName = element.parentElement.getAttribute('class');
        listName = (listName === 'list1') ? 'list2' : 'list1';
        var list = document.getElementsByClassName(listName)[0];
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
    };
});

var searchBox = document.getElementById('searchbox');
searchBox.oninput = function () {
    var list1 = document.querySelector('.list1');
    var children = [].slice.call(list1.children);
    for (var child of children) {
        console.log(searchBox.value, child.childNodes[0].nodeValue.slice(0, searchBox.value.length));
        if (searchBox.value !== child.childNodes[0].nodeValue.slice(0, searchBox.value.length)) {
            child.style.display = 'none';
        }
    }
};

var closeIcon = document.getElementsByClassName('close')[0];
closeIcon.onclick = function () {
    var list1 = document.querySelector('.list1');
    var children = [].slice.call(list1.children);
    for (var child of children) {
        child.style.display = 'list-item';
    }
};
