(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PageManager = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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

            d3.json(pageDataUrl, function (error, pageData) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log(pageData);

                    _this2.pageSections = _this2.pageContainer.selectAll("div.section");

                    _this2.pageSections = _this2.pageSections.data(pageData);

                    _this2.pageSections.enter().append("div").classed("section", true).each(printSectionContent);

                    _this2.pageSections = _this2.pageContainer.selectAll("div.section");
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
                res.push('01-' + y);
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
            this.yearTexts = this.yearAxis.selectAll('g.year');
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
                    dates.push(date.start);dates.push(date.end);
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
                return horizontalScale(ts.scale(d.end));
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
            var yearTextsEnter = this.yearTexts.enter().append('g').classed('year', true);

            yearTextsEnter.append('text');
            yearTextsEnter.append('line');

            this.yearTexts = yearTextsEnter.merge(this.yearTexts).attr('transform', function (d) {
                return 'translate(' + horizontalScale(ts.scale(d)) + ',0)';
            });

            this.yearTexts.select('text').attr('text-anchor', 'middle').style('font-size', padding.bottom / 2 - 2 + 'px').attr('dy', padding.bottom / 2 - 1 + 'px').attr('fill', 'grey').text(function (d) {
                return d.split('-')[1];
            });
            this.yearTexts.select('line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', -(this.height - padding.bottom)).attr('stroke-width', '1px').attr('stroke', 'lightgrey');

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

            var textScale = d3.scaleLinear().domain(d3.extent(data, function (d) {
                return d.size;
            })).range([20, 50]);

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
            }).spiral('rectangular').padding(12).random(function () {
                return 0.5;
            }).on('end', draw).start();

            return this;
        }
    }]);

    return Wordcloud;
}();

