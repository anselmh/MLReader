// Add body class to detect which mailing list archive we're in
//@TODO: Make this a unified query so this works 
//       basically on every mailing list

(function (Showdown) {
	
	var boom = function () {
	 
		[].forEach.call( document.querySelectorAll('[data-markdown]'), function  fn(elem){
		  
			// strip leading whitespace so it isn't evaluated as code
			var text      = elem.innerHTML.replace(/\n\s*\n/g,'\n');
			var leadingws = text.match(/^\n?(\s*)/)[1].length;
			var regex     = new RegExp('\\n?\\s{' + leadingws + '}','g');
			var md        = text.replace(regex,'\n');
			var html      = (new Showdown.converter()).makeHtml(md);
		 
			// here, have sum HTML
			elem.innerHTML = html;
	 
	  });
	 
	};


	if(document.location.host == "lists.whatwg.org") {
	  document.getElementsByTagName("body")[0].className = "whatwg";
	}
	else if (document.location.host == "lists.w3.org") {
	  document.getElementsByTagName("body")[0].className = "w3c";
	}

	var s = document.getElementsByTagName('pre');
	var contentElement;
	var i = 0;
	var nodeLength = s.length;
	
	for (; i < nodeLength; i++) {
		contentElement = document.createElement('div');
		contentElement.className = 'msg';
		contentElement.dataset['markdown'] = '';
		contentElement.innerHTML = s[i].innerHTML;

		s[i].innerHTML = '';
		s[i].insertBefore(contentElement);

	}

	boom();
}(Showdown));