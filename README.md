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
    <title>Hello Se.JS!</title>
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

When you design some of your websites, you may think about how to maintain all your pages. For example, you want to create many pages that have the same navigation bar. In simplest approach, you duplicate all of them eache pages, which is not a good way to do. In server-side, you may write your HTML header in some parts of your server code, then render them in response. In client-side, you can also use jQuery trick to achieve this:
```javascript
$.get("navigation.html", function(data){
    $("#nav-placeholder").replaceWith(data);
});
```
But in Se.JS, it is 'dead simple' Just put an `attribute` in any HTML tags you wanted to show. For example, if we have web page like this:
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
If you want to put your navigation bar file, for now it is named `navbar.html`, also has a structure like this:
```html
<div class="topnav">
    <a> ≡ Navigator</a>
    <div class="topnav-menu" id="navlinks">
        <a href="index.html"> Home</a>
        <a href="images.html"> Photos</a>
        <a href="map.html"> Map</a>
        <a href="reserve.php"> Reserve</a>
        <a href="scr_auth.php"> Login</a>
        <a href="scr_auth.php"> Report</a>
        <a href="contact.php"> Contact Us</a>
    </div>
</div>
```
To import it, you just put `se-html` attribute in the tag like this:
```html
<body>
    <!--Navigation bar goes here!-->
    <div class="navbar" se-html="navbar.html"></div>
    <div class="content">
        Some of cool content goes here!
    </div>
    <div class="footer"></div>
</body>
```
For other components, like CSS file, you can also put `se-css` attribute somewhere in your HTML page, maybe `<body>` or `<head>` tag, like `<head se-css="awesome.css">`.
In the complete web page, it should look like this:
```html
<html>
<!-- CSS is here! -->
<head se-css="awesome.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Hello Se.JS!</title>
</head>
<body>
    <div class="navbar" se-html="navbar.html"></div>
    <div class="content">
        Some of cool content goes here!
    </div>
    <div class="footer"></div>
</body>
</html>
```
Vala, we have done with the Page Module!

> Note: Due to security concerns, put `<script>` tag inside page module will not work. I'd suggest you to put `<script src="navbar.js"></script>` alongside your `<div>` of the page module, or using Se.JS's`component`, which I'll talk more about it later.

---
## Component

In dynamic websites, they take request from users, process them, then send results back. Basically, in some web servers, they take care all of tasks and send them to user statically. Everything happened request by request, a new request means an entire new webpage to be created and send back to user. This may not be a problem for websites that are no need using real-time data. But when you need a real-time responsive website. Constantly forcing the web page to reload is probably not ideal. So, another approach need to be applied to achieve this.

Basically, using jQuery/AJAX can achieve this and give a result you expected, like this:
```javascript
var obj = jQuery.parseJSON(result);
if(obj != ''){
    $("#body").empty();
    $.each(obj, function(key, val) {
        var tr = "<tr>";
        tr = tr + "<td>" + val["CustomerID"] + "</td>";
        tr = tr + "<td>" + val["Name"] + "</td>";
        tr = tr + "<td>" + val["Email"] + "</td>";
        tr = tr + "<td>" + val["CountryCode"] + "</td>";
        tr = tr + "<td>" + val["Budget"] + "</td>";
        tr = tr + "<td>" + val["Used"] + "</td>";
        tr = tr + "</tr>";
        $('#table > tbody:last').append(tr);
    });
}
```
This may not look like a big deal. But what if your data have plenty of them, or they are stacked up, like this social media's post:
```javascript
let data = {
    id: 1234,
    name: "johnmccrane0420",
    desc: "Nice trip today! :D",
    year: 2020,
    month: 4,
    day: 20,
    hour: 17,
    min: 30,
    img: "https://cdn.social.media/0123456789.png",
    like: 5,
    comment:[
        {
            id: 5678,
            name: "jenny9228",
            desc: "That looks cool really!",
            year: 2020,
            month: 4,
            day: 20,
            hour: 19,
            min: 10,
            img: "",
            like: 2,
            comment:[
                {
                    id:9024,
                    name:"elmotttt",
                    desc: "I think so too!",
                    year: 2020,
                    month: 4,
                    day: 20,
                    hour: 20,
                    min: 04,
                    img: "",
                    like: 0
                },
                {
                    id:3333,
                    name:"nickrareman",
                    desc: "Couldn't agree more!",
                    year: 2020,
                    month: 4,
                    day: 20,
                    hour: 20,
                    min: 33,
                    img: "",
                    like: 0
                }
            ]
        }
    ]
}
```
This can be a nightmare, and extremely hard to maintain a clean and reusable code. But in Se.JS, this can be solved quickly and easily. Let's get started.

