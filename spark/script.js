// src/script.ts
var calendar = document.getElementById("calendar");
var images = JSON.parse(document.getElementById("images").textContent);
function createCalendar(year2, month2) {
  let mon = month2 - 1;
  let d = new Date(year2, mon);
  let table = document.createElement("table");
  let row = document.createElement("tr");
  for (let i = 0; i < d.getDay(); i++) {
    row.append(document.createElement("td"));
  }
  while (d.getMonth() == mon) {
    let cell = document.createElement("td");
    cell.dataset.date = String(d.getDate());
    cell.classList.add("day");
    if (d.getDay() == 0 || d.getDay() == 6) cell.classList.add("weekend");
    if (d > now) cell.classList.add("future");
    let key = `${year2}-${String(month2).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (images[key]) {
      let button = document.createElement("button");
      button.textContent = "\u2728\uFE0F";
      button.addEventListener("click", () => openPopup(images[key]));
      cell.append(button);
    }
    row.append(cell);
    if (d.getDay() == 6) {
      table.append(row);
      row = document.createElement("tr");
    }
    d.setDate(d.getDate() + 1);
  }
  if (d.getDay() != 0) {
    for (let i = d.getDay(); i < 7; i++) {
      row.append(document.createElement("td"));
    }
    table.append(row);
  }
  let section = document.createElement("section");
  section.append(table);
  return section;
}
function openPopup(srcs) {
  document.getElementById("popup")?.remove();
  let popup = document.createElement("div");
  popup.id = "popup";
  let close = document.createElement("button");
  close.classList = "close";
  close.textContent = "\xD7";
  close.ariaLabel = "close";
  close.addEventListener("click", () => popup.remove());
  let wrapper = document.createElement("div");
  wrapper.append(close);
  wrapper.classList.add("content-wrapper");
  for (let src of srcs) {
    let img = document.createElement("img");
    img.src = src;
    img.alt = "";
    wrapper.append(img);
  }
  popup.append(wrapper);
  document.body.append(popup);
}
document.addEventListener("click", (event) => {
  let target = event.target;
  if (target.closest(".content-wrapper, #calendar button")) return;
  document.getElementById("popup")?.remove();
});
var [oldestYear, oldestMonth] = Object.keys(images)[0].split("-").map(Number);
var now = /* @__PURE__ */ new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
while (year > oldestYear || year == oldestYear && month >= oldestMonth) {
  calendar.append(createCalendar(year, month));
  month--;
  if (month == 0) {
    month = 12;
    year--;
  }
}
history.scrollRestoration = "manual";
window.scrollTo(0, document.documentElement.scrollHeight);
