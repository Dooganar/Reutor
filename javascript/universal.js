console.log("Reutor's universal javascript file linked")

$ = ele => {return document.getElementById(ele)}

subjectsDict = {
    "English": [25, 25, 25, 25], 
    "Maths Methods": [20, 15, 15, 50], 
    "General Maths": [20, 15, 15, 50],
    "Specialist Maths": [20, 15, 15, 50],
    "Physics": [10, 20, 20, 50],
    "Chemistry": [10, 20, 20, 50], 
    "Biology": [10, 20, 20, 50],
    "Business/Economics": [25, 25, 25, 25],
    "Legal": [25, 25, 25, 25],
    "Drama/Dance": [20, 20, 35, 25],
    "Music": [20, 20, 35, 25],
    "PE": [25, 20, 30, 25],
    "Engineering": [25, 25, 25, 25],
    "Digital Solutions": [20, 30, 25, 25],
    "*Language*": [15, 30, 30, 25]
}

auth.onAuthStateChanged(user => {
    //console.log(user);
    if(user){
        db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
            userData = doc.data()
            if(userData && userData.isDarkMode == true || (window.matchMedia('prefers-color-scheme: dark').matches && userData.isDarkMode === undefined)){
                document.querySelector("html").classList.add("darkMode");
            }
            else if (!userData) {
                if(window.matchMedia('prefers-color-scheme: dark').matches){
                    document.querySelector("html").classList.add("darkMode");
                } 
            }
        })

    }
    else {
        if(window.matchMedia('prefers-color-scheme: dark').matches){
            document.querySelector("html").classList.add("darkMode");
        }
    }
})
