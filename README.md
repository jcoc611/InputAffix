![Input Affix Logo](http://static.jcoc611.com/lab/InputAffix/logo.png)

*Tested on: Chrome 43.0.2, Firefox 36.0.4, Internet Explorer 10.0.9.*

*Note: this plugin requires jQuery version 1.11 or above.*

Input Affix is a jQuery plugin that allows you to add prefixes and suffixes to your input fields such that when your users type, the suffix or prefix does not change or move, and the user selection is managed accordingly. For example, if you need to add a percentage or degree symbol to one of your fields, it can easily be done by:

```javascript
// For a suffix
// i.e. 100 becomes 100%
jQuery("#fieldThatNeedsPercentage").suffix("%");
jQuery("#fieldThatNeedsAngle").suffix("°");
```

You might consider alternatively placing your prefix/suffix *outside* of the input field, but if you are serious about including it within the input field (i.e. you want your users to be able to select the prefix and/or suffix when they interact with your input field), then use this plugin to easily add such.

## Usage
If you want to use the hosted libraries, just add the following to the head of your page:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="http://static.jcoc611.com/hosted/js/InputAffix.0.1.3.min.js"></script>
```

Otherwise, you can host your own version of jQuery and Input Affix to suit your needs. After you have included both libraries, adding a prefix or suffix is easier than writing the HTML for them. Check the documentation out for the detailed explanation:

## Documentation

### Prefix
#### .prefix("string")
Adds the prefix *string* to the input field given by the jQuery selector. The user will be able to select/copy the prefix, but won't be able to delete it or write over it. Any text input will be inserted after the prefix, such that the pre string is kept at the beginning of the input at all times. Returns the same jQuery object for chained calls.

Example:

```javascript
jQuery("#userField").prefix("Username: ");
```

#### .prefix(array, index)
Sets the internal prefix list to array, and sets the actual prefix of the input field to `array[index]`. The argument index is *optional*, and its default value is `0`. The user *will* be able to delete and modify the prefix, in order to make it possible to change from one prefix to the other. Only the prefixes inside *array* will be considered valid. This allows you to enable more than one prefix for a single input field. Returns the same jQuery object for chained calls.

Example:

```javascript
jQuery("#userField").prefix(["1.","2.","3."]);
```

The previous example will set the prefix to `"1."`, and will let the user to alternatively use the prefixes `"2."` or `"3."`. If you want to execute a code when the user changes the current prefix, take a look at the **prefixchange** event below. If you want to easily change programmatically between these prefixes, you can use the following:

#### .prefix(integer)
Assuming an internal prefix list has been set (with `.prefix(array, index)`), this sets the prefix to the string found at `array[integer]`. Notice that the integer corresponds to the index of the array starting at zero. Returns the same jQuery object for chained calls.

Example:

```javascript
jQuery("#userField").prefix(["1.","2.","3."]);
jQuery("#userField").prefix(1); // Sets the prefix to "2."
```

#### .prefix()
Returns the current prefix, if there is one.

Example:

```javascript
jQuery("#userField").prefix("Username: ");
jQuery("#userField").prefix(); // Returns "Username: "
```

### Suffix
This works pretty much in the same way as the prefix function.

#### .suffix(suff)
Adds the suffix *suff* to the input field given by the jQuery selector. The user will be able to select/copy the suffix, but won't be able to delete it or write over it. Any text input will be inserted before the suffix, such that the suff string is kept at the end of the input at all times.

```javascript
jQuery("#percentageField").suffix("%");
```

#### .suffix(array, index)
Sets the internal suffix list to array, and sets the actual suffix of the input field to `array[index]`. The argument index is *optional*, and its default value is `0`. The user *will* be able to delete and modify the suffix, in order to make it possible to change from one suffix to the other. Only the suffixes inside *array* will be considered valid. This allows you to enable more than one suffix for a single input field. Returns the same jQuery object for chained calls.

Example:

```javascript
jQuery("#numberField").suffix(["1.","2.","3."]);
```

The previous example will set the suffix to `"1."`, and will let the user to alternatively use the suffixes `"2."` or `"3."`. If you want to execute a code when the user changes the current suffix, take a look at the **suffixchange** event below. If you want to easily change programmatically between these suffixes, you can use the following:

#### .suffix(integer)
Assuming an internal suffix list has been set (with `.suffix(array, index)`), this sets the suffix to the string found at `array[integer]`. Notice that the integer corresponds to the index of the array starting at zero. Returns the same jQuery object for chained calls.

Example:

```javascript
jQuery("#numberField").suffix([".1",".2",".3"]);
jQuery("#numberField").suffix(1); // Sets the suffix to ".2"
```

#### .suffix()
Returns the current suffix, if there is one.

### Affix Value
The `.affixValue(...)` function is a wrapper for the jQuery `.val()` [function](https://api.jquery.com/val/). The only difference is that it takes into account the prefix and suffix, making it easy to get and set the value of the inner text contained between a given prefix and suffix.

#### .affixValue("string")
Sets the value of the input to `prefix + "string" + suffix`. If either a *prefix* or a *suffix* has not been set, it is ignored. Thus, if no prefix or suffix has been added, the function behaves *exactly* the same as `.val("string")`.

#### .affixValue()
Gets the value of the input after having removed any prefix or suffix that had been added with Input Affix. Thus, if no prefix or suffix has been added, the function behaves *exactly* the same as `.val()`.

### Events

#### .on("prefixchange", function(e, pre, index){...})
This event is triggered every time the prefix of an element is changed. It is particularly useful when used in conjunction with multiple prefixes. Here, *e* is a jQuery event object, *pre* refers to a string representing the new prefix, and *index* is an integer representing the index of the prefix list that contains the new prefix, if a prefix list is being used (otherwise it is always `0`).

Example:

```javascript
jQuery("#userField").prefix(["1.","2.","3."]);
jQuery("#userField").on("prefixchange", function(e, pre, index){
    // After the line after this event handler,
    // This function is called,
    // pre is "2.", and
    // index is 1.
})
jQuery("#userField").prefix(1);
```

Similarily, there exists an analogous event for suffixes:

#### .on("suffixchange", function(e, suff, index){...})
This event is triggered every time the suffix of an element is changed. It is particularly useful when used in conjunction with multiple suffixes. Here, *e* is a jQuery event object, *suff* refers to a string representing the new suffix, and *index* is an integer representing the index of the suffix list that contains the new suffix, if a suffix list is being used (otherwise it is always `0`).

## Hosted library
In addition to the GitHub repo, I will also be hosting the minified version of the library at

    http://static.jcoc611.com/hosted/js/InputAffix.0.1.3.min.js

## Collaborating
If you have any issues with the code, or have found any bugs, submit an Issue Ticket! Also, if you want to improve/change anything just fork the repo, make your changes, and submit a pull request. I will review it as soon as possible.

Keep affixing your life with greatness,  
JCOC611.
