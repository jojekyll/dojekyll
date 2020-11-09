/*!
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com/how-to-serialize-form-data-with-vanilla-js/
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 * https://codepen.io/influxweb/pen/ozoYqa
 */

var form = document.getElementById('test-form');

/*
var serialize = function (form) {
	return Array.from(new FormData(form)
		.entries())
		.reduce(function (response, current) {
			response[current[0]] = current[1];
			return response
		}, {})
};
*/

var serialize = function (form) {
	var field,
		l,
		s = [];

	if (typeof form == 'object' && form.nodeName == "FORM") {
		var len = form.elements.length;

		for (var i = 0; i < len; i++) {
			field = form.elements[i];
			if (field.name && !field.disabled && field.type != 'button' && field.type != 'file' && field.type != 'hidden' && field.type != 'reset' && field.type != 'submit') {
				if (field.type == 'select-multiple') {
					l = form.elements[i].options.length;

					for (var j = 0; j < l; j++) {
						if (field.options[j].selected) {
							s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
						}
					}
				}
				else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
					s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
				}
			}
		}
	}
	return s.join('&').replace(/%20/g, '+');
};
function submitFormAjax(data) {
    let xmlhttp= window.XMLHttpRequest ?
        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200)
            alert(this.responseText); // Here is the response
    }

    xmlhttp.open("GET","https://script.google.com/macros/s/AKfycbzvZAQO0sRE6qPuU6kDE1Rb_Gp-2MIoULYhWTBUSprdyG8OJnnz/exec?" + data, true);
    xmlhttp.send();
};

form.addEventListener('submit', function (event) {
	event.preventDefault();
	var data = serialize(form);
	console.log(data);
	submitFormAjax(data)
});