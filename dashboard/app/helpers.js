var Handlebars = require('handlebars');
var fs = require('fs');
var stripAnsi = require('strip-ansi');

function readFile (path) {
	return fs.readFileSync(path, 'utf8');
}

function jsonHelper(obj) {
	return JSON.stringify(obj);
}

function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);

	return Math.round(value * multiplier) / multiplier;
}

function decimalPlaceHelper(value) {
	return round(value, 1);
}

function addS(value) {
	if (value > 1) {
		return 's';
	}
	return '';
}

function stripesHelper(array, even, odd, fn, elseFn) {
	if (array && array.length > 0) {
		var buffer = "";
		for (var i = 0, j = array.length; i < j; i++) {
			var item = array[i];

			item.stripeClass = (i % 2 == 0 ? even : odd);

			buffer += fn.fn(item);
		}

		return buffer;
	}
	else {
		if (elseFn && elseFn.fn) {
			return elseFn.fn();
		}
	}
}

function registerPartials(partialsDir) {
	var filenames = fs.readdirSync(partialsDir);

	filenames.forEach(function (filename) {
		var matches = /^([^.]+).html$/.exec(filename);
		if (!matches) {
			return;
		}
		var name = matches[1];
		var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');

		Handlebars.registerPartial(name, template);
	});
}

function selectHelper (selected, options) {
	var innerBlock = options.fn(this);

	return innerBlock.replace(
		new RegExp(' value=\"' + selected + '\"'),
		'$& selected="selected"');
}

function optionHelper (value) {
	var selected = value === (this._id.toString()) ? 'selected="selected"' : '';
	return '<option value="' + this._id + '" ' + selected + '>' + this.name + '</option>';
}

function ansi (value) {
	return stripAnsi(value).replace('\r', '<br/>');
}

function helpers (app) {
	Handlebars.registerHelper('dp', decimalPlaceHelper);
	Handlebars.registerHelper('json', jsonHelper);
	Handlebars.registerHelper('addS', addS);
	Handlebars.registerHelper("stripes", stripesHelper);
	Handlebars.registerHelper('select', selectHelper);
	Handlebars.registerHelper('option', optionHelper);
	Handlebars.registerHelper('ansi', ansi);

	Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

		if (arguments.length < 3)
			throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

		var operator = options.hash.operator || "==";

		var operators = {
			'==':       function(l,r) { return l == r; },
			'===':      function(l,r) { return l === r; },
			'!=':       function(l,r) { return l != r; },
			'<':        function(l,r) { return l < r; },
			'>':        function(l,r) { return l > r; },
			'<=':       function(l,r) { return l <= r; },
			'>=':       function(l,r) { return l >= r; },
			'typeof':   function(l,r) { return typeof l == r; }
		}

		if (!operators[operator])
			throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

		var result = operators[operator](lvalue,rvalue);

		if( result ) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}

	});

	registerPartials('views/partials');
}

module.exports = helpers;