In your web page javascript file, use function `Se.res()` to create a reusable `component` resource for the page, then write base of HTML file for this data.

If we figure out how the data looks like, so there are 3 sub parts of them, so our HTML component should look like this:
```javascript
import * as Se from "./js/se.js"

//Create a component for our post data.
Se.res("comp","post",`
    <!--HTML Goes Here--->
`)
```
When `"comp"` stands for the `component` (other res types can also be used, including `"css"`, `"html"`, but they are more easier using attributes in the HTML file), `"post"` stands for component name, and the last parameter is where we put HTML code in. But before continue, we need to understand how the component works first.

---
### Object Properties

Every object in JavaScript has an ability to store their properties. If you want to render them in the component, simply use a dollar sign (`$`), followed by your object property name. It can be used at any parts in your HTML code, as follows: 
```html
    <div id="$id-post" class="post">

        <!-- Post -->
        <div id="$id-header">
            <h1>$name</h1>
            $day-$month-$year $hour:$min
        </div>

        <p>$desc</p>
        
        <div class="post-img"> <img src="$img"> </div>
        
        <div class="post-comment">
            
            <!-- Comments -->
            <div id="$id-post" class="comment">

                <div id="$id-header">
                    <h2>$name</h2> $day-$month-$year $hour:$min
                </div>
                    
                <p>$desc</p>
                
                <div id="post-img"> <img src="$img"> </div>
                
                <div class="post-sub-comment">
                
                    <!-- Sub Comments -->
                    <div id="$id-post" class="sub-comment">
                        
                        <div id="$id-header">
                            <h3>$name</h3> $day-$month-$year $hour:$min
                        </div>
                            
                        <p>$desc</p>
                        
                        <div id="post-img"> <img src="$img"> </div>
                        
                    </div>
                    <!-- End Sub Comments -->

                </div>

            </div>
             <!-- End Comments -->

        <div>

    </div>
```
---

### Arrayed Component

