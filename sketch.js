import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';

const sketch = (p5) => {
  const width = p5.windowWidth;
  const height = p5.windowHeight;

  window.p5 = p5;

  p5.setup = () => {
    let canvas = p5.createCanvas(height, width);
    canvas.parent('sketch');
    p5.background(0);
    // dropzone = select('#dropzone');
    canvas.drop(gotFile);
    p5.rect(230, 425, 150, 150);
  }

  function gotFile(file) {
    p5.createP(file.name + " " + file.size);
    let img = p5.createImg(file.data);
    p5.rect(0, 0, 200, 200);
    p5.image(img, 0, 0, 200, 200);
  }
}

export default sketch;
