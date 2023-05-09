// import authCheck from "../validtionChecker.js";
// (function () {
//     document.addEventListener("DOMContentLoaded", function () {
//         const forgotPassForm = document.getElementById("forgotPassword-form");
//         const errorHandle = document.getElementById("forgetPasswordError");
//         if (forgotPassForm) {
//             forgotPassForm.addEventListener("submit", (event) => {
//                 event.stopPropagation();
//                 event.stopImmediatePropagation();
//                 event.preventDefault();
//                 const elements = event.target.elements;
//                 errorHandle.hidden = true;
//                 let email = document.getElementById("email").value;
//                 try {
//                     email = authCheck.checkEmail(email);
//                 }catch(e) {
//                     document.getElementById("email").setAttribute("value", email);
//                     return handleError(e || "Something went wrong");
//                 }
//                 fetch("/forgot-password", {
//                     method: "post",
//                     headers: {
//                         Accept: "application/json, text/plain, */*", "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         email: email
//                     }),
//                 })
//                 .then(async (res) => {
//                     if (!res.ok) {
//                       const data = await res.json();
//                         throw data;
//                     }
//                     return res.json();
//                   }).then((data) => {
//                     if (data && !data.success) {

//                         document.getElementById("email").value = data.email;
//                         //document.getElementById("password").value = data.password;
//                         return handleError(data.message || "Something went wrong.");
//                     }
//                     else {
//                         location.href = "/login";
//                     }

//                 }).catch((e) => {
//                     alert(e || "Something went wrong.");
//                 });
//             });
//         }
//         const handleError = (errorMsg) => {
//             errorHandle.hidden = false;
//             errorHandle.innerHTML = errorMsg;
//         };
//     });
// })();

import authCheck from "../validtionChecker.js";
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const forgotPassForm = document.getElementById("forgetPassword-form");
    const errorHandle = document.getElementById("forgetPasswordError");
    if (forgotPassForm) {
      forgotPassForm.addEventListener("submit", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
        const elements = event.target.elements;
        errorHandle.hidden = true;
        let email = document.getElementById("email").value;
        try {
          email = authCheck.checkEmail(email);
        } catch (e) {
          document.getElementById("email").setAttribute("value", email);
          return handleError(e || "Something went wrong");
        }
        fetch("/forgot-password", {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const data = await res.json();
                throw data;
            }
            return res.json();
          })
          .then((data) => {
            if (!data.success) {
              document.getElementById("email").value = data.email;
              return handleError(data.message || "Something went wrong.");
            } else {
              location.href = "/login";
            }
          })
          .catch((e) => {
            handleError(e.message || "Something went wrong.");
          });
          
      });
    }
    const handleError = (errorMsg) => {
      errorHandle.hidden = false;
      errorHandle.innerHTML = "<li>" + errorMsg + "</li>";
    };
  });
})();