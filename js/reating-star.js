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

    StarReating.createStyle = function () {
        let _self = this;
        let head = document.getElementsByTagName('head');
        let style = document.querySelector('style[arm-star-reting="true"]');
        if (head && !style) {
            let styles = document.createElement('style');
            styles.setAttribute('type', 'text/css');
            styles.innerText = `.arm-star-reting-content-star:hover svg rect {display: none;} .arm-star-reting-content-star,.arm-star-reting-content-star *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0}.arm-star-reting-content-star{width:${_self.option.width * _self.option.count}px;height:${_self.option.width}px}.arm-star-reting-mouse-over{cursor:pointer;}.arm-star-reting-mouse-over.arm-star-overed{cursor:pointer;fill:${_self.option.starColor}}`;
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

        mask = mask + buckets.map((bucket, index) => {
            let positionX = index === 0 ? (index + 0.5) * _self.option.width : index * _self.option.width;
            let starPath = _self.star((index + 0.5) * _self.option.width, _self.option.width / 2, _self.option.width / 2, _self.option.points);
            return `<path d=${starPath} fill="${_self.option.starColor}" />`;
        }).join('');

        clipPath.innerHTML = mask;

        svgTop.innerHTML = svgTop.innerHTML + buckets.map((bucket, index) => {
            let positionX = index === 0 ? (index + 0.5) * _self.option.width : index * _self.option.width;
            let starPath = _self.star((index + 0.5) * _self.option.width, _self.option.width / 2, _self.option.width / 2, _self.option.points);
            return `<path d=${starPath} fill="none" stroke="${_self.option.stroke}" class="arm-star-reting-mouse-over" stroke-width="${_self.option.strokeWidth}" data-index='${index}' />`;
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
     */
    StarReating.addFunctionalInRow = function (item, index) {
        let _self = this;
        let mouseOver = item.querySelectorAll('.arm-star-reting-mouse-over');

        mouseOver.forEach((starItem, starIndex) => {
            starItem.onmouseover = (event) => {
                for (let i = 0; i <= starIndex; i++) {
                    if (!mouseOver.item(i).classList.contains('arm-star-overed')) {
                        mouseOver.item(i).classList.add('arm-star-overed');
                    }
                }
            }

            starItem.onmouseout = (event) => {
                for (let i = 0; i <= starIndex; i++) {
                    if (mouseOver.item(i).classList.contains('arm-star-overed')) {
                        mouseOver.item(i).classList.remove('arm-star-overed');
                    }
                }
            }

            starItem.onclick = (event) => {
                if (_self.option.onclick !== null) {
                    _self.option.onclick(starIndex, index);
                }
            }
        });
    };

    /**
     *
     */
    StarReating.createStar = function () {
        let _self = this;
        let parents = document.querySelectorAll(_self.parent);

        if (parents) {
            parents.forEach((item, index) => {
                _self.createSvg(item, index);
                _self.addFunctionalInRow(item, index);
            });
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

    /**
     *
     */
    StarReating.mutator.addStars = function () {
        let stars = document.querySelectorAll(this.parent.parent);
        this.stars = stars;
        this.cloneNodeList(stars);
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
        if (!this.observer) {
            this.connect();
            this.addStars();
        }

        if (this.stars.length > 0) {
            this.stars.forEach((item, index) => {
                this.parent.createSvg(item, index);
                this.parent.addFunctionalInRow(item, index);
            });
        }

        if (this.observer) {
            this.observer.observe(document, this.option);
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