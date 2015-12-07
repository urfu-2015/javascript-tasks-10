'use strict';

// Получаем комбинации элементов
var formulas = window.formulas;

var outOfBoiler = document.getElementById("outOfBoiler");
var inBoiler = document.getElementById("inBoiler");

for (var li of [].slice.call(outOfBoiler.children)) {
    li.onclick = toBoiler.bind(li);
}

for (var li of [].slice.call(inBoiler.children)) {
    li.onclick = toBoilerOut.bind(li);
}

function toBoiler(li) {
    inBoiler.appendChild(this);
    checkBoiler();
    this.onclick = toBoilerOut.bind(this);
}

function toBoilerOut(li) {
    outOfBoiler.appendChild(this);
    checkBoiler();
    this.onclick = toBoiler.bind(this);
}

function checkBoiler() {
    for (var formula of formulas) {
        for (var li of [].slice.call(inBoiler.children)) {

        }
    }

}

