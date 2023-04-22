const loginbtn = document.getElementById('login');
const signupbtn = document.getElementById('signup');
const profilebtn = document.getElementById('profile');
const form = document.getElementById('myForm');

//console.log(profilebtn); 

loginbtn.addEventListener('click',()=>{
    window.location.href ='/login';
});

signupbtn.addEventListener('click', () => {
    window.location.href ='/signup';
});

form.addEventListener("submit",function(event){
    event.preventDefault();
    window.location.href='/createpost';
})

