Site Example
======================

Here is the code for the **Input Affix** examples on the [main website](http://lab.jcoc611.com/web/input-affix/). Some of the code has been removed to aid readability. The content of this example assumes that both *jQuery* and *Input Affix* have been included on the head of the page. Additionally, it is recommended to include *bootstrap* (css), which is being used for styling. It's a good idea to open the site and look at the fields as you follow the following example.

# HTML

The markup for the site is very simple:

```html
<input type="text" class="form-control input-sm active" id="test-prefix" value="hashtag">
<input type="text" class="form-control" id="test-suffix" value="100">
<input type="text" class="form-control" id="test-multiple" value="awesome">

<!-- The following is the affix selector below the "multiple" test. -->
<div id="test-multiple-selector" class="multiple">
	<span id="test-multiple-hashtag" class="left active">#</span>
	<span id="test-multiple-amp" class="left">&amp;</span>
	<span id="test-multiple-money" class="left">$</span>
	<span id="test-multiple-excl" class="right active">!</span>
	<span id="test-multiple-degree" class="right">°</span>
	<span id="test-multiple-percent" class="right">%</span>
</div>
```

# The JavaScript

The basic jQuery required in order to get the example working is the following

```javascript
jQuery(function($){
	// Actual Input Affixing
	$("#test-prefix").prefix("#");
	$("#test-suffix").suffix("%");
	$("#test-multiple")
		.prefix(["#", "&", "$"])
		.suffix(["!", "°", "%"]);
	// ... (see below)
});
```

However, there is a few more functions that provide the functionality of being able to select different preffixes and suffixes from the menu below the *multiple* test field. Specifically, there is a few event handlers used whenever the affixes change:

```javascript
// ...
$("#test-multiple").on("prefixchange", function(e, pre, ind){
	var $e;
	// Get the tab element for ind
	switch(ind){
		case 0:
		$e = $("#test-multiple-hashtag");
		break;
		case 1:
		$e = $("#test-multiple-amp");
		break;
		case 2:
		$e = $("#test-multiple-money");
		break;
	}
	// Apply the styling
	$("#test-multiple-selector .left").not($e).removeClass("active");
	$e.addClass("active");
}).on("suffixchange", function(e, suff, ind){
	var $e;
	// Get the tab element for ind
	switch(ind){
		case 0:
		$e = $("#test-multiple-excl");
		break;
		case 1:
		$e = $("#test-multiple-degree");
		break;
		case 2:
		$e = $("#test-multiple-percent");
		break;
	}
	// Apply the styling
	$("#test-multiple-selector .right").not($e).removeClass("active");
	$e.addClass("active");
});
```

Additionally, there is also some code that lets you click on each prefix/suffix button such that it will change on the multiple test field:

```javascript
// Selector handling
$("#test-multiple-hashtag").click(function(){
	$("#test-multiple").prefix(0);
});
$("#test-multiple-amp").click(function(){
	$("#test-multiple").prefix(1);
});
$("#test-multiple-money").click(function(){
	$("#test-multiple").prefix(2);
});
$("#test-multiple-excl").click(function(){
	$("#test-multiple").suffix(0);
});
$("#test-multiple-degree").click(function(){
	$("#test-multiple").suffix(1);
});
$("#test-multiple-percent").click(function(){
	$("#test-multiple").suffix(2);
});
```
