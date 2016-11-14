var Handlebars = require('handlebars');
var fs = require('fs');

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
		return elseFn.fn();
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

function helpers (app) {
	Handlebars.registerHelper('dp', decimalPlaceHelper);
	Handlebars.registerHelper('json', jsonHelper);
	Handlebars.registerHelper('addS', addS);
	Handlebars.registerHelper("stripes", stripesHelper);
	Handlebars.registerHelper('select', selectHelper);
	Handlebars.registerHelper('option', optionHelper);

	registerPartials('views/partials');
}

module.exports = helpers;
