## Reating Star

[LICENSE](LICENSE)

[View Demo](https://amurkhoyetsyan.github.io/stars-reating/)

<br/>

<img src="./src/stars-example.gif" title="stars example" />

<br/>

concat js file

    <script type="text/javascript" src="js/reating-star.js"></script>
    
or

    <script type="text/javascript" src="js/reating-star.min.js"></script>
    
    
### Attribute

| Attribute             | Value         | Type    | Require                 |
|-----------------------|---------------|---------| ----------------------- |
| arm-star-data-percent | 0-100         | Number  |    :heavy_check_mark:   |
| arm-star-is-hover     | true or false | Boolean |    :x:                  |


### Default Options

    {
        width: 15,
        count: 5,
        strokeWidth: 1,
        stroke: 'rgba(0,0,0,1)',
        starColor: 'rgb(255,200,0)',
        starEmptyColor: '#FFFFFF',
        points: 5,
        onclick: function(starIndex, index) {
            console.log('clicked', starIndex, index)
        }
    }


### Example for pure js

    <div class="star-bar" arm-star-data-percent="50" arm-star-is-hover=></div>
    <div class="star-bar" arm-star-data-percent="10" arm-star-is-hover="false"></div>
    <div class="star-bar" arm-star-data-percent="25" arm-star-is-hover="false"></div>
    <div class="star-bar" arm-star-data-percent="100" arm-star-is-hover="true"></div>
    <div class="star-bar" arm-star-data-percent="71" arm-star-is-hover="true"></div>
    <div class="star-bar" arm-star-data-percent="88" arm-star-is-hover="true"></div>
    <div class="star-bar" arm-star-data-percent="37" arm-star-is-hover="true"></div>
    <script src="./js/reating-star.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        StarReating.run('.star-bar', {
            width: 15,
            count: 5,
            strokeWidth: 1,
            stroke: 'rgba(0,0,0,1)',
            starColor: 'rgb(255,200,0)',
            starEmptyColor: '#FFFFFF',
            points: 5,
            onclick: function(starIndex, index) {
                console.log('clicked', starIndex, index)
            }
        });
    </script>
