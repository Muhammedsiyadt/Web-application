const hamburgerBtn = document.querySelector(".hamburger");
const mobilenavigationList = document.querySelector(".mobilenavigationList");
const mobilenavigation = document.querySelector(".mobilenavigation");
const logo = document.querySelector(".logo");

hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("active");
  mobilenavigationList.classList.toggle("active");
  mobilenavigation.classList.toggle("active");
  logo.classList.toggle("active");
});

const slideNewly = document.querySelector(".newlyLaunched");
function moveSlide(num) {
  if (window.innerWidth > 861) {
    slideNewly.style.left = `${-1 * num * 400}px`;
    document.querySelectorAll('.slideBtnNewlyLaunched').forEach(element => element.classList.remove('btnActive'));
    document.querySelectorAll('.slideBtnNewlyLaunched')[num].classList.add('btnActive');
  }
}
function reset() {
  if (window.innerWidth < 861) {
    slideNewly.style.left = 0;
  }
}
window.addEventListener("resize", reset);

document.querySelector('.shopByCat').addEventListener('click', ()=>{
  document.querySelector('#shopByCat').classList.toggle('display');
});