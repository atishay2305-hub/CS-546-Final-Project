const loginbtn = document.getElementById('login');
const signupbtn = document.getElementById('signup');

loginbtn.addEventListener('click',()=>{
    window.location.href ='/login';
});

signupbtn.addEventListener('click', () => {
    window.location.href ='/signup';
});
