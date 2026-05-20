const btn = document.querySelector("button");

btn.onclick = (e) => {
  let x = e.clientX - btn.offsetLeft;
  let y = e.clientY - btn.offsetTop;
  let div = document.createElement("div");
  div.style.left = x + "px";
  div.style.top = y + "px";
  btn.appendChild(div);

  setTimeout(() => {
    btn.removeChild(div);
  }, 800);
};
