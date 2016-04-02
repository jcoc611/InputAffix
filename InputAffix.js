"use strict";
// Created by Juan Camilo Osorio (JCOC611 - jcoc611.com).
// Version 1.1.1. (Beta, stable).
// Consider giving back by sharing your own code!
// Licensed under the MIT License. 
// http://www.opensource.org/licenses/mit-license.php

// Includes jQuery Caret v1.0.2
// Slightly modified by JCOC611.
// Created by C. F., Wong, and also licensed
// under the MIT License. Find his project here:
// https://code.google.com/p/jcaret/ 

(function($) {
	if(!$) throw new Error("Input Affix: no jQuery found. Make sure window.jQuery exists.");
	// Functions
	// Caret from Wong's code.
	$.fn.caret = function(options, opt2) {
		/* (*) -> object
		
		Return new object that contains:
			- start: the start index of the current selection.
			- end: the end index of the current selection.
			- text: the text contained within the selection.

		Overloads:
		(object) -> object
			Set the current browser selection to this element, starting at
			options.start and ending at options.end.
		(int, int) -> object
			Set the current browser selection to this element, starting at
			options, and ending at opt2.
		(str) -> object
			Set the current browser selection to this element, containing
			the first instance of the string options.
		(regexp) -> object
			Set the current browser selection to this element, containing
			the first instance matched by the regular expression options.
		() -> object
			Do nothing but return the object described above.

		Most comments and some slight edits were made by JCOC611.
		Credit goes to C. F., Wong.

		*/

		var start, end, t = this[0];
		// For overloading.
		// .caret({start:..., end:...})
		//      or ({start ...})
		if (typeof options === "object" && typeof options.start === "number") {
			start = options.start;
			if(typeof options.end === "number") end = options.end;
			else end = options.start;
		// .caret(start, end)
		//      or (start)
		} else if (typeof options === "number") {
			start = options;
			if(typeof opt2 === "number") end = opt2;
			else end = start;
		// .caret("str")
		} else if (typeof options === "string") {
			if ((start = t.value.indexOf(options)) > -1) end = start + options.length;
			else start = null;
		// .caret(/regex/)
		} else if (Object.prototype.toString.call(options) === "[object RegExp]") {
			var re = options.exec(t.value);
			if (re != null) {
				start = re.index;
				end = start + re[0].length;
			}
		}

		// Overload for .caret(...) called with new selection information.
		if (typeof start != "undefined") {
			// For compatibility.
			if (t.createTextRange) {
				var selRange = t.createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end - start);
				selRange.select();
			} else {
				t.selectionStart = start;
				t.selectionEnd = end;
			}
			t.focus();
			return this
		// Overload for .caret(), with no arguments.
		} else {
			// Modification as suggested by Андрей Юткин
			if(document.selection){
				var selection = document.selection;
				if (t.tagName.toLowerCase() != "textarea") {
					var val = this.val(),
						range = selection["createRange"]()["duplicate"]();

					range.moveEnd("character", val.length);

					var s = (range.text == "" ? val.length : val.lastIndexOf(range.text));

					range = selection["createRange"]()["duplicate"]();
					range.moveStart("character", -val.length);

					var e = range.text.length;
				} else {
					var range = selection["createRange"](),
						stored_range = range["duplicate"]();

					stored_range.moveToElementText(t);
					stored_range.setEndPoint('EndToEnd', range);


					var s = stored_range.text.length - range.text.length,
						e = s + range.text.length
				}
				// End of Modification
			} else {
				var s = t.selectionStart,
					e = t.selectionEnd;
			}
			// Substring text.
			var te = t.value.substring(s, e);
			// Return usable object
			return {
				start: s,
				end: e,
				text: te,
				replace: function(st) {
					return t.value.substring(0, s) + st + t.value.substring(e, t.value.length)
				}
			}
		}
	}
	$.fn.affixValue = function(val){
		/* (str) -> jQuery Object
		
		Set the value property of this object to val, taking care
		of adding the appropriate prefixes and suffixes if necessary.
		Mostly just a wrapper function for .val() that doesn't break
		Input Affix.

		Return the jQuery object.

		>>> $("#example").prefix("Yeah, ");
		>>> $("#example").suffix("!");
		>>> $("#example").affixValue("this works");
		>>> $("#example").val();
		"Yeah, this works!"

		*/

		// Overload for .affixValue(), with no arguments.
		if(val === undefined){
			// Get current value
			val = this.val();

			var prefix = this.data("prefix"),
				suffix = this.data("suffix");

			// Remove prefix if necessary
			if(prefix && val.substr(0, prefix.length) == prefix)
				val = val.substr(prefix.length);
			// Remove suffix if necessary
			if(suffix && val.substr(val.length - suffix.length) == suffix)
				val = val.substr(0, val.length - suffix.length);

			// Return inner value
			return val;
		}
		
		val += "";

		// Overload for .affixValue(val)
		// Add the prefix if necessary
		if(this.data("prefix")) val = this.data("prefix") + val;

		// Add the suffix if necessary
		if(this.data("suffix")) val += this.data("suffix");

		// Set the value
		this.val(val);

		// Return jQuery object.
		return this;
	};
	$.fn.prefix = function(pre, index){
		/* (* [, int]) -> *

		Functionality depends on the arguments,
		take a look at the following:

		Overloads:
		() -> str
			Return the current prefix.

			>>> $("#example").prefix("hello");
			>>> $("#example").prefix();
			"hello"

		(str) -> jQuery Object
			Set the current prefix to pre.
			Return jQuery element.

			>>> $("#example").prefix("hello");
			$("#example")

		(array [, int]) -> jQuery Object
			Set the current prefix to the string
			given by pre[index] if index was set, or
			pre[0] otherwise. Set the current prefix list
			to pre.
			Return jQuery element.

			>>> $("#example").prefix(["hi", "there"], 1);
			$("#example")
			>>> $("#example").prefix();
			"there"

		(int) -> jQuery Object
			Precondition: .prefix([...]) was called
			previous to the execution of .prefix(int),
			such that prefix list is set.

			Set the current prefix to the string located
			at the index pre of the array previously set
			by .prefix([...]).
			Return jQuery element.

			>>> $("#example").prefix(["zero", "one", "two"]);
			>>> $("#example").prefix(1);
			>>> $("#example").prefix();
			"one"

		*/

		// Overload for .prefix(), called with no arguments
		if(pre === undefined) return this.data("prefix");

		var val = this.val(), prefix = this.data("prefix");

		// Remove previous prefix (if it's there)
		if(prefix && val.substr(0, prefix.length) == prefix){
			this.val(val.substr(prefix.length, val.length - prefix.length));
			val = this.val();
		}

		// Overload for .prefix([...], index), an array of prefixes.
		if(typeof(pre) == "object"){
			this.data("prefix-list", pre);
			index = index || 0;
			pre = pre[index];
		// Overload for .prefix(number).
		}else if(typeof(pre) == "number" && this.data("prefix-list")){
			index = pre;
			pre = this.data("prefix-list")[index];
		// Restore prefix-list
		}else this.data("prefix-list", false);

		// Set new prefix data
		this.data("prefix", pre);
		this.data("prefixQueue", 0);
		this.trigger("prefixchange", [pre, index || 0]);

		// Allow placeholder if no value
		// Add prefix if it's not already there
		if(!(this.affixValue() == "" && this.attr("placeholder")) && val.indexOf(pre) != 0){
			this.val(pre + this.val());
		}

		// Set event handlers
		this.on("keypress", function(e){
			var t = $(this),
				caret = t.caret(),
				prefix = t.data("prefix"),
				val = t.val();
			// Ignore specials
			if(e.ctrlKey) return;
			// Caret position fix
			if(caret.start < prefix.length){
				var prefixList = t.data("prefix-list"),
					input = String.fromCharCode(e.which);
				// If a prefix list was used, update current prefix if necessary.
				if(prefixList && caret.start == 0){
					for(var z = 0; z < prefixList.length; z++){
						if(prefixList[z].substr(0, 1) == input){
							t.prefix(z);
							var newPrefix = t.prefix();
							t.caret({	 start: 1 });
							e.preventDefault();
							return;
						}
					}
				}
				// Allow to change prefix if a list is used
				if(prefixList && val.substr(0, pre.length) != pre) return;

				var prefixQueue = t.data("prefixQueue");
				if(caret.start == caret.end && prefix.substr(caret.start, 1) == input){
					t.caret(caret.start);
					t.data("prefixQueue", caret.start + 1);
					e.preventDefault();
				}else if(caret.start != caret.end && prefix.substr(caret.start, 1) == input){
					var newVal = prefix + val.substr(caret.end);
					if(t.data("suffix")){
						newVal += t.data("suffix");
					}
					t.val(newVal);
					t.caret(caret.start + 1);
					e.preventDefault();
				}else{
					if(caret.start == caret.end && prefixQueue == caret.start){
						var start = caret.start + prefix.length;

						t.val(prefix + val.substr(0, caret.start) + input + val.substr(prefix.length));
						t.caret(start+1);
						t.data("prefixQueue", 0);
						e.preventDefault();
					}else{
						t.caret({ start: prefix.length, end: Math.max(caret.end, prefix.length) });
					}
				}
			}
		}).on("keydown", function(e){
			var $t = $(this),
				caret = $t.caret(),
				prefix = $t.data("prefix");
			// Backspace & delete fix 
			if(e.which == 8 || e.which == 46){
				// Allow for backspace & delete if prefix list is used
				if($t.data("prefix-list")) return;

				// Else prevent it:
				// Backspace on prefix
				// if(e.which == 8 && caret.start <= prefix.length && caret.start == caret.end) e.preventDefault();
				if(e.which == 8 && caret.end <= prefix.length){
					$t.caret(prefix.length);
					e.preventDefault();
				}else if(caret.end < prefix.length){
					$t.caret(prefix.length);
				}else if(caret.start < prefix.length){
					$t.caret({ start:prefix.length, end:caret.end });
				}
				
			// Paste fix position
			}else if(e.which == 86 && e.ctrlKey){
				// If prefix list is used, do nothing weird
				if($t.data("prefix-list")) return;
				// Handle caret positions
				if(caret.start < prefix.length){
					var end = caret.end;
					if(end < prefix.length) end += prefix.length;
					$t.caret({start:prefix.length, end:end});
				}
			// Home/start fix
			}else if(e.which == 36 && e.ctrlKey){
				if(e.shiftKey) $t.caret({start:prefix.length, end:Math.max(caret.start, prefix.length)});
				else $t.caret({start:prefix.length, end:prefix.length});
				e.preventDefault();
			}
		}).on("paste", function(e){
			// Fixes some pasting issues.
			// Works with context menu too.
			var t = $(this);

			// Set timeout hack to skip call stack.
			setTimeout(function(){
				// Set local vars.
				var prefix = t.data("prefix"),
					caret = t.caret(),
					val = t.val(),
					end = caret.end;

				// If prefix list was used, compute new prefix
				if(t.data("prefix-list")){
					var prefixList = t.data("prefix-list");
					for(var z = 0; z < prefixList.length; z++){
						if(val.substr(0, prefixList[z].length) == prefixList[z]){
							prefix = prefixList[z];
							t.data("prefix", prefix);
							t.trigger("prefixchange", [prefix, z]);
							break;
						}
					}
				}

				// If a paste deletes the prefix, add it again.
				if(val.substr(0, prefix.length) != prefix){
					val = prefix + val;
					end += prefix.length;
				}

				// More vars
				var body = val.substr(prefix.length),
					nbody = body;

				// Delete repeated prefix from body
				for(var z = prefix.length - 1; z >= 0; z--){
					if(body.substr(0, z + 1) == prefix.substr((prefix.length - 1) - z)){
						nbody = nbody.substr(z + 1);
						break;
					}
				}

				// Set the final value and caret pos.
				t.val(prefix + nbody);
				t.caret({
					start: end,
					end: end
				});

				// Prevent default paste.
				e.preventDefault();
			});
		}).on("change", function(e){
			// If prefix is lost in input, re-add it.
			var prefix = $(this).data("prefix"),
				// caret = $(this).caret(),
				val = $(this).val();
				// end = caret.end;

			if(val.substr(0, prefix.length) != prefix){
				val = prefix + val;
				$(this).val(val);
			}
		}).on("blur", function(e){
			var prefixList = $(this).data("prefix-list");
			var prefix = $(this).data("prefix"),
				val = $(this).val();

			// If prefix list was used, check if prefix changed
			if(prefixList && val.substr(0, prefix.length) != prefix){
				// If new prefix is in prefix list...
				for(var z = 0; z < prefixList.length; z++){
					if(val.substr(0, prefixList[z].length) == prefixList[z]){
						$(this).prefix(z);
						return;
					}
				}
				// Else readd original prefix
				val = prefix + val;
				$(this).val(val);
			}
			// If input has placeholder and is empty
			// show placeholder
			if($(this).affixValue() == "" && $(this).attr("placeholder")){
				$(this).val("");
			}
		}).on("focus", function(e){
			var val = $(this).affixValue();
			if(val == ""){
				$(this).affixValue("");
			}
		});
		return this;
	};
	$.fn.suffix = function(suff, index){
		/* (* [, int]) -> *

		Functionality depends on the arguments,
		take a look at the following:

		Overloads:
		() -> str
			Return the current suffix.

			>>> $("#example").suffix("hello");
			>>> $("#example").suffix();
			"hello"

		(str) -> jQuery Object
			Set the current suffix to suff.
			Return jQuery element.

			>>> $("#example").suffix("hello");
			$("#example")
			>>> $("#example").suffix();
			"hello"

		(array [, int]) -> jQuery Object
			Set the current suffix to the string
			given by suff[index] if index was set, or
			suff[0] otherwise. Set the current suffix list
			to suff.
			Return jQuery element.

			>>> $("#example").suffix(["hi", "there"], 1);
			$("#example")
			>>> $("#example").suffix();
			"there"

		(int) -> jQuery Object
			Precondition: .suffix([...]) was called
			previous to the execution of .suffix(int),
			such that suffix list is set.

			Set the current suffix to the string located
			at the index suff of the array previously set
			by .suffix([...]).
			Return jQuery element.

			>>> $("#example").suffix(["zero", "one", "two"]);
			>>> $("#example").suffix(1);
			>>> $("#example").suffix();
			"one"

		*/

		// Overload for .suffix(), called with no arguments
		if(suff === undefined) return this.data("suffix");

		var val = this.val(), suffix = this.data("suffix");

		// Remove previous suffix (if it's there)
		if(suffix && val.substr(val.length - suffix.length) == suffix){
			this.val(val.substr(0, val.length - suffix.length));
		}

		// Overload for .suffix([...], index), an array of suffixes.
		if(typeof(suff) == "object"){
			this.data("suffix-list", suff);
			index = index || 0;
			suff = suff[index];
		// Overload for .suffix(number).
		}else if(typeof(suff) == "number" && this.data("suffix-list")){
			index = suff;
			suff = this.data("suffix-list")[index];
		// Restore suffix-list
		}else this.data("suffix-list", false);

		// Set new suffix
		this.data("suffix", suff);
		this.data("suffixQueue", 0);
		this.trigger("suffixchange", [suff, index || 0]);

		// Allow for display of placeholder
		// Add suffix if it's not already there
		if(!(this.affixValue() == "" && this.attr("placeholder"))
			&& this.val().substr(this.val().length - suff.length) !== suff){
			this.val(this.val() + suff);
		}

		// Event handlers
		this.on("keypress", function(e){
			var t = $(this),
				caret = t.caret(),
				val = t.val(),
				suffix = t.data("suffix");

			if(caret.end >= val.length - suffix.length){
				var suffixList = t.data("suffix-list"),
					input = String.fromCharCode(e.which);
				// If a suffix list was used, update current suffix if necessary.
				if(suffixList && caret.start >= val.length - suffix.length){
					for(var z = 0; z < suffixList.length; z++){
						if(suffixList[z].substr(0, 1) == input){
							t.val(val.substr(0, caret.start));
							t.suffix(z);
							
							t.caret({
								start: t.val().length,
								end: t.val().length
							});
							e.preventDefault();
							return;
						}
					}
				}
				// Allow change of suffix if list is used
				if(suffixList && val.substr(val.length - suff.length) != suffix) return;

				if(caret.start == caret.end && suffix.substr(caret.end - val.length + suffix.length, 1) == input){
					t.caret({start:caret.end + 1, end:caret.end + 1});
					t.data("prefixQueue", caret.end - val.length + suffix.length + 1);
					e.preventDefault();
				}else{
					// IE-specific overwrite mode fix
					var overwriteMode = document.queryCommandValue("OverWrite");

					if(caret.start == caret.end && t.data("prefixQueue") == caret.end - val.length + suffix.length){
						t.val(val.substr(0, caret.start) + input + suffix);
						t.caret({start: caret.start+1, end: caret.start+1});
						e.preventDefault();
					}else if(overwriteMode){
						t.val(val.substr(0, caret.start) + input + suffix);
						t.caret(val.length - suffix.length + 1);
						e.preventDefault();
					} else{
						t.caret({
							start: Math.min(caret.start, val.length- suffix.length),
							end: val.length - suffix.length
						});
					}
				}
			}else if(caret.end == val.length - suffix.length && caret.start == caret.end 
				&& suffix.substr(caret.end - val.length + suffix.length, 1) == input){
				t.caret({start:caret.end + 1, end:caret.end + 1});
				e.preventDefault();
			}

		}).on("keydown", function(e){
			var $t = $(this),
				caret = $t.caret(),
				val = $t.val(),
				suffix = $t.data("suffix");
			// Backspace & delete fix 
			if(e.which == 8 || e.which == 46){
				// Allow for backspace & delete if suffix list is used
				if($t.data("suffix-list")) return;

				// Else continue
				if(e.which == 46 && caret.start >= val.length - suffix.length){
					$t.caret(val.length - suffix.length);
					e.preventDefault();
				}else if(caret.end > val.length - suffix.length){
					$t.caret({
						start: Math.min(caret.start, val.length - suffix.length),
						end: val.length - suffix.length
					});
					var prefix = $t.data("prefix");
					if(prefix && val.length == prefix.length + suffix.length) e.preventDefault();
				}
			// Paste fix position
			}else if(e.which == 86 && e.ctrlKey){
				// Handle caret positions
				if(caret.end > val.length - suffix.length){
					var start = caret.start;
					if(start > val.length -  suffix.length) start -= suffix.length;
					$t.caret({start:start, end:val.length - suffix.length});
				}
			// End fix
			}else if(e.which == 35 && e.ctrlKey){
				if(e.shiftKey) $t.caret({start:Math.min(val.length - suffix.length, caret.end), end:val.length - suffix.length});
				else $t.caret({start:val.length - suffix.length, end:val.length - suffix.length});
				e.preventDefault();
			}
		}).on("paste", function(e){
			// Fixes some pasting issues.
			// Works with context menu too.

			var t = $(this);

			// Set timeout hack to skip call stack.
			setTimeout(function(){
				// Set local vars.
				var suffix = t.data("suffix"),
					caret = t.caret(),
					val = t.val(),
					start = caret.end;

				// If suffix list was used, compute new suffix
				if(t.data("suffix-list")){
					var suffixList = t.data("suffix-list");
					for(var z = 0; z < suffixList.length; z++){
						if(val.substr(val.length - suffixList[z].length) == suffixList[z]){
							suffix = suffixList[z];
							t.data("suffix", suffix);
							t.trigger("suffixchange", [suffix, z]);
							break;
						}
					}
				}

				// If a paste deletes the suffix, add it again.
				if(val.substr(val.length - suffix.length) != suffix) val += suffix;

				// More vars
				var body = val.substr(0, val.length - suffix.length),
					nbody = body;

				// Handle caret positions
				if(caret.end > val.length - suffix.length){
					var start = caret.start;
					if(start > val.length -  suffix.length) start -= suffix.length;
					$(this).caret({start:start, end:val.length - suffix.length});
				}

				// Delete repeated suffix from body
				for(var z = suffix.length - 1; z >= 0; z--){
					if(body.substr(body.length - suffix.length + z) == suffix.substr(0, suffix.length - z)){
						nbody = nbody.substr(0, body.length - suffix.length + z);
						break;
					}
				}

				// Set the final value and caret pos.
				t.val(nbody + suffix);
				t.caret({
					start: start,
					end: start
				});
				// Prevent default paste.
				e.preventDefault();
			}, 1);
			
		}).on("change", function(e){
			var suffix = $(this).data("suffix"),
				val = $(this).val();

			// If suffix is lost in input, re-add it.
			if(val.substr(val.length - suffix.length) != suffix){
				val += suffix;
				$(this).val(val);
			}
		}).on("blur", function(e){
			var suffixList = $(this).data("suffix-list");
			var suffix = $(this).data("suffix"),
				val = $(this).val();

			// If suffix list was used, check if suffix changed
			if(suffixList && val.substr(val.length - suffix.length) != suffix){
				// If new suffix is in suffix list...
				for(var z = 0; z < suffixList.length; z++){
					if(val.substr(val.length - suffixList[z].length) == suffixList[z]){
						$(this).suffix(z);
						return;
					}
				}
				// Else re-add original suffix
				val += suffix;
				$(this).val(val);
			}
			// If input has placeholder and is empty
			// show placeholder
			if($(this).affixValue() == "" && $(this).attr("placeholder")){
				$(this).val("");
			}
		}).on("focus", function(e){
			var t = $(this), val = t.affixValue();
			// If input is empty, show suffix
			// And move caret to correct position
			if(val == ""){
				t.affixValue("");
				var pos = 0;
				if(t.data("prefix")){
					pos = t.data("prefix").length;
				}
				setTimeout(function(){
					t.caret({
						start: pos,
						end: pos
					});
				}, 1);
				e.preventDefault();
			}
		});
		return this;
	}
})(window.jQuery);
//TFIN
