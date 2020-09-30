console.log("Reutor's atar_calculator.js is linked")



auth.onAuthStateChanged(function(user){
    //----------------------Opening Users Pre-Saved Subject History--------------------
    if(user){
        db.collection("users").doc(auth.currentUser.uid).collection("grades").get().then(function(snapshot){
            if (snapshot.size != 0){
                snapshot.forEach(function(subjectDoc){
                    subjectData = subjectDoc.data()
                    subjectDataArr = [
                        subjectData["Y1ia1"],
                        subjectData["Y1ia2"],
                        subjectData["Y1ia3"],
                        subjectData["Y1ia4"],
                        subjectData["Y2ia1"],
                        subjectData["Y2ia2"],
                        subjectData["Y2ia3"],
                        subjectData["Y2ia4"]
                        ]
                    
                    //console.log(subjectDataArr)
                    
                    addSubjectRow(user, subjectDataArr, subjectDoc.id)
                })
            }else{
                addSubjectRow(user)
            }

        })
    }else{
        addSubjectRow(user)
    }
    //---------------------------------------------------------------------------------
    //-----------------------Adding Subjects to Table Functionality:-------------------
    $("addSubjectButt").addEventListener("click", function(){
        addSubjectRow(user)
    })
    //---------------------------------------------------------------------------------
    //----------------Calculating Results and uploading data to firebase:--------------
    $("calculateButt").addEventListener("click", function(event){
        dataArray = []
        for(child in bigTable.childNodes){
            if(child != 0 && child != 1 && child % 1 == 0){
                subjectData = []
                //console.log(bigTable.childNodes[child])
                for(gchild in bigTable.childNodes[child].childNodes){
                    if(gchild == 0){
                        subjectData.push(bigTable.childNodes[child].childNodes[gchild].value)
                    }else if(gchild % 1 == 0){
                        //console.log(gchild)
                        if(!(gchild % 2 == 0)){
                            subjectData.push(bigTable.childNodes[child].childNodes[gchild].firstChild.value)
                        }
                        
                    }
                }
                dataArray.push(subjectData)
            }
        }
        //console.log(dataArray)
        // UPLOAD USER DATA TO FIREBASE:
        if(user){   
            for(subject in dataArray){
                //console.log(subject)
                db.collection("users").doc(auth.currentUser.uid).collection("grades").doc(dataArray[subject][0]).set({
                    Y1ia1: dataArray[subject][1], 
                    Y1ia2: dataArray[subject][2],
                    Y1ia3: dataArray[subject][3],
                    Y1ia4: dataArray[subject][4],
                    Y2ia1: dataArray[subject][5], 
                    Y2ia2: dataArray[subject][6],
                    Y2ia3: dataArray[subject][7],
                    Y2ia4: dataArray[subject][8],
                })
            }
        }
        //-----------------------------
        //----------------ACTUAL CALCULATIONS AND SHIT--------------------------
        
        calculateDiv = document.createElement("div")
        calculateDiv.classList = "pageContent"

        
        atarCalculationDiv = document.createElement("div")
        atarCalculationDiv.classList = "pageContent"
        atarTitle = document.createElement("h2")
        atarTitle.innerHTML = "Your Atar"
        atarTitle.style.textAlign = "center"
        atarCalculationP = document.createElement("p")
        atarCalculationP.innerHTML = "<br>If you have given us enough information, your predicted ATAR will be displayed on your <a target='_blank' href='account.html'>ACCOUNT</a> page after the next round of ATAR calculations are completed. This is because ATAR predictions are calculated in 'batches' (all at once) on <i>Reutor</i> so that we can use the same algorithm that QCAA uses.<br><br> The calculation of your real ATAR requires not just your grades, but the grades of your entire cohort. Although not entirely the same, <i>Reutor</i> uses 'mini cohorts' made up of <i>Reutor</i> users like yourself."
        atarCalculationDiv.appendChild(atarTitle)
        atarCalculationDiv.appendChild(atarCalculationP)




        while($("endOfContentDiv").hasChildNodes()){
            $("endOfContentDiv").firstChild.remove()
        }
        calculateDiv.appendChild(addSubjectDataColumn(1))
        calculateDiv.appendChild(addSubjectDataColumn(2))

        $("endOfContentDiv").appendChild(document.createElement("br"))
        $("endOfContentDiv").appendChild(calculateDiv)
        $("endOfContentDiv").appendChild(document.createElement("br"))
        $("endOfContentDiv").appendChild(atarCalculationDiv)



        //----------------------------------------------------------------------

    })
    //---------------------------------------------------------------------------------
})

