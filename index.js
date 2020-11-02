import * as Se from "./js/se.js"

//Delare Functions!
Se.global.like = function(number){
    alert("You've Liked "+data.contact[number].name)
}

Se.global.edit = function(number){
    Se.global.comp.data.contact[number].name = prompt("New Name")
}

Se.global.reverse = function(number){
    Se.global.comp.data.contact[number].name = data.contact[number].name.split('').reverse().join('')
}

//Setup Resources
let tableComponent = Se.res("comp",/*html*/`
<h1>Contacts</h1>
<table>
    <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Likes</th>
        <th>Hates</th>
        <th>Action</th>
    </tr>
    $contact{
        <tr>    
            <td>$name</td> !name{No name}name!
            <td>$phone</td>
            <td>
                <ol>
                $like{
                    <li>$[]</li>
                }like$
                </ol>
                !like{
                    <p>No likes</p>
                }like!
            </td>
            <td>
                <ol>
                $hate{
                    <li>$[]</li>
                }hate$
                </ol>
                !hate{
                    <p>No hates</p>
                }hate!
            </td>
            <td>
                <button onclick="Se.like($@)">Like</button>
                <button onclick="Se.edit($@)">Edit Name</button>
                <button onclick="Se.reverse($@)">Reverse Name</button>
            </td>
        </tr>
    }contact$
</table>
!contact{
    <h1>No Contacts!</h1>
}contact!

?if($x===3){
    <h1> Hello There! </h1>
    ?if($y===4){
        <h2> Cond0! </h2>
    }?
    ?elif($y===5){
        <h2> Cond1! </h2>
    }?
    ?else{
        <h3> Cond2! </h3>
        ?if($z===6){
            <h3> SubCond0! </h3>
        }?
        ?else{
            <h3> SubCond1! </h3>
        }?
    }?
}?
?else{
    <h1> Good Bye! </h1>
}?
`)
let data = {
    x: 3,
    y: 4,
    z: 6,
    time: 0,
    contact:[
        {
            name: "Somchai",
            phone: "085-555-5555",
            like:["apple","mango","orange"],
            hate:["spider","cockroach"]
        },
        {
            name: "Kanjana",
            phone: "088-888-8888",
            like:[],
            hate:[]
        }
    ]
}

//Create a component!
Se.global.comp = new Se.reactComp("ContactsTable", tableComponent, "root", data)