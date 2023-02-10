;(function(){
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function arc(x, y, radius, startAngle, endAngle, closeShape) {

        const fullCircle = endAngle - startAngle === 360;
        const start = polarToCartesian(x, y, radius, endAngle - (fullCircle ? 0.01 : 0));
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            (closeShape && !fullCircle ? (`L ${x} ${y} Z`) : null),
            (fullCircle && !closeShape ? 'Z' : null)
        ].join(" ");
        return d;
    }

    function pie(x, y, radius, startAngle, endAngle) {
        return arc(x, y, radius, startAngle, endAngle, true);
    }

    function star(startX, startY, outerRadius = 10, points = 5) {
        let innerRadius = (outerRadius * 40) / 100;
        const degreeIncrement = 360 / (points * 2);
        const d = new Array(points * 2).fill(0).map((p, i) => {
            let radius = i % 2 == 0 ? outerRadius : innerRadius;
            let degrees = degreeIncrement * i;
            const point = polarToCartesian(startX, startY, radius, degrees);
            return `${point.x},${point.y}`;
        });
        return `M${d}Z`;
    }

    // let showPercent = 0;
    // let max = 95;
    // let container = document.querySelector('.waveform-container');
    // let mask = document.querySelector('#buckets');
    // let conWidth = container.clientWidth;

    // let count = 5;
    // let space = 4;
    // let width = conWidth / count;
    // let height = 28;

    // let buckets = [];

    // for (let i = 0; i < count; i++) {
    //     buckets.push(i);
    // }

    // mask.innerHTML = buckets.map((bucket, index) => {
    //     let positionX = index === 0 ? (index + 0.5) * 20 : index * 20;
    //     let starPath = star((index + 0.5) * 20, 10, 10, 5);
    //     return `<path d=${starPath} fill="rgba(255,200,0, 1)" />`;
    // }).join('');

    // container.innerHTML = container.innerHTML + buckets.map((bucket, index) => {
    //     let positionX = index === 0 ? (index + 0.5) * 20 : index * 20;
    //     let starPath = star((index + 0.5) * 20, 10, 10, 5);
    //     return `<path d=${starPath} fill="none" stroke="rgba(0,0,0,1)" class="mouse-over" strokeWidth="2" data-index='${index}' />`;
    // }).join('');


    // let mouseOver = document.querySelectorAll('.mouse-over');

    // mouseOver.forEach((item, index) => {
    //     item.onmouseover = function (event) {
    //         for (let i = 0; i <= index; i++) {
    //             if (!mouseOver.item(i).classList.contains('overed')) {
    //                 mouseOver.item(i).classList.add('overed');
    //             }
    //         }
    //     }

    //     item.onmouseout = function (event) {
    //         for (let i = 0; i <= index; i++) {
    //             if (mouseOver.item(i).classList.contains('overed')) {
    //                 mouseOver.item(i).classList.remove('overed');
    //             }
    //         }
    //     }

    //     item.onclick = function (event) {
    //         console.log(index + 1);
    //     }
    // });
})();

;(function(){
    const StarReating = function (parent, callback = null) {
        this.parent = parent;
        this.callback = callback;
    };

    StarReating.prototype.createStyle = function () {
        let head = document.getElementsByTagName('head');
        let style = document.querySelector('style[arm-star-reting="true"]');
        if (head && !style) {
            let styles = document.createElement('style');
            styles.setAttribute('type', 'text/css');
            styles.innerText = ".arm-star-reting-content-star,.arm-star-reting-content-star *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0}.arm-star-reting-content-star{width:100%;max-width:100px;height:20px}.arm-star-reting-content-star .arm-star-reting-waveform-bg{-webkit-clip-path:url(#buckets);clip-path:url(#buckets);fill:#FFFFFF}.arm-star-reting-waveform-bg{cursor:pointer}.arm-star-reting-mouse-over.overed{cursor:pointer;fill:rgb(255,200,0)}";
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
        let rectTop = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectTop.setAttribute('height', 20);
        rectTop.setAttribute('width', '100%');
        rectTop.setAttribute('x', 0);
        rectTop.setAttribute('y', 0);
        rectTop.setAttribute('class', 'arm-star-reting-waveform-bg');

        let rectBottom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectBottom.setAttribute('height', 20);
        rectBottom.setAttribute('width', '100%');
        rectBottom.setAttribute('x', 0);
        rectBottom.setAttribute('y', 0);
        rectBottom.setAttribute('class', `.arm-star-reting-progress-star-${index}`);
        rectBottom.setAttribute('fill', 'rgb(255,200,0)');

        let svgTop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgTop.setAttribute('height', 20);
        svgTop.setAttribute('width', 100);
        svgTop.setAttribute('preserveaspectratio', 'none');
        svgTop.setAttribute('viewBox', '0 0 100 20');
        svgTop.setAttribute('xmlns','http://www.w3.org/2000/svg');
        svgTop.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
        svgTop.setAttribute('class', 'arm-star-reting-waveform-container');

        svgTop.appendChild(rectTop);
        svgTop.appendChild(rectBottom);

        let contentStar = document.createElement('div');
        contentStar.classList.add(`arm-star-reting-content-star-${index}`);

        let styles = document.createElement('style');
        styles.setAttribute('type', 'text/css');
        styles.innerText = `.arm-star-reting-content-star-${index} .arm-star-reting-progress-star-${index} { -webkit-clip-path: url(#buckets${index}); clip-path: url(#buckets${index}); }`

        let svgBottom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgBottom.setAttribute('height', 0);
        svgBottom.setAttribute('width', 0);
        svgBottom.setAttribute('xmlns','http://www.w3.org/2000/svg');
        svgBottom.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
        svgBottom.setAttribute('class', 'arm-star-reting-waveform-container');

        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        let clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');

        clipPath.setAttribute('id', `#buckets${index}`);

        let count = 5;
        let space = 4;
        let width = 100 / count;
        let height = 28;

        let buckets = [];

        for (let i = 0; i < count; i++) {
            buckets.push(i);
        }

        // mask.innerHTML = buckets.map((bucket, index) => {
        //     let positionX = index === 0 ? (index + 0.5) * 20 : index * 20;
        //     let starPath = star((index + 0.5) * 20, 10, 10, 5);
        //     return `<path d=${starPath} fill="rgba(255,200,0, 1)" />`;
        // }).join('');

        let content = '';

        content = content + buckets.map((bucket, index) => {
            let positionX = index === 0 ? (index + 0.5) * 20 : index * 20;
            let starPath = this.star((index + 0.5) * 20, 10, 10, 5);
            return `<path d=${starPath} fill="none" stroke="rgba(0,0,0,1)" class="mouse-over" strokeWidth="2" data-index='${index}' />`;
        }).join('');

        clipPath.innerHTML = content;

        defs.appendChild(clipPath);
        svgBottom.appendChild(defs);
        
        contentStar.appendChild(styles);
        contentStar.appendChild(svgTop);
        contentStar.appendChild(svgBottom);
        item.appendChild(contentStar);
    };

    StarReating.prototype.createStar = function () {
        let parents = document.querySelectorAll(this.parent);

        if (parents) {
            parents.forEach((item, index) => {
                this.createSvg(item, index);
            });
        }
    };

    StarReating.prototype.run = function () {
        this.createStyle();
        this.createStar();
    };

    let star = new StarReating('.fff', function(json) {
        console.log('clicked', json)
    });
    star.run();
})();