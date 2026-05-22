const authModal = document.querySelector('.auth-modal');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginBtnModal = document.querySelector('.login-btn-modal');
const closeBtnModal = document.querySelector('.close-btn-modal');
const profileBox = document.querySelector('.profile-box');
const avaterCircle = document.querySelector('.avater-circle');
const alertBox = document.querySelector('.alert-box');

registerLink.addEventListener('click', () => authModal.classList.add('slide'));
loginLink.addEventListener('click', () => authModal.classList.remove('slide'));

loginBtnModal.addEventListener('click', () => authModal.classList.add('show'));
closeBtnModal.addEventListener('click', () => authModal.classList.remove('show', 'slide'));

avaterCircle.addEventListener('click', () => profileBox.classList.toggle('show'));

setTimeout(() => alertBox.classList.add('show'), 50);

setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => alertBox.remove(), 1000);
}, 6000);