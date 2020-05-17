# Se.JS

A portable load-balancing-focused JavaScript rendering framework.

This is just an experimental project, and being used for my own website. But you can try it :)

---
## Getting Started

Just clone this project to your folder. Actually, only `se.js` file is required. Then, create an HTML file as follows:
```html
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Hellow Se.JS!</title>
</head>
<body>
    Hello Se.JS!
</body>
</html>
```
You can choose any name as you desrired to. For this guide, I will choose `index.html`. Now we can create our JavaScript file for this page.
```javascript
//If you put se.js file in other part of your site directory, just change it to your directory.
import * as Se from "./js/se.js"

/* The rest of code goes here. */
```
Now we can save this file. You can also choose any name you wanted, but I'd prefer the same name of the page, so it is `index.js`.
Then, put this HTML code to your page we've created recently. Prefer `<head>` part first.
```html
    <script type="module" src="index.js"></script>
```
And we are all set! Now we can learn more from here.

---
## Page Module

When you design some of your websites, you may think about how to maintain all your pages. For example, you want to create many pages that have the same navigation bar. In simplest approach, you duplicate all of them eache pages. Which is not a good way to do. In server-side, you may write your HTML header in some parts of your server code, then render them in response. In client-side, you can also use jQuuery trick to achieve this:
```javascript
$.get("navigation.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});
```
But in Se.JS is 'dead simple' Just put an `attribute` in any HTML tags you wanted to show. For example, if we have web page like this:
```html
<body>
    <!--Navigation bar goes here!-->
    <div class="navbar"></div>
    <!--Content goes here!-->
    <div class="content"></div>
    <!--Footer goes here-->
    <div class="footer"></div>
</body>
```
If you want to put your navigation bar file, for now it is named `navbar.html`. You just put `se-html` attribute in the tag like this:
```html
<body>
    <!--Navigation bar goes here!-->
    <div class="navbar" se-html="navbar.html"></div>
    <!--Content goes here!-->
    <div class="content">
        Some of cool content goes here!
    </div>
    <!--Footer goes here-->
    <div class="footer"></div>
</body>
```
Or if you also have some of cool scripts to be used, just put `se-js` along side it, or anywhere you want. But for a good code maintain. I'd prefer putting them together like this:
```html
<body>
    <!--Navigation bar goes here!-->
    <div class="navbar" se-html="navbar.html" se-js="navbar.js"></div>
    <!--Content goes here!-->
    <div class="content">
        Some of cool content goes here!
    </div>
    <!--Footer goes here-->
    <div class="footer"></div>
</body>
```
And that's it! Now you have a reusable module!

For other components, like CSS file, you can also put `se-css` attribute somewhere in your HTML page, maybe `<body>` or `<head>` tag, like `<head se-css="awesome.css">`.
In the complete web page, it should look like this:
```html
<html>
<head se-css="awesome.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Hellow Se.JS!</title>
</head>
<body>
    <!--Navigation bar goes here!-->
    <div class="navbar" se-html="navbar.html" se-js="navbar.js"></div>
    <!--Content goes here!-->
    <div class="content">
        Some of cool content goes here!
    </div>
    <!--Footer goes here-->
    <div class="footer"></div>
</body>
</html>
```
Vala, we have done with the Page Module!