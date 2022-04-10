import React, { useRef, useEffect, useState } from "react";
import songFile from "./audio.mp3";

// Changing Variables
let ctx, x_end, y_end, bar_height;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 555;
const bar_width = 1;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;

const Convas = (props) => {
  // let audio = new Audio(songFile);
  // const canvas = useRef();
  const [musicArray] = useState([songFile, songFile]);
  const [data, setData] = useState([]);

  useEffect(() => {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let source = context.createMediaElementSource(this.audio);
    let analyser = context.createAnalyser();

    source.connect(this.analyser);
    analyser.connect(this.context.destination);
    let frequency_array = new Uint8Array(this.analyser.frequencyBinCount);
  });

  const animationLooper = (canvas) => {
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    for (var i = 0; i < bars; i++) {
      //divide a circle into equal part
      const rads = (Math.PI * 2) / bars;

      // Math is magical
      bar_height = this.frequency_array[i] * 2;

      const x = center_x + Math.cos(rads * i) * radius;
      const y = center_y + Math.sin(rads * i) * radius;
      x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
      y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

      //draw a bar
      drawBar(x, y, x_end, y_end, frequency_array[i], ctx, canvas);
    }
  };

  const drawBar = (x1 = 0, y1 = 0, x2 = 0, y2 = 0, frequency, ctx, canvas) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
    gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
    ctx.fillStyle = gradient;

    const lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = bar_width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  // componentDidMount() {
  //   this.context = new (window.AudioContext || window.webkitAudioContext)();
  //   this.source = this.context.createMediaElementSource(this.audio);

  //   this.analyser = this.context.createAnalyser();
  //   this.source.connect(this.analyser);
  //   this.analyser.connect(this.context.destination);
  //   // this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);
  // }

  const togglePlay = () => {
    const { audio } = this;
    if (audio.paused) {
      audio.play();
      rafId = requestAnimationFrame(tick);
    } else {
      audio.pause();
      cancelAnimationFrame(rafId);
    }
  };

  const tick = () => {
    animationLooper(this.canvas.current);
    analyser.getByteTimeDomainData(this.frequency_array);
    rafId = requestAnimationFrame(this.tick);
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafId);
      props.analyser.disconnect();
      source.disconnect();
    };
  }, []);

  // componentWillUnmount() {
  //   cancelAnimationFrame(this.rafId);
  //   this.analyser.disconnect();
  //   this.source.disconnect();
  // }

  useEffect(() => {
    const musicData = musicArray.map((sound) => {
      return { audio: new Audio(sound), play: false };
    });

    setData(musicData);
  }, [musicArray]);

  const playSound = (index) => {
    setData((arr) =>
      arr.map((sound, i) => {
        if (i === index) {
          sound.audio.play();
          return { ...sound, play: true };
        }
        sound.audio.pause();
        return { ...sound, play: false };
      })
    );
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const stopSound = (index) => {
    setData((arr) =>
      arr.map((sound, i) => {
        if (i === index) {
          sound.audio.pause();
          return { ...sound, play: false };
        }
        return { ...sound, play: false };
      })
    );
  };

  return (
    <>
      {/* <button onClick={tooglePlay}>Play/Pause</button> */}
      {/* <canvas ref={this.canvas} /> */}

      <div>
        {data.map((sound, i) => {
          return (
            <>
              {sound.play ? (
                <button onClick={() => stopSound(i)}>pause</button>
              ) : (
                <button onClick={() => playSound(i)}>play</button>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

export default Convas;
