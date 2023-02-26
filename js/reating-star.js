/**
 * Copyright (c) Amur 2023
 *
 * Reating Stars using pure js
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

;(function () {
    /**
     * @type {{}}
     */
    const StarReating = {};

    /**
     * @param text
     * @returns {boolean}
     */
    StarReating.toBoolean = text => text === "true";

    /**
     * @param str
     * @returns {boolean}
     */
    StarReating.isEmpty = str => str.trim().length === 0;

    /**
     * @type {*[]}
     */
    StarReating.itemStarPosition = [];

    StarReating.starPositionSet = function () {
        let _self = this;

        for (let index = 0; index < _self.option.count; index++) {
            let positionX = index === 0 ? 0 : index * _self.option.width;

            _self.itemStarPosition.push({
                startX: positionX,
                endX: positionX + _self.option.width,
                startY: 0,
                endY: _self.option.width
            });
        }
    }

    StarReating.createStyle = function () {
        let _self = this;
        let head = document.getElementsByTagName('head');
        let style = document.querySelector('style[arm-star-reting="true"]');
        if (head && !style) {
            let styles = document.createElement('style');
            styles.setAttribute('type', 'text/css');
            styles.innerText = `.arm-star-reting-content-star,.arm-star-reting-content-star *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0}.arm-star-reting-content-star{width:${_self.option.width * _self.option.count}px;height:${_self.option.width}px}.arm-star-reting-content-star.arm-star-is-hover{cursor: pointer;}`;
            head[0].appendChild(styles);
        }
    };

    /**
     * @param centerX
     * @param centerY
     * @param radius
     * @param angleInDegrees
     * @returns {{x: *, y: *}}
     */
    StarReating.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    /**
     * @param x
     * @param y
     * @param radius
     * @param startAngle
     * @param endAngle
     * @param closeShape
     * @returns {string}
     */
    StarReating.arc = function (x, y, radius, startAngle, endAngle, closeShape) {
        const fullCircle = endAngle - startAngle === 360;
        const start = this.polarToCartesian(x, y, radius, endAngle - (fullCircle ? 0.01 : 0));
        const end = this.polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            (closeShape && !fullCircle ? (`L ${x} ${y} Z`) : null),
            (fullCircle && !closeShape ? 'Z' : null)
        ].join(" ");
        return d;
    }

    /**
     * @param x
     * @param y
     * @param radius
     * @param startAngle
     * @param endAngle
     * @returns {*}
     */
    StarReating.pie = function (x, y, radius, startAngle, endAngle) {
        return this.arc(x, y, radius, startAngle, endAngle, true);
    }

    /**
     * @param startX
     * @param startY
     * @param outerRadius
     * @param points
     * @returns {string}
     */
    StarReating.star = function (startX, startY, outerRadius = 10, points = 5) {
        let innerRadius = (outerRadius * 40) / 100;
        const degreeIncrement = 360 / (points * 2);
        const d = new Array(points * 2).fill(0).map((p, i) => {
            let radius = i % 2 == 0 ? outerRadius : innerRadius;
            let degrees = degreeIncrement * i;
            const point = this.polarToCartesian(startX, startY, radius, degrees);
            return `${point.x},${point.y}`;
        });
        return `M${d}Z`;
    }

    /**
     * @param item
     * @returns {*}
     */
    StarReating.isHover = function (item) {
        let isHover = item.hasAttribute('arm-star-is-hover') ? item.getAttribute('arm-star-is-hover') : false;
        return this.isEmpty(isHover) ? false : this.toBoolean(isHover);
    }

    /**
     * @param item
     * @param index
     */
    StarReating.createSvg = function (item, index) {
        let _self = this;
        let rectTop = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectTop.setAttribute('height', _self.option.width);
        rectTop.setAttribute('width', '100%');
        rectTop.setAttribute('x', 0);
        rectTop.setAttribute('y', 0);
        rectTop.setAttribute('class', `arm-star-reting-waveform-bg-${index}`);

        let percent = item.hasAttribute('arm-star-data-percent') ? parseFloat(item.getAttribute('arm-star-data-percent')) : 0;

        let rectBottom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectBottom.setAttribute('height', _self.option.width);
        rectBottom.setAttribute('width', `${percent}%`);
        rectBottom.setAttribute('x', 0);
        rectBottom.setAttribute('y', 0);
        rectBottom.setAttribute('class', `arm-star-reting-progress-star-${index}`);
        rectBottom.setAttribute('fill', _self.option.starColor);

        let svgTop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgTop.setAttribute('viewBox', `0 0 ${_self.option.width * _self.option.count} ${_self.option.width}`);
        svgTop.setAttribute('height', _self.option.width);
        svgTop.setAttribute('width', '100%');
        svgTop.setAttribute('preserveaspectratio', 'none');
        svgTop.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgTop.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svgTop.setAttribute('class', 'arm-star-reting-waveform-container');

        svgTop.appendChild(rectTop);
        svgTop.appendChild(rectBottom);

        let contentStar = document.createElement('div');
        contentStar.classList.add(`arm-star-reting-content-star`);

        if (_self.isHover(item)) {
            contentStar.classList.add(`arm-star-is-hover`);
        }

        contentStar.setAttribute('arm-star-data-backup-percent', percent);

        let styles = document.createElement('style');
        styles.setAttribute('type', 'text/css');
        styles.innerText = `.arm-star-reting-content-star .arm-star-reting-waveform-bg-${index} {-webkit-clip-path:url(#buckets${index});clip-path:url(#buckets${index});fill:${_self.option.starEmptyColor}} .arm-star-reting-content-star .arm-star-reting-progress-star-${index} { -webkit-clip-path: url(#buckets${index}); clip-path: url(#buckets${index}); }`

        let svgBottom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgBottom.setAttribute('height', 0);
        svgBottom.setAttribute('width', 0);
        svgBottom.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgBottom.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svgBottom.setAttribute('class', 'arm-star-reting-mask');

        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');

        clipPath.setAttribute('id', `buckets${index}`);

        let count = _self.option.count;
        let space = 4;
        let width = _self.option.width;
        let height = _self.option.width;

        let buckets = [];

        for (let i = 0; i < count; i++) {
            buckets.push(i);
        }

        let mask = '';

        mask = mask + buckets.map((bucket, bucketIndex) => {
            let positionX = bucketIndex === 0 ? 0 : bucketIndex * _self.option.width;
            let starPath = _self.star((bucketIndex + 0.5) * _self.option.width, _self.option.width / 2, _self.option.width / 2, _self.option.points);
            return `<path d=${starPath} fill="${_self.option.starColor}" />`;
        }).join('');

        clipPath.innerHTML = mask;

        svgTop.innerHTML = svgTop.innerHTML + buckets.map((bucket, bucketIndex) => {
            let positionX = bucketIndex === 0 ? 0 : bucketIndex * _self.option.width;
            let starPath = _self.star((bucketIndex + 0.5) * _self.option.width, _self.option.width / 2, _self.option.width / 2, _self.option.points);
            return `<path d=${starPath} fill="none" stroke="${_self.option.stroke}" stroke-width="${_self.option.strokeWidth}" data-index='${bucketIndex}' />`;
        }).join('');

        defs.appendChild(clipPath);
        svgBottom.appendChild(defs);

        contentStar.appendChild(styles);
        contentStar.appendChild(svgTop);
        contentStar.appendChild(svgBottom);
        item.appendChild(contentStar);
    };

    /**
     * @param item
     * @param index
     * @param callback
     */
    StarReating.getPositionCursorInItem = function (item, index, callback) {
        let _self = this;
        document.addEventListener('mousemove', function (event) {
            let position = item.getBoundingClientRect();

            if ((event.clientY >= position.y && event.clientY <= position.y + position.height) && (event.clientX >= position.x && event.clientX <= position.x + position.width)) {
                let cusrsorX = event.clientX - position.x;
                let cursorIndex = Math.ceil(cusrsorX / _self.option.width);
                let width = _self.option.count * _self.option.width;
                let widthByCursor = cursorIndex * _self.option.width;

                let percent = (widthByCursor * 100) / width;
                callback(true, cursorIndex, percent);
            } else {
                let rect = item.querySelector(`.arm-star-reting-progress-star-${index}`);
                rect.setAttribute('width', item.getAttribute('arm-star-data-backup-percent') + '%');
                callback(false);
            }
        }, true);
    };

    /**
     * @param item
     * @param index
     */
    StarReating.addFunctionalInRow = function (item, index) {
        let _self = this;
        
        if (_self.isHover(item)) {
            let itemRowStars = item.querySelector('.arm-star-reting-content-star');

            if (itemRowStars !== null) {
                let rect = item.querySelector(`.arm-star-reting-progress-star-${index}`);

                _self.getPositionCursorInItem(itemRowStars, index, function (bool, staarIndex, percent) {
                    itemRowStars.onmouseover = function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        if (bool) {
                            rect.setAttribute('width', percent + '%');
                        }
                    }

                    if (_self.option.onclick !== null) {
                        itemRowStars.onclick = function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            _self.option.onclick(staarIndex, index);
                        }
                    }
                });
            }
        }
    };

    StarReating.createStar = function () {
        let _self = this;
        let parents = document.querySelectorAll(_self.parent);

        if (parents) {
            parents.forEach((item, index) => {
                _self.createSvg(item, index);
                _self.addFunctionalInRow(item, index);
            });

            _self.starPositionSet();
        }
    };

    /**
     * @type {{observer: null, parent: null, stars: null, option: {subtree: boolean, childList: boolean, attributes: boolean, characterData: boolean}, olderStars: []}}
     */
    StarReating.mutator = {
        option: {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        },
        observer: null,
        stars: null,
        olderStars: [],
        parent: null
    };

    /**
     * @param parent
     */
    StarReating.mutator.setParent = function (parent) {
        this.parent = parent;
    };

    /**
     * @param attr
     * @returns {string}
     */
    StarReating.mutator.attrListString = function (attr) {
        let str = "";
        if (attr.length === 0) {
            return str;
        }

        for (let item of attr) {
            str += `${item.name}: ${item.value}; `;
        }

        return str.trim();
    };

    /**
     * @param node1
     * @param node2
     * @returns {boolean}
     */
    StarReating.mutator.equalsNode = function (node1, node2) {
        let attr1 = node1.attributes;
        let attr2 = node2.attributes;

        let len1 = attr1.length;

        if (len1 !== attr2.length) {
            return false;
        }

        if (this.attrListString(attr1) !== this.attrListString(attr2)) {
            return false;
        }

        return true;
    };

    /**
     * @returns {boolean}
     */
    StarReating.mutator.equals = function () {
        this.stars = document.querySelectorAll(this.parent.parent);

        if (this.stars === null) {
            return false;
        }

        if (this.olderStars.length !== this.stars.length) {
            return false;
        }

        for (let [index, item] of this.stars.entries()) {
            if (!this.equalsNode(item, this.olderStars[index])) {
                return false;
            }
        }

        return true;
    };

    /**
     * @param item
     */
    StarReating.mutator.removeAnotherStars = function (item) {
        while (item.firstChild) {
            item.removeChild(item.firstChild);
        }
    };

    /**
     * @returns {boolean}
     */
    StarReating.mutator.disconnect = function () {
        if (!this.observer) {
            return false;
        }

        this.observer.disconnect();
    };

    /**
     * @param nodeList
     */
    StarReating.mutator.cloneNodeList = function (nodeList) {
        this.olderStars = [];
        nodeList.forEach((item, index) => {
            this.olderStars.push(item.cloneNode(true));
        });
    };

    StarReating.mutator.addStars = function () {
        let stars = document.querySelectorAll(this.parent.parent);

        if (stars !== null) {
            this.stars = stars;
            this.cloneNodeList(stars);
        }
    };

    StarReating.mutator.connect = function () {
        let _self = this;
        _self.observer = new MutationObserver((mutationList, observer) => {
            if (_self.stars && !_self.equals()) {
                _self.disconnect();
                _self.stars.forEach((item, index) => _self.removeAnotherStars(item));
                _self.addStars();
                _self.start();
            }
        });
    };

    StarReating.mutator.start = function () {
        let _self = this;

        if (!_self.observer) {
            _self.connect();
            _self.addStars();
        }

        if (_self.stars.length > 0) {
            _self.stars.forEach((item, index) => {
                _self.parent.createSvg(item, index);
                _self.parent.addFunctionalInRow(item, index);
            });

            _self.parent.starPositionSet();
        }

        if (_self.observer) {
            _self.observer.observe(document, _self.option);
        }
    };

    /**
     * @param parent
     * @param option
     */
    StarReating.run = function (parent, option) {
        this.parent = parent;
        this.option = {
            width: 20,
            onclick: null,
            count: 5,
            strokeWidth: 2,
            stroke: 'rgba(0,0,0,1)',
            starColor: 'rgb(255,200,0)',
            starEmptyColor: '#FFFFFF',
            points: 5
        };

        for (let key in option) {
            this.option[key] = option[key];
        }

        this.createStyle();
        this.mutator.setParent(this);
        this.mutator.start();
    };

    window.StarReating = StarReating;
})();