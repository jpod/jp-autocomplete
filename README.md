YPing AutoComplete
==================

This is a JQuery autocomplete version similar to ExtJs AutoComplete

How to use ?
------------

    $('#id').yping({
		minchar: 3,
		url: 'url_specified',
		tpl: "<h2><b>${id}</b></h2><h3>${value}</h3>",
		dataPush: { 'per_page':10 },
    	onSelect:function(data){
			$('#id').val(data.id);
			// you can specify other elements
		}
    });

Requirement 
-----------
* [jquery tmpl](http://api.jquery.com/jquery.tmpl/)

Demo
----
* [Demo jQuery Autocomplete] (http://desamedia.com/jp-autocomplete/)

