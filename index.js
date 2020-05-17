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
                !like{
                    <p>No likes</p>
                }like!
                </ol>
            </td>
            <td>
                <ol>
                $hate{
                    <li>$[]</li>
                }hate$
                !hate{
                    <p>No hates</p>
                }hate!
                </ol>
            </td>
            <td>
                <button onclick="like('$name')">Like</button>
            </td>
        </tr>
    }contact$
</table>
!contact{
    <h1>No Contacts!</h1>
}contact!
`)
window.x = Se.comp("table","root",{
    contact:[
        {
            name: "Somchai",
            phone: "085-555-5555",
            like:["apple","mango","orange"],
            hate:["spider","cockroach"]
        },
        {
            name: "",
            phone: "088-888-8888",
            like:[],
            hate:[]
        }
    ]
})