//const guideList = document.querySelector('.guides');
const chatBox = document.querySelector('.chat-box');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');


const setupUI = (user) => {
    if(user){
        //account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
            <div>Logged in as ${user.email}</div>
            <div>Bio: ${doc.data().bio}</div>
            <div>Username: ${user.displayName}</div>
            <div>Moderator status: ${doc.data().isModerator}</div>
            `;
            accountDetails.innerHTML = html;
        });
        
        
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        //hide any remaining account info
        accountDetails.innerHTML = '';
        //toggle UI elements
        loggedOutLinks.forEach(item => item.style.display = 'block');
        loggedInLinks.forEach(item => item.style.display = 'none');
    }
}

//setup messages
const setupMessages = (data) => {
    let html = '';
    data.forEach(doc => {
        const message = doc.data('message');
        const div = `
            <div><span class=\"${getFlairs(message)}\">${message.username}</span><span>: ${message.message}</span></div>
        `;
        html += div;
    });
    chatBox.innerHTML = html;
}

//gets the flairs of a user
function getFlairs(message){
    var user = db.collection("users").doc(message.uid);
    let flairs;
    user.get().then((doc) =>{
        console.log(doc.data().isUser);
        if(doc.data().isUser){
            flairs += "user ";
            console.log(doc.data().isUser);
        }
        if(doc.data().isModerator){
            flairs += "moderator ";
            console.log(doc.data().isModerator);
        }
        if(doc.data().isBroadcaster){
            flairs += "broadcaster ";
            console.log(doc.data().isBroadcaster);

        }
    });
    return flairs;
}


//setup materialize components
document.addEventListener('DOMContentLoaded', function(){

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    //THIS DOESNT WORK EITHER
    let element = document.querySelector("#chat-container");
    element.scrollIntoView({block: "end"});

});

