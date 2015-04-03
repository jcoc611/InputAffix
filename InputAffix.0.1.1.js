// Created by Juan Camilo Osorio (JCOC611 - jcoc611.com).
// Version 0.1.1. (Beta).
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
		var start, end, t = this[0];
		// For type aliasing
		if (typeof options === "object" && typeof options.start === "number" && typeof options.end === "number") {
			start = options.start;
			end = options.end;
		} else if (typeof options === "number" && typeof opt2 === "number") {
			start = options;
			end = opt2;
		} else if (typeof options === "string") {
			if ((start = t.value.indexOf(options)) > -1) end = start + options["length"];
			else start = null;
		} else if (Object.prototype.toString.call(options) === "[object RegExp]") {
			var re = options.exec(t.value);
			if (re != null) {
				start = re.index;
				end = start + re[0]["length"];
			}
		}

		// Alias for .caret(...) called with new selection information.
		if (typeof start != "undefined") {
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
		// Alias for .caret(), with no arguments.
		} else {
			// Modification as suggested by Андрей Юткин
			if(document.selection){
				var selection = document.selection;
				if (t.tagName.toLowerCase() != "textarea") {
					var val = this.val(),
						range = selection["createRange"]()["duplicate"]();
					range.moveEnd("character", val["length"]);
					var s = (range.text == "" ? val["length"] : val.lastIndexOf(range.text));
					range = selection["createRange"]()["duplicate"]();
					range.moveStart("character", -val["length"]);
					var e = range.text["length"];
				} else {
					var range = selection["createRange"](),
						stored_range = range["duplicate"]();
					stored_range.moveToElementText(t);
					stored_range.setEndPoint('EndToEnd', range);
					var s = stored_range.text["length"] - range.text["length"],
						e = s + range.text["length"]
				}
				// End of Modification
			} else {
				var s = t.selectionStart,
					e = t.selectionEnd;
			}
			var te = t.value.substring(s, e);
			return {
				start: s,
				end: e,
				text: te,
				replace: function(st) {
					return t.value.substring(0, s) + st + t.value.substring(e, t.value["length"])
				}
			}
		}
	}
	$.fn.prefix = function(pre){
		if(!pre){
			return this.data("prefix");
		}
		this.data("prefix", pre);
		if(this.val().indexOf(pre) != 0){
			this.val(pre + this.val());
		}

		this.on("keypress", function(e){
			var caret = $(this).caret(),
				prefix = $(this).data("prefix");
			if(caret.start < prefix.length){
				var end = caret.end;
				if(end < prefix.length) end += prefix.length;
				$(this).caret({start:prefix.length, end:end});
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
			// Paste fix
			}else if(e.which == 86 && e.ctrlKey){
				if(caret.start < prefix.length){
					var end = caret.end;
					if(end < prefix.length) end += prefix.length;
					$(this).caret({start:prefix.length, end:end});
				}
			// Home/start fix
			}else if(e.which == 36){
				$(this).caret({start:prefix.length, end:prefix.length});
				e.preventDefault();
			}

		});
		return this;
	}
	$.fn.suffix = function(suff){
		// Overload for .suffix(), called with no arguments
		if(!suff) return this.data("suffix");

		// Else assume .suffix(str)
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
				var start = caret.start;
				if(start > val.length - suffix.length) start -= suffix.length;
				$(this).caret({start: start, end: val.length - suffix.length});
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
			// Paste fix
			}else if(e.which == 86 && e.ctrlKey){
				if(caret.end > val.length - suffix.length){
					var start = caret.start;
					if(start > val.length -  suffix.length) start -= suffix.length;
					$(this).caret({start:start, end:val.length - suffix.length});
				}
			// End fix
			}else if(e.which == 35){
				$(this).caret({start:val.length - suffix.length, end:val.length - suffix.length});
				e.preventDefault();
			}

		});
		return this;
	}
})(jQuery);
//TFIN