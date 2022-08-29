const tapirs = document.querySelector(".section-tap");
const tapir1 = document.querySelector(".tapir-1");
const tapir2 = document.querySelector(".tapir-2");
const tapir3 = document.querySelector(".tapir-3");

tapir1.addEventListener("click", function () {
  tapir1.classList.toggle("hidden");
  tapir2.classList.toggle("hidden");
});
tapir2.addEventListener("click", function () {
  tapir2.classList.toggle("hidden");
  tapir3.classList.toggle("hidden");
});
tapir3.addEventListener("click", function () {
  tapir3.classList.toggle("hidden");
  tapir1.classList.toggle("hidden");
});
