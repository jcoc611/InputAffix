"use strict";
// Created by Juan Camilo Osorio (JCOC611 - jcoc611.com).
// Version 0.1.2. (Beta).
// Consider giving back by sharing your own code!
// Licensed under the MIT License. 
// http://www.opensource.org/licenses/mit-license.php

// Includes jQuery Caret v1.02
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
		if (typeof options === "object" && typeof options.start === "number" && typeof options.end === "number") {
			start = options.start;
			end = options.end;
		// .caret(start, end)
		} else if (typeof options === "number" && typeof opt2 === "number") {
			start = options;
			end = opt2;
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
	$.fn.prefix = function(pre){
		// Overload for .prefix(), called with no arguments
		if(!pre) return this.data("prefix");
		
		// Remove previous prefix
		if(this.data("prefix")){
			this.val(this.val().substr(this.data("prefix").length, this.val().length - this.data("prefix").length));
		}

		// Set new prefix
		this.data("prefix", pre);
		if(this.val().indexOf(pre) != 0){
			this.val(pre + this.val());
		}

		this.on("keypress", function(e){
			var caret = $(this).caret(),
				prefix = $(this).data("prefix");
			if(caret.start < prefix.length){
				if(caret.start == caret.end && prefix.substr(caret.start, 1) == String.fromCharCode(e.which)){
					$(this).caret({start:caret.start + 1, end:caret.start + 1});
					e.preventDefault();
				}else{
					var end = caret.end;
					if(end == caret.start) end = prefix.length;
					else if(end < prefix.length) end += prefix.length;
					$(this).caret({start:prefix.length, end:end});
				}
			}
		}).on("keydown", function(e){
			var caret = $(this).caret(),
				prefix = $(this).data("prefix");
			// Backspace & delete fix 
			if(e.which == 8 || e.which == 46){
				if(e.which == 8 && caret.start <= prefix.length && caret.start == caret.end) e.preventDefault();
				else if(caret.start < prefix.length && caret.start == caret.end) e.preventDefault();
				else if(caret.start < prefix.length && caret.end == prefix.length){
					$(this).caret({start:prefix.length, end:Math.max(caret.end, prefix.length)});
					e.preventDefault();
				}else if(caret.start < prefix.length){
					$(this).caret({start:prefix.length, end:Math.max(caret.end, prefix.length)});
				}
			// Paste fix position
			}else if(e.which == 86 && e.ctrlKey){
				// Handle caret positions
				if(caret.start < prefix.length){
					var end = caret.end;
					if(end < prefix.length) end += prefix.length;
					$(this).caret({start:prefix.length, end:end});
				}
			// Home/start fix
			}else if(e.which == 36){
				if(e.ctrlKey){
					if(e.shiftKey) $(this).caret({start:prefix.length, end:Math.max(caret.start, prefix.length)});
					else $(this).caret({start:prefix.length, end:prefix.length});
					e.preventDefault();
				}
			}

		}).on("paste", function(e){
			// Fixes some pasting issues.
			// Works with context menu too.

			var t = this;

			// Set timeout hack to skip call stack.
			setTimeout(function(){
				// Set local vars.
				var prefix = $(t).data("prefix"),
					caret = $(t).caret(),
					val = $(t).val(),
					end = caret.end;

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
				$(t).val(prefix + nbody);
				$(t).caret({
					start: end,
					end: end
				});

				// Prevent default paste.
				e.preventDefault();
			});
		});
		return this;
	}
	$.fn.suffix = function(suff){
		// Overload for .suffix(), called with no arguments
		if(!suff) return this.data("suffix");

		// Else assume .suffix(str)
		// Remove previous suffix
		if(this.data("suffix")){
			this.val(this.val().substr(0, this.val().length - this.data("suffix").length));
		}
		// Set new suffix
		this.data("suffix", suff);
		if(this.val().indexOf(suff, this.val().length - suff.length) == -1){
			this.val(this.val() + suff);
		}

		// Event handlers
		this.on("keypress", function(e){
			var caret = $(this).caret(),
				val = $(this).val(),
				suffix = $(this).data("suffix");
			if(caret.end > val.length - suffix.length){
				if(caret.start == caret.end && suffix.substr(caret.end - val.length + suffix.length, 1) == String.fromCharCode(e.which)){
					$(this).caret({start:caret.end + 1, end:caret.end + 1});
					e.preventDefault();
				}else{
					var start = caret.start;
					if(start > val.length - suffix.length) start -= suffix.length;
					$(this).caret({start: start, end: val.length - suffix.length});
				}
			}else if(caret.end == val.length - suffix.length && caret.start == caret.end 
				&& suffix.substr(caret.end - val.length + suffix.length, 1) == String.fromCharCode(e.which)){
				$(this).caret({start:caret.end + 1, end:caret.end + 1});
				e.preventDefault();
			}

		}).on("keydown", function(e){
			var caret = $(this).caret(),
				val = $(this).val(),
				suffix = $(this).data("suffix");
			// Backspace & delete fix 
			if(e.which == 8 || e.which == 46){
				if(e.which == 46 && caret.end >= val.length - suffix.length && caret.start == caret.end){
					$(this).caret({start: val.length - suffix.length, end: val.length - suffix.length});
					e.preventDefault();
				}else if(e.which == 46 && caret.end >= val.length - suffix.length && caret.start == caret.end){
					e.preventDefault();
				}else if(caret.start > val.length - suffix.length && caret.start == val.length - suffix.length){
					$(this).caret({start:val.length - suffix.length, end:val.length - suffix.length});
					e.preventDefault();
				}else if(caret.end > val.length - suffix.length){
					$(this).caret({end:val.length - suffix.length, start:Math.min(caret.start, val.length - suffix.length)});
				}
			// Paste fix position
			}else if(e.which == 86 && e.ctrlKey){
				// Handle caret positions
				if(caret.end > val.length - suffix.length){
					var start = caret.start;
					if(start > val.length -  suffix.length) start -= suffix.length;
					$(this).caret({start:start, end:val.length - suffix.length});
				}
			// End fix
			}else if(e.which == 35){
				if(e.ctrlKey){
					if(e.shiftKey) $(this).caret({start:Math.min(val.length - suffix.length, caret.end), end:val.length - suffix.length});
					else $(this).caret({start:val.length - suffix.length, end:val.length - suffix.length});
					e.preventDefault();
				}
			}

		}).on("paste", function(e){
			// Fixes some pasting issues.
			// Works with context menu too.

			var t = this;

			// Set timeout hack to skip call stack.
			setTimeout(function(){
				// Set local vars.
				var suffix = $(t).data("suffix"),
					caret = $(t).caret(),
					val = $(t).val(),
					start = caret.end;

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
				$(t).val(nbody + suffix);
				$(t).caret({
					start: start,
					end: start
				});

				// Prevent default paste.
				e.preventDefault();
			}, 1);
		});
		return this;
	}
})(jQuery);
//TFIN