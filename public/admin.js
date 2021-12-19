let deleteButtons = document.querySelectorAll(".delete-btn");

for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", function(event) {
    document.querySelector(".delete-element-container").classList.toggle("hidden");
    document.querySelector("body").classList.toggle("no-scroll");
    document.querySelector(".delete-confirm").setAttribute("value", event.target.getAttribute('value'));
  });
};

document.querySelector(".cancel-btn").addEventListener("click", function() {
  document.querySelector(".delete-element-container").classList.toggle("hidden");
  document.querySelector("body").classList.toggle("no-scroll");
});

document.querySelector(".new-btn").addEventListener("click", function(){
  document.querySelector(".new-element-container").classList.toggle("hidden");
  document.querySelector("body").classList.toggle("no-scroll");
})

document.querySelector(".create-cancel-btn").addEventListener("click", function() {
  document.querySelector(".new-element-container").classList.toggle("hidden");
  document.querySelector("body").classList.toggle("no-scroll");
});
