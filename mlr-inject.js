// Add body class to detect which mailing list archive we're in
//@TODO: Make this a unified query so this works 
//       basically on every mailing list

if(document.location.host == "lists.whatwg.org") {
  document.getElementsByTagName("body")[0].className = "whatwg";
}
else if (document.location.host == "lists.w3.org") {
  document.getElementsByTagName("body")[0].className = "w3c";
}