var dropzone;

function setup() {
  var canvas = createCanvas(200, 200);
  background(0);

  // dropzone = select('#dropzone');
  canvas.drop(gotFile);
}

function gotFile(file) {
  createP(file.name + " " + file.size);
  var img = createImg(file.data);
  image(img, 0, 0, width, height);
}

function highlight() {
  dropzone.style('background-color', '#ccc');
}

function unhighlight() {
  dropzone.style('background-color', '#fff');
}
