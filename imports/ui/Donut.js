import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Donut extends Component {

	constructor(props) {
		
		super(props);

		this.state={

		};

	}

	update(props){



	}

	componentDidMount() {

		var width = 300,
		height = 300,
		radius = Math.min(width, height) / 2;

		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var pie = d3.pie()
		.value(function(d) { return d.count; })
		.sort(null);

		var arc = d3.arc()
		.innerRadius(radius - 100)
		.outerRadius(radius - 20);

		var svg = d3.select(this.svg)
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var path = svg.selectAll("path");

		d3.tsv("data.tsv", type, function(error, data) {
		var regionsByFruit = d3.nest()
		  .key(function(d) { return d.fruit; })
		  .entries(data)
		  .reverse();

		var label = d3.selectById(this.props.survey._id).selectAll("label")
		  .data(regionsByFruit)
		.enter().append("label");

		label.append("input")
		  .attr("type", "radio")
		  .attr("name", "fruit")
		  .attr("value", function(d) { return d.key; })
		  .on("change", change)
		.filter(function(d, i) { return !i; })
		  .each(change)
		  .property("checked", true);

		label.append("span")
		  .text(function(d) { return 'pregunta1'; });

		function change(region) {
		var data0 = path.data(),
		    data1 = pie(region.values);

		path = path.data(data1, key);

		path.enter().append("path")
		    .each(function(d, i) { this._current = findNeighborArc(i, data0, data1, key) || d; })
		    .attr("fill", function(d) { return color(d.data.region); })
		  .append("title")
		    .text(function(d) { return d.data.region; });

		path.exit()
		    .datum(function(d, i) { return findNeighborArc(i, data1, data0, key) || d; })
		  .transition()
		    .duration(750)
		    .attrTween("d", arcTween)
		    .remove();

		path.transition()
		    .duration(750)
		    .attrTween("d", arcTween);
		}
		});

		function key(d) {
		  return d.data.region;
		}

		function type(d) {
		  d.count = +d.count;
		  return d;
		}

		function findNeighborArc(i, data0, data1, key) {
		  var d;
		  return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
		      : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
		      : null;
		}

		// Find the element in data0 that joins the highest preceding element in data1.
		function findPreceding(i, data0, data1, key) {
		  var m = data0.length;
		  while (--i >= 0) {
		    var k = key(data1[i]);
		    for (var j = 0; j < m; ++j) {
		      if (key(data0[j]) === k) return data0[j];
		    }
		  }
		}

		// Find the element in data0 that joins the lowest following element in data1.
		function findFollowing(i, data0, data1, key) {
		  var n = data1.length, m = data0.length;
		  while (++i < n) {
		    var k = key(data1[i]);
		    for (var j = 0; j < m; ++j) {
		      if (key(data0[j]) === k) return data0[j];
		    }
		  }
		}

		function arcTween(d) {
		  var i = d3.interpolate(this._current, d);
		  this._current = i(0);
		  return function(t) { return arc(i(t)); };
		}

	}

	render() {

		return (

			<div className="donut" id={this.props.survey._id}>
				
				<svg
					width="300"
					height="300"
					ref = {(svg) => this.svg = svg}
				></svg>

			</div>
		);

	}

}
