const mintWindow = document.querySelector(".mint-window");
const overlay = document.querySelector(".overlay");
const closeMintButton = document.querySelector(".close-mint");
const mintPrice = document.querySelector(".mint-price");

const tapir1 = document.querySelector(".tapir-1");
const tapir2 = document.querySelector(".tapir-2");
const tapir3 = document.querySelector(".tapir-3");
const tapirsEls = [tapir1, tapir2, tapir3];

tapirsEls.forEach(function (tapir) {
  let index = tapirsEls.indexOf(tapir) + 1;
  tapirsEls.indexOf(tapir) == tapirsEls.length - 1 ? (index = 0) : null;
  let tapirNext = tapirsEls[index];
  tapir.addEventListener("click", function () {
    tapir.classList.toggle("hidden");
    tapirNext.classList.toggle("hidden");
  });
});

overlay.addEventListener("click", function () {
  mintWindow.classList.add("hidden");
  overlay.classList.add("hidden");
});

closeMintButton.addEventListener("click", function () {
  mintWindow.classList.add("hidden");
  overlay.classList.add("hidden");
});

// mintQuantity.addEventListener("change", function () {
//   if (this.value > 1) {
//     mintPrice.textContent = "0.003 Ξ";
//   } else if (this.value == 1) {
//     mintPrice.textContent = "Free!";
//   }
// });