addSubjectDataColumn = function(year){
    Year1Div = document.createElement("span")
    Year1Div.style.display = "inline-block"
    Year1Div.style.width = "49%"
    Year1Title = document.createElement("h3")
    Year1Title.style.textAlign = "center"
    if(year==1){
        Year1Title.innerHTML = "Units 1 and 2 Percentages: "
        Year1Div.style.borderRight = "solid black"
    }else{
        Year1Title.innerHTML = "Units 3 and 4 Percentages: "
    }
    Year1Div.appendChild(Year1Title)

    let scoreList = []

    numToAdd = (year-1)*4

    for(subject in dataArray){
        subData = dataArray[subject]

        Year1Message = document.createElement("p")
        Year1Message.style.textAlign = "center"
        //console.log(subData[1], subData[2], subData[3])

        oldInternalMarks = 100-subjectsDict[subData[0]][3]
        newInternalMarks = oldInternalMarks
        for(let i = 1; i<4; i++){
            if(subData[i+numToAdd]==""){
                newInternalMarks -= subjectsDict[subData[0]][i-1]
            }
        }
    
        scaleFactor = oldInternalMarks/newInternalMarks
        

        IA1 = Number(subData[1+numToAdd])*scaleFactor
        IA2 = Number(subData[2+numToAdd])*scaleFactor
        IA3 = Number(subData[3+numToAdd])*scaleFactor
        IA4 = Number(subData[4+numToAdd])

        if(subData[4+numToAdd]==""){
            IA4 = ((IA1+IA2+IA3)/oldInternalMarks)*subjectsDict[subData[0]][3]
        }

        //console.log(IA1, IA2, IA3, IA4, scaleFactor, oldInternalMarks, newInternalMarks)

        subjectScore = Math.floor(IA1+IA2+IA3+IA4)
        scoreList.push(subjectScore)

        if(newInternalMarks==0){
            Year1Message.innerHTML = `...Not enough ${subData[0]} data...`
        }else if(newInternalMarks!=oldInternalMarks){
            Year1Message.innerHTML = `${subData[0]} (predicted): <span style="color:black">${subjectScore}%</span>`
        }else{
            Year1Message.innerHTML = `${subData[0]}: <span style="color:black">${subjectScore}%</span>`
        }
        


        Year1Div.appendChild(Year1Message)
    }

    let averageScore = 0
    // for(let i=0; i<scoreList.length; i++){
    //     averageScore += scoreList
    // }
    scoreList.forEach(function(score){
        averageScore += score
    })
    averageScore = averageScore/scoreList.length


    averageScoreElement = document.createElement("p")
    averageScoreElement.innerHTML = "<br><b>AVERAGE: </b>"+ averageScore+"%"
    averageScoreElement.style.textAlign = "center"
    averageScoreElement.style.color = "black"
    Year1Div.appendChild(averageScoreElement)

    return Year1Div 
}

addSubjectRow = function(user, info, subName){
    bigTable = $("bigTable")
    nRow = document.createElement("tr")

    nSubject = document.createElement("select")
    for(let subject in subjectsDict){
        nOption = document.createElement("option")
        nOption.innerHTML = subject
        nSubject.appendChild(nOption)
    }

    nSubject.addEventListener("change", function(event){
        for(input in event.target.parentNode.childNodes){
            if(input%2==0 && input != 0){
                actualInput = event.target.parentNode.childNodes[input].childNodes[1]
                
                if(!subjectsDict[event.target.value]){
                    actualInput.innerHTML = "??"
                }else{
                    //console.log(input)
                    actualInput.innerHTML = subjectsDict[event.target.value][((input/2)-1) % 4]
                }
            }else if(input%1==0 && input != 0){
                //console.log(input)
                actualInput = event.target.parentNode.childNodes[input].firstChild
                if(subjectsDict[event.target.value]){
                    actualInput.max = subjectsDict[event.target.value][(input-1)/2 % 4]
                    // actualInput.max = (input-1)/2 % 4
                    // actualInput.max = input
                }else{
                    actualInput.max = ''
                }
            }
        }
    })
    
    if(subName != null){
        nSubject.value = subName
    }

    nRow.appendChild(nSubject)

    for(let i=1; i <= 16; i++){
        nData = document.createElement("td")
        if(i % 2 != 0){
            nInput = document.createElement("input")
            nInput.type = "number"
            nInput.min = 0
            if(subName != null){
                if(subjectsDict[subName]!=0){
                    nInput.max = subjectsDict[subName][(((i+1)/2-1) % 4)]
                }
            }else{
                nInput.max = subjectsDict["English"][(((i+1)/2-1) % 4)]
            }
            
            nInput.classList.add("markInput")
            if(info != null){
                nInput.value = info[(i-1)/2]
            }
            
            nData.appendChild(nInput)
        }else{
            nSlash = document.createElement("p")
            nSlash.innerHTML = "/"
            nSlash.style.display = "inline"

            nInput = document.createElement("p")
            nInput.classList.add("outOfText")
            //nInput.innerHTML = subjectsDict["English"][((i/2-1) % 4)]
            if(subName != null){
                nInput.innerHTML = subjectsDict[subName][(((i)/2-1) % 4)]
            }else{
                nInput.innerHTML = subjectsDict["English"][(((i)/2-1) % 4)] 
            }
            nInput.style.display = "inline"
            // nInput = document.createElement("input") // Old input system
            // nInput.classList.add("markInput") //old input sytem
            // nInput.value = subjectsDict["English"][((i/2-1) % 4)] //old input system
            nInput.style.fontWeight = "bold"
            nData.appendChild(nSlash)
            nData.appendChild(nInput)
        }
        nRow.appendChild(nData)
    }

    nDeleteButt = document.createElement("p")
    nDeleteButt.innerHTML = "🗑"
    nDeleteButt.style.cursor = "pointer"
    nRow.appendChild(nDeleteButt)
    
    nDeleteButt.addEventListener("click", function(event){
        if(user){
            db.collection("users").doc(auth.currentUser.uid).collection("grades").doc(event.target.parentNode.firstChild.value).delete()
            console.log(`Removed ${event.target.parentNode.firstChild.value} marks from database`)
        }
        event.target.parentNode.remove()
    })

    bigTable.appendChild(nRow)
}


//---------------------------------------------------------------------------------
// ------------------------Bens Sign Up Stuff:-------------------------------------

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

// ----------------------------------------------------------------------------------------------------------------------