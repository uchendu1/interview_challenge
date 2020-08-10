

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// get 
async function getTasks(){
  const options= {
    "headers":{
      "Authorization": localStorage.getItem("token")
    }
  }
  try{
    const response = await fetch('/mytasks', options )
    const json = await response.json()
    const data = json.tasks
    const lists = document.getElementById("myUL");
    if (response.ok){
      data.forEach((item)=> {
        const li = document.createElement("li");
        li.innerText = item.title
        const span = document.createElement("SPAN");
        const txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.setAttribute("data-id", item._id)
        span.appendChild(txt);
        li.appendChild(span);
        lists.appendChild(li)
      })
      deleteEvent()

    }else{
      alert(json.message)
    }}catch(e){
      console.log(e)
    }
}

async function deleteRequest(itemId){
 
      const options= {
        method:"POST",
        "headers":{
          "Authorization": localStorage.getItem("token")
        }
      }
      try{
        const response = await fetch(`/deletetask/${itemId}`, options)
        const json = await response.json()
        if(response.ok){
          alert(json.message)
        }

      }catch(e){
        alert(json.message)
      }
}

function deleteEvent(){
  for (i = 0; i < close.length; i++) {
    close[i].onclick = async function (e) {
      try{
        await deleteRequest(e.target.dataset.id)
        const div = this.parentElement;
        div.style.display = "none";
        
      }catch(e){
        alert(e.message)
      }

    }
  }
}

// Create a new list item when clicking on the "Add" button
async function newElement() {

  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput");
  var t = document.createTextNode(inputValue.value);
  li.appendChild(t);

  if (inputValue === '') {
    alert("You must write something!");
  } else {

    const body = {
      title: inputValue.value
    }

    const options= {
      "method": "POST",
      "headers":{
        "Content-Type":"application/json;charset=utf-8",
        "Authorization": localStorage.getItem("token")
      }
    }

    options.body = JSON.stringify(body)
    try{
      const response = await fetch('/addtask', options )
      const json = await response.json()
      console.log(json)

      if (response.ok){
        document.getElementById("myUL").appendChild(li);
        inputValue.value = ""
    
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);
      
        deleteEvent()
      }else{
        alert(json.message)
      }
    }catch (e){
      alert(e.message)
    }


   
  }
  // document.getElementById("myInput").value = "";
  


}


// ======================== sign up

var checkTexts = /^[a-zA-Z ]+$/;
// var checkPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
// var checkEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


function validate(e) {

  e.preventDefault();
  var username = document.myForm.username.value;
  var password = document.myForm.password.value;
  var email = document.myForm.email.value;

  // email validation

  function validateEmail() {
    atpos = email.indexOf("@");
    dotpos = email.lastIndexOf(".");

    if (atpos < 1 || (dotpos - atpos < 2)) {
      alert("Please enter correct email ID")
      document.myForm.email.focus();
      return false;
    }
    return (true);
  }

  function validateText() {
    if (username !== checkTexts) {
      alert('Enter texts only')
      document.myForm.username.focus();
      return false;
    }
    return (true);
  }
  const data = {
    username: username,
    password: password,
    email: email
  }
  console.log(data);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/signup', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    if(xhr.status == 201){
      var data = JSON.parse(this.responseText);
      console.log(this.response);
      localStorage.setItem("token", this.response.token);
      localStorage.setItem("userObj", JSON.stringify(this.response.user));
      window.location.href = "to-do-lists.html"
    } else{
      console.log(xhr);
      alert(xhr.responseText);
    }
    

  };
};


// login validate

function login(e) {

  e.preventDefault();
  // var username = document.myForm.username.value;
  var password = document.myForm.password.value;
  var email = document.myForm.email.value;

  // email validation

  function validateEmail() {
    atpos = email.indexOf("@");
    dotpos = email.lastIndexOf(".");

    if (atpos < 1 || (dotpos - atpos < 2)) {
      alert("Please enter correct email ID")
      document.myForm.email.focus();
      return false;
    }
    return (true);
  }

 
  const data = {
    password: password,
    email: email
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  xhr.onload = function () {
    if(xhr.status == 200){
      var data = JSON.parse(this.responseText);
      console.log(this.responseText);
      console.log(this.response);
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userObj", JSON.stringify(data.user));
      window.location.href = "to-do-lists.html"
    } else{
      console.log(xhr);
      alert(xhr.responseText);
    }
     
  };
};