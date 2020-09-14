console.log("Reutor's universal javascript file linked")

$ = ele => {return document.getElementById(ele)}

auth.onAuthStateChanged(user => {
    console.log(user);
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