Now we're able to render our object properties in our component, but what about array? In the example data, we have 2 stacks of the array, so what to do next? Simple, just put them in an `array bracket`! Let's have a look at our data again, now I will simplify them just to do you get the point:
```javascript
let data = {
    //... object properties here...//
    comment:[
        {
            //... object properties here...//
            comment:[
                {
                    //... object properties here...//
                },
                {
                    //... object properties here...//
                }
            ]
        }
    ]
}
```
Now in our component, an `array bracket` has a stucture like this:
```html
$arrayName{
    <Contents-Here>
}arrayName$
```
When `arrayName` stands for array name you want to render them. For example, you want to render `comment` array, your `array bracket` should look like this:
```html
$comment{
    <Contents-Here>
}comment$
```
An `array bracket` can also be stackable. In this example, we have 2 stacks of them, to the rest of it should looke like this:
```html
    $comment{
        <Contents-Here>
        $comment{
            <Sub-Contents-Here>
        }comment$
    }comment$
```
Now let's put `array bracket`s in! It should look like this:
```html
    <div id="$id-post" class="post">

        <!-- Post -->
        <div id="$id-header">
            <h1>$name</h1>
            $day-$month-$year $hour:$min
        </div>

        <p>$desc</p>
        
        <div class="post-img"> <img src="$img"> </div>
        
        <div class="post-comment">
        
        $comment{ <!-- Comments -->
            
            <div id="$id-post" class="comment">

                <div id="$id-header">
                    <h2>$name</h2> $day-$month-$year $hour:$min
                </div>
                    
                <p>$desc</p>
                
                <div id="post-img"> <img src="$img"> </div>
                
                <div class="post-sub-comment">
                
                $comment{ <!-- Sub Comments -->
                    
                    <div id="$id-post" class="sub-comment">
                        
                        <div id="$id-header">
                            <h3>$name</h3> $day-$month-$year $hour:$min
                        </div>
                            
                        <p>$desc</p>
                        
                        <div id="post-img"> <img src="$img"> </div>
                        
                    </div>
                    
                }comment$ <!-- End Sub Comments -->

                </div>

            </div>
            
        }comment$ <!-- End Comments -->

        <div>

    </div>
```
And that's it! Now you have complete reusable component for your web page. Let's put some code to make a magic happen! Do you still remember component name of this example? It is `"post"`! Now put it in `Se.comp()`!
```javascript
//This command creates a component, then instantly show the result.
let postComment = new Se.comp("objPost", "post", data)
```
When `"objPost"` stands for component ID (string can also be used), `"post"` stands for component name that wil be used, and `data` stands for data to be bound (can be left empty)

To summarise, all of the rest should look like this:
```javascript
import * as Se from "./js/se.js"

//Create a component named "post"
Se.res("comp","post",`
    <div id="$id-post" class="post">

        <!-- Post -->
        <div id="$id-header">
            <h1>$name</h1>
            $day-$month-$year $hour:$min
        </div>

        <p>$desc</p>
        
        <div class="post-img"> <img src="$img"> </div>
        
        <div class="post-comment">
        
        $comment{ <!-- Comments -->
            
            <div id="$id-post" class="comment">

                <div id="$id-header">
                    <h2>$name</h2> $day-$month-$year $hour:$min
                </div>
                    
                <p>$desc</p>
                
                <div id="post-img"> <img src="$img"> </div>
                
                <div class="post-sub-comment">
                
                $comment{ <!-- Sub Comments -->
                    
                    <div id="$id-post" class="sub-comment">
                        
                        <div id="$id-header">
                            <h3>$name</h3> $day-$month-$year $hour:$min
                        </div>
                            
                        <p>$desc</p>
                        
                        <div id="post-img"> <img src="$img"> </div>
                        
                    </div>
                    
                }comment$ <!-- End Sub Comments -->

                </div>

            </div>
            
        }comment$ <!-- End Comments -->

        <div>

    </div>
`)
//Create data object
let data = {
    id: 1234,
    name: "johnmccrane0420",
    desc: "Nice trip today! :D",
    year: 2020,
    month: 4,
    day: 20,
    hour: 17,
    min: 30,
    img: "https://cdn.social.media/0123456789.png",
    like: 5,
    comment:[
        {
            id: 5678,
            name: "jenny9228",
            desc: "That looks cool really!",
            year: 2020,
            month: 4,
            day: 20,
            hour: 19,
            min: 10,
            img: "",
            like: 2,
            comment:[
                {
                    id:9024,
                    name:"elmotttt",
                    desc: "I think so too!",
                    year: 2020,
                    month: 4,
                    day: 20,
                    hour: 20,
                    min: 14,
                    img: "",
                    like: 0
                },
                {
                    id:3333,
                    name:"nickrareman",
                    desc: "Couldn't agree more!",
                    year: 2020,
                    month: 4,
                    day: 20,
                    hour: 20,
                    min: 33,
                    img: "",
                    like: 0
                }
            ]
        }
    ]
}
//Create component using "post" component, and bind the data.
let postComment = new Se.comp("objPost", "post",data)
```
And we are all set for this part!
> Note: Any value assigned to the component with dollar sign `($)` must be exist. Se.JS component will not automatically delete them if assigned data do not exist. At least, they must be empty, or you will have a strange tags or dollar sign values like `$something`

