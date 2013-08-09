// Add body class to detect which mailing list archive we're in
//@TODO: Make this a unified query so this works
//       basically on every mailing list

;(function() {

	var contentBackup = document.body.innerHTML;

	var boom = function () {

		[].forEach.call( document.querySelectorAll('[data-markdown]'), function  fn(elem){

			// strip leading whitespace so it isn't evaluated as code
			var text      = elem.innerHTML.replace(/\n\s*\n/g,'\n\n');
			var leadingws = text.match(/^\n?(\s*)/)[1].length;
			var regex     = new RegExp('\\n?\\s{' + leadingws + '}','g');
			var md        = (leadingws > 0) ? text.replace(regex,'\n') : text;

			// fix closing tag on new line, caused by dumb email clients
			md = md.replace(/\n(<\/[^>]+>)/g, '$1\n');

			// fix URLs that were converted to <a> by dumb email clients
			// this removes all links and is not used due to that fact
			// md = md.replace(/<a href="([^"]+)">\1<\/a>/g, '$1');

			// convert leading &gt; (entity) to > (literal)
			md = md.replace(/(^|\n)(&gt;\s*)+/g, function(match) {
				// add trailing space to separate <i> injected by
				// dumb email clients to visualize a repliy-quote
				return match.replace(/&gt;/g, '>') + ' ';
			});

			// fix whatver this is, you need 4 spaces!
			md = md.replace(/\n\s{3}(\S&lt;)/g, '\n    $1');

			// Format nested quotes properly regarding Markdown style
			md = md.replace('>>', '> >');

			// Find empty <i> </i> elements to detect quote level changes
			md = md.replace(/<i><\/i>/g, '\n\n');

			// Remove breaks inside of paragraphs
			if ( md.match(/&gt;/gi) !== null ) {

				md = md.replace(/(>*?) <i>(.*?)<\/i>/gim, '$1 $2');
				// @TODO: Try to fix newline >> forcings
			}

			// Load Markdown Converter
			marked.setOptions({
				gfm: true,
				highlight: function (code, lang, callback) {
					pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
						callback(err, result.toString());
					});
				},
				tables: true,
				breaks: true,
				pedantic: false,
				sanitize: false,
				smartLists: true,
				smartypants: false,
				langPrefix: 'lang-'
			});

			// Run Markdown engine
			md = marked(md);

			// Fix line-breaks in blockquotes, should be achieved by line 45
			if ( md.match(/<blockquote>/gi) !== null ) {

				md = md.replace(/<br>/g, ' ');
			}

			// Finally, set new innerHTML content
			elem.innerHTML = md;

			// Define Restore original content button as fallback
			var backupBtnStyle = 'display: block; position: absolute; top: 0; left: 0; padding: 8px; background: #000; color: #fff !important;';

			var createBackupBtn = document.createElement('a');
			createBackupBtn.setAttribute('style',backupBtnStyle);
			createBackupBtn.setAttribute('href','#');
			createBackupBtn.setAttribute('id', 'backupBtn');
			createBackupBtnContent = document.createTextNode('Reset Style');

			createBackupBtn.appendChild(createBackupBtnContent);

			var contentSection = document.querySelector('[data-markdown]');
			document.body.insertBefore(createBackupBtn, contentSection);

			var backupBtnElemSelector = document.getElementById('backupBtn');

			backupBtnElemSelector.addEventListener('click', function() {
				document.body.innerHTML = contentBackup;
			});

	  });
	};

	if(document.location.host == "lists.whatwg.org") {
	  document.getElementsByTagName("body")[0].className = "whatwg";
	}
	else if (document.location.host == "lists.w3.org" || document.location.host == "localhost:8888") {
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
	}

	boom();


}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());