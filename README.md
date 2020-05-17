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
Or if you also have some of cool scripts to be used, just put `se-js` along side it, or anywhere you want. But for a good code maintaining. I'd prefer putting them together like this:
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

---
## Component

In dynamic websites, they take request from users, process them, then send results back. Basically, in some web servers, they take care all of tasks and send them to user statically. Everything happened request by request, a new request means an entire new webpage to be created and send back to user. This may not be a problem for websites that are no need using real-time data. But when you need a real-time responsive website. Constantly forcing the web page to reload is probably not ideal. So, another approach need to be applied to achieve this.

Basically, using jQuery/AJAX can achieve this and give a result you expected, like this:
```javascript
$.ajax({
    url: "getData.php" ,
    type: "POST",
    data: ''
}).success(function(result) {
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
});
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
                    id:9024,
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
When `"comp"` stands for the `component` (other res types can also be used, including `"css"`, `"html"`, `"js"`, but they are more easier using attributes in the HTML file), `"post"` stands for component name, and the last parameter is where we put HTML code in. But before continue, we need to understand how the component works first.

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
And that's it! Now you have complete reusable component for your web page. Let's put some code to make a magic happen! Do you still remember component name of this example? It is `"post"`! Now put it in `Se.comp()` function!
```javascript
//This command creates a component, then instantly show the result.
window.postComponent = Se.comp("post",data)
```
To summarise, all of the rest should look like this:
```javascript
import * as Se from "./js/se.js"

//A reusable component.
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
//A data
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
                    id:9024,
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
//Create and show the result.
window.postComponent = Se.comp("post",data)
```
And we are all set for this part!