---
### Reactive Component
In modern JavaScript Frameworks, like Vue.js, it provides many cool things to make a development much easier, one of them is 'reactivity'. But in Se.JS, it's called a `reactive` component.

A `reactive` component is a form of the component that is "reactive", means that the object has instant reaction with data they received. No need to trigger any events or watchers to make them happen. Se.JS also provides a `reactive` component, which can be useful in some cases, like minor data update. The component can be declared with `Se.reactComp()` prototype.
```javascript
var comp = new Se.reactComp("compId","compName", data, target)
```
When `"compId"` stands for component ID, `"compName"` stands for component name, `data` stand for data to be bound (can be left empty), and `target` stands for ID to target to be bound by the component.

Everytime you want to get or set some data, simply type `comp.data` followed by anything you want, like `comp.data.name = "John"`. When you change the value, the component will get updated instantly.
> If you have to assign many values in one time, or you don't need a reactive website, I'd suggest you to use regular `Se.comp()` instead.

---
### Empty Object Properties
Data received from the server can be varied. To dealing with empty data, simply put `empty bracket`, then put your HTML code as you desire. Let's take a look for an example:
```javascript
var data = {
    name: ""
}
```
For the structure of `empty bracket`, it looks like this:
```html
!propertyName{
    <Your-contents-here>
}propertyName!
```
For this example, name of the property is `name`, now apply to HTML code for the component:
```html
$name{
    <h1> Your name is $name. </h1>
}$name
!name{
    <h1> I don't know your name! </h1>
}name!
```
This structure can also be applied to `array` too. To access your data inside array, simply put `$[]` inside the component you want to access, using `$@` will tell a position of data:
```javascript
var data = {
    contact:["John", "Leona", "Bruce"]
}
```
HTML:
```html
<div id="contact">
    <ol>
        $contact{
            <li> $[] (Number $@) </li>
        }contact$
    </ol>
    !contact{
            <h1> No contacts! </h1>
    }contact!
</div>
```
Now, you may notice some flaws in this HTML, that `<ol>` tag is "NOT" supposed to be here when there is no data in the array. This is how `conditional component` comes in place. Let's continue on!

---
### Conditional Component
In many cases, conditions need to be applied for the component to behave as we desire. In Se.JS, a `conditional component` has a structure like this:
```html
?condition(expression){
    <Contents-Here>
}?
```
For `condition` (conditional statement) in Se.JS, there are 3 of them:
+ `if` condition.
+ `elif` (else if) condition.
+ `else` condition.

For `expression`, it can be anything in JavaScript, from common expressions, to all functions that return values.

Let's go for some examples! Here is our data.
```javascript
var data = {
    fruits: ["Apple","Banana","Cherry","Durian"]
}
```
Now for our HTML component:
```html
?if($fruits.length !== 0){
    <h1> Our Basket </h1>
    <ol>
        $fruits{
            <li> $[] </li>
        }fruits$
    </ol>
}?
?else{
    <h1> Our basket is empty! <h1>
}?
```

---
### Event Handling
There are no specific `event handling` methods designed for Se.JS. To be honest, at least for me, I don't really find them useful. But that does not mean it is impossible to implement event handling for Se.JS. I provided some ways to make event handling for the component. Let's get started!

First, let's understand how browser's JavaScript work.
In the browser, there are at leaast 2 scopes of area
1. `module` scope, where `Se.JS` is working.
2. `browser`, `global` or `window` scope, where the browser and regular scripts are in.

