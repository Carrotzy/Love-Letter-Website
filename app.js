document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("canvas");
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  const opts = {
    seed: {
      x: width / 2 - 20,
      color: "rgb(190, 26, 37)",
      scale: 2,
    },
    branch: [
      [
        535,
        680,
        570,
        250,
        500,
        200,
        30,
        100,
        [
          [
            540,
            500,
            455,
            417,
            340,
            400,
            13,
            100,
            [[450, 435, 434, 430, 394, 395, 2, 40]],
          ],
          [
            550,
            445,
            600,
            356,
            680,
            345,
            12,
            100,
            [[578, 400, 648, 409, 661, 426, 3, 80]],
          ],
          [539, 281, 537, 248, 534, 217, 3, 40],
          [
            546,
            397,
            413,
            247,
            328,
            244,
            9,
            80,
            [
              [427, 286, 383, 253, 371, 205, 2, 40],
              [498, 345, 435, 315, 395, 330, 4, 60],
            ],
          ],
          [
            546,
            357,
            608,
            252,
            678,
            221,
            6,
            100,
            [[590, 293, 646, 277, 648, 271, 2, 80]],
          ],
        ],
      ],
    ],
    bloom: {
      num: 700,
      width: 1080,
      height: 650,
    },
    footer: {
      width: 1200,
      height: 5,
      speed: 10,
    },
  };

  const timeElapse = (date) => {
    const current = new Date();
    let seconds = (current - new Date(date)) / 1000;
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    let hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    seconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    const result = `第 <span class="digit">${days}</span> 天 <span class="digit">${hours}</span> 小时 <span class="digit">${minutes}</span> 分钟 <span class="digit">${seconds}</span> 秒`;
    document.getElementById("clock").innerHTML = result;
  };

  const tree = new Tree(canvas, width, height, opts);
  let { seed, footer } = tree;
  let hold = true;

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (seed.hover(x, y)) {
      canvas.removeEventListener("click", this);
      document.getElementById("bgm").play();
      document.getElementById("footer").style.display = "none";
      hold = false;
    }
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const seedAnimate = async () => {
    seed.draw();
    while (hold) {
      await sleep(10);
    }
    while (seed.canScale()) {
      seed.scale(0.95);
      await sleep(10);
    }
    while (seed.canMove()) {
      seed.move(0, 2);
      footer.draw();
      await sleep(10);
    }
  };

  const growAnimate = async () => {
    do {
      tree.grow();
      await sleep(10);
    } while (tree.canGrow());
  };

  const flowAnimate = async () => {
    do {
      tree.flower(2);
      await sleep(10);
    } while (tree.canFlower());
  };

  const moveAnimate = async () => {
    tree.snapshot("p1", 240, 0, 610, 680);
    while (tree.move("p1", 500, 0)) {
      footer.draw();
      await sleep(10);
    }
    footer.draw();
    tree.snapshot("p2", 500, 0, 610, 680);

    // Assuming canvas is a plain DOM element and not a jQuery object.
    const canvasParent = canvas.parentNode;

    // Set the background of the parent element
    canvasParent.style.background = `url(${tree.toDataURL("image/png")})`;

    // Set CSS properties directly on the canvas element
    canvas.style.background = "#ffe";
    await sleep(300);
    canvas.style.background = "none";
  };

  const jumpAnimate = async () => {
    while (true) {
      tree.ctx.clearRect(0, 0, width, height);
      tree.jump();
      footer.draw();
      await sleep(25);
    }
  };

  const textAnimate = async () => {
    const memorialInput = document.getElementById("memorialDate");
    const memorialDate = new Date(memorialInput.value);
    startTypewriter(document.getElementById("letter"));
    const clockBox = document.getElementById("clock-box");
    clockBox.style.opacity = 1;
    clockBox.style.transition = "opacity 0.5s";
    clockBox.style.display = "block";
    while (true) {
      timeElapse(memorialDate);
      await sleep(1000);
    }
  };

  await seedAnimate();
  await growAnimate();
  await flowAnimate();
  await moveAnimate();
  textAnimate();
  jumpAnimate();
});
