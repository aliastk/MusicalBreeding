import * as MidiConvert from 'midiconvert';
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
    p5.fill(255, 255, 255);
    p5.text("word", 10, 90);
    // dropzone = select('#dropzone');
    canvas.drop(gotFile);
    //p5.rect(230, 425, 150, 150);
  }

  function gotFile(file) {
    p5.createP(file.name + " " + file.size);
    /*p5.fill(255, 255, 255);
    p5.text("word", 10, 90);
    //let img = p5.createImg(file.data);
    p5.rect(0, 0, 200, 200);*/
    //p5.image(img, 0, 0, 200, 200);
    console.log(file);
    var stuff = dataURLtoBlob(file.data);
    console.log(stuff);
    //MidiConvert.parse(file);
    var reader = new FileReader();

    reader.onload = function(e) {

      var partsData = MidiConvert.parse(e.target.result);
      console.log(JSON.stringify(partsData, undefined, 2));
    };
    reader.readAsBinaryString(stuff);

  }

  //A quick fix to get around p5.js method of handling files
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }
}

export default sketch;
