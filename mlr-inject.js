// Add body class to detect which mailing list archive we're in
//@TODO: Make this a unified query so this works 
//       basically on every mailing list

(function (Showdown) {
	
	var boom = function () {
	 
		[].forEach.call( document.querySelectorAll('[data-markdown]'), function  fn(elem){
console.log(elem.innerHTML, "--------------------------");
			// strip leading whitespace so it isn't evaluated as code
			var text      = elem.innerHTML.replace(/\n\s*\n/g,'\n\n');
			var leadingws = text.match(/^\n?(\s*)/)[1].length;
			var regex     = new RegExp('\\n?\\s{' + leadingws + '}','g');
			var md        = (leadingws > 0) ? text.replace(regex,'\n') : text;


			// fix closing tag on new line, caused by dumb email clients
			md = md.replace(/\n(<\/[^>]+>)/g, '$1\n');
			
			// fix URLs that were converted to <a> by dumb email clients
			md = md.replace(/<a href="([^"]+)">\1<\/a>/g, '$1');

			// convert leading &gt; (entity) to > (literal)
			md = md.replace(/(^|\n)(&gt;\s*)+/g, function(match) {
				// add trailing space to separate <i> injected by  
				// dumb email clients to visualize a repliy-quote
				return match.replace(/&gt;/g, '>') + ' ';
			});

			// fix whatver this is, you need 4 spaces!
			md = md.replace(/\n\s{3}(\S&lt;)/g, '\n    $1');

console.log(md, "--------------------------");
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
		
		var clonedPre = s[i].cloneNode(true);
		while (clonedPre.childNodes.length) {
			contentElement.appendChild(clonedPre.childNodes[0]);
		}

		s[i].parentNode.replaceChild(contentElement, s[i]);

		// $pre.clone().children().appendTo($contentElement)
		// $pre.replaceWith($contentElement);
	}

	boom();
}(Showdown));