exports.default = Wordcloud;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy1zcmMvUGFnZU1hbmFnZXIuanMiLCJqcy1zcmMvdml6L1RpbWVsaW5lLmpzIiwianMtc3JjL3Zpei9Xb3JkY2xvdWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztxakJDQUE7Ozs7QUFJQTs7OztBQUNBOzs7Ozs7OztJQUVNLFc7QUFFRiwyQkFBYTtBQUFBOztBQUNULGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUEsYUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsYUFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0g7Ozs7eUNBRWdCLFcsRUFBWTtBQUN6QixpQkFBSyxhQUFMLEdBQXFCLEdBQUcsTUFBSCxDQUFVLFdBQVYsRUFDaEIsT0FEZ0IsQ0FDUixjQURRLEVBQ1EsSUFEUixDQUFyQjtBQUVBLG1CQUFPLElBQVA7QUFDSDs7O2lDQUVRLFcsRUFBYSxXLEVBQVk7QUFBQTs7QUFFOUIsZUFBRyxJQUFILENBQVEsV0FBUixFQUFxQixVQUFDLEtBQUQsRUFBUSxRQUFSLEVBQXFCO0FBQ3RDLG9CQUFHLEtBQUgsRUFBUztBQUNMLDRCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0gsaUJBRkQsTUFFTztBQUFBO0FBQ0gsOEJBQUssSUFBTCxHQUFZLEdBQUcsTUFBSCxDQUFVLFdBQVYsRUFDUCxPQURPLENBQ0MsVUFERCxFQUNhLElBRGIsRUFFUCxTQUZPLENBRUcsSUFGSCxDQUFaOztBQUlBLDhCQUFLLElBQUwsR0FBWSxNQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsUUFBZixDQUFaOztBQUVBLDhCQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLE1BQWxCLENBQXlCLElBQXpCLEVBQ0ssSUFETCxDQUNVLGFBQUs7QUFBQyxtQ0FBTyxFQUFFLFFBQVQ7QUFBa0IseUJBRGxDLEVBRUssT0FGTCxDQUVhLFFBRmIsRUFFdUIsVUFBQyxD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QWUsQ0FBQyxFQUFFLENBQUgsRUFBTSxFQUFFLENBQVIsQ0FBZixHQUE0QixVQUE1QixHQUF5QyxFQUFFLE1BQTNDLEdBQW9ELEdBQTNEO0FBQWlFLGlCQUozRSxFQUtqQixJQUxpQixDQUtaLGFBTFksRUFLRSxRQUxGO0FBTWxCO0FBTmtCLGlCQU9qQixJQVBpQixDQU9aLFVBQUMsQ0FBRCxFQUFPO0FBQUUsMkJBQU8sRUFBRSxJQUFUO0FBQWdCLGlCQVBiLENBQXRCO0FBUUgsYUFaRDs7QUFjQSxlQUFHLE1BQUgsQ0FBVSxLQUFWLEdBQ0ssSUFETCxDQUNVLENBQUMsS0FBSyxLQUFOLEVBQWEsS0FBSyxNQUFsQixDQURWLEVBRUssS0FGTCxDQUVXLElBRlgsRUFHSyxNQUhMLENBR1ksQ0FIWixFQUlLLFFBSkwsQ0FJYyxhQUFLO0FBQUMsdUJBQU8sVUFBVSxFQUFFLElBQVosQ0FBUDtBQUF5QixhQUo3QyxFQUtLLElBTEwsQ0FLVSxhQUFLO0FBQUMsdUJBQU8sRUFBRSxJQUFUO0FBQWUsYUFML0IsRUFNSyxNQU5MLENBTVksYUFOWixFQU9LLE9BUEwsQ0FPYSxFQVBiLEVBUUssTUFSTCxDQVFZLFlBQU07QUFBQyx1QkFBTyxHQUFQO0FBQVksYUFSL0IsRUFTSyxFQVRMLENBU1EsS0FUUixFQVNlLElBVGYsRUFVSyxLQVZMOztBQVlBLG1CQUFPLElBQVA7QUFDSDs7Ozs7O2tCQWxFZ0IsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgcGllcnJlIG9uIDIzLzExLzE2LlxuICovXG5cbmltcG9ydCBXb3JkY2xvdWQgZnJvbSAnLi92aXovV29yZGNsb3VkJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL3Zpei9UaW1lbGluZSc7XG5cbmNsYXNzIFBhZ2VNYW5hZ2Vye1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy50YWJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhYiA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5wYWdlQ29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYWdlU2VjdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHNldFBhZ2VDb250YWluZXIoc2VsZWN0b3JTdHIpe1xuICAgICAgICB0aGlzLnBhZ2VDb250YWluZXIgPSBkMy5zZWxlY3Qoc2VsZWN0b3JTdHIpXG4gICAgICAgICAgICAuY2xhc3NlZChcInBhZ2UtY29udGVudFwiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW5pdFRhYnMoc2VsZWN0b3JTdHIsIHRhYnNEYXRhVXJsKXtcblxuICAgICAgICBkMy5qc29uKHRhYnNEYXRhVXJsLCAoZXJyb3IsIHRhYnNEYXRhKSA9PiB7XG4gICAgICAgICAgICBpZihlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYnMgPSBkMy5zZWxlY3Qoc2VsZWN0b3JTdHIpXG4gICAgICAgICAgICAgICAgICAgIC5jbGFzc2VkKCduYXYtdGFicycsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2xpJyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRhYnMgPSB0aGlzLnRhYnMuZGF0YSh0YWJzRGF0YSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRhYnMuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAgICAgLnRleHQoZCA9PiB7cmV0dXJuIGQudGFiVGl0bGV9KVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZCgnYWN0aXZlJywgKGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGkgPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRhYiA9IGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludFBhZ2UodGhpcy5zZWxlY3RlZFRhYi5wYWdlRGF0YVVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSAwO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMudGFicyA9IGQzLnNlbGVjdChzZWxlY3RvclN0cikuc2VsZWN0QWxsKCdsaScpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy50YWJzLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQsIGkpe1xuICAgICAgICAgICAgICAgICAgICBpZihkLnRhYlRpdGxlICE9IHRoYXQuc2VsZWN0ZWRUYWIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZFRhYiA9IGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnByaW50UGFnZSh0aGF0LnNlbGVjdGVkVGFiLnBhZ2VEYXRhVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudGFicy5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzZXRQYWdlKCl7XG4gICAgICAgIHRoaXMucGFnZUNvbnRhaW5lci5odG1sKCcnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHJpbnRQYWdlKHBhZ2VEYXRhVXJsKXtcbiAgICAgICAgdGhpcy5yZXNldFBhZ2UoKTtcblxuICAgICAgICAvKlxuICAgICAgICAgICAgdHlwZSBtYXA6XG4gICAgICAgICAgICAgICAgcGFyIC0tPiBwYXJhZ3JhcGhcbiAgICAgICAgICAgICAgICBpbWcgLS0+IGltYWdlXG4gICAgICAgICAgICAgICAgbGkgLS0+IGxpc3RcbiAgICAgICAgICAgICAgICBzdWJzZWMgLS0+IHN1YnNlY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHByaW50Vml6KGVsZW1lbnQsIHZpekRhdGEpe1xuICAgICAgICAgICAgc3dpdGNoKHZpekRhdGEudml6dHlwZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAnd29yZGNsb3VkJzpcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdvcmRjbG91ZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0V2lkdGgodml6RGF0YS53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRIZWlnaHQodml6RGF0YS5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaW5pdChlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1ha2VDbG91ZCh2aXpEYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0aW1lbGluZSc6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBUaW1lbGluZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0V2lkdGgodml6RGF0YS53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRIZWlnaHQodml6RGF0YS5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaW5pdChlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1ha2VMaW5lKHZpekRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVmYXVsdCB2aXpcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJpbnRJdGVtcyhlbGVtZW50LCB0eXBlLCBpdGVtcyl7XG4gICAgICAgICAgICBpZih0eXBlID09IFwibGlzdFwiKXtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdEl0ZW1zID0gZWxlbWVudC5zZWxlY3RBbGwoXCJsaVwiKTtcbiAgICAgICAgICAgICAgICBsaXN0SXRlbXMgPSBsaXN0SXRlbXMuZGF0YShpdGVtcyk7XG4gICAgICAgICAgICAgICAgbGlzdEl0ZW1zLmVudGVyKCkuYXBwZW5kKFwibGlcIilcbiAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGQsIGkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRJdGVtcyhkMy5zZWxlY3QodGhpcyksIFwibGlzdEl0ZW1cIiwgW2RdKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goaXRlbS50eXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwYXJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZChcInBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmh0bWwoaXRlbS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdWJ0aXRsZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKFwicFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZChcInN1YnRpdGxlXCIsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKGl0ZW0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW1nXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoXCJpbWdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzcmNcIiwgaXRlbS5zcmMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiYWx0XCIsIGl0ZW0uYWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ3aWR0aFwiLCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS53aWR0aCAhPSBcIm5vbmVcIil7IHJldHVybiBpdGVtLndpZHRoK1wicHhcIjsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJoZWlnaHRcIiwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0uaGVpZ2h0ICE9IFwibm9uZVwiKXsgcmV0dXJuIGl0ZW0uaGVpZ2h0K1wicHhcIjsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsaVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGUgPT0gXCJsaXN0SXRlbVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoXCJwXCIpLmh0bWwoaXRlbS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpc3QgPSBlbGVtZW50LmFwcGVuZChcInVsXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50SXRlbXMobGlzdCwgXCJsaXN0XCIsIGl0ZW0uaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInN1YnNlY1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdWJzZWMgPSBlbGVtZW50LmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZChcInN1YnNlY3Rpb25cIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2VjLmFwcGVuZChcImgzXCIpLmh0bWwoaXRlbS50aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRJdGVtcyhzdWJzZWMsIFwic3Vic2VjdGlvblwiLCBpdGVtLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ2aXpcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdml6ID0gZWxlbWVudC5hcHBlbmQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRWaXoodml6LCBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmludFNlY3Rpb25Db250ZW50KGQsIGkpIHtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSBzZWN0aW9uLmFwcGVuZChcImgyXCIpO1xuICAgICAgICAgICAgdGl0bGUuYXBwZW5kKCdzcGFuJykuaHRtbChkLnNlY3Rpb25UaXRsZSk7XG4gICAgICAgICAgICBzZWN0aW9uLmFwcGVuZChcImhyXCIpO1xuICAgICAgICAgICAgaWYoZC5leHBhbmRhYmxlKXtcbiAgICAgICAgICAgICAgICBsZXQgaW5uZXJEaXYgPSBzZWN0aW9uLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzZWQoJ2NvbGxhcHNpYmxlJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcHJpbnRJdGVtcyhpbm5lckRpdiwgXCJzZWN0aW9uXCIsIGQuaXRlbXMpO1xuICAgICAgICAgICAgICAgIGxldCBoZWlnaHQgPSBpbm5lckRpdi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmKGQuZXhwYW5kZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZS5jbGFzc2VkKCdleHBhbmRlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpbm5lckRpdi5zdHlsZSgnaGVpZ2h0JywgJzBweCcpLnN0eWxlKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICBpbm5lckRpdi50cmFuc2l0aW9uKCkuZHVyYXRpb24oNDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQrJ3B4JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXYuc3R5bGUoJ2hlaWdodCcsICcwcHgnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGl0bGUuY2xhc3NlZCgnZXhwYW5kYWJsZScsIHRydWUpLm9uKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKGQuZXhwYW5kZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9sZXQgaW5uZXJEaXYgPSBzZWN0aW9uLnNlbGVjdCgnZGl2LmNvbGxhcHNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckRpdi5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnaGVpZ2h0JywgJzBweCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgaW5uZXJEaXYgPSBzZWN0aW9uLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuY2xhc3NlZCgnY29sbGFwc2libGUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByaW50SXRlbXMoaW5uZXJEaXYsIFwic2VjdGlvblwiLCBkLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCBoZWlnaHQgPSBpbm5lckRpdi5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJEaXYuc3R5bGUoJ2hlaWdodCcsICcwcHgnKS5zdHlsZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyRGl2LnRyYW5zaXRpb24oKS5kdXJhdGlvbig0MDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQrJ3B4JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkLmV4cGFuZGVkID0gIWQuZXhwYW5kZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlLmNsYXNzZWQoJ2V4cGFuZGVkJywgZC5leHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByaW50SXRlbXMoc2VjdGlvbiwgXCJzZWN0aW9uXCIsIGQuaXRlbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZDMuanNvbihwYWdlRGF0YVVybCwgKGVycm9yLCBwYWdlRGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGFnZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlU2VjdGlvbnMgPSB0aGlzLnBhZ2VDb250YWluZXIuc2VsZWN0QWxsKFwiZGl2LnNlY3Rpb25cIik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VTZWN0aW9ucyA9IHRoaXMucGFnZVNlY3Rpb25zLmRhdGEocGFnZURhdGEpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlU2VjdGlvbnMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzZWQoXCJzZWN0aW9uXCIsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIC5lYWNoKHByaW50U2VjdGlvbkNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlU2VjdGlvbnMgPSB0aGlzLnBhZ2VDb250YWluZXIuc2VsZWN0QWxsKFwiZGl2LnNlY3Rpb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFnZU1hbmFnZXI7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHBpZXJyZSBvbiAyOC8xMS8xNi5cbiAqL1xuXG5jbGFzcyBUaW1lU2NhbGUge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEpe1xuICAgICAgICB0aGlzLm1pblllYXIgPSBkMy5taW4oZGF0YSwgZCA9PiB7cmV0dXJuIHBhcnNlSW50KGQuc3BsaXQoJy0nKVsxXSl9KTtcbiAgICAgICAgdGhpcy5tYXhZZWFyID0gZDMubWF4KGRhdGEsIGQgPT4ge3JldHVybiBwYXJzZUludChkLnNwbGl0KCctJylbMV0pfSk7XG4gICAgICAgIHRoaXMubWluTW9udGggPSBkMy5taW4oZGF0YSwgZCA9PiB7XG4gICAgICAgICAgICBpZihwYXJzZUludChkLnNwbGl0KCctJylbMV0pID09IHRoaXMubWluWWVhcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGQuc3BsaXQoJy0nKVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1heE1vbnRoID0gZDMubWluKGRhdGEsIGQgPT4ge1xuICAgICAgICAgICAgaWYocGFyc2VJbnQoZC5zcGxpdCgnLScpWzFdKSA9PSB0aGlzLm1heFllYXIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChkLnNwbGl0KCctJylbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBleHRlbmQoKXtcbiAgICAgICAgcmV0dXJuICh0aGlzLm1heFllYXItKHRoaXMubWluWWVhcisxKSkqMTIgKyAxMi10aGlzLm1pbk1vbnRoICsgdGhpcy5tYXhNb250aDtcbiAgICB9XG5cbiAgICBzY2FsZShkYXRlKXtcbiAgICAgICAgbGV0IG0gPSBwYXJzZUludChkYXRlLnNwbGl0KCctJylbMF0pLFxuICAgICAgICAgICAgeSA9IHBhcnNlSW50KGRhdGUuc3BsaXQoJy0nKVsxXSk7XG4gICAgICAgIHJldHVybiAoeS0odGhpcy5taW5ZZWFyKzEpKSoxMiArIDEyLXRoaXMubWluTW9udGggKyBtO1xuICAgIH1cblxuICAgIGdldFllYXJzQXJyYXkoKXtcbiAgICAgICAgbGV0IHJlcyA9IFtdLFxuICAgICAgICAgICAgeSA9IHRoaXMubWluWWVhcisxO1xuICAgICAgICB3aGlsZSh5IDw9IHRoaXMubWF4WWVhcil7XG4gICAgICAgICAgICByZXMucHVzaCgnMDEtJyt5KTtcbiAgICAgICAgICAgIHkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLndpZHRoID0gMjAwO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDEwMDtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnN2ZyA9IG51bGw7XG4gICAgICAgIHRoaXMubGluZXMgPSBudWxsO1xuICAgICAgICB0aGlzLnllYXJBeGlzID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXRXaWR0aCh3KXtcbiAgICAgICAgdGhpcy53aWR0aCA9IE1hdGgubWF4KHcsIDIwMCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldEhlaWdodChoKXtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heChoLCAxMDApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpbml0KGNvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyLmNsYXNzZWQoJ3ZpekNvbXBvbmVudCcsIHRydWUpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMuY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMubGluZXMgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoJ2cubGluZScpO1xuICAgICAgICB0aGlzLnllYXJBeGlzID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgICAgIHRoaXMueWVhclRleHRzID0gdGhpcy55ZWFyQXhpcy5zZWxlY3RBbGwoJ2cueWVhcicpO1xuICAgICAgICB0aGlzLnR5cGVBeGlzID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgICAgIHRoaXMudHlwZVRleHRzID0gdGhpcy50eXBlQXhpcy5zZWxlY3RBbGwoJ3RleHQnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWFrZUxpbmUoZGF0YSl7XG5cbiAgICAgICAgbGV0IHBhZGRpbmcgPSB7dG9wOiAxMCwgYm90dG9tOiAzMCwgbGVmdDogMTUsIHJpZ2h0OjE1fTtcblxuICAgICAgICBsZXQgZGF0ZXMgPSBbXTtcbiAgICAgICAgZGF0YS5mb3JFYWNoKGQgPT4ge2QuZGF0ZXMuZm9yRWFjaChkYXRlID0+IHtkYXRlcy5wdXNoKGRhdGUuc3RhcnQpOyBkYXRlcy5wdXNoKGRhdGUuZW5kKX0pO30pO1xuICAgICAgICBsZXQgdHMgPSBuZXcgVGltZVNjYWxlKGRhdGVzKTtcblxuICAgICAgICBsZXQgdmVydGljYWxTY2FsZSA9IGQzLnNjYWxlUG9pbnQoKVxuICAgICAgICAgICAgLmRvbWFpbihkYXRhLm1hcChkID0+IHtyZXR1cm4gZC50eXBlfSkpXG4gICAgICAgICAgICAucmFuZ2UoW3BhZGRpbmcudG9wLCB0aGlzLmhlaWdodC1wYWRkaW5nLmJvdHRvbV0pXG4gICAgICAgICAgICAucGFkZGluZygwLjUpO1xuXG4gICAgICAgIGxldCBob3Jpem9udGFsU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFswLCB0cy5leHRlbmQoKV0pXG4gICAgICAgICAgICAucmFuZ2UoW3BhZGRpbmcubGVmdCwgdGhpcy53aWR0aC1wYWRkaW5nLnJpZ2h0XSk7XG5cbiAgICAgICAgbGV0IGNvbG9yU2NhbGUgPSBkMy5zY2FsZU9yZGluYWwoKVxuICAgICAgICAgICAgLmRvbWFpbihkYXRhLm1hcChkID0+IHtyZXR1cm4gZC50eXBlfSkpXG4gICAgICAgICAgICAucmFuZ2UoZDMuc2NoZW1lQ2F0ZWdvcnkxMCk7XG5cbiAgICAgICAgdGhpcy5saW5lcyA9IHRoaXMubGluZXMuZGF0YShkYXRhKTtcblxuICAgICAgICB0aGlzLmxpbmVzLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5saW5lcyA9IHRoaXMubGluZXMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ2xpbmUnLCB0cnVlKVxuICAgICAgICAgICAgLm1lcmdlKHRoaXMubGluZXMpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgZCA9PiB7cmV0dXJuICd0cmFuc2xhdGUoMCwnK3ZlcnRpY2FsU2NhbGUoZC50eXBlKSsnKSc7fSlcbiAgICAgICAgICAgIC5vbignbW91c2VvdmVyJywgbGluZUdyb3VwTW91c2VvdmVyQ2FsbGJhY2spXG4gICAgICAgICAgICAub24oJ21vdXNlb3V0JywgbGluZUdyb3VwTW91c2VvdXRDYWxsYmFjayk7XG5cbiAgICAgICAgdGhpcy5saW5lcy5zZWxlY3RBbGwoJ2xpbmUnKVxuICAgICAgICAgICAgLmRhdGEoZCA9PiBkLmRhdGVzKVxuICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoJ2xpbmUnKTtcbiAgICAgICAgdGhpcy5saW5lcy5zZWxlY3RBbGwoJ2xpbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ3gxJywgZCA9PiB7cmV0dXJuIGhvcml6b250YWxTY2FsZSh0cy5zY2FsZShkLnN0YXJ0KSl9KVxuICAgICAgICAgICAgLmF0dHIoJ3gyJywgZCA9PiB7cmV0dXJuIGhvcml6b250YWxTY2FsZSh0cy5zY2FsZShkLmVuZCkpfSlcbiAgICAgICAgICAgIC5hdHRyKCd5MScsIDApXG4gICAgICAgICAgICAuYXR0cigneTInLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICc2cHgnKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsIGZ1bmN0aW9uKCl7cmV0dXJuIGNvbG9yU2NhbGUoZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSkuZGF0dW0oKS50eXBlKX0pXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLWxpbmVjYXAnLCdyb3VuZCcpXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLW9wYWNpdHknLCAwLjcpO1xuXG4gICAgICAgIGxldCB0aXAgPSBkMy50aXAoJ3RpbWVsaW5lVGlwJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd2aXotdG9vbHRpcCcpXG4gICAgICAgICAgICAub2Zmc2V0KFstOCwwXSlcbiAgICAgICAgICAgIC5kaXJlY3Rpb24oJ24nKVxuICAgICAgICAgICAgLmh0bWwoZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICc8Yj4nK2QubmFtZSsnPC9iPjxicj48aT4nK2QubG9jYXRpb24rJzwvaT4nO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3ZnLmNhbGwodGlwKTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5lR3JvdXBNb3VzZW92ZXJDYWxsYmFjayhkLCBpKXtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2xpbmUnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMTBweCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS1vcGFjaXR5JywgMS4wKTtcbiAgICAgICAgICAgIHRpcC5zaG93KGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbGluZUdyb3VwTW91c2VvdXRDYWxsYmFjayhkLCBpKXtcbiAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2xpbmUnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnNnB4JylcbiAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlLW9wYWNpdHknLCAwLjcpO1xuICAgICAgICAgICAgdGlwLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMueWVhckF4aXMuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrKHRoaXMuaGVpZ2h0LXBhZGRpbmcuYm90dG9tKSsnKScpO1xuICAgICAgICB0aGlzLnllYXJUZXh0cyA9IHRoaXMueWVhclRleHRzLmRhdGEodHMuZ2V0WWVhcnNBcnJheSgpLCBkID0+IGQpO1xuICAgICAgICB0aGlzLnllYXJUZXh0cy5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgIGxldCB5ZWFyVGV4dHNFbnRlciA9IHRoaXMueWVhclRleHRzLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgICAgIC5jbGFzc2VkKCd5ZWFyJywgdHJ1ZSk7XG5cbiAgICAgICAgeWVhclRleHRzRW50ZXIuYXBwZW5kKCd0ZXh0Jyk7XG4gICAgICAgIHllYXJUZXh0c0VudGVyLmFwcGVuZCgnbGluZScpO1xuXG4gICAgICAgIHRoaXMueWVhclRleHRzID0geWVhclRleHRzRW50ZXIubWVyZ2UodGhpcy55ZWFyVGV4dHMpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgZCA9PiB7cmV0dXJuICd0cmFuc2xhdGUoJytob3Jpem9udGFsU2NhbGUodHMuc2NhbGUoZCkpKycsMCknfSk7XG5cbiAgICAgICAgdGhpcy55ZWFyVGV4dHMuc2VsZWN0KCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAocGFkZGluZy5ib3R0b20vMi0yKSsncHgnKVxuICAgICAgICAgICAgLmF0dHIoJ2R5JywgKHBhZGRpbmcuYm90dG9tLzItMSkrJ3B4JylcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJ2dyZXknKVxuICAgICAgICAgICAgLnRleHQoZCA9PiB7cmV0dXJuIGQuc3BsaXQoJy0nKVsxXX0pO1xuICAgICAgICB0aGlzLnllYXJUZXh0cy5zZWxlY3QoJ2xpbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ3gxJywgMClcbiAgICAgICAgICAgIC5hdHRyKCd4MicsIDApXG4gICAgICAgICAgICAuYXR0cigneTEnLCAwKVxuICAgICAgICAgICAgLmF0dHIoJ3kyJywgLSh0aGlzLmhlaWdodC1wYWRkaW5nLmJvdHRvbSkpXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJ2xpZ2h0Z3JleScpO1xuXG4gICAgICAgIHRoaXMudHlwZUF4aXMuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrKHRoaXMuaGVpZ2h0LXBhZGRpbmcuYm90dG9tLzIpKycpJyk7XG5cbiAgICAgICAgbGV0IHR5cGVUZXh0SG9yaXpvbnRhbFNjYWxlID0gZDMuc2NhbGVQb2ludCgpXG4gICAgICAgICAgICAuZG9tYWluKGRhdGEubWFwKGQgPT4ge3JldHVybiBkLnR5cGV9KSlcbiAgICAgICAgICAgIC5yYW5nZShbcGFkZGluZy5sZWZ0LCB0aGlzLndpZHRoLXBhZGRpbmcucmlnaHRdKVxuICAgICAgICAgICAgLnBhZGRpbmcoMC41KTtcblxuICAgICAgICB0aGlzLnR5cGVUZXh0cyA9IHRoaXMudHlwZVRleHRzLmRhdGEoZGF0YS5tYXAoZCA9PiB7cmV0dXJuIGQudHlwZX0pLCBkID0+IGQpO1xuICAgICAgICB0aGlzLnR5cGVUZXh0cy5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMudHlwZVRleHRzID0gdGhpcy50eXBlVGV4dHMuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgLm1lcmdlKHRoaXMueWVhclRleHRzKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGQgPT4ge3JldHVybiAndHJhbnNsYXRlKCcrdHlwZVRleHRIb3Jpem9udGFsU2NhbGUoZCkrJywwKSd9KVxuICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIChwYWRkaW5nLmJvdHRvbS8yLTIpKydweCcpXG4gICAgICAgICAgICAuYXR0cignZHknLCAocGFkZGluZy5ib3R0b20vMi0xKSsncHgnKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBkID0+IHtyZXR1cm4gY29sb3JTY2FsZShkKX0pXG4gICAgICAgICAgICAudGV4dChkID0+IGQpXG4gICAgfVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBwaWVycmUgb24gMjgvMTEvMTYuXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29yZGNsb3VkIHtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMud2lkdGggPSAyMDA7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMTAwO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG4gICAgICAgIHRoaXMuc3ZnID0gbnVsbDtcbiAgICAgICAgdGhpcy53b3JkY2xvdWQgPSBudWxsO1xuICAgICAgICB0aGlzLndvcmRjbG91ZFRleHRzID0gbnVsbDtcbiAgICB9XG5cbiAgICBzZXRXaWR0aCh3KXtcbiAgICAgICAgdGhpcy53aWR0aCA9IE1hdGgubWF4KHcsIDIwMCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldEhlaWdodChoKXtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heChoLCAxMDApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpbml0KGNvbnRhaW5lcil7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyLmNsYXNzZWQoJ3ZpekNvbXBvbmVudCcsIHRydWUpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMuY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLndvcmRjbG91ZCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnKyh0aGlzLndpZHRoLzIpKycsJysodGhpcy5oZWlnaHQvMikrJyknKTtcbiAgICAgICAgdGhpcy53b3JkY2xvdWRUZXh0cyA9IHRoaXMud29yZGNsb3VkLnNlbGVjdEFsbCgndGV4dCcpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG1ha2VDbG91ZChkYXRhKXtcblxuICAgICAgICBsZXQgdGV4dFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgICAgLmRvbWFpbihkMy5leHRlbnQoZGF0YSwgZCA9PiB7cmV0dXJuIGQuc2l6ZX0pKVxuICAgICAgICAgICAgLnJhbmdlKFsyMCw1MF0pO1xuXG4gICAgICAgIGxldCBkcmF3ID0gKHdvcmRzKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMud29yZGNsb3VkVGV4dHMgPSB0aGlzLndvcmRjbG91ZFRleHRzLmRhdGEod29yZHMpO1xuICAgICAgICAgICAgdGhpcy53b3JkY2xvdWRUZXh0cy5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLndvcmRjbG91ZFRleHRzID0gdGhpcy53b3JkY2xvdWRUZXh0cy5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAgICAgLm1lcmdlKHRoaXMud29yZGNsb3VkVGV4dHMpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAoZCkgPT4geyByZXR1cm4gZC5zaXplICsgJ3B4JzsgfSlcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoKSA9PiB7IHJldHVybiAnZ3JleSc7IH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkKSA9PiB7IHJldHVybiAndHJhbnNsYXRlKCcgKyBbZC54LCBkLnldICsgJylyb3RhdGUoJyArIGQucm90YXRlICsgJyknOyB9KVxuICAgICAgICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsJ21pZGRsZScpXG4gICAgICAgICAgICAgICAgLy8uc3R5bGUoJ2ZvbnQtd2VpZ2h0JywgJ2JvbGQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KChkKSA9PiB7IHJldHVybiBkLnRleHQ7IH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgZDMubGF5b3V0LmNsb3VkKClcbiAgICAgICAgICAgIC5zaXplKFt0aGlzLndpZHRoLCB0aGlzLmhlaWdodF0pXG4gICAgICAgICAgICAud29yZHMoZGF0YSlcbiAgICAgICAgICAgIC5yb3RhdGUoMClcbiAgICAgICAgICAgIC5mb250U2l6ZShkID0+IHtyZXR1cm4gdGV4dFNjYWxlKGQuc2l6ZSl9KVxuICAgICAgICAgICAgLnRleHQoZCA9PiB7cmV0dXJuIGQudGV4dDt9KVxuICAgICAgICAgICAgLnNwaXJhbCgncmVjdGFuZ3VsYXInKVxuICAgICAgICAgICAgLnBhZGRpbmcoMTIpXG4gICAgICAgICAgICAucmFuZG9tKCgpID0+IHtyZXR1cm4gMC41O30pXG4gICAgICAgICAgICAub24oJ2VuZCcsIGRyYXcpXG4gICAgICAgICAgICAuc3RhcnQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59Il19