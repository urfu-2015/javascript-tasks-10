'use strict';
var html_result = document.querySelector('.js-result');
var html_find = document.querySelector('.js-find-input');
var html_clear_find = document.querySelector('.js-clear');
// Получаем комбинации элементов
var formulas = window.formulas;

Object.prototype.getDate = function (name) {
    return this.dataset[name];
};

function Utensil(html_class) {
    this.class = html_class;
    this.html_element = document.querySelector('.' + this.class);

}

Utensil.prototype.getIngredients = function () {
    var html_ingredients = [].slice.call(this.html_element.children);
    return html_ingredients.map(function (element) {
        return element.getDate('element');
    });
};

Utensil.prototype.checkElements = function () {

};

Utensil.prototype.clickElements = function (twoX) {
    var self = this;
    this.html_element.onclick = function (event) {
        var element = event.target;
        self.html_element.removeChild(element);
        twoX.html_element.appendChild(element);
        self.checkElements();
        twoX.checkElements();
        find();
        event.stopPropagation();
    };
};


var table = new Utensil('js-table');
var boiler = new Utensil('js-boiler');

table.clickElements(boiler);

boiler.clickElements(table);
boiler.checkElements = function () {
    var ing = this.getIngredients();
    var all_result = formulas.filter(function (item) {
        return item.checkElementInRecipe(ing);
    });
    var result;
    var complexity = 0;
    all_result.forEach(function (recipe) {
        var recipe_complexity = recipe.getСomplexity();
        if (recipe_complexity > complexity) {
            result = recipe;
            complexity = recipe_complexity;
        }
    });
    if (result) {
        html_result.innerText = result.result;
    } else {
        html_result.innerHTML = 'нет нужного рецепта =(';
    }
};
boiler.checkElements();

function delSpan(word) {
    var start_span = new RegExp('<span style="color: red;">', "g");
    var end_span = new RegExp('</span>', "g");
    var new_word = word.replace(start_span, '');
    new_word = new_word.replace(end_span, '');
    return new_word;
}

function backlight_word(word, find_word) {
    word = delSpan(word);
    return word.replace(new RegExp(find_word, "g"), '<span style="color: red;">' + find_word + '</span>');
}
function find() {
    var html_ingredients = [].slice.call(table.html_element.children);
    var find_word = html_find.value;
    var find_element = html_ingredients.filter(function (html_element) {
        var word = html_element.innerText;
        var result = word.indexOf(find_word) != -1;

        if (result) {
            html_element.innerHTML = backlight_word(word, find_word);
        }
        return result;
    });
    var not_find_element = html_ingredients.filter(function (html_element) {
        return html_element.innerText.indexOf(find_word) === -1;
    });
    find_element.forEach(function (element) {
        element.setAttribute('style', 'display:list-item;');
    });
    not_find_element.forEach(function (element) {
        element.setAttribute('style', 'display:none;');
    })
}

html_find.onkeyup = function (e) {
    find()
};

html_clear_find.onclick = function () {
    html_find.value = '';
    find();
};