Generally, both of these are seperated, and can't be accessed by each other, especially in browser scope. JavaScript module also provides `window` as browser scope in the module, and can be accessed directly. We can use this area to communicate between module and browser.

However, using `window` to declare things is considerd a "bad practice", since it increases JavaScript engine overhead, reduces code maintainability, and risk of unexpected default scope changes. So there is a solution for this.

In Se.JS, there is a space called `Se.global`, which is used for declaring anything you wanted for the browser environment (since putting anything in global scope is a bad practice) In a module script, we can provide a new thing uisng `Se.global` like this:
```javascript
import * as Se from "./js/se.js"

//declare something
Se.global.x = 0
Se.global.arr = []
Se.global.obj = {}
Se.global.greet = () => { //function
    alert('Hello World!')
}
```
Now in HTML component/page, we can use them via `Se` object:
```html
    <!-- Call greet() from Se.global in module -->
    <button onclick="Se.greet()">Greet!</button>
```
To do a combination with `component` we can use symbol `$@` to define a position we want to interact with. Let's see an example, a `fruit basket` application:
```javascript
import * as Se from "./js/se.js"

//component resource
Se.res("comp","fruitBasketApp",`
<h2> Fruit Basket </h2>
<input id="fruit-name" type="text"><br><br>

<!-- We use only "Se." for browser scope -->
<button onclick="Se.fruitAdd()">Add this fruit</button>

?if($fruits.length !== 0){
<ol>
    $fruits{
        <li>
            <!-- $@ is used to declare data position, $[] is used to pull data from position -->
            $[] <button onclick="Se.fruitEdit($@)">Edit</button>
        </li>
    }fruits$
</ol>
}?
?else{
    <h4> No fruits. </h4>
}?
`)

//component
let comp = new Se.reactComp('myApp', 'fruitBasketApp',{
    fruits:[]
})

//functions
Se.global.fruitAdd = function(){ //We use "Se.global." in module scope.
    var fruitName = Se.ele('fruit-name').value //Se.ele() is a shorthand of document.getElementById()
    comp.data.fruits.push(fruitName) //push new fruit to array
}
Se.global.fruitEdit = function(pos){
    comp.data.fruits[pos] = prompt('Enter new fruit name: ')
}
```

---
### Component Name
Unlike many JavaScript frameworks, in Se.JS, there is no way specifically provided for components to have their own functions (You can implement them, but you can't use them) So, to make components be able to use the same function, you have to `name` a component.

Name being used for a component can be number, or string:
```javascript
var object = new Se.comp("myName")
```
You can also find a component using name with `Se.where()` function
```javascript
var objFound = Se.where("myName")
```
In a component structure, to access a component name, simply put `$#?` in anywhere you want to delare it:
```javascript
Se.res("comp","myComponent",`
    <h1> My name is $#?. </h1>
`)
```
To implement functions be able to be used by many of components, we can declare an array for storing components Let's take a look for an example. We need many `post` components:
```javascript
import * as Se from "./js/se.js"

Se.res("comp","postComponent",`
<div id="$#?" "class="post">
    <h6> Post number $#? <h6>
    $text<br>
    <button onclick="Se.postLike($#?)">$like Like</button>
    <button onclick="Se.postComment($#?)">Comment</button><br>
    $comment
</div>
`)
//create an array for post components.
const posts = []
function newPost (){
    //component name can be a number.
    posts.push(new Se.reactComp(posts.length,"postComponent",{
        text: "This is a post.",
        like: 0,
        comment: ""
    }))
}
Se.global.postLike = function(pos){
    posts[pos].data.like++
    alert("You have liked post number "+pos)
}
Se.global.postComment = function(pos){
    posts[pos].data.comment = prompt("Your comment: ")
}
//let's simulate two posts
var rp = 2
while(rp--) newPost()
```
Now components are able to use same functions!

*This method is 'highly' recommended if you want to create dynamically loaded contents for your website, since it is more device friendly and does not take much of system resources.*