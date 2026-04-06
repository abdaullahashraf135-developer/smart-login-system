let loginSection = document.getElementById("login-section");
let signupSection = document.getElementById("signup-section");
let welcomeSection = document.getElementById("welcome-section");
let toSignup = document.getElementById("to-signup");
let toLogin = document.getElementById("to-login");
let loginBtn = document.querySelector("#login-section button");
let signupBtn = document.querySelector("#signup-section button");
let logoutBtn = document.getElementById("logout-btn");
let userSpan = document.getElementById("user");

toSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.classList.add("d-none");
    signupSection.classList.remove("d-none");
});

toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
});

signupBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let name = document.querySelector("#signup-section #name").value.trim();
    let email = document.querySelector("#signup-section #email").value.trim();
    let password = document.querySelector("#signup-section #password").value.trim();

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name || !email || !password) {
        alert("من فضلك املأ جميع الحقول.");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("البريد الإلكتروني غير صالح.");
        return;
    }

    if (!passwordRegex.test(password)) {
        alert("كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير قم.");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    alert("تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن.");
    signupSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
});

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let email = document.querySelector("#login-section #email").value.trim();
    let password = document.querySelector("#login-section #password").value.trim();
    let savedUser = JSON.parse(localStorage.getItem("user"));

    if (!email || !password) {
        alert(" من فضلك أدخل البريد الإلكتروني وكلمة المرور.");
        return;
    }

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        loginSection.classList.add("d-none");
        welcomeSection.classList.remove("d-none");
        userSpan.textContent = savedUser.name;
    } else {
        alert("بيانات الدخول غير صحيحة. حاول مرة أخرى.");
    }
});

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    welcomeSection.classList.add("d-none");
    loginSection.classList.remove("d-none");
});
