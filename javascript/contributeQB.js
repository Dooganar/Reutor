contributeForm = document.querySelector("#newQstnForm")

let date = new Date;
console.log(date)


//------------------------------------------DRAWING FUNCTIONALITY 2.0----------------------------------------------
var lcQ, lcA
$("createSvgButt").addEventListener("click", function(event){
  if(event.target.value == "draw"){
    var allContent = document.getElementsByClassName('pageContent');
    for (var i = 0; i < allContent.length; i++) {
      allContent[i].style.margin = '0% 2% 0% 2%'
    }
    event.target.value = "-draw-"
    if($("questionCanvas")==undefined){
      qCanvas = document.createElement("div")
      qCanvas.id = "questionCanvas"
      contributeForm["questionInput"].insertAdjacentElement("afterend", qCanvas)
      lcQ = LC.init(document.getElementById("questionCanvas"), {
        imageURLPrefix: './lcanvas/lc-images',
        toolbarPosition: 'bottom',
        defaultStrokeWidth: 2,
        strokeWidths: [1, 2, 3, 5, 30]
      });
    }else{ 
      $("questionCanvas").style.display = "inline"
    }
  }else{
    var allContent = document.getElementsByClassName('pageContent');
    for (var i = 0; i < allContent.length; i++) {
      allContent[i].style.margin = '0% 20% 0% 20%'
    }
    event.target.value = "draw"
    $("questionCanvas").style.display = "none"
  }

})
$("createSvgButtA").addEventListener("click", function(event){
  if(event.target.value == "draw"){
    event.target.value = "-draw-"
    if($("answerCanvas")==undefined){
      aCanvas = document.createElement("div")
      aCanvas.id = "answerCanvas"
      contributeForm["answerInput"].insertAdjacentElement("afterend", aCanvas)
      lcA = LC.init(document.getElementById("answerCanvas"), {
        imageURLPrefix: './lcanvas/lc-images',
        toolbarPosition: 'bottom',
        defaultStrokeWidth: 2,
        strokeWidths: [1, 2, 3, 5, 30]
      });
    }else{
      $("answerCanvas").style.display = "inline"
    }
    
  }else{
    event.target.value = "draw"
    $("answerCanvas").style.display = "none"
  }
})
//-------------------------------------------------------------------------------------------------------------

//-------------------OLD SVG FILE READING SYSTEM-----------------------
//fileReader = new FileReader();
// $("svgFileInput").addEventListener("change", function(event){
//   fileReader.readAsText(event.target.files[0])
//   fileReader.addEventListener("load", function(event){
//     contributeForm["questionInput"].innerHTML = event.target.result
//   })
// })
// $("svgFileInputA").addEventListener("change", function(event){
//   fileReader.readAsText(event.target.files[0])
//   fileReader.addEventListener("load", function(event){
//     contributeForm["answerInput"].innerHTML = event.target.result
//   })
// })
//---------------------------------------------------------------------



auth.onAuthStateChanged(user => {
  //console.log(user)
  if (user) {
      $('welcomeMessage').innerHTML = `Welcome, ${user.email.slice(0, user.email.lastIndexOf('@'))}`  
      $('signup_button').innerHTML = `<br><p class="navButton">Logout</p><br><p class="navButton">Account</p>`
      $('signup_button').className = ""
  }
})

document.addEventListener('click', e => {
  if ($('signup_form').style.display == "block" && $('signup_form') != e.target && $('signup_button') != e.target && !$('signup_form').contains(e.target)) {
      $('signup_form').style.display = "none";
  }
})

