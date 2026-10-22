const backgroundButton = document.getElementById('changeBackground');
const colors=["#f8f6f2","#e8eef4", "#f3e8ed"];
let colorIndex = 0;
backgroundButton.addEventListener("click", function () {
  colorIndex = (colorIndex + 1) % colors.length;
  document.body.style.backgroundColor = colors[colorIndex];
});