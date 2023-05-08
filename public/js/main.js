// const loginbtn = document.getElementById('login');
// const signupbtn = document.getElementById('signup');
// const profilebtn = document.getElementById('profile');
// const form = document.getElementById('myForm');

// //console.log(profilebtn); 

// loginbtn.addEventListener('click',()=>{
//     window.location.href ='/login';
// });

// signupbtn.addEventListener('click', () => {
//     window.location.href ='/signup';
// });

// form.addEventListener("submit",function(event){
//     event.preventDefault();
//     window.location.href='/createpost';
// })

// // 

// CHAO'S CODE BELOW

// // In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
// // let registerForm = document.getElementById('registration-form');
// let firstNameInput = document.getElementById('firstNameInput');
// let lastNameInput = document.getElementById('lastNameInput');
// let emailAddressInput = document.getElementById('emailAddressInput');
// let passwordInput = document.getElementById('passwordInput');
// let confirmPasswordInput = document.getElementById('confirmPasswordInput');
// let roleInput = document.getElementById('roleInput');
// let errorDiv = document.getElementById('error')
// const nameRegex = /^[a-zA-Z]+$/;
// const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
// const spaceRegex = /\s/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//
//
// // login form 
// let loginForm = document.getElementById('login-form');
//
// if(loginForm){
//     loginForm.addEventListener('submit', (event)=> {
//         event.preventDefault();
//         errorDiv.hidden = true;
//         if(!emailAddressInput.value.trim()) {
//             errorDiv.hidden = false;
//             return errorDiv.innerHTML = "Please provide email<br>";
//         } else {
//             if (!emailRegex.test(emailAddressInput.value.trim())) {
//                 errorDiv.hidden = false;
//                 return errorDiv.innerHTML = "Invalid email address<br>";
//             }
//         }
//
//         if (!passwordInput.value.trim()) {
//             errorDiv.hidden = false;
//             return errorDiv.innerHTML = "Password not provided<br>";
//         } else {
//             if (passwordInput.value.trim().length < 8) {
//                 errorDiv.hidden = false;
//                 return errorDiv.innerHTML = "Password must be at least 8 characters<br>";
//             }
//
//             if (spaceRegex.test(passwordInput.value.trim())) {
//                 errorDiv.hidden = false;
//                 return errorDiv.innerHTML = "Password must not contain whitespace<br>";
//             }
//             // if (!passwordRegex.test(passwordInput.value.trim())) {
//             //     errorDiv.hidden = false;
//             //     return errorDiv.innerHTML = "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special character<br>";
//             // }
//         }
//
//         // if(errorMsg.length > 0){
//         //     event.preventDefault();
//         //     errorDiv.innerHTML = errorMsg;
//         //     errorDiv.hidden = false;
//         // } else {
//
//             loginForm.submit();
//
//
//     })
// }
