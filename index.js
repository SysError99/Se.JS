import * as Se from "./js/se.js"
window.like = function(name){
    alert("You've Liked "+name)
}
Se.res("comp","table",`
<h1>Contacts</h1>
<table>
    <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Likes</th>
        <th>Action</th>
    </tr>
    \${
        <tr>    
            <td>$name</td>
            <td>$phone</td>
            <td>
                <ol>
                \${
                    <li>$[]</li>
                }\$
                !{
                    <p>None</p>
                }!
                </ol>
            </td>
            <td>
                <button onclick="like('$name')">Like</button>
            </td>
        </tr>
    }\$
</table>
!{
    <h1>No Contacts!</h1>
}!
`)
window.x = Se.comp("table","root",{
    $:[
        {
            name: "Somchai",
            phone: "085-555-5555",
            $:["apple","mango","orange"]
        },
        {
            name: "kanjana",
            phone: "088-888-8888",
            $:[]
        }
    ]
})