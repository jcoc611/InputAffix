![Input Affix Logo](http://static.jcoc611.com/lab/InputAffix/logo.png)

*Note: this plugin requires jQuery version 1.11 or above.*

Input Affix is a jQuery plugin that allows you to add prefixes and suffixes to your input fields such that when your users type, the suffix or prefix does not change or move, and the user selection is managed accordingly. For example, if you need to add a percentage or degree symbol to one of your fields, it can easily be done by:

```javascript
// For a prefix
// i.e. myuser becomes Username: myuser
jQuery("#myInputField2").prefix("Username: ");
// For a suffix
// i.e. 100 becomes 100%
jQuery("#myInputField").suffix("%");
```

You might cosider alternatively placing your prefix/suffix *outside* of the input field, but if you are serious about including it within the input field (i.e you want your users to be able to select the prefix or/and suffix when they interact with your input field), then use this plugin to easily add such.

## Documentation

### .prefix(pre)
Adds the prefix *pre* to the input field given by the jQuery selector. The user will be able to select/copy the prefix, but won't be able to delete it or write over it. Any text input will be inserted after the prefix, such that the pre string is kept at the beginning of the input at all times.

### .suffix(suff)
Adds the suffix *suff* to the input field given by the jQuery selector. The user will be able to select/copy the suffix, but won't be able to delete it or write over it. Any text input will be inserted before the suffix, such that the suff string is kept at the end of the input at all times.

*Note: calling both functions for an input field should also work.*

## Hosted library
In addition to the GitHub repo, I will also be hosting the minified version of the library at

    http://static.jcoc611.com/hosted/js/InputAffix.0.1.0.min.js

## Collaborating
If you have any issues with the code, or have found any bugs, submit an Issue Ticket! Also, if you want to improve/change anything just fork the repo, make your changes, and submit a pull request. I will review it as soon as possible.

Keep affixing your life with greatness,
JCOC611.