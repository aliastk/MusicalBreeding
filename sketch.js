import * as MidiConvert from 'midiconvert';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import Tone from "tone";
//var Q = require('q');
var notes;
var max1 = -1;
var max2;
var min1 = 10000;
var min2;
var measure;
var loaded = false;
var partsData;
var tracksNum;
const sketch = (p5) => {
    const width = p5.windowWidth;
    const height = p5.windowHeight;

    window.p5 = p5;

    p5.setup = () => {
        let canvas = p5.createCanvas(width, height);
        canvas.parent('sketch');
        p5.background(0);
        p5.fill(255, 255, 255);
        p5.text("word", 10, 90);
        p5.frameRate(10);
        // dropzone = select('#dropzone');
        canvas.drop(gotFile);

        //p5.rect(230, 425, 150, 150);
      }
      //p5.draw = () => {
      //if (!loaded) {
      //put loading animation
      //} else {

    //}
    var i = 0;
    var red = 255;
    var green = 0;
    var blue = 0;

    p5.mousePressed = () => {
      if ((50 <= p5.mouseX) && (p5.mouseX <= 100) && (50 <= p5.mouseY) && (p5
          .mouseY <= 100)) {
        red = 0;
        green = 255;
        blue = 0;
      }
    }

    p5.draw = () => {

      // Re add you button here
      p5.fill(red, green, blue);
      p5.rect(50, 50, 50, 50);
      if (loaded) {
        for (let x = 0; x < notes.length; x++) {
          //console.log(notes[x].name);
          if (notes[x].midi > max1) {
            max1 = notes[x].midi;
          }
          if (notes[x].midi < min1) {
            min1 = notes[x].midi;
          }
        }
        //for (let x = 0; x < notes.length; x++) {
        if (i < notes.length) {
          console.log(notes[i].name);
          p5.rectMode(p5.CORNERS)
            // notes[trackNum].time is where the note start
            // notes[i].duration is how long the not plays for
            // notes[i].midi is the pitch
            //partsData.tracks[1].duration is how long the song is
          p5.fill((notes[i].time / partsData.tracks[tracksNum].duration) *
            255, 0, 0);
          p5.rect((notes[i].time / partsData.tracks[tracksNum].duration) *
            width,
            height - ((notes[i].midi / max1) * height), ((notes[i].duration +
              notes[i].time) / partsData.tracks[tracksNum].duration) *
            width,
            height - ((notes[i].midi / max1) * height) + 5);
          i++;
        } else {
          i = 0;
          p5.background(0);
        }
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

          partsData = MidiConvert.parse(e.target.result);
          //console.log(JSON.stringify(partsData, undefined, 2));
          var print = "nothing";
          for (let i = 0; i < partsData.tracks.length; i++) {
            //print = "nothing";
            console.log(partsData.tracks[i].channelNumber);
            if (partsData.tracks[i].channelNumber > -1) {
              print = JSON.stringify(partsData.tracks[i], 2);
              tracksNum = i;
              console.log("hi");
            }
            notes = partsData.tracks[tracksNum].notes;
          }
          reader.onloadend = function(e) {
            console.log(partsData);
            //partsData.tracks.length
            //find the range of notes
            //finding seconds per measure

            loaded = true;

            //use the events to play the synth

            //console.log("max:" + max1);
            //console.log("min: " + min1);
            //p5.background(0);
            //p5.text(print, 10, 90);

          }


        }
        reader.readAsBinaryString(stuff)



        //p5.save(partsData, 'my.json');

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
