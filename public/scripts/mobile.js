const mobileMenuBtnElement = document.getElementById("mobile-menu-btn");
const mobileMenuElement = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle("open"); //this will toggle the class 'open' on that element
}

mobileMenuBtnElement.addEventListener("click", toggleMobileMenu);
