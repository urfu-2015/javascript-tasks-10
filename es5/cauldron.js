'use strict';

(function () {
    /**
    * Base class for Library, Formula, FormulaResult
    * @constructor
    */
    function Common() {}
    Common.prototype = {
        /**
        * @param {HTMLElement} element
        * @returns {boolean}
        */
        isElementWithin: function isElementWithin(element) {
            return this._container === element.parentElement;
        },
        /**
        * @returns {boolean}
        */
        isContainerClear: function isContainerClear() {
            return this._container.firstChild === null;
        },
        /**
        * @param {HTMLElement} element
        */
        addElement: function addElement(element) {
            this._container.appendChild(element);
        },
        /**
        * @param {HTMLElement} element
        */
        removeElement: function removeElement(element) {
            this._container.removeChild(element);
        },
        /**
        * remove all child elements
        */
        clearContainer: function clearContainer() {
            while (!this.isContainerClear()) {
                this.removeElement(this._container.firstChild);
            }
        },
        /**
        * @returns {Array.<HTMLElement>}
        */
        getRenderedElements: function getRenderedElements() {
            return [].slice.apply(this._container.children);
        },
        /**
        * @param {string} className
        * @returns {Array.<string>}
        */
        getNamesRenderedElements: function getNamesRenderedElements(className) {
            if (this.isContainerClear()) {
                return [];
            }
            var renderedElements = this.getRenderedElements();
            var names = renderedElements.filter(function (item) {
                return item.classList.contains(className);
            }).map(function (item) {
                return item.dataset.element;
            });
            return names;
        }
    };

    /**
    * Singleton
    */
    var singletonLibrary = (function () {
        /**
        * List of available alchemical elements
        * @constructor
        */
        var Library = function Library() {
            this._container = document.querySelector('.library__elements');
            this._elements = [];
            this._onMouseWheel = this._onMouseWheel.bind(this);
        };
        /**
        * Inherit from Common
        */
        Library.prototype = Object.create(Common.prototype);
        Library.prototype.constructor = Library;

        var library = {
            /**
            * @param {string} jsonUrl
            */
            loadInfo: function loadInfo(jsonUrl) {
                loadJSON(jsonUrl, (function (loadedElements) {
                    this._elements = loadedElements;
                    this.renderElements();
                    var mousewheelEvt = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';
                    this._container.addEventListener(mousewheelEvt, this._onMouseWheel);
                }).bind(this));
            },
            /**
            * Render all elements with inLibrary flag
            */
            renderElements: function renderElements() {
                var elementsFragment = document.createDocumentFragment();
                this._elements.filter(function (item) {
                    return item.inLibrary;
                }).sort(function (a, b) {
                    return a.name > b.name ? 1 : -1;
                }).forEach(function (item) {
                    var elem = new Element(item.name);
                    elementsFragment.appendChild(elem.getElementNode());
                    elem.loadImg(item.url);
                });
                this._container.appendChild(elementsFragment);
            },
            /**
            *
            * @returns {Array|{index: number, input: string}|null}
            */
            getStyleTranslateY: function getStyleTranslateY() {
                return this._container.style.transform.match(/-?\d+/);
            },
            resetScrollElements: function resetScrollElements() {
                this._container.style.transform = 'translateY(0px)';
            },
            /**
            * @param {number} displacement
            */
            scrollElements: function scrollElements(displacement) {
                var translateY = this.getStyleTranslateY();
                displacement = translateY ? Number(translateY[0]) + displacement : displacement;
                this._container.style.transform = 'translateY(' + displacement + 'px)';
            },
            /**
            * Find url on element which has got a name in func argument
            * @param {string} name
            * @returns {string|null}
            */
            getUrlByName: function getUrlByName(name) {
                for (var i = 0; i < this._elements.length; i++) {
                    if (this._elements[i].name === name) {
                        break;
                    }
                }
                return this._elements[i].url || null;
            },
            /**
            * @param {HTMLElement} element
            */
            addElement: function addElement(element) {
                var renderedElements = this.getRenderedElements();
                var i = 0;
                while (renderedElements.length > i && renderedElements[i].dataset.element < element.dataset.element) {
                    i++;
                }
                this._container.insertBefore(element, renderedElements[i]);
            },
            /**
            * Highlight name of the elements which match to the filter input
            */
            highlightElements: function highlightElements() {
                var filterVal = filter.getFilterValue();
                var regExp = new RegExp('^(' + filterVal + ')', 'gi');
                var renderedElements = this.getRenderedElements();
                renderedElements.forEach(function (item) {
                    if (!(item.dataset.element.search(regExp) + 1)) {
                        item.classList.add('hidden');
                    } else {
                        item.classList.remove('hidden');
                        var elementName = item.querySelector('.element__name');
                        elementName.innerHTML = filterVal.length ? elementName.textContent.replace(regExp, '<b>$1</b>') : elementName.textContent;
                    }
                });
            },
            /**
            * @returns {number}
            */
            getElementHeight: function getElementHeight() {
                var renderedElements = this.getRenderedElements();
                renderedElements = renderedElements.filter(function (item) {
                    return !item.classList.contains('hidden');
                });
                return renderedElements[0].offsetHeight;
            },
            /**
            * Event handler of mouse wheel
            * @param {Event} event
            * @private
            */
            _onMouseWheel: function _onMouseWheel(event) {
                var elementHeight = this.getElementHeight();
                var maxTop = filter.getHeight();
                var libraryClientRect = this._container.getBoundingClientRect();
                var delta = event.detail ? event.detail * -SCROLL_SIZE : event.wheelDelta;

                if (delta > 0) {
                    if (maxTop <= libraryClientRect.top) {
                        return;
                    }
                    maxTop > libraryClientRect.top + elementHeight ? this.scrollElements(elementHeight) : this.scrollElements(maxTop - libraryClientRect.top);
                    return;
                }
                if (window.innerHeight >= libraryClientRect.bottom) {
                    return;
                }
                window.innerHeight < libraryClientRect.bottom - elementHeight ? this.scrollElements(-elementHeight) : this.scrollElements(window.innerHeight - libraryClientRect.bottom);
            }
        };

        assignIn(Library.prototype, library);

        var instance;
        return {
            getInstance: function getInstance() {
                if (!instance) {
                    instance = new Library();
                }
                return instance;
            }
        };
    })();

    /**
    * Singleton
    */
    var singletonFormula = (function () {
        /**
        * @constructor
        */
        var Formula = function Formula() {
            this._container = document.querySelector('.workspace__formula');
            this._minFormulaLength = Infinity;
            this._formulas = [];
        };
        /**
        * Inherit from Common
        */
        Formula.prototype = Object.create(Common.prototype);
        Formula.prototype.constructor = Formula;

        var formula = {
            /**
            * @param {string} jsonUrl
            */
            loadInfo: function loadInfo(jsonUrl) {
                loadJSON(jsonUrl, (function (loadedFormulas) {
                    var _this = this;

                    this._formulas = loadedFormulas;
                    loadedFormulas.forEach(function (item) {
                        _this._minFormulaLength = Math.min(_this._minFormulaLength, item.elements.length);
                    });
                }).bind(this));
            },
            /**
            * @param {HTMLElement} element
            */
            addElement: function addElement(element) {
                if (!this._container.childElementCount) {
                    Common.prototype.addElement.call(this, element);
                    this.calculate();
                    return;
                }
                var plus = document.createElement('span');
                plus.classList.add('workspace__formula-plus');
                Common.prototype.addElement.call(this, plus);
                Common.prototype.addElement.call(this, element);
                this.calculate();
            },
            /**
            * @param {HTMLElement} element
            */
            removeElement: function removeElement(element) {
                if (this._container.childElementCount < 2) {
                    Common.prototype.removeElement.call(this, element);
                    this.calculate();
                    return;
                }
                Common.prototype.removeElement.call(this, element);
                this.removeRedundantPluses();
            },
            /**
            * Remove spare pluses between elements or on the edges
            */
            removeRedundantPluses: function removeRedundantPluses() {
                var _this2 = this;

                var pluses = this.getRenderedElements();
                pluses.filter(function (item) {
                    return item.classList.contains('workspace__formula-plus');
                }).forEach(function (item) {
                    if (item === _this2._container.firstElementChild || item === _this2._container.lastElementChild || item.className === item.nextElementSibling.className) {
                        _this2._container.removeChild(item);
                    }
                });
                this.calculate();
            },
            /**
            * Calculate formula and display the result
            */
            calculate: function calculate() {
                var elementsNames = this.getNamesRenderedElements('element');
                if (elementsNames.length < this._minFormulaLength) {
                    this.resetFormulaResult();
                    return;
                }

                var formulas = this.getAppropriateFormulas(elementsNames.length);
                var resultName = null;
                for (var i = 0; i < formulas.length; i++) {
                    var answ = elementsNames.every(function (item) {
                        return formulas[i].elements.indexOf(item) + 1;
                    });
                    if (answ) {
                        resultName = formulas[i].result;
                        break;
                    }
                }

                if (!resultName) {
                    this.resetFormulaResult();
                    return;
                }

                this.setFormulaResult(resultName);
            },
            /**
            * @param {string} elementName
            */
            setFormulaResult: function setFormulaResult(elementName) {
                var elem = new Element(elementName);
                formulaRes.setResultElement(elem.getElementNode());
                var url = library.getUrlByName(elementName);
                elem.loadImg(url);
            },
            /**
            *
            * @param formulaLength
            * @returns {Array|Array.<Object>}
            */
            getAppropriateFormulas: function getAppropriateFormulas(formulaLength) {
                return this._formulas.filter(function (item) {
                    return item.elements.length === formulaLength;
                });
            },
            resetFormulaResult: function resetFormulaResult() {
                formulaRes.clearContainer();
                formulaRes.reset();
            }
        };

        assignIn(Formula.prototype, formula);

        var instance;
        return {
            getInstance: function getInstance() {
                if (!instance) {
                    instance = new Formula();
                }
                return instance;
            }
        };
    })();

    /**
    * Singleton
    */
    var singletonFormulaResult = (function () {
        /**
        * @constructor
        */
        var FormulaResult = function FormulaResult() {
            this._container = document.querySelector('.workspace__result');
            this._resultElement = null;
        };
        /**
        * Inherit from Common
        */
        FormulaResult.prototype = Object.create(Common.prototype);
        FormulaResult.prototype.constructor = FormulaResult;

        var formulaResult = {
            /**
            * Come back to default
            */
            reset: function reset() {
                this._resultElement = null;
            },
            /**
            * @returns {HTMLElement|null}
            */
            getResultElement: function getResultElement() {
                return this._resultElement;
            },
            /**
            * @param {HTMLElement} element
            */
            setResultElement: function setResultElement(element) {
                if (!this.getResultElement()) {
                    this.addElement(element);
                } else {
                    this._container.replaceChild(element, this._resultElement);
                }
                this._resultElement = element;
            },
            /**
            * @param {HTMLElement} element
            */
            addElement: function addElement(element) {
                if (this.isContainerClear()) {
                    var arrow = document.createElement('span');
                    arrow.classList.add('workspace__result-arrow');
                    Common.prototype.addElement.call(this, arrow);
                }
                Common.prototype.addElement.call(this, element);
            }
        };

        assignIn(FormulaResult.prototype, formulaResult);

        var instance;
        return {
            getInstance: function getInstance() {
                if (!instance) {
                    instance = new FormulaResult();
                }
                return instance;
            }
        };
    })();

    /**
    * @param {string} newName
    * @constructor
    */
    var Element = function Element(newName) {
        this._elementTemplate = document.getElementById('element-template');
        this._element = this._elementTemplate.content.children[0].cloneNode(true);
        this._elementName = this._element.querySelector('.element__name');
        this._elementImg = this._element.querySelector('img');
        this._elementName.textContent = newName;
        this._element.dataset.element = newName;
    };
    Element.prototype = {
        /**
        * @param {string} url
        */
        loadImg: function loadImg(url) {
            var _this3 = this;

            var img = new Image();
            img.src = url;
            img.classList.add('element__img');

            img.addEventListener('load', function () {
                _this3._element.replaceChild(img, _this3._elementImg);
                _this3._elementImg = img;
            });
            img.addEventListener('error', function () {
                _this3._elementImg.classList.add('element__img', 'img-load-failure');
            });
        },
        /**
        * @returns {HTMLElement}
        */
        getElementNode: function getElementNode() {
            return this._element;
        }
    };

    /**
    * Singleton
    */
    var singletonFilter = (function () {
        /**
        * @constructor
        */
        var Filter = function Filter() {
            this._filterInput = document.getElementById('filter');
            this._filterClear = document.querySelector('.filter__clear');
            this._onInputEnterText = this._onInputEnterText.bind(this);
            this._onClearClick = this._onClearClick.bind(this);
            this._filterInput.addEventListener('input', this._onInputEnterText);
            this._filterClear.addEventListener('click', this._onClearClick);
        };
        Filter.prototype = {
            /**
            * @returns {number}
            */
            getHeight: function getHeight() {
                var styles = window.getComputedStyle(this._filterInput.parentElement);
                var margin = parseInt(styles.marginTop) + parseInt(styles.marginBottom);
                return this._filterInput.offsetHeight + margin;
            },
            /**
            * @returns {string}
            */
            getFilterValue: function getFilterValue() {
                return this._filterInput.value;
            },
            /**
            * @returns {boolean}
            */
            isFilterInputClear: function isFilterInputClear() {
                return !this._filterInput.value.length;
            },
            /**
            * Event handler of input any symbol in input area
            * @private
            */
            _onInputEnterText: function _onInputEnterText() {
                this._filterInput.value.length ? this._filterClear.classList.remove('hidden') : this._filterClear.classList.add('hidden');
                var libraryTranslateY = library.getStyleTranslateY();
                if (libraryTranslateY && Number(libraryTranslateY[0]) !== 0) {
                    library.resetScrollElements();
                }
                library.highlightElements();
            },
            /**
            * Event handler of click on cross
            * @param {Event} event
            * @private
            */
            _onClearClick: function _onClearClick(event) {
                event.preventDefault();
                this._filterInput.value = '';
                this._filterInput.dispatchEvent(new Event('input'));
            }
        };

        var instance;
        return {
            getInstance: function getInstance() {
                if (!instance) {
                    instance = new Filter();
                }
                return instance;
            }
        };
    })();

    /**
    * Singleton for drag and drop elements
    */
    var dragAndDrop = new function () {
        var dragObj = {};
        /**
        * Event handler of hold down the left mouse button
        * @param {Event} event
        */
        function onMouseDown(event) {
            if (event.which !== 1) {
                return;
            }
            dragObj.elementImg = event.target.closest('.element__img');
            if (!dragObj.elementImg || dragObj.elementImg.closest('.workspace__result')) {
                return;
            }
            dragObj.element = dragObj.elementImg.closest('.element');
            dragObj.downX = event.pageX;
            dragObj.downY = event.pageY;

            event.preventDefault();
        }
        /**
        * Event handler of moving a mouse
        * @param {Event} event
        */
        function onMouseMove(event) {
            if (!dragObj.element) {
                return;
            }
            if (!dragObj.isDragStart) {
                dragObj.lastNextSibling = dragObj.element.nextSibling;
                dragObj.lastParent = dragObj.element.parentNode;
                var moveX = event.pageX - dragObj.downX;
                var moveY = event.pageY - dragObj.downY;
                if (Math.abs(moveX) < 5 && Math.abs(moveY) < 5) {
                    return;
                }
                var coords = getCoords(dragObj.element);
                var prevImgSizes = getSizes(dragObj.elementImg);
                dragObj.shiftX = dragObj.downX - coords.left;
                dragObj.shiftY = dragObj.downY - coords.top;
                startDrag();
                var currImgSizes = getSizes(dragObj.elementImg);
                if (currImgSizes.width !== prevImgSizes.width || currImgSizes.height !== prevImgSizes.height) {
                    dragObj.shiftX += (currImgSizes.width - prevImgSizes.width) / 2;
                    dragObj.shiftY += (currImgSizes.height - prevImgSizes.height) / 2;
                }
            }
            dragObj.element.style.left = event.pageX - dragObj.shiftX + 'px';
            dragObj.element.style.top = event.pageY - dragObj.shiftY + 'px';

            event.preventDefault();
        }
        /**
        * Event handler of the end of hold left mouse button
        * @param event
        */
        function onMouseUp(event) {
            if (dragObj.isDragStart) {
                finishDrag(event);
            }
            dragObj = {};
        }
        /**
        * Beginning of the dragging element
        */
        function startDrag() {
            if (isFirefox()) {
                dragObj.element.classList.add('noclick');
            }
            dragObj.element.classList.add('element--drag');
            dragObj.elementImg.classList.add('element__img--drag');
            document.body.appendChild(dragObj.element);
            dragObj.element.style.position = 'absolute';
            dragObj.isDragStart = true;
        }
        /**
        * Beginning of the end of the dragging element
        * @param {Event} event
        */
        function finishDrag(event) {
            dragObj.dropElem = findDroppable(event);
            if (!dragObj.dropElem) {
                rollback();
            } else {
                onDragEnd();
            }
        }
        /**
        * Cancel dragging and return element to the previous position
        */
        function rollback() {
            dragObj.lastParent.insertBefore(dragObj.element, dragObj.lastNextSibling);
            resetElementStyle();
        }
        /**
        * The end of the dragging element
        */
        function onDragEnd() {
            resetElementStyle();
            var elementName = dragObj.element.querySelector('.element__name');
            if (isLibraryParent()) {
                if (elementName.getElementsByTagName('b')) {
                    elementName.innerHTML = elementName.textContent;
                }
                formula.addElement(dragObj.element);
                return;
            }
            formula.removeRedundantPluses();
            library.addElement(dragObj.element);
            if (!filter.isFilterInputClear()) {
                library.highlightElements();
            }
        }

        /**
        * Find drop container
        * @param {Event} event
        * @returns {HTMLElement|null}
        */
        function findDroppable(event) {
            dragObj.element.classList.add('hidden');
            var elem = document.elementFromPoint(event.clientX, event.clientY);
            dragObj.element.classList.remove('hidden');
            if (elem === null) {
                return null;
            }
            if (isLibraryParent()) {
                return elem.closest('.workspace');
            }
            return elem.closest('.library');
        }
        function resetElementStyle() {
            dragObj.element.classList.remove('element--drag');
            dragObj.elementImg.classList.remove('element__img--drag');
            dragObj.element.style.position = 'static';
        }
        /**
        * @param {HTMLElement} elem
        * @returns {{top: Number, left: Number}}
        */
        function getCoords(elem) {
            var box = elem.getBoundingClientRect();
            return {
                top: box.top,
                left: box.left
            };
        }
        /**
        * Returns sizes of the Image
        * @param {HTMLElement} elem
        * @returns {{width: Number, height: Number}}
        */
        function getSizes(elem) {
            var styles = window.getComputedStyle(elem);
            return {
                width: parseInt(styles.width),
                height: parseInt(styles.height)
            };
        }
        /**
        * @returns {boolean}
        */
        function isLibraryParent() {
            return dragObj.lastParent.classList.contains('library__elements');
        }
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }();

    /**
    * @param {string} url
    * @param {Function} callback
    */
    function loadJSON(url, callback) {
        fetch(url).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response.json());
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        }).then(function (data) {
            callback(data);
        })['catch'](function (error) {
            console.log("Failed", error);
        });
    }

    function initEvents() {
        window.addEventListener('imgElementClick', function (event) {
            var element = event.detail.element;
            var elementName = element.querySelector('.element__name');
            if (library.isElementWithin(element)) {
                library.removeElement(element);
                if (elementName.getElementsByTagName('b')) {
                    elementName.innerHTML = elementName.textContent;
                }
                formula.addElement(element);
            } else if (formula.isElementWithin(element)) {
                formula.removeElement(element);
                library.addElement(element);
                if (!filter.isFilterInputClear()) {
                    library.highlightElements();
                }
            }
        });

        var formulasClear = document.querySelector('.workspace__clear');
        formulasClear.addEventListener('click', function (event) {
            event.preventDefault();
            var elementsInFormula = formula.getRenderedElements();
            formula.clearContainer();
            elementsInFormula.filter(function (item) {
                return item.classList.contains('element');
            }).forEach(function (item) {
                library.addElement(item);
            });
            if (!filter.isFilterInputClear()) {
                library.highlightElements();
            }
        });

        window.addEventListener('click', function (event) {
            event.preventDefault();
            if (!doesHaveParents(event.target, ['element__img', 'library__elements']) && !doesHaveParents(event.target, ['element__img', 'workspace__formula'])) {
                return;
            }

            var parent = event.target.parentElement;
            if (isFirefox() && parent.classList.contains('noclick')) {
                parent.classList.remove('noclick');
                return;
            }
            var imgClickEvent = new CustomEvent('imgElementClick', { detail: { element: parent } });
            window.dispatchEvent(imgClickEvent);
        });
    }

    /**
    * Check if element and his parent have all classes from classNamesArr
    * @param {HTMLElement} element
    * @param {Array} classNamesArr
    * @returns {boolean}
    */
    function doesHaveParents(_x, _x2) {
        var _again = true;

        _function: while (_again) {
            var element = _x,
                classNamesArr = _x2;
            className = undefined;
            _again = false;

            if (!classNamesArr) {
                return false;
            }
            var className = classNamesArr.shift();
            do {
                if (element.classList.contains(className)) {
                    if (classNamesArr.length) {
                        _x = element;
                        _x2 = classNamesArr;
                        _again = true;
                        continue _function;
                    } else {
                        return true;
                    }
                }
                element = element.parentElement;
            } while (element);
            return false;
        }
    }

    /**
    * For MouseWheel -> DOMMouseScroll and for DragAndDrop. Triggered events in the following order:
    * in Chrome: mousedown -> mouseup (without click)
    * in Firefox: mousedown -> mouseup -> click
    * @returns {boolean}
    */
    function isFirefox() {
        return (/Firefox/i.test(navigator.userAgent)
        );
    }

    /**
    * @param {Object} object
    * @param {Object} source
    * @returns {Object}
    */
    function assignIn(object, source) {
        var props = Object.keys(source);
        while (props.length) {
            var key = props.shift();
            object[key] = source[key];
        }
        return object;
    }

    initEvents();
    var SCROLL_SIZE = 120;
    var library = singletonLibrary.getInstance();
    var formula = singletonFormula.getInstance();
    var formulaRes = singletonFormulaResult.getInstance();
    library.loadInfo('elements.json');
    formula.loadInfo('formulas.json');
    var filter = singletonFilter.getInstance();
})();
//# sourceMappingURL=cauldron.js.map