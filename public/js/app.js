const mintWindow = document.querySelector(".mint-window");
const overlay = document.querySelector(".overlay");
const closeMintButton = document.querySelector(".close-mint");

let tapirs = [];
// i < amount of tapirs
for (let i = 1; i < 8; i++) {
  tapirs.push(document.querySelector(`.tapir-${i}`));
}

tapirs.forEach(function (tapir, i, arr) {
  let index = i + 1;
  i == arr.length - 1 ? (index = 0) : null;
  let tapirNext = tapirs[index];
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