$('signup_button').addEventListener('click', e => {
  if (e.target.innerHTML == "LOGIN/SIGNUP") {
  $('signup_form').style.display = $('signup_form').style.display == "block" ? "none" : "block";}
  else if (e.target.innerHTML == "Logout") {
      auth.signOut().then(() => location.reload());
  }
  else {
      location.assign('account.html')
  }
})
$('signup_form').getElementsByTagName('form')[0].addEventListener('submit', e => {
    e.preventDefault();
    ([]).forEach.call(document.getElementsByClassName('error'), ele => {ele.innerHTML = "";})
    auth.signInWithEmailAndPassword(e.target.usernameLI.value + "@rutor.com", e.target.passwordLI.value).then(() => {window.location.reload()}).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
})
$('signup_form').getElementsByTagName('form')[1].addEventListener('submit', e => {
  e.preventDefault();
  ([]).forEach.call(document.getElementsByClassName('error'), ele => {ele.innerHTML = "";})
  if (e.target.passwordSU.value == e.target.confirmSU.value) {
  auth.createUserWithEmailAndPassword(e.target.usernameSU.value + "@rutor.com", e.target.passwordSU.value).then(auth_id => {
      console.log(auth_id.uid);
      db.collection('users').doc(auth_id.user.uid).set({
          bookmarks: [],
          removals: [],
          practice: [],
          completed: [],
      }).then(docRef => {window.location.reload()})
  }).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
  }
  else {
      e.target.nextElementSibling.innerHTML = "Passwords do not match";
  }
})

console.log("contributeQB.js is running on current html document")

autoArr = []
updateAutoArr = function(){
  arr = []
  database.ref("topics/"+contributeForm["subject"].value+"/"+contributeForm["unit"].value).once("value", function(snapshot){
    snapshot.forEach(function(child){
      arr.push(child.val()["name"])
    })
    autoArr = arr
    autocomplete(contributeForm["topic"], autoArr)
    console.log(autoArr)
  })
}


contributeForm["topic"].addEventListener("focus", (e)=>{
  if ((contributeForm['subject'].value != "") && (contributeForm['unit'].value != "")){
    updateAutoArr()
  }
})




contributeForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  //change if you want to allow anonymous contributions
  if (auth.currentUser == null && false) {e.target.nextElementSibling.innerHTML = "You must be signed in to contribute"}
  
  // else if (auth.currentUser.email.slice(0, auth.currentUser.email.lastIndexOf('@'))) {
  //   e.target.nextElementSibling.innerHTML = "Your contributor name must be the same as your username";
  // }
  else {
    $('contributeButton').style.display = "none";
    console.log("Form_Submitted")
    console.log("Form submitted by "+contributeForm['contributer'].value)
    
    if(lcQ != undefined){questionSVGstring = "<br>"+ lcQ.getSVGString()}else{questionSVGstring = ""}
    if(lcA != undefined){answerSVGstring = "<br>"+ lcA.getSVGString()}else{answerSVGstring = ""}
    

    database.ref(`questions/${contributeForm['subject'].value}/${contributeForm['unit'].value}/${Math.round(Math.random()*100000000)}`).set({
      difficulty: contributeForm['difficulty'].value,
      contributer: contributeForm['contributer'].value,
      question: contributeForm['questionInput'].value.replaceAll("\n", "</br>") + questionSVGstring,
      answer: contributeForm['answerInput'].value.replaceAll("\n", "</br>")+ answerSVGstring,
      //workingOut: contributeForm['workingOutInput'].value.replaceAll().replaceAll("\n", "</br>"),
      tech: contributeForm['tech'].value,
      topic: contributeForm["topic"].value, 
      dateSubmitted: date.toString(),
      testt: "Heloooo"
    }).catch(error => {e.target.nextElementSibling.innerHTML = error.message; $('contributeButton').style.display = "initial";});
    console.log(new Date())

    //-------------------------Add to topics list functionality:---------------------
    database.ref("topics/"+contributeForm["subject"].value+"/"+contributeForm["unit"].value).once("value", function(snapshot){
      pushTopic = true
      snapshot.forEach(function(child){
        if(child.val()["name"] == contributeForm["topic"].value){
          pushTopic = false
        }
      })
      if(pushTopic){
        database.ref("topics/"+contributeForm["subject"].value+"/"+contributeForm["unit"].value).push().set({
          name: contributeForm["topic"].value
        })
      }
    }).then(ref => window.location.href="./index.html").catch(error => {e.target.nextElementSibling.innerHTML = error.message; 
      $('contributeButton').style.display = "initial";})
    //-------------------------------------------------------------------------------

}
})
//console.log(database.ref('Questions/question1').val())



function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  
  startingSuggestions = function(e){
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    inp.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*create a DIV element for each matching element:*/
      b = document.createElement("DIV");
      /*make the matching letters bold:*/
      b.innerHTML = arr[i]
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
    }
  }
  startingSuggestions()
  
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
} 