

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if(user){
        // get data (onSnapshot sets up a realtime listener)
        // db.collection('guides').onSnapshot(snapshot => {
        // setupGuides(snapshot.docs);
        // });
        setupUI(user);
    } else {
        //setupGuides([]);
        setupUI();
    }
    db.collection('message').orderBy('sort').onSnapshot(snapshot => {
        setupMessages(snapshot.docs);
    })
});

//create new guide
// const createForm = document.querySelector('#create-form');
// createForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     db.collection('guides').add({
//         title: createForm['title'].value,
//         content: createForm['content'].value
//     }).then(() => {
//         //close modal and reset form
//         const modal = document.querySelector('#modal-create');
//         M.Modal.getInstance(modal).close();
//         createForm.reset();

//     }).catch(err => {
//         console.log(err.message);
//     })
// });

//submit chat message to server
const messageBox = document.querySelector('#message-box');

const sendMessage = () => {
    var user = firebase.auth().currentUser;
    if(user){
        console.log(user);
        db.collection('message').add({
            sort: firebase.firestore.FieldValue.serverTimestamp(),
            username: firebase.auth().currentUser.displayName,
            message: messageBox['message-content'].value,
            //email: auth.user.email
        });
    } else {
        console.log('you are fucking stupid');
    }
}

function onEvent(event){ 
        if(event.key === "Enter"){
            sendMessage();
            messageBox.reset();
        }
}


// sign-ups
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //add bio and uid to firestore database
        firebase.auth().currentUser.updateProfile({
            displayName: signupForm['signup-username'].value,
        }).catch(function(error){
            console.log(error);
        });
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value,
        });
    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) =>{
    e.preventDefault();
    
    auth.signOut();
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {

        //close login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    });
});