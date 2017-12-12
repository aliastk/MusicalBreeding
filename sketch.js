import * as MidiConvert from 'midiconvert';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import 'p5/lib/addons/p5.dom';
import Tone from "tone";
//var Q = require('q');
var index;
var max1 = -1;
var min1 = 10000;
var measure, PPS;
var loaded = false;
var songs = [];
var PPQN;
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
  //var drawMeasure = 0;
  var count_measure;
  p5.mousePressed = () => {
    if ((50 <= p5.mouseX) && (p5.mouseX <= 100) && (250 <= p5.mouseY) && (
        p5.mouseY <= 350)) {
      red = 0;
      green = 255;
      blue = 0;
    }
    index = 0;
    //p5.background(0);
    count_measure = songs[0].measure;
    play(songs[0]);
    makeDisplay(songs[0], width / 4, height / 4);
  }

  p5.draw = () => {

    // Re add you button here
    p5.fill(red, green, blue);
    p5.rect(50, 250, 50, 50);
    if (loaded && green == 255) {
      //console.log(index.name);
      //display(index);
    }
  }


  function gotFile(file) {
    p5.createP(file.name + " " + file.size);
    //console.log(file);
    var stuff = dataURLtoBlob(file.data);
    //console.log(stuff);
    var reader = new FileReader();
    reader.onload = function(e) {

      partsData = MidiConvert.parse(e.target.result);
      console.log(JSON.stringify(partsData, undefined, 2));
      for (let i = 0; i < partsData.tracks.length; i++) {
        console.log(partsData.tracks[i].channelNumber);
        if (partsData.tracks[i].channelNumber > -1) {
          print = JSON.stringify(partsData.tracks[i], 2);
          tracksNum = i;
        }
      }
      //find the measure
      PPQN = partsData.header.PPQ;
      var BPM = partsData.header.bpm;
      var dd = partsData.header.timeSignature[1];
      var nn = partsData.header.timeSignature[0];
      var Qpm = (4 / dd) * nn;
      var Nm = Qpm * PPQN;
      PPS = (PPQN * BPM) / 60;
      measure = Qpm * PPQN * (1 / PPS);
    }

    reader.onloadend = function(e) {
      console.log(partsData);
      var notes = partsData.tracks[1].notes;
      //partsData.tracks.length
      //find the range of notes
      //finding seconds per measure
      notes.max = max1;
      notes.min = min1;
      notes.duration = Math.round(partsData.tracks[tracksNum].duration *
        PPS);
      for (let x = 0; x < notes.length; x++) {
        //console.log(notes[x].name);
        if (notes[x].midi > notes.max) {
          notes.max = notes[x].midi;
        }
        if (notes[x].midi < notes.min) {
          notes.min = notes[x].midi;
        }
        notes[x].type = Math.round((notes[x].duration * PPS));
        notes[x].offset = Math.round((notes[x].time * PPS));
        if (x > 0) {
          notes[x].distance = notes[x].offset - notes[x - 1].offset;
        } else {
          notes[x].distance = 0;
        }
        notes[x].time = notes[x].offset * (1 / PPS);
        notes[x].duration = notes[x].type / PPS;
      }
      notes.measure = measure;
      notes.pps = PPS;
      notes.bpm = partsData.header.bpm;
      index = 0;
      loaded = true;
      songs.push(notes);
      console.log(songs[songs.length - 1]);
    }

    reader.readAsBinaryString(stuff)
  }


  function play(music) {
    Tone.Transport.bpm.value = music.bpm
    var count = 0;
    var synth = new Tone.Synth().toMaster();
    var midiPart = new Tone.Part(function(time, note) {

        //use the events to play the synth
        synth.triggerAttackRelease(note.name, note.duration,
          time, note.velocity);
        Tone
          .Draw.schedule(function() {
            //this callback is in voked from a requestAnimationFrame
            //and will be invoked close to AudioContext time
            //console.log(note);
            //index = note;
          }, time);
        Tone.Transport.loop = false;
      },
      music).start();
    Tone.Transport.start();
  }

  function display(curr) {
    console.log(curr.name);
    var notes = songs[0];
    p5.rectMode(p5.CORNERS)
    p5.fill(curr.time * 255, 0, (1 - (curr.time / notes.duration)) * 255);
    /*p5.rect((curr.time / notes.duration) * width,
      height - ((curr.midi / notes.max) * height), ((curr.duration + curr.time) /
        notes.duration) * width,
      height - ((curr.midi / notes.max) * height) + 5);
    if ((curr.duration + curr.time) >= count_measure) {
      //console.log(count_measure);
      var wide = (count_measure / curr.duration) * width;
      p5.fill(255)
      p5.ellipse(wide, notes.max, 3, notes.min);
      count_measure += notes.measure;
    }*/
  }

  function makeDisplay(song, wide, high) {
    console.log(song);
    song.forEach(function(curr) {
      console.log(curr.name);
      p5.rectMode(p5.CORNERS)
      p5.fill((curr.offset / song.duration) * 255, 0, (1 - (curr.offset /
        song.duration)) * 255);
      p5.rect((curr.offset / song.duration) * wide,
        high - ((curr.midi / song.max) * high), ((curr.type +
            curr.offset) /
          song.duration) * wide,
        high - ((curr.midi / song.max) * high) + 5);
    });
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
