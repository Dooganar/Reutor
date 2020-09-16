auth.onAuthStateChanged(user => {
    console.log("auth state change triggered")
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

console.log('useQB.js is running on current html document')


generateButton = document.querySelector('#generateButton')
questionZone = document.querySelector('#questionZone')
questionForm = document.querySelector('#findQstnForm')
topicDiv = document.querySelector('#topicDiv')

qSnapshotList = []
questionList = []


//console.log(firebase.database.ref('users/test/email').val())


var x;


updateTopicDiv = function(){
    database.ref('topics/'+questionForm["subject"].value+"/"+questionForm["unit"].value).once("value", function(snapshot1){
        while(topicDiv.hasChildNodes()){
            topicDiv.removeChild(topicDiv.firstChild)
        }
        topicArr = []
        snapshot1.forEach(function(child){
            nTopic = child.val()['name']
            topicArr.push(nTopic)
    
            nTopicLable = document.createElement("label")
            nTopicLable.innerHTML = nTopic
            nTopicLable.setAttribute("for", nTopic)
    
            nTopicInput = document.createElement("input")
            nTopicInput.setAttribute("type", "checkbox")
            nTopicInput.setAttribute("checked", true)
            nTopicInput.setAttribute("name", nTopic)
    
            brElement = document.createElement("br")
    
            topicDiv.appendChild(nTopicInput)
            topicDiv.appendChild(nTopicLable)
            topicDiv.appendChild(brElement)
        })
        questionForm.addEventListener('submit', function(e){
            e.preventDefault()

            questionList = []
            while(questionZone.hasChildNodes()){
                questionZone.removeChild(questionZone.firstChild)
            }

            loadingMessage = document.createElement("h2")
            loadingMessage.innerHTML = "Loading..."
            questionZone.appendChild(loadingMessage)
            console.log("loadingMessageCompletes")
        
            database.ref('questions/'+questionForm['subject'].value+'/'+questionForm['unit'].value).once("value", function(snapshot){
                questionList = []
                while(questionZone.hasChildNodes()){
                    questionZone.removeChild(questionZone.firstChild)
                }
                snapshot.forEach(function(childSnapshot){
                    //qSnapshotList.append([childSnapshot.val(), childSnapshot.key])
                    childSnapshotData = childSnapshot.val()
        
        
        
                    if((questionForm["SF"].checked == false) && (childSnapshotData["difficulty"] == "Simple Familiar")){
                        console.log("SF Question Excluded")
                    }else if((questionForm["CF"].checked == false) && (childSnapshotData["difficulty"] == "Complex Familiar")){
                        console.log("SF Question Excluded")
                    }else if((questionForm["CU"].checked == false) && (childSnapshotData["difficulty"] == "Complex Unfamiliar")){
                        console.log("CU Question Excluded")
                    }else if((questionForm["techFree"].checked == false) && (childSnapshotData["tech"] == "Tech Free")){
                        console.log("Tech Free Question Excluded")
                    }else if((questionForm["techActive"].checked == false) && (childSnapshotData["tech"] == "Tech Active")){
                        console.log("Tech Active Question Excluded")
                    }else if((questionForm["dunno"].checked == false) && (childSnapshotData["tech"] == "Dunno")){
                        console.log("Dunno Question Excluded")
                    }else{
                        console.log("Question "+ childSnapshot.key+ " not excluded... yet")
                        questionList.push([childSnapshotData, childSnapshot.key])
                    }
        
                })
                
                qstnsToRemove = []
                questionList.forEach(function(question){
                    topicArr.forEach(function(topic){
                        if((questionForm[topic].checked == false) && (topic == question[0]["topic"])){
                            qstnsToRemove.push(question)
                        }
                    })
                })
                qstnsToRemove.forEach(function(removedQuestion){
                    index = questionList.indexOf(removedQuestion)
                    questionList.splice(index, 1)
                    console.log("Excluded question "+removedQuestion[1])
                })

                shuffle(questionList);
                questionList.forEach((question, last_index_check) => {
                    console.log(question[1])
                    var LINE = document.createElement("hr")
            
                    var nQstnInfo = document.createElement("div")
                    nQstnInfo.className = "QstnInfo";
            
                    var nQstnDiff = document.createElement("span")
                    nQstnDiff.innerHTML = question[0]["difficulty"]+ ' | '
                    nQstnInfo.appendChild(nQstnDiff)
            
                    var nQstnTech = document.createElement("span")
                    nQstnTech.innerHTML = question[0]["tech"]+ ' | '
                    nQstnInfo.appendChild(nQstnTech)
            
                    var nQstnCont = document.createElement("span")
                    nQstnCont.innerHTML = question[0]["contributer"]+ ' | '
                    nQstnInfo.appendChild(nQstnCont)
            
                    var nQstnId = document.createElement("span")
                    nQstnId.innerHTML = "ID: "+ question[1]
                    nQstnInfo.appendChild(nQstnId)
            
                    var nQstnEl = document.createElement("li")
                    nQstnEl.innerHTML = question[0]["question"];
                    nQstnEl.className = "question";  
            
                    var nQstnAnsButt = document.createElement("span")
                    nQstnAnsButt.innerHTML = "Reveal Answer";
                    nQstnAnsButt.setAttribute('class', 'QstnAnswerButt')
                    var nQstnAns = document.createElement("span")
                    nQstnAns.setAttribute('class',"QstnAnswer");
                    nQstnAns.style.display = "none";
                    nQstnAns.innerHTML = "<br>"+question[0]["answer"]

                    var nQstnOptions = document.createElement('span');
                    nQstnOptions.innerHTML = "<span>&#9734</span><span>&#9998</span>";
                    nQstnOptions.setAttribute('class', 'options')

                    var nQstnOptions2 = document.createElement('span');
                    nQstnOptions2.innerHTML = "<span>&#9872</span><span>&#128465</span>";
                    nQstnOptions2.setAttribute('class', 'options2')
            
                    nQstnOptions.getElementsByTagName('span')[0].addEventListener('click', e => {
                        if (auth.currentUser) {
                        if (e.target.innerHTML == "☆") {
                        e.target.innerHTML = "★";
                        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                            var new_bookmarks = doc.data().bookmarks.push ? doc.data().bookmarks : [];
                            console.log(new_bookmarks)
                            new_bookmarks.push(snapshot.ref.path.toString() + "/" + question[1])
                            db.collection("users").doc(auth.currentUser.uid).update({
                                bookmarks: new_bookmarks
                            })
                        })
                    }
                        else {
                            e.target.innerHTML = "☆";
                            db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                                var new_bookmarks = doc.data().bookmarks;
                                console.log(new_bookmarks)
                                if (new_bookmarks.indexOf(snapshot.ref.path.toString() + "/" + question[1]) != -1) {
                                new_bookmarks.splice(new_bookmarks.indexOf(snapshot.ref.path.toString() + "/" + question[1]), 1);
                                db.collection("users").doc(auth.currentUser.uid).update({
                                    bookmarks: new_bookmarks
                                })
                            }
                            })
                        }
                    }
                    else {
                        window.alert('You must be signed in to use this feature')
                    }
// <-------------------------------------PUT-CODE-TO-TOGGLE-BOOKMARK-HERE---------------------------------------------> //
                    })
                    nQstnOptions2.getElementsByTagName('span')[0].addEventListener('click', e => {
                        if (e.target.innerHTML == "⚐") {
                            e.target.innerHTML = "⚑";
                            db.collection('flag').add({
                                submitted_by: auth.currentUser ? auth.currentUser.uid : "anon",
                                submitted_at: new Date(),
                                complaint_path: snapshot.ref.path.toString() + "/" + question[1],
                                complaint_author: question[0]["contributer"]
                            })
                        }
                        else {
                            e.target.innerHTML = "⚐";
                        }


// <-------------------------------------PUT-CODE-TO-TOGGLE-FLAG-FOR-SPAM-(NOTIFIES-ADMIN)-HERE---------------------------------------------> //
                    })
                    nQstnOptions2.getElementsByTagName('span')[1].addEventListener('click', e => {
                        if (e.target.style['font-weight'] != "900") {
                            e.target.style['font-weight'] = '900';
                            var parent = e.target.parentElement.parentElement.parentElement;
                            parent.style.overflow = "hidden";
                            var interval = setInterval(() => {
                                parent.style.height = parseFloat(getComputedStyle(parent).height) - 3 + "px";
                                if (parseFloat(getComputedStyle(parent).height) < e.target.getBoundingClientRect().bottom - e.target.parentElement.parentElement.parentElement.getBoundingClientRect().top + 3) {
                                    e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[0].style.display = "none";
                                    e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[1].style.display = "none";
                                    e.target.parentElement.parentElement.getElementsByClassName('options2')[0].getElementsByTagName('span')[0].style.display = "none";
                                    e.target.parentElement.parentElement.parentElement.getElementsByClassName('question')[0].style.visibility = "hidden";
                                    clearInterval(interval)
// <-----------------------------PUT-CODE-TO-REMOVE-QUESTION-FROM-FEED-HERE----------------------------------------> //
                                    if (auth.currentUser) {
                                        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                                        var removals = doc.data().removals.push ? doc.data().removals : [];
                                        removals.push(snapshot.ref.path.toString() + "/" + question[1])
                                        console.log(removals);
                                        db.collection("users").doc(auth.currentUser.uid).update({
                                            removals: removals
                                        })
                                    })
                                    }
                                }
                            }, 1)
                        }
                        else {
                            e.target.style['font-weight'] = '400';
                            e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[0].style.display = "initial";
                            e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[1].style.display = "initial";
                            e.target.parentElement.parentElement.getElementsByClassName('options2')[0].getElementsByTagName('span')[0].style.display = "initial";                          
                            e.target.parentElement.parentElement.parentElement.getElementsByClassName('question')[0].style.visibility = "visible";
                            var parent = e.target.parentElement.parentElement.parentElement;
                            var prev_height = getComputedStyle(parent).height;
                            parent.style.height = "initial";
                            var final_height = getComputedStyle(parent).height;
                            parent.style.height = prev_height;
                            var interval = setInterval(() => {
                                parent.style.height = parseFloat(getComputedStyle(parent).height) + 3 + "px";
                                if (parseFloat(getComputedStyle(parent).height) > parseFloat(final_height)) {
                                    parent.style.overflow = "visible"; parent.style.height = final_height; parent.style.height = "unset"; clearInterval(interval)}
                            

                                }, 1)

                            // <-----------------------------PUT-CODE-TO-RE-ADD-QUESTION-FROM-FEED-HERE----------------------------------------> //
                            if (auth.currentUser) {
                            db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                                var removals = doc.data().removals;
                                if (removals.indexOf(snapshot.ref.path.toString() + "/" + question[1]) != -1) {
                                removals.splice(removals.indexOf(snapshot.ref.path.toString() + "/" + question[1]), 1);
                                console.log(removals);
                                    db.collection("users").doc(auth.currentUser.uid).update({
                                        removals: removals
                                    })
                                }
                            })
                        }
                        }
                    })

                    nQstnAnsButt.addEventListener('click', e => {
                        e.target.nextElementSibling.style.display = getComputedStyle(e.target.nextElementSibling).display != "none" ? "none" : "block";
                        e.target.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
                        e.target.nextElementSibling.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
                        e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
                        e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
                        e.target.innerHTML = getComputedStyle(e.target.nextElementSibling).display != "none" ? "Hide Answer" : "Reveal Answer";
                    })
                    
                    nQstnAnsCompleted = document.createElement("span");
                    nQstnAnsCompleted.innerHTML = "Mark as Completed";
                    nQstnAnsCompleted.setAttribute('class', 'QstnAnswerButt2')

                    nQstnAnsStudy = document.createElement("span");
                    nQstnAnsStudy.innerHTML = "Keep Practicing";
                    nQstnAnsStudy.setAttribute('class', 'QstnAnswerButt2')
                    
                    nQstnAnsAlternate = document.createElement("span");
                    nQstnAnsAlternate.innerHTML = "Suggest Alternate Answer";
                    nQstnAnsAlternate.setAttribute('class', 'QstnAnswerButt2')
                    
                    nQstnAnsTopic = document.createElement("span");
                    nQstnAnsTopic.innerHTML = "Suggest Alternate Unit/Topic";
                    nQstnAnsTopic.setAttribute('class', 'QstnAnswerButt2')


                    nQstnAnsCompleted.style.display = "none";
                    nQstnAnsStudy.style.display = "none";
                    nQstnAnsAlternate.style.display = "none";
                    nQstnAnsTopic.style.display = "none";

                    nQstnAnsCompleted.addEventListener('click', e => {
                        //mark as completed
                    })
                    nQstnAnsStudy.addEventListener('click', e => {
                        //mark as for practice
                    })
                    nQstnAnsAlternate.addEventListener('click', e => {
                        //send off alternate answer
                    })
                    nQstnAnsTopic.addEventListener('click', e => {
                        //send off alternate topic
                    })


                    // nQstnSaveButt = document.createElement("button")
                    // nQstnSaveButt.innerHTML = "SAVE"
                    // nQstnSaveDiv = document.createElement("div")
                    // nQstnSaveDiv.style.display = "none"

                    // nQstnSaveToCorrect = document.createElement("input"); nQstnSaveToCorrect.type = "checkbox"
                    // nQstnSaveToCorrectL = document.createElement("lable"); nQstnSaveToCorrectL.innerHTML = "Correct"
                    // nQstnSaveToIncorrect = document.createElement("input"); nQstnSaveToIncorrect.type = "checkbox"
                    // nQstnSaveToIncorrectL = document.createElement("lable"); nQstnSaveToIncorrectL.innerHTML = "Incorrect"
                    // nQstnSaveToDone = document.createElement("input"); nQstnSaveToDone.type = "checkbox"
                    // nQstnSaveToDoneL = document.createElement("lable"); nQstnSaveToDoneL.innerHTML = "Done"
                    // nQstnSaveDiv.appendChild(nQstnSaveToCorrect); nQstnSaveDiv.appendChild(nQstnSaveToCorrectL); nQstnSaveDiv.appendChild(nQstnSaveToIncorrect); nQstnSaveDiv.appendChild(nQstnSaveToIncorrectL); nQstnSaveDiv.appendChild(nQstnSaveToDone); nQstnSaveDiv.appendChild(nQstnSaveToDoneL);



                    // nQstnSaveButt.addEventListener("click", function(event){
                    //     if(event.target.innerHTML == "-SAVE-"){
                    //         event.target.nextElementSibling.style.display = "none"
                    //         event.target.innerHTML = "SAVE"
                    //         console.log(nQstnSaveButt.innerHTML)
                    //     } else{
                    //         event.target.innerHTML = "-SAVE-"
                    //         event.target.nextElementSibling.style.display = "block"
                    //         console.log(nQstnSaveButt.innerHTML)
                    //     }
                    // })

            
            
            
            

                    var individual_question = document.createElement("DIV")
                    individual_question.setAttribute('class', 'individual_question')

                    nQstnInfo.appendChild(nQstnOptions)
                    nQstnInfo.appendChild(nQstnOptions2)
                    individual_question.appendChild(nQstnInfo)
                    individual_question.appendChild(nQstnEl)
                    individual_question.appendChild(nQstnAnsButt)
                    individual_question.appendChild(nQstnAns)
                    individual_question.appendChild(nQstnAnsCompleted);
                    individual_question.appendChild(nQstnAnsStudy);
                    individual_question.appendChild(nQstnAnsAlternate);
                    individual_question.appendChild(nQstnAnsTopic);

                    // questionZone.appendChild(nQstnSaveButt)
                    // questionZone.appendChild(nQstnSaveDiv)
                    questionZone.appendChild(individual_question);
                    questionZone.appendChild(LINE)
                
                if (last_index_check == questionList.length - 1 && auth.currentUser) {
                    db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
                        var removal_array = doc.data().removals;
                        var bookmark_array = doc.data().bookmarks;
                        console.log('AUTH', removal_array, bookmark_array);
                        ([]).forEach.call(document.getElementsByClassName('individual_question'), ele => {
                            var qstn_id = ele.getElementsByClassName('QstnInfo')[0].childNodes[3].childNodes[0].data.split(' ')[1]
                            if (removal_array.includes(snapshot.ref.path + "/" + qstn_id)) {
                                ele.style.overflow = "hidden";
                                ele.getElementsByClassName('options')[0].getElementsByTagName('span')[0].style.display = "none";
                                ele.getElementsByClassName('options')[0].getElementsByTagName('span')[1].style.display = "none";
                                ele.getElementsByClassName('options2')[0].getElementsByTagName('span')[0].style.display = "none";
                                ele.getElementsByClassName('question')[0].style.visibility = "hidden";
                                
                                ele.getElementsByClassName('options2')[0].childNodes[1].style['font-weight'] = '900';
                                ele.style.height = ele.getElementsByClassName('options2')[0].getElementsByTagName('span')[1].getBoundingClientRect().bottom - ele.getBoundingClientRect().top + "px";

                            }
                            if (bookmark_array.includes(snapshot.ref.path + "/" + qstn_id)) {
                                ele.getElementsByClassName('options')[0].childNodes[0].innerHTML = "★"
                            }
                        })
                         })
                } })

                if(questionList.length==0){
                    message = document.createElement("p")
                    message.innerHTML = "Sorry, we don't seem to have any "+questionForm["subject"].value+ " " + questionForm["unit"].value+ " questions in our database (that fit your descriptors)."
                    message.setAttribute("class", "errorMessages")
                    questionZone.appendChild(message)
                }
                
            })
            
            
             
        })
    })
}

if ((questionForm['subject'].value != "") && (questionForm['unit'].value != "")){
    updateTopicDiv()
}


questionForm["subject"].addEventListener("change", function(){
    if ((questionForm['subject'].value != "") && (questionForm['unit'].value != "")){
        updateTopicDiv()
    }
})
questionForm["unit"].addEventListener("change", function(){
    if ((questionForm['subject'].value != "") && (questionForm['unit'].value != "")){
        updateTopicDiv()
    }
})

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
