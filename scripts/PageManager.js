(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PageManager = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by pierre on 23/11/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Wordcloud = require('./viz/Wordcloud');

var _Wordcloud2 = _interopRequireDefault(_Wordcloud);

var _Timeline = require('./viz/Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageManager = function () {
    function PageManager() {
        _classCallCheck(this, PageManager);

        this.tabs = null;
        this.selectedTab = null;

        this.pageContainer = null;
        this.pageSections = null;
    }

    _createClass(PageManager, [{
        key: 'setPageContainer',
        value: function setPageContainer(selectorStr) {
            this.pageContainer = d3.select(selectorStr).classed("page-content", true);
            return this;
        }
    }, {
        key: 'initTabs',
        value: function initTabs(selectorStr, tabsDataUrl) {
            var _this = this;

            d3.json(tabsDataUrl, function (error, tabsData) {
                if (error) {
                    console.log(error);
                } else {
                    (function () {
                        _this.tabs = d3.select(selectorStr).classed('nav-tabs', true).selectAll('li');

                        _this.tabs = _this.tabs.data(tabsData);

                        _this.tabs.enter().append('li').text(function (d) {
                            return d.tabTitle;
                        }).classed('active', function (d, i) {
                            if (i == 0) {
                                _this.selectedTab = d;
                                _this.printPage(_this.selectedTab.pageDataUrl);
                            }
                            return i == 0;
                        });

                        _this.tabs = d3.select(selectorStr).selectAll('li');

                        var that = _this;

                        _this.tabs.on('click', function (d, i) {
                            if (d.tabTitle != that.selectedTab) {
                                that.selectedTab = d;
                                that.printPage(that.selectedTab.pageDataUrl);
                                that.tabs.classed('active', false);
                                d3.select(this).classed('active', true);
                            }
                        });
                    })();
                }
            });
        }
    }, {
        key: 'resetPage',
        value: function resetPage() {
            this.pageContainer.html('');
            return this;
        }
    }, {
        key: 'printPage',
        value: function printPage(pageDataUrl) {
            var _this2 = this;

            this.resetPage();

            /*
                type map:
                    par --> paragraph
                    img --> image
                    li --> list
                    subsec --> subsection
             */
            function printViz(element, vizData) {
                switch (vizData.viztype) {
                    case 'wordcloud':
                        new _Wordcloud2.default().setWidth(vizData.width).setHeight(vizData.height).init(element).makeCloud(vizData.data);
                        break;
                    case 'timeline':
                        new _Timeline2.default().setWidth(vizData.width).setHeight(vizData.height).init(element).makeLine(vizData.data);
                        break;
                    default:
                        console.log("default viz");
                        break;
                }
            }

            function printItems(element, type, items) {
                if (type == "list") {
                    var listItems = element.selectAll("li");
                    listItems = listItems.data(items);
                    listItems.enter().append("li").each(function (d, i) {
                        printItems(d3.select(this), "listItem", [d]);
                    });
                } else {
                    items.forEach(function (item, index) {
                        switch (item.type) {
                            case "par":
                                element.append("p").html(item.text);
                                break;
                            case "subtitle":
                                element.append("p").classed("subtitle", true).html(item.text);
                                break;
                            case "img":
                                element.append("img").attr("src", item.src).attr("alt", item.alt).style("width", function () {
                                    if (item.width != "none") {
                                        return item.width + "px";
                                    }
                                }).style("height", function () {
                                    if (item.height != "none") {
                                        return item.height + "px";
                                    }
                                });
                                break;
                            case "li":
                                if (type == "listItem") {
                                    element.append("p").html(item.text);
                                }
                                var list = element.append("ul");
                                printItems(list, "list", item.items);
                                break;
                            case "subsec":
                                var subsec = element.append("div").classed("subsection", true);
                                subsec.append("h3").html(item.title);
                                printItems(subsec, "subsection", item.items);
                                break;
                            case "viz":
                                var viz = element.append("div");
                                printViz(viz, item);
                                break;
                            default:
                                console.log("default");
                                break;
                        }
                    });
                }
            }

            function printSectionContent(d, i) {
                var section = d3.select(this);

                var title = section.append("h2");
                title.append('span').html(d.sectionTitle);
                section.append("hr");
                if (d.expandable) {
                    (function () {
                        var innerDiv = section.append('div').classed('collapsible', true);
                        printItems(innerDiv, "section", d.items);
                        var height = innerDiv.node().getBoundingClientRect().height;
                        if (d.expanded) {
                            title.classed('expanded', true);
                            innerDiv.style('height', '0px').style('visibility', 'hidden');
                            innerDiv.transition().duration(400).style('height', height + 'px').transition().style('visibility', 'visible');
                        } else {
                            innerDiv.style('height', '0px').style('visibility', 'hidden');
                        }
                        title.classed('expandable', true).on('click', function () {
                            if (d.expanded) {
                                //let innerDiv = section.select('div.collapsible');
                                innerDiv.style('visibility', 'hidden').transition().duration(400).style('height', '0px');
                                //.remove();
                            } else {
                                // let innerDiv = section.append('div')
                                //     .classed('collapsible', true);
                                // printItems(innerDiv, "section", d.items);
                                // let height = innerDiv.node().getBoundingClientRect().height;
                                innerDiv.style('height', '0px').style('visibility', 'hidden');
                                innerDiv.transition().duration(400).style('height', height + 'px').transition().style('visibility', 'visible');
                            }
                            d.expanded = !d.expanded;
                            title.classed('expanded', d.expanded);
                        });
                    })();
                } else {
                    printItems(section, "section", d.items);
                }
            }

            function printList(parent, items) {
                items.forEach(function (d) {
                    var el = parent.append('li');
                    printItem(el, d);
                });
            }

            function printItem(parent, itemData) {
                (function () {
                    switch (itemData.type) {
                        case 'container':
                            var cont = parent.append('div');
                            if (itemData.arrangement === "row") {
                                cont.classed("row", true);
                            }
                            if (itemData.title) {
                                cont.append('h2').html(itemData.title);
                                cont.append('hr');
                            }
                            if (itemData.subtitle) {
                                cont.classed('subsection', true);
                                cont.append('h3').html(itemData.subtitle);
                            }
                            if (itemData.width) {
                                cont.style('max-width', itemData.width);
                            }
                            if (typeof itemData.content === "string") {
                                cont.append("div").html(itemData.content);
                            } else if (_typeof(itemData.content) === "object") {
                                itemData.content.forEach(function (d) {
                                    return printItem(cont, d);
                                });
                            }
                            break;
                        case 'par':
                            parent.append('p').html(itemData.text);
                            break;
                        case 'subtitle':
                            parent.append('p').html(itemData.text).classed('subtitle', true);
                            break;
                        case 'ul':
                            var ul = parent.append('ul');
                            printList(ul, itemData.content);
                            break;
                        case 'ol':
                            var ol = parent.append('ul');
                            printList(ol, itemData.content);
                            break;
                        case 'viz':
                            var viz = parent.append("div");
                            printViz(viz, itemData);
                            break;
                        case "img":
                            parent.append("img").attr("src", itemData.src).attr("alt", itemData.alt).style("width", function () {
                                if (itemData.width) {
                                    return itemData.width + "px";
                                }
                            }).style("height", function () {
                                if (itemData.height) {
                                    return itemData.height + "px";
                                }
                            }).style("border-radius", function () {
                                if (itemData.borderRad) {
                                    return itemData.borderRad + 'px';
                                }
                            });
                            break;
                    }
                })();
            }

            d3.json(pageDataUrl, function (error, pageData) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log(pageData);
                    //
                    // this.pageSections = this.pageContainer.selectAll("div.section");
                    //
                    // this.pageSections = this.pageSections.data(pageData);
                    //
                    // this.pageSections.enter().append("div")
                    //     .classed("section", true)
                    //     .each(printSectionContent);
                    //
                    // this.pageSections = this.pageContainer.selectAll("div.section");

                    printItem(_this2.pageContainer, pageData);
                }
            });
        }
    }]);

    return PageManager;
}();

module.exports = PageManager;

},{"./viz/Timeline":2,"./viz/Wordcloud":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by pierre on 28/11/16.
 */

var TimeScale = function () {
    function TimeScale(data) {
        var _this = this;

        _classCallCheck(this, TimeScale);

        this.minYear = d3.min(data, function (d) {
            return parseInt(d.split('-')[1]);
        });
        this.maxYear = d3.max(data, function (d) {
            return parseInt(d.split('-')[1]);
        });
        this.minMonth = d3.min(data, function (d) {
            if (parseInt(d.split('-')[1]) == _this.minYear) {
                return parseInt(d.split('-')[0]);
            }
        });
        this.maxMonth = d3.min(data, function (d) {
            if (parseInt(d.split('-')[1]) == _this.maxYear) {
                return parseInt(d.split('-')[0]);
            }
        });
    }

    _createClass(TimeScale, [{
        key: 'extend',
        value: function extend() {
            return (this.maxYear - (this.minYear + 1)) * 12 + 12 - this.minMonth + this.maxMonth;
        }
    }, {
        key: 'scale',
        value: function scale(date) {
            var m = parseInt(date.split('-')[0]),
                y = parseInt(date.split('-')[1]);
            return (y - (this.minYear + 1)) * 12 + 12 - this.minMonth + m;
        }
    }, {
        key: 'getYearsArray',
        value: function getYearsArray() {
            var res = [],
                y = this.minYear + 1;
            while (y <= this.maxYear) {
                res.push(y.toString());
                y += 1;
            }
            return res;
        }
    }]);

    return TimeScale;
}();

var Timeline = function () {
    function Timeline() {
        _classCallCheck(this, Timeline);

        this.width = 200;
        this.height = 100;
        this.container = null;
        this.svg = null;
        this.lines = null;
        this.yearAxis = null;
    }

    _createClass(Timeline, [{
        key: 'setWidth',
        value: function setWidth(w) {
            this.width = Math.max(w, 200);
            return this;
        }
    }, {
        key: 'setHeight',
        value: function setHeight(h) {
            this.height = Math.max(h, 100);
            return this;
        }
    }, {
        key: 'init',
        value: function init(container) {
            this.container = container.classed('vizComponent', true);
            this.svg = this.container.append('svg').attr('width', this.width).attr('height', this.height);

            this.lines = this.svg.selectAll('g.line');
            this.yearAxis = this.svg.append('g');
            this.yearTexts = this.yearAxis.selectAll('text.year');
            this.yearLines = this.yearAxis.selectAll('line.year');
            this.typeAxis = this.svg.append('g');
            this.typeTexts = this.typeAxis.selectAll('text');
            return this;
        }
    }, {
        key: 'makeLine',
        value: function makeLine(data) {

            var padding = { top: 10, bottom: 30, left: 15, right: 15 };

            var dates = [];
            data.forEach(function (d) {
                d.dates.forEach(function (date) {
                    dates.push(date.start);
                    if(date.end === 'now'){
                        let today = new Date(),
                            mm = today.getMonth()+1,
                            yyyy = today.getFullYear();
                        if(mm<10){mm = `0${mm}`}
                        return dates.push(`${mm}-${yyyy}`);
                    }else{
                        dates.push(date.end);
                    }
                });
            });
            var ts = new TimeScale(dates);

            var verticalScale = d3.scalePoint().domain(data.map(function (d) {
                return d.type;
            })).range([padding.top, this.height - padding.bottom]).padding(0.5);

            var horizontalScale = d3.scaleLinear().domain([0, ts.extend()]).range([padding.left, this.width - padding.right]);

            var colorScale = d3.scaleOrdinal().domain(data.map(function (d) {
                return d.type;
            })).range(d3.schemeCategory10);

            this.lines = this.lines.data(data);

            this.lines.exit().remove();
            this.lines = this.lines.enter().append('g').classed('line', true).merge(this.lines).attr('transform', function (d) {
                return 'translate(0,' + verticalScale(d.type) + ')';
            }).on('mouseover', lineGroupMouseoverCallback).on('mouseout', lineGroupMouseoutCallback);

            this.lines.selectAll('line').data(function (d) {
                return d.dates;
            }).enter().append('line');
            this.lines.selectAll('line').attr('x1', function (d) {
                return horizontalScale(ts.scale(d.start));
            }).attr('x2', function (d) {
                if(d.end === 'now'){
                    let today = new Date(),
                        mm = today.getMonth()+1,
                        yyyy = today.getFullYear();
                    if(mm<10){mm = `0${mm}`}
                    return horizontalScale(ts.scale(`${mm}-${yyyy}`));
                }else{
                    return horizontalScale(ts.scale(d.end));
                }
            }).attr('y1', 0).attr('y2', 0).attr('stroke-width', '6px').attr('stroke', function () {
                return colorScale(d3.select(this.parentNode).datum().type);
            }).attr('stroke-linecap', 'round').attr('stroke-opacity', 0.7);

            var tip = d3.tip('timelineTip').attr('class', 'viz-tooltip').offset([-8, 0]).direction('n').html(function (d) {
                return '<b>' + d.name + '</b><br><i>' + d.location + '</i>';
            });
            this.svg.call(tip);

            function lineGroupMouseoverCallback(d, i) {
                d3.select(this).selectAll('line').attr('stroke-width', '10px').attr('stroke-opacity', 1.0);
                tip.show(d);
            }

            function lineGroupMouseoutCallback(d, i) {
                d3.select(this).selectAll('line').attr('stroke-width', '6px').attr('stroke-opacity', 0.7);
                tip.hide();
            }

            this.yearAxis.attr('transform', 'translate(0,' + (this.height - padding.bottom) + ')');
            this.yearTexts = this.yearTexts.data(ts.getYearsArray(), function (d) {
                return d;
            });
            this.yearTexts.exit().remove();
            var yearTextsEnter = this.yearTexts.enter().append('text').classed('year', true);

            // yearTextsEnter.append('text');
            // yearTextsEnter.append('line');

            // this.yearTexts = yearTextsEnter.merge(this.yearTexts)
            //     .attr('transform', d => {return `translate(${horizontalScale(ts.scale('07-'+d))},0)`});

            yearTextsEnter //.select('text')
            .attr('text-anchor', 'middle').style('font-size', padding.bottom / 2 - 2 + 'px').attr('dy', (padding.bottom / 2 - 1) / 2 + 'px').attr('fill', 'grey').text(function (d) {
                return d;
            }).attr('transform', function (d) {
                return 'translate(' + horizontalScale(ts.scale('07-' + d)) + ',0)';
            });

            this.yearLines = this.yearLines.data(ts.getYearsArray(), function (d) {
                return d;
            });
            this.yearLines.exit().remove();
            var yearLinesEnter = this.yearLines.enter().append('line').classed('year', true);

            yearLinesEnter //.select('line')
            .attr('transform', function (d) {
                return 'translate(' + horizontalScale(ts.scale('01-' + d)) + ',0)';
            }).attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', -(this.height - padding.bottom)).attr('stroke-width', '1px').attr('stroke', 'lightgrey');

            this.typeAxis.attr('transform', 'translate(0,' + (this.height - padding.bottom / 2) + ')');

            var typeTextHorizontalScale = d3.scalePoint().domain(data.map(function (d) {
                return d.type;
            })).range([padding.left, this.width - padding.right]).padding(0.5);

            this.typeTexts = this.typeTexts.data(data.map(function (d) {
                return d.type;
            }), function (d) {
                return d;
            });
            this.typeTexts.exit().remove();
            this.typeTexts = this.typeTexts.enter().append('text').merge(this.yearTexts).attr('transform', function (d) {
                return 'translate(' + typeTextHorizontalScale(d) + ',0)';
            }).attr('text-anchor', 'middle').style('font-size', padding.bottom / 2 - 2 + 'px').attr('dy', padding.bottom / 2 - 1 + 'px').attr('fill', function (d) {
                return colorScale(d);
            }).text(function (d) {
                return d;
            });
        }
    }]);

    return Timeline;
}();

exports.default = Timeline;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by pierre on 28/11/16.
 */

var Wordcloud = function () {
    function Wordcloud() {
        _classCallCheck(this, Wordcloud);

        this.width = 200;
        this.height = 100;
        this.container = null;
        this.svg = null;
        this.wordcloud = null;
        this.wordcloudTexts = null;
    }

    _createClass(Wordcloud, [{
        key: 'setWidth',
        value: function setWidth(w) {
            this.width = Math.max(w, 200);
            return this;
        }
    }, {
        key: 'setHeight',
        value: function setHeight(h) {
            this.height = Math.max(h, 100);
            return this;
        }
    }, {
        key: 'init',
        value: function init(container) {
            this.container = container.classed('vizComponent', true);
            this.svg = this.container.append('svg').attr('width', this.width).attr('height', this.height);
            this.wordcloud = this.svg.append('g').attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
            this.wordcloudTexts = this.wordcloud.selectAll('text');

            return this;
        }
    }, {
        key: 'makeCloud',
        value: function makeCloud(data) {
            var _this = this;

            var textScale = d3.scaleLinear().domain([1,d3.max(data, function (d) {
                return d.size;
            })]).range([15, 30]);

            var draw = function draw(words) {

                _this.wordcloudTexts = _this.wordcloudTexts.data(words);
                _this.wordcloudTexts.exit().remove();
                _this.wordcloudTexts = _this.wordcloudTexts.enter().append('text').merge(_this.wordcloudTexts).style('font-size', function (d) {
                    return d.size + 'px';
                }).style('fill', function () {
                    return 'grey';
                }).attr('transform', function (d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                }).attr('text-anchor', 'middle')
                //.style('font-weight', 'bold')
                .text(function (d) {
                    return d.text;
                });
            };

            d3.layout.cloud().size([this.width, this.height]).words(data).rotate(0).fontSize(function (d) {
                return textScale(d.size);
            }).text(function (d) {
                return d.text;
            }).spiral('rectangular').padding(8).random(function () {
                return 0.5;
            }).on('end', draw).start();

            var wordcloudBBox = this.wordcloud.node().getBBox();
            var wordcloudCenterX = wordcloudBBox.x + wordcloudBBox.width / 2;
            var wordcloudCenterY = wordcloudBBox.y + wordcloudBBox.height / 2;
            var wordcloudOffsetX = this.width / 2 - wordcloudCenterX;
            var wordcloudOffsetY = this.height / 2 - wordcloudCenterY;

            this.wordcloud.attr('transform', 'translate(' + wordcloudOffsetX + ',\n            ' + wordcloudOffsetY + ')');

            return this;
        }
    }]);

    return Wordcloud;
}();

exports.default = Wordcloud;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy1zcmMvUGFnZU1hbmFnZXIuanMiLCJqcy1zcmMvdml6L1RpbWVsaW5lLmpzIiwianMtc3JjL3Zpei9Xb3JkY2xvdWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O3FqQkNBQTs7OztBQUlBOzs7O0FBQ0E7Ozs7Ozs7O0lBRU0sVztBQUVGLDJCQUFhO0FBQUE7O0FBQ1QsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssV0FBTCxHQUFtQixJQUFuQjs7QUFFQSxhQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxhQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDSDs7Ozt5Q0FFZ0IsVyxFQUFZO0FBQ3pCLGlCQUFLLGFBQUwsR0FBcUIsR0FBRyxNQUFILENBQVUsV0FBVixFQUNoQixPQURnQixDQUNSLGNBRFEsRUFDUSxJQURSLENBQXJCO0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7aUNBRVEsVyxFQUFhLFcsRUFBWTtBQUFBOztBQUU5QixlQUFHLElBQUgsQ0FBUSxXQUFSLEVBQXFCLFVBQUMsS0FBRCxFQUFRLFFBQVIsRUFBcUI7QUFDdEMsb0JBQUcsS0FBSCxFQUFTO0FBQ0wsNEJBQVEsR0FBUixDQUFZLEtBQVo7QUFDSCxpQkFGRCxNQUVPO0FBQUE7QUFDSCw4QkFBSyxJQUFMLEdBQVksR0FBRyxNQUFILENBQVUsV0FBVixFQUNQLE9BRE8sQ0FDQyxVQURELEVBQ2EsSUFEYixFQUVQLFNBRk8sQ0FFRyxJQUZILENBQVo7O0FBSUEsOEJBQUssSUFBTCxHQUFZLE1BQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxRQUFmLENBQVo7O0FBRUEsOEJBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsTUFBbEIsQ0FBeUIsSUFBekIsRUFDSyxJQURMLENBQ1UsYUFBSztBQUFDLG1DQUFPLEVBQUUsUUFBVDtBQUFrQix5QkFEbEMsRUFFSyxPQUZMLENBRWEsUUFGYixFQUV1QixVQUFD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QUFDQSxnQkFBSSxtQkFBbUIsS0FBSyxNQUFMLEdBQVksQ0FBWixHQUFnQixnQkFBdkM7O0FBRUEsaUJBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsV0FBcEIsaUJBQThDLGdCQUE5Qyx1QkFDTSxnQkFETjs7QUFHQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztrQkEzRWdCLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHBpZXJyZSBvbiAyMy8xMS8xNi5cbiAqL1xuXG5pbXBvcnQgV29yZGNsb3VkIGZyb20gJy4vdml6L1dvcmRjbG91ZCc7XG5pbXBvcnQgVGltZWxpbmUgZnJvbSAnLi92aXovVGltZWxpbmUnO1xuXG5jbGFzcyBQYWdlTWFuYWdlcntcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMudGFicyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUYWIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucGFnZUNvbnRhaW5lciA9IG51bGw7XG4gICAgICAgIHRoaXMucGFnZVNlY3Rpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXRQYWdlQ29udGFpbmVyKHNlbGVjdG9yU3RyKXtcbiAgICAgICAgdGhpcy5wYWdlQ29udGFpbmVyID0gZDMuc2VsZWN0KHNlbGVjdG9yU3RyKVxuICAgICAgICAgICAgLmNsYXNzZWQoXCJwYWdlLWNvbnRlbnRcIiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGluaXRUYWJzKHNlbGVjdG9yU3RyLCB0YWJzRGF0YVVybCl7XG5cbiAgICAgICAgZDMuanNvbih0YWJzRGF0YVVybCwgKGVycm9yLCB0YWJzRGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJzID0gZDMuc2VsZWN0KHNlbGVjdG9yU3RyKVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZCgnbmF2LXRhYnMnLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKCdsaScpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzID0gdGhpcy50YWJzLmRhdGEodGFic0RhdGEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGQgPT4ge3JldHVybiBkLnRhYlRpdGxlfSlcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzZWQoJ2FjdGl2ZScsIChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpID09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUYWIgPSBkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRQYWdlKHRoaXMuc2VsZWN0ZWRUYWIucGFnZURhdGFVcmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkgPT0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRhYnMgPSBkMy5zZWxlY3Qoc2VsZWN0b3JTdHIpLnNlbGVjdEFsbCgnbGknKTtcblxuICAgICAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHRoaXMudGFicy5vbignY2xpY2snLCBmdW5jdGlvbihkLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoZC50YWJUaXRsZSAhPSB0aGF0LnNlbGVjdGVkVGFiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRUYWIgPSBkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5wcmludFBhZ2UodGhhdC5zZWxlY3RlZFRhYi5wYWdlRGF0YVVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnRhYnMuY2xhc3NlZCgnYWN0aXZlJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoJ2FjdGl2ZScsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc2V0UGFnZSgpe1xuICAgICAgICB0aGlzLnBhZ2VDb250YWluZXIuaHRtbCgnJyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHByaW50UGFnZShwYWdlRGF0YVVybCl7XG4gICAgICAgIHRoaXMucmVzZXRQYWdlKCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIHR5cGUgbWFwOlxuICAgICAgICAgICAgICAgIHBhciAtLT4gcGFyYWdyYXBoXG4gICAgICAgICAgICAgICAgaW1nIC0tPiBpbWFnZVxuICAgICAgICAgICAgICAgIGxpIC0tPiBsaXN0XG4gICAgICAgICAgICAgICAgc3Vic2VjIC0tPiBzdWJzZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBwcmludFZpeihlbGVtZW50LCB2aXpEYXRhKXtcbiAgICAgICAgICAgIHN3aXRjaCh2aXpEYXRhLnZpenR5cGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dvcmRjbG91ZCc6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBXb3JkY2xvdWQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFdpZHRoKHZpekRhdGEud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SGVpZ2h0KHZpekRhdGEuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmluaXQoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYWtlQ2xvdWQodml6RGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndGltZWxpbmUnOlxuICAgICAgICAgICAgICAgICAgICBuZXcgVGltZWxpbmUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFdpZHRoKHZpekRhdGEud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0SGVpZ2h0KHZpekRhdGEuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmluaXQoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYWtlTGluZSh2aXpEYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlZmF1bHQgdml6XCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHByaW50SXRlbXMoZWxlbWVudCwgdHlwZSwgaXRlbXMpe1xuICAgICAgICAgICAgaWYodHlwZSA9PSBcImxpc3RcIil7XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RJdGVtcyA9IGVsZW1lbnQuc2VsZWN0QWxsKFwibGlcIik7XG4gICAgICAgICAgICAgICAgbGlzdEl0ZW1zID0gbGlzdEl0ZW1zLmRhdGEoaXRlbXMpO1xuICAgICAgICAgICAgICAgIGxpc3RJdGVtcy5lbnRlcigpLmFwcGVuZChcImxpXCIpXG4gICAgICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uIChkLCBpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50SXRlbXMoZDMuc2VsZWN0KHRoaXMpLCBcImxpc3RJdGVtXCIsIFtkXSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKGl0ZW0udHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicGFyXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoXCJwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKGl0ZW0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3VidGl0bGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZChcInBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNsYXNzZWQoXCJzdWJ0aXRsZVwiLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaHRtbChpdGVtLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKFwiaW1nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwic3JjXCIsIGl0ZW0uc3JjKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcImFsdFwiLCBpdGVtLmFsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0ud2lkdGggIT0gXCJub25lXCIpeyByZXR1cm4gaXRlbS53aWR0aCtcInB4XCI7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiaGVpZ2h0XCIsICgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmhlaWdodCAhPSBcIm5vbmVcIil7IHJldHVybiBpdGVtLmhlaWdodCtcInB4XCI7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGlcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlID09IFwibGlzdEl0ZW1cIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKFwicFwiKS5odG1sKGl0ZW0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gZWxlbWVudC5hcHBlbmQoXCJ1bFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludEl0ZW1zKGxpc3QsIFwibGlzdFwiLCBpdGVtLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdWJzZWNcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3Vic2VjID0gZWxlbWVudC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNsYXNzZWQoXCJzdWJzZWN0aW9uXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNlYy5hcHBlbmQoXCJoM1wiKS5odG1sKGl0ZW0udGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50SXRlbXMoc3Vic2VjLCBcInN1YnNlY3Rpb25cIiwgaXRlbS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidml6XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZpeiA9IGVsZW1lbnQuYXBwZW5kKFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50Vml6KHZpeiwgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJpbnRTZWN0aW9uQ29udGVudChkLCBpKSB7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbiA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgICAgICAgICAgbGV0IHRpdGxlID0gc2VjdGlvbi5hcHBlbmQoXCJoMlwiKTtcbiAgICAgICAgICAgIHRpdGxlLmFwcGVuZCgnc3BhbicpLmh0bWwoZC5zZWN0aW9uVGl0bGUpO1xuICAgICAgICAgICAgc2VjdGlvbi5hcHBlbmQoXCJoclwiKTtcbiAgICAgICAgICAgIGlmKGQuZXhwYW5kYWJsZSl7XG4gICAgICAgICAgICAgICAgbGV0IGlubmVyRGl2ID0gc2VjdGlvbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAgIC5jbGFzc2VkKCdjb2xsYXBzaWJsZScsIHRydWUpO1xuICAgICAgICAgICAgICAgIHByaW50SXRlbXMoaW5uZXJEaXYsIFwic2VjdGlvblwiLCBkLml0ZW1zKTtcbiAgICAgICAgICAgICAgICBsZXQgaGVpZ2h0ID0gaW5uZXJEaXYubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICBpZihkLmV4cGFuZGVkKXtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUuY2xhc3NlZCgnZXhwYW5kZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXYuc3R5bGUoJ2hlaWdodCcsICcwcHgnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXYudHJhbnNpdGlvbigpLmR1cmF0aW9uKDQwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0KydweCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyRGl2LnN0eWxlKCdoZWlnaHQnLCAnMHB4Jykuc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpdGxlLmNsYXNzZWQoJ2V4cGFuZGFibGUnLCB0cnVlKS5vbignY2xpY2snLCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICBpZihkLmV4cGFuZGVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGV0IGlubmVyRGl2ID0gc2VjdGlvbi5zZWxlY3QoJ2Rpdi5jb2xsYXBzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXYuc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDQwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2hlaWdodCcsICcwcHgnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IGlubmVyRGl2ID0gc2VjdGlvbi5hcHBlbmQoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmNsYXNzZWQoJ2NvbGxhcHNpYmxlJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcmludEl0ZW1zKGlubmVyRGl2LCBcInNlY3Rpb25cIiwgZC5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgaGVpZ2h0ID0gaW5uZXJEaXYubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyRGl2LnN0eWxlKCdoZWlnaHQnLCAnMHB4Jykuc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckRpdi50cmFuc2l0aW9uKCkuZHVyYXRpb24oNDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0KydweCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZC5leHBhbmRlZCA9ICFkLmV4cGFuZGVkO1xuICAgICAgICAgICAgICAgICAgICB0aXRsZS5jbGFzc2VkKCdleHBhbmRlZCcsIGQuZXhwYW5kZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmludEl0ZW1zKHNlY3Rpb24sIFwic2VjdGlvblwiLCBkLml0ZW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHByaW50TGlzdChwYXJlbnQsIGl0ZW1zKXtcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZD0+e1xuICAgICAgICAgICAgICAgIGxldCBlbCA9IHBhcmVudC5hcHBlbmQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgcHJpbnRJdGVtKGVsLCBkKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmludEl0ZW0ocGFyZW50LCBpdGVtRGF0YSl7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbURhdGEudHlwZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGFpbmVyJzpcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnQgPSBwYXJlbnQuYXBwZW5kKCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbURhdGEuYXJyYW5nZW1lbnQgPT09IFwicm93XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udC5jbGFzc2VkKFwicm93XCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW1EYXRhLnRpdGxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnQuYXBwZW5kKCdoMicpLmh0bWwoaXRlbURhdGEudGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udC5hcHBlbmQoJ2hyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbURhdGEuc3VidGl0bGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udC5jbGFzc2VkKCdzdWJzZWN0aW9uJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250LmFwcGVuZCgnaDMnKS5odG1sKGl0ZW1EYXRhLnN1YnRpdGxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtRGF0YS53aWR0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250LnN0eWxlKCdtYXgtd2lkdGgnLCBpdGVtRGF0YS53aWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGl0ZW1EYXRhLmNvbnRlbnQgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udC5hcHBlbmQoXCJkaXZcIikuaHRtbChpdGVtRGF0YS5jb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBpdGVtRGF0YS5jb250ZW50ID09PSBcIm9iamVjdFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1EYXRhLmNvbnRlbnQuZm9yRWFjaChkPT5wcmludEl0ZW0oY29udCwgZCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3Bhcic6XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmQoJ3AnKS5odG1sKGl0ZW1EYXRhLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzdWJ0aXRsZSc6XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmQoJ3AnKS5odG1sKGl0ZW1EYXRhLnRleHQpLmNsYXNzZWQoJ3N1YnRpdGxlJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VsJzpcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVsID0gcGFyZW50LmFwcGVuZCgndWwnKTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRMaXN0KHVsLCBpdGVtRGF0YS5jb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnb2wnOlxuICAgICAgICAgICAgICAgICAgICBsZXQgb2wgPSBwYXJlbnQuYXBwZW5kKCd1bCcpO1xuICAgICAgICAgICAgICAgICAgICBwcmludExpc3Qob2wsIGl0ZW1EYXRhLmNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd2aXonOlxuICAgICAgICAgICAgICAgICAgICBsZXQgdml6ID0gcGFyZW50LmFwcGVuZChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRWaXoodml6LCBpdGVtRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJpbWdcIjpcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZChcImltZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzcmNcIiwgaXRlbURhdGEuc3JjKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJhbHRcIiwgaXRlbURhdGEuYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtRGF0YS53aWR0aCl7IHJldHVybiBpdGVtRGF0YS53aWR0aCtcInB4XCI7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJoZWlnaHRcIiwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtRGF0YS5oZWlnaHQpeyByZXR1cm4gaXRlbURhdGEuaGVpZ2h0K1wicHhcIjsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImJvcmRlci1yYWRpdXNcIiwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtRGF0YS5ib3JkZXJSYWQpe3JldHVybiBpdGVtRGF0YS5ib3JkZXJSYWQrJ3B4Jzt9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkMy5qc29uKHBhZ2VEYXRhVXJsLCAoZXJyb3IsIHBhZ2VEYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyB0aGlzLnBhZ2VTZWN0aW9ucyA9IHRoaXMucGFnZUNvbnRhaW5lci5zZWxlY3RBbGwoXCJkaXYuc2VjdGlvblwiKTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHRoaXMucGFnZVNlY3Rpb25zID0gdGhpcy5wYWdlU2VjdGlvbnMuZGF0YShwYWdlRGF0YSk7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyB0aGlzLnBhZ2VTZWN0aW9ucy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC8vICAgICAuY2xhc3NlZChcInNlY3Rpb25cIiwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAvLyAgICAgLmVhY2gocHJpbnRTZWN0aW9uQ29udGVudCk7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyB0aGlzLnBhZ2VTZWN0aW9ucyA9IHRoaXMucGFnZUNvbnRhaW5lci5zZWxlY3RBbGwoXCJkaXYuc2VjdGlvblwiKTtcblxuICAgICAgICAgICAgICAgIHByaW50SXRlbSh0aGlzLnBhZ2VDb250YWluZXIsIHBhZ2VEYXRhKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VNYW5hZ2VyOyIsIi8qKlxuICogQ3JlYXRlZCBieSBwaWVycmUgb24gMjgvMTEvMTYuXG4gKi9cblxuY2xhc3MgVGltZVNjYWxlIHtcbiAgICBjb25zdHJ1Y3RvcihkYXRhKXtcbiAgICAgICAgdGhpcy5taW5ZZWFyID0gZDMubWluKGRhdGEsIGQgPT4ge3JldHVybiBwYXJzZUludChkLnNwbGl0KCctJylbMV0pfSk7XG4gICAgICAgIHRoaXMubWF4WWVhciA9IGQzLm1heChkYXRhLCBkID0+IHtyZXR1cm4gcGFyc2VJbnQoZC5zcGxpdCgnLScpWzFdKX0pO1xuICAgICAgICB0aGlzLm1pbk1vbnRoID0gZDMubWluKGRhdGEsIGQgPT4ge1xuICAgICAgICAgICAgaWYocGFyc2VJbnQoZC5zcGxpdCgnLScpWzFdKSA9PSB0aGlzLm1pblllYXIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChkLnNwbGl0KCctJylbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tYXhNb250aCA9IGQzLm1pbihkYXRhLCBkID0+IHtcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGQuc3BsaXQoJy0nKVsxXSkgPT0gdGhpcy5tYXhZZWFyKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoZC5zcGxpdCgnLScpWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXh0ZW5kKCl7XG4gICAgICAgIHJldHVybiAodGhpcy5tYXhZZWFyLSh0aGlzLm1pblllYXIrMSkpKjEyICsgMTItdGhpcy5taW5Nb250aCArIHRoaXMubWF4TW9udGg7XG4gICAgfVxuXG4gICAgc2NhbGUoZGF0ZSl7XG4gICAgICAgIGxldCBtID0gcGFyc2VJbnQoZGF0ZS5zcGxpdCgnLScpWzBdKSxcbiAgICAgICAgICAgIHkgPSBwYXJzZUludChkYXRlLnNwbGl0KCctJylbMV0pO1xuICAgICAgICByZXR1cm4gKHktKHRoaXMubWluWWVhcisxKSkqMTIgKyAxMi10aGlzLm1pbk1vbnRoICsgbTtcbiAgICB9XG5cbiAgICBnZXRZZWFyc0FycmF5KCl7XG4gICAgICAgIGxldCByZXMgPSBbXSxcbiAgICAgICAgICAgIHkgPSB0aGlzLm1pblllYXIrMTtcbiAgICAgICAgd2hpbGUoeSA8PSB0aGlzLm1heFllYXIpe1xuICAgICAgICAgICAgcmVzLnB1c2goeS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDEwMDtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnN2ZyA9IG51bGw7XG4gICAgICAgIHRoaXMubGluZXMgPSBudWxsO1xuICAgICAgICB0aGlzLnllYXJBeGlzID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXRXaWR0aCh3KXtcbiAgICAgICAgdGhpcy53aWR0aCA9IE1hdGgubWF4KHcsIDIwMCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldEhlaWdodChoKXtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heChoLCAxMDApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpbml0KGNvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyLmNsYXNzZWQoJ3ZpekNvbXBvbmVudCcsIHRydWUpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMuY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMubGluZXMgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJ2cubGluZScpO1xuICAgICAgICB0aGlzLnllYXJBeGlzID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgICAgIHRoaXMueWVhclRleHRzID0gdGhpcy55ZWFyQXhpcy5zZWxlY3RBbGwoJ3RleHQueWVhcicpO1xuICAgICAgICB0aGlzLnllYXJMaW5lcyA9IHRoaXMueWVhckF4aXMuc2VsZWN0QWxsKCdsaW5lLnllYXInKTtcbiAgICAgICAgdGhpcy50eXBlQXhpcyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpO1xuICAgICAgICB0aGlzLnR5cGVUZXh0cyA9IHRoaXMudHlwZUF4aXMuc2VsZWN0QWxsKCd0ZXh0Jyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG1ha2VMaW5lKGRhdGEpe1xuXG4gICAgICAgIGxldCBwYWRkaW5nID0ge3RvcDogMTAsIGJvdHRvbTogMzAsIGxlZnQ6IDE1LCByaWdodDoxNX07XG5cbiAgICAgICAgbGV0IGRhdGVzID0gW107XG4gICAgICAgIGRhdGEuZm9yRWFjaChkID0+IHtkLmRhdGVzLmZvckVhY2goZGF0ZSA9PiB7ZGF0ZXMucHVzaChkYXRlLnN0YXJ0KTsgZGF0ZXMucHVzaChkYXRlLmVuZCl9KTt9KTtcbiAgICAgICAgbGV0IHRzID0gbmV3IFRpbWVTY2FsZShkYXRlcyk7XG5cbiAgICAgICAgbGV0IHZlcnRpY2FsU2NhbGUgPSBkMy5zY2FsZVBvaW50KClcbiAgICAgICAgICAgIC5kb21haW4oZGF0YS5tYXAoZCA9PiB7cmV0dXJuIGQudHlwZX0pKVxuICAgICAgICAgICAgLnJhbmdlKFtwYWRkaW5nLnRvcCwgdGhpcy5oZWlnaHQtcGFkZGluZy5ib3R0b21dKVxuICAgICAgICAgICAgLnBhZGRpbmcoMC41KTtcblxuICAgICAgICBsZXQgaG9yaXpvbnRhbFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgLmRvbWFpbihbMCwgdHMuZXh0ZW5kKCldKVxuICAgICAgICAgICAgLnJhbmdlKFtwYWRkaW5nLmxlZnQsIHRoaXMud2lkdGgtcGFkZGluZy5yaWdodF0pO1xuXG4gICAgICAgIGxldCBjb2xvclNjYWxlID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgICAgIC5kb21haW4oZGF0YS5tYXAoZCA9PiB7cmV0dXJuIGQudHlwZX0pKVxuICAgICAgICAgICAgLnJhbmdlKGQzLnNjaGVtZUNhdGVnb3J5MTApO1xuXG4gICAgICAgIHRoaXMubGluZXMgPSB0aGlzLmxpbmVzLmRhdGEoZGF0YSk7XG5cbiAgICAgICAgdGhpcy5saW5lcy5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMubGluZXMgPSB0aGlzLmxpbmVzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCdsaW5lJywgdHJ1ZSlcbiAgICAgICAgICAgIC5tZXJnZSh0aGlzLmxpbmVzKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGQgPT4ge3JldHVybiAndHJhbnNsYXRlKDAsJyt2ZXJ0aWNhbFNjYWxlKGQudHlwZSkrJyknO30pXG4gICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGxpbmVHcm91cE1vdXNlb3ZlckNhbGxiYWNrKVxuICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIGxpbmVHcm91cE1vdXNlb3V0Q2FsbGJhY2spO1xuXG4gICAgICAgIHRoaXMubGluZXMuc2VsZWN0QWxsKCdsaW5lJylcbiAgICAgICAgICAgIC5kYXRhKGQgPT4gZC5kYXRlcylcbiAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKCdsaW5lJyk7XG4gICAgICAgIHRoaXMubGluZXMuc2VsZWN0QWxsKCdsaW5lJylcbiAgICAgICAgICAgIC5hdHRyKCd4MScsIGQgPT4ge3JldHVybiBob3Jpem9udGFsU2NhbGUodHMuc2NhbGUoZC5zdGFydCkpfSlcbiAgICAgICAgICAgIC5hdHRyKCd4MicsIGQgPT4ge3JldHVybiBob3Jpem9udGFsU2NhbGUodHMuc2NhbGUoZC5lbmQpKX0pXG4gICAgICAgICAgICAuYXR0cigneTEnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3kyJywgMClcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnNnB4JylcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCBmdW5jdGlvbigpe3JldHVybiBjb2xvclNjYWxlKGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUpLmRhdHVtKCkudHlwZSl9KVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS1saW5lY2FwJywncm91bmQnKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS1vcGFjaXR5JywgMC43KTtcblxuICAgICAgICBsZXQgdGlwID0gZDMudGlwKCd0aW1lbGluZVRpcCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndml6LXRvb2x0aXAnKVxuICAgICAgICAgICAgLm9mZnNldChbLTgsMF0pXG4gICAgICAgICAgICAuZGlyZWN0aW9uKCduJylcbiAgICAgICAgICAgIC5odG1sKGQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAnPGI+JytkLm5hbWUrJzwvYj48YnI+PGk+JytkLmxvY2F0aW9uKyc8L2k+JztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN2Zy5jYWxsKHRpcCk7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluZUdyb3VwTW91c2VvdmVyQ2FsbGJhY2soZCwgaSl7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCdsaW5lJylcbiAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzEwcHgnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utb3BhY2l0eScsIDEuMCk7XG4gICAgICAgICAgICB0aXAuc2hvdyhkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmVHcm91cE1vdXNlb3V0Q2FsbGJhY2soZCwgaSl7XG4gICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCdsaW5lJylcbiAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzZweCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS1vcGFjaXR5JywgMC43KTtcbiAgICAgICAgICAgIHRpcC5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnllYXJBeGlzLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnKyh0aGlzLmhlaWdodC1wYWRkaW5nLmJvdHRvbSkrJyknKTtcbiAgICAgICAgdGhpcy55ZWFyVGV4dHMgPSB0aGlzLnllYXJUZXh0cy5kYXRhKHRzLmdldFllYXJzQXJyYXkoKSwgZCA9PiBkKTtcbiAgICAgICAgdGhpcy55ZWFyVGV4dHMuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgICBsZXQgeWVhclRleHRzRW50ZXIgPSB0aGlzLnllYXJUZXh0cy5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuY2xhc3NlZCgneWVhcicsIHRydWUpO1xuXG4gICAgICAgIC8vIHllYXJUZXh0c0VudGVyLmFwcGVuZCgndGV4dCcpO1xuICAgICAgICAvLyB5ZWFyVGV4dHNFbnRlci5hcHBlbmQoJ2xpbmUnKTtcblxuICAgICAgICAvLyB0aGlzLnllYXJUZXh0cyA9IHllYXJUZXh0c0VudGVyLm1lcmdlKHRoaXMueWVhclRleHRzKVxuICAgICAgICAvLyAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGQgPT4ge3JldHVybiBgdHJhbnNsYXRlKCR7aG9yaXpvbnRhbFNjYWxlKHRzLnNjYWxlKCcwNy0nK2QpKX0sMClgfSk7XG5cbiAgICAgICAgeWVhclRleHRzRW50ZXIvLy5zZWxlY3QoJ3RleHQnKVxuICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIChwYWRkaW5nLmJvdHRvbS8yLTIpKydweCcpXG4gICAgICAgICAgICAuYXR0cignZHknLCAoKHBhZGRpbmcuYm90dG9tLzItMSkvMikrJ3B4JylcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ2dyZXknKVxuICAgICAgICAgICAgLnRleHQoZCA9PiBkKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGQgPT4ge3JldHVybiBgdHJhbnNsYXRlKCR7aG9yaXpvbnRhbFNjYWxlKHRzLnNjYWxlKCcwNy0nK2QpKX0sMClgfSk7XG5cbiAgICAgICAgdGhpcy55ZWFyTGluZXMgPSB0aGlzLnllYXJMaW5lcy5kYXRhKHRzLmdldFllYXJzQXJyYXkoKSwgZCA9PiBkKTtcbiAgICAgICAgdGhpcy55ZWFyTGluZXMuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgICBsZXQgeWVhckxpbmVzRW50ZXIgPSB0aGlzLnllYXJMaW5lcy5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAgICAgICAuY2xhc3NlZCgneWVhcicsIHRydWUpO1xuXG4gICAgICAgIHllYXJMaW5lc0VudGVyLy8uc2VsZWN0KCdsaW5lJylcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBkID0+IHtyZXR1cm4gYHRyYW5zbGF0ZSgke2hvcml6b250YWxTY2FsZSh0cy5zY2FsZSgnMDEtJytkKSl9LDApYH0pXG4gICAgICAgICAgICAuYXR0cigneDEnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3gyJywgMClcbiAgICAgICAgICAgIC5hdHRyKCd5MScsIDApXG4gICAgICAgICAgICAuYXR0cigneTInLCAtKHRoaXMuaGVpZ2h0LXBhZGRpbmcuYm90dG9tKSlcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCAnbGlnaHRncmV5Jyk7XG5cbiAgICAgICAgdGhpcy50eXBlQXhpcy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJysodGhpcy5oZWlnaHQtcGFkZGluZy5ib3R0b20vMikrJyknKTtcblxuICAgICAgICBsZXQgdHlwZVRleHRIb3Jpem9udGFsU2NhbGUgPSBkMy5zY2FsZVBvaW50KClcbiAgICAgICAgICAgIC5kb21haW4oZGF0YS5tYXAoZCA9PiB7cmV0dXJuIGQudHlwZX0pKVxuICAgICAgICAgICAgLnJhbmdlKFtwYWRkaW5nLmxlZnQsIHRoaXMud2lkdGgtcGFkZGluZy5yaWdodF0pXG4gICAgICAgICAgICAucGFkZGluZygwLjUpO1xuXG4gICAgICAgIHRoaXMudHlwZVRleHRzID0gdGhpcy50eXBlVGV4dHMuZGF0YShkYXRhLm1hcChkID0+IHtyZXR1cm4gZC50eXBlfSksIGQgPT4gZCk7XG4gICAgICAgIHRoaXMudHlwZVRleHRzLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy50eXBlVGV4dHMgPSB0aGlzLnR5cGVUZXh0cy5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAubWVyZ2UodGhpcy55ZWFyVGV4dHMpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgZCA9PiB7cmV0dXJuICd0cmFuc2xhdGUoJyt0eXBlVGV4dEhvcml6b250YWxTY2FsZShkKSsnLDApJ30pXG4gICAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgKHBhZGRpbmcuYm90dG9tLzItMikrJ3B4JylcbiAgICAgICAgICAgIC5hdHRyKCdkeScsIChwYWRkaW5nLmJvdHRvbS8yLTEpKydweCcpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIGQgPT4ge3JldHVybiBjb2xvclNjYWxlKGQpfSlcbiAgICAgICAgICAgIC50ZXh0KGQgPT4gZClcbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHBpZXJyZSBvbiAyOC8xMS8xNi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JkY2xvdWQge1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy53aWR0aCA9IDIwMDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAxMDA7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdmcgPSBudWxsO1xuICAgICAgICB0aGlzLndvcmRjbG91ZCA9IG51bGw7XG4gICAgICAgIHRoaXMud29yZGNsb3VkVGV4dHMgPSBudWxsO1xuICAgIH1cblxuICAgIHNldFdpZHRoKHcpe1xuICAgICAgICB0aGlzLndpZHRoID0gTWF0aC5tYXgodywgMjAwKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0SGVpZ2h0KGgpe1xuICAgICAgICB0aGlzLmhlaWdodCA9IE1hdGgubWF4KGgsIDEwMCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGluaXQoY29udGFpbmVyKXtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXIuY2xhc3NlZCgndml6Q29tcG9uZW50JywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc3ZnID0gdGhpcy5jb250YWluZXIuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy53aWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIHRoaXMud29yZGNsb3VkID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrKHRoaXMud2lkdGgvMikrJywnKyh0aGlzLmhlaWdodC8yKSsnKScpO1xuICAgICAgICB0aGlzLndvcmRjbG91ZFRleHRzID0gdGhpcy53b3JkY2xvdWQuc2VsZWN0QWxsKCd0ZXh0Jyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWFrZUNsb3VkKGRhdGEpe1xuXG4gICAgICAgIGxldCB0ZXh0U2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKGQzLmV4dGVudChkYXRhLCBkID0+IHtyZXR1cm4gZC5zaXplfSkpXG4gICAgICAgICAgICAucmFuZ2UoWzE1LDMwXSk7XG5cbiAgICAgICAgbGV0IGRyYXcgPSAod29yZHMpID0+IHtcblxuICAgICAgICAgICAgdGhpcy53b3JkY2xvdWRUZXh0cyA9IHRoaXMud29yZGNsb3VkVGV4dHMuZGF0YSh3b3Jkcyk7XG4gICAgICAgICAgICB0aGlzLndvcmRjbG91ZFRleHRzLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMud29yZGNsb3VkVGV4dHMgPSB0aGlzLndvcmRjbG91ZFRleHRzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAubWVyZ2UodGhpcy53b3JkY2xvdWRUZXh0cylcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIChkKSA9PiB7IHJldHVybiBkLnNpemUgKyAncHgnOyB9KVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsICgpID0+IHsgcmV0dXJuICdncmV5JzsgfSlcbiAgICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQpID0+IHsgcmV0dXJuICd0cmFuc2xhdGUoJyArIFtkLngsIGQueV0gKyAnKXJvdGF0ZSgnICsgZC5yb3RhdGUgKyAnKSc7IH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywnbWlkZGxlJylcbiAgICAgICAgICAgICAgICAvLy5zdHlsZSgnZm9udC13ZWlnaHQnLCAnYm9sZCcpXG4gICAgICAgICAgICAgICAgLnRleHQoKGQpID0+IHsgcmV0dXJuIGQudGV4dDsgfSlcbiAgICAgICAgfTtcblxuICAgICAgICBkMy5sYXlvdXQuY2xvdWQoKVxuICAgICAgICAgICAgLnNpemUoW3RoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XSlcbiAgICAgICAgICAgIC53b3JkcyhkYXRhKVxuICAgICAgICAgICAgLnJvdGF0ZSgwKVxuICAgICAgICAgICAgLmZvbnRTaXplKGQgPT4ge3JldHVybiB0ZXh0U2NhbGUoZC5zaXplKX0pXG4gICAgICAgICAgICAudGV4dChkID0+IHtyZXR1cm4gZC50ZXh0O30pXG4gICAgICAgICAgICAuc3BpcmFsKCdyZWN0YW5ndWxhcicpXG4gICAgICAgICAgICAucGFkZGluZyg4KVxuICAgICAgICAgICAgLnJhbmRvbSgoKSA9PiB7cmV0dXJuIDAuNTt9KVxuICAgICAgICAgICAgLm9uKCdlbmQnLCBkcmF3KVxuICAgICAgICAgICAgLnN0YXJ0KCk7XG5cbiAgICAgICAgbGV0IHdvcmRjbG91ZEJCb3ggPSB0aGlzLndvcmRjbG91ZC5ub2RlKCkuZ2V0QkJveCgpO1xuICAgICAgICBsZXQgd29yZGNsb3VkQ2VudGVyWCA9IHdvcmRjbG91ZEJCb3gueCArIHdvcmRjbG91ZEJCb3gud2lkdGgvMjtcbiAgICAgICAgbGV0IHdvcmRjbG91ZENlbnRlclkgPSB3b3JkY2xvdWRCQm94LnkgKyB3b3JkY2xvdWRCQm94LmhlaWdodC8yO1xuICAgICAgICBsZXQgd29yZGNsb3VkT2Zmc2V0WCA9IHRoaXMud2lkdGgvMiAtIHdvcmRjbG91ZENlbnRlclg7XG4gICAgICAgIGxldCB3b3JkY2xvdWRPZmZzZXRZID0gdGhpcy5oZWlnaHQvMiAtIHdvcmRjbG91ZENlbnRlclk7XG5cbiAgICAgICAgdGhpcy53b3JkY2xvdWQuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3dvcmRjbG91ZE9mZnNldFh9LFxuICAgICAgICAgICAgJHt3b3JkY2xvdWRPZmZzZXRZfSlgKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59Il19
