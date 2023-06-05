let img_input = document.getElementById("input_image");
let file_input = document.getElementById("file_input");

file_input.addEventListener("change", (e) => {
  img_input.src = URL.createObjectURL(e.target.files[0]);
}, false);

img_input.onload = function() {
  let mat = cv.imread(img_input);
  cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY);
  cv.imshow("output", mat);
  mat.delete();
}
