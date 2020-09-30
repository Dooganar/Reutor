console.log("Reutor's universal javascript file linked")

$ = ele => {return document.getElementById(ele)}

subjectsDict = {
    "English": [25, 25, 25, 25], 
    "Maths Methods": [20, 15, 15, 50], 
    //"General Maths": 0,
    "Specialist Maths": [20, 15, 15, 50],
    "Physics": [10, 20, 20, 50],
    "Chemistry": [10, 20, 20, 50], 
    //"Biology": 0,
    //"Buisness": 0,
    //"Legal": 0,
    //"Drama": 0,
    //"PE": 0,
    //"Legal": 0,
    "Engineering": [25, 25, 25, 25],
    //"IT": 0,
    //"Music": 0
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
