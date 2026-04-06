const API_DELAY = 1000;

const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    loginSection: document.getElementById('login-section'),
    signupSection: document.getElementById('signup-section'),
    homeSection: document.getElementById('home-section'),

    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),

    loginBtn: document.getElementById('login-btn'),
    signupBtn: document.getElementById('signup-btn'),
    logoutBtn: document.getElementById('logout-btn'),

    toSignupFromLogin: document.getElementById('to-signup-from-login'),
    toLoginFromSignup: document.getElementById('to-login-from-signup'),

    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    signupName: document.getElementById('signup-name'),
    signupEmail: document.getElementById('signup-email'),
    signupPassword: document.getElementById('signup-password'),

    userName: document.getElementById('user-name'),
    loginDate: document.getElementById('login-date'),
};


const state = {
    currentPage: 'login',
    isLoading: false,
    isLoggedIn: false,
    currentUser: null,
};


class AuthService {
    static async signup(name, email, password) {
        await this.delay(API_DELAY);

        const existingUser = localStorage.getItem('user');
        if (existingUser) {
            const userData = JSON.parse(existingUser);
            if (userData.email === email) {
                throw new Error('This email is already registered');
            }
        }

        const userData = {
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('signupCompleted', 'true');

        return userData;
    }

    static async login(email, password) {
        await this.delay(API_DELAY);

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            throw new Error('User not found. Please sign up first');
        }

        const userData = JSON.parse(storedUser);

        if (userData.email === email && userData.password === password) {
            localStorage.setItem('loggedIn', 'true');
            return userData;
        } else {
            throw new Error('Invalid email or password');
        }
    }

    static async logout() {
        await this.delay(API_DELAY);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        return true;
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

function showLoadingScreen() {
    state.isLoading = true;
    elements.loadingScreen.classList.add('loading-active');
}

function hideLoadingScreen() {
    state.isLoading = false;
    elements.loadingScreen.classList.remove('loading-active');
}

function navigateTo(pageId) {
    return new Promise(async(resolve) => {
        showLoadingScreen();

        await AuthService.delay(API_DELAY);

        hideCurrentPage();

        showPage(pageId);

        state.currentPage = pageId;

        hideLoadingScreen();

        resolve();
    });
}

function hideCurrentPage() {
    const currentElement = document.getElementById(state.currentPage + '-section') ||
        document.getElementById(state.currentPage + '-section');

    if (state.currentPage === 'home') {
        elements.homeSection.classList.add('home-hidden');
        elements.homeSection.classList.remove('home-visible');
    } else {
        const authPages = [elements.loginSection, elements.signupSection];
        authPages.forEach(page => {
            page.classList.add('auth-page-hidden');
            page.classList.remove('auth-page-visible');
        });
    }
}

function showPage(pageId) {
    if (pageId === 'home') {
        elements.homeSection.classList.remove('home-hidden');
        elements.homeSection.classList.add('home-visible');
    } else if (pageId === 'login') {
        elements.loginSection.classList.remove('auth-page-hidden');
        elements.loginSection.classList.add('auth-page-visible');
    } else if (pageId === 'signup') {
        elements.signupSection.classList.remove('auth-page-hidden');
        elements.signupSection.classList.add('auth-page-visible');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return passwordRegex.test(password);
}

function showError(message) {
    alert('❌ ' + message);
}

function showSuccess(message) {
    alert('✅ ' + message);
}

elements.loginBtn.addEventListener('click', async(e) => {
    e.preventDefault();

    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value.trim();

    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email');
        return;
    }

    try {
        showLoadingScreen();

        const user = await AuthService.login(email, password);

        elements.loginForm.reset();

        state.isLoggedIn = true;
        state.currentUser = user;

        hideCurrentPage();
        showPage('home');
        state.currentPage = 'home';

        updateHomePage(user);

        hideLoadingScreen();

        showSuccess('Login successful! Welcome');

    } catch (error) {
        hideLoadingScreen();
        showError(error.message);
    }
});

elements.signupBtn.addEventListener('click', async(e) => {
    e.preventDefault();

    const name = elements.signupName.value.trim();
    const email = elements.signupEmail.value.trim();
    const password = elements.signupPassword.value.trim();

    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email');
        return;
    }

    if (!isValidPassword(password)) {
        showError('Password must contain:\n• At least 8 characters\n• Uppercase letter (A-Z)\n• Lowercase letter (a-z)\n• Number (0-9)\n• Special character (@$!%*?&)');
        return;
    }

    try {
        showLoadingScreen();

        const user = await AuthService.signup(name, email, password);

        elements.signupForm.reset();

        hideCurrentPage();
        showPage('login');
        state.currentPage = 'login';

        hideLoadingScreen();

        showSuccess('Account created successfully! Now you can login');

    } catch (error) {
        hideLoadingScreen();
        showError(error.message);
    }
});

elements.logoutBtn.addEventListener('click', async(e) => {
    e.preventDefault();

    try {
        showLoadingScreen();

        await AuthService.logout();

        state.isLoggedIn = false;
        state.currentUser = null;

        hideCurrentPage();
        showPage('login');
        state.currentPage = 'login';

        elements.loginForm.reset();

        hideLoadingScreen();

        showSuccess('Logout successful');

    } catch (error) {
        hideLoadingScreen();
        showError(error.message);
    }
});

elements.toSignupFromLogin.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('signup');
});

elements.toLoginFromSignup.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('login');
});

function updateHomePage(user) {
    elements.userName.textContent = user.name;

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    elements.loginDate.textContent = `Last login: ${today}`;
}

function initializeApp() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const userData = localStorage.getItem('user');

    if (isLoggedIn && userData) {
        state.isLoggedIn = true;
        state.currentUser = JSON.parse(userData);
        state.currentPage = 'home';

        elements.loginSection.classList.add('auth-page-hidden');
        elements.signupSection.classList.add('auth-page-hidden');
        elements.homeSection.classList.add('home-visible');

        updateHomePage(state.currentUser);
    } else {
        state.currentPage = 'login';
        elements.loginSection.classList.add('auth-page-visible');
        elements.signupSection.classList.add('auth-page-hidden');
        elements.homeSection.classList.add('home-hidden');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);