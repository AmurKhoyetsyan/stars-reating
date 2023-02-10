/**
 * Copyright (c) Amur 2023
 *
 * Reating Stars in pure js
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const StarReating = function (parent, option) {
    this.parent = parent;
    this.option = {
        width: 20,
        onclick: null,
        count: 5,
        stroke: 2,
        points: 5
    };

    for (let key in option) {
        this.option[key] = option[key];
    }
};

StarReating.prototype.createStyle = function () {
    let _self = this;
    let head = document.getElementsByTagName('head');
    let style = document.querySelector('style[arm-star-reting="true"]');
    if (head && !style) {
        let styles = document.createElement('style');
        styles.setAttribute('type', 'text/css');
        styles.innerText = `.arm-star-reting-content-star:hover svg rect {display: none;} .arm-star-reting-content-star,.arm-star-reting-content-star *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0}.arm-star-reting-content-star{width:${_self.option.width * _self.option.count}px;height:${_self.option.width}px}.arm-star-reting-mouse-over{cursor:pointer;}.arm-star-reting-mouse-over.arm-star-overed{cursor:pointer;fill:rgb(255,200,0)}`;
        head[0].appendChild(styles);
    }
};

StarReating.prototype.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

StarReating.prototype.arc = function (x, y, radius, startAngle, endAngle, closeShape) {

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

StarReating.prototype.pie = function (x, y, radius, startAngle, endAngle) {
    return this.arc(x, y, radius, startAngle, endAngle, true);
}

StarReating.prototype.star = function (startX, startY, outerRadius = 10, points = 5) {
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

StarReating.prototype.createSvg = function (item, index) {
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
    rectBottom.setAttribute('fill', 'rgb(255,200,0)');

    let svgTop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgTop.setAttribute('viewBox', `0 0 ${_self.option.width * _self.option.count} ${_self.option.width}`);
    svgTop.setAttribute('height', _self.option.width);
    svgTop.setAttribute('width', '100%');
    svgTop.setAttribute('preserveaspectratio', 'none');
    svgTop.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svgTop.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svgTop.setAttribute('class', 'arm-star-reting-waveform-container');

    svgTop.appendChild(rectTop);
    svgTop.appendChild(rectBottom);

    let contentStar = document.createElement('div');
    contentStar.classList.add(`arm-star-reting-content-star`);

    let styles = document.createElement('style');
    styles.setAttribute('type', 'text/css');
    styles.innerText = `.arm-star-reting-content-star .arm-star-reting-waveform-bg-${index} {-webkit-clip-path:url(#buckets${index});clip-path:url(#buckets${index});fill:#FFFFFF} .arm-star-reting-content-star .arm-star-reting-progress-star-${index} { -webkit-clip-path: url(#buckets${index}); clip-path: url(#buckets${index}); }`

    let svgBottom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBottom.setAttribute('height', 0);
    svgBottom.setAttribute('width', 0);
    svgBottom.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svgBottom.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
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
        return `<path d=${starPath} fill="rgba(255,200,0, 1)" />`;
    }).join('');

    clipPath.innerHTML = mask;

    svgTop.innerHTML = svgTop.innerHTML + buckets.map((bucket, index) => {
        let positionX = index === 0 ? (index + 0.5) * _self.option.width : index * _self.option.width;
        let starPath = _self.star((index + 0.5) * _self.option.width, _self.option.width / 2, _self.option.width / 2, _self.option.points);
        return `<path d=${starPath} fill="none" stroke="rgba(0,0,0,1)" class="arm-star-reting-mouse-over" stroke-width="${_self.option.stroke}" data-index='${index}' />`;
    }).join('');

    defs.appendChild(clipPath);
    svgBottom.appendChild(defs);
    
    contentStar.appendChild(styles);
    contentStar.appendChild(svgTop);
    contentStar.appendChild(svgBottom);
    item.appendChild(contentStar);
};

StarReating.prototype.createStar = function () {
    let _self = this;
    let parents = document.querySelectorAll(_self.parent);

    if (parents) {
        parents.forEach((item, index) => {
            _self.createSvg(item, index);

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
        });
    }
};

StarReating.prototype.run = function () {
    this.createStyle();
    this.createStar();
};