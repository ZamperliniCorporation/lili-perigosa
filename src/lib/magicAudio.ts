const FAIRY = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];

let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function audioContextClass() {
  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

function getContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!context) {
    const Context = audioContextClass();
    if (!Context) {
      return null;
    }
    context = new Context();
    master = context.createGain();
    master.gain.value = muted ? 0 : 0.42;
    master.connect(context.destination);
  }

  return context;
}

async function resume() {
  const audio = getContext();
  if (audio && audio.state === "suspended") {
    await audio.resume();
  }
  return audio;
}

async function ready() {
  if (muted) {
    return null;
  }
  return resume();
}

function panNode(amount: number) {
  const audio = context;
  if (!audio || !master) {
    return master;
  }
  try {
    const pan = audio.createStereoPanner();
    pan.pan.value = amount;
    pan.connect(master);
    return pan;
  } catch {
    return master;
  }
}

function playBell(
  frequency: number,
  when: number,
  volume = 0.1,
  decay = 1.35,
  pan = 0,
) {
  const audio = context;
  if (!audio || !master) {
    return;
  }

  const destination = panNode(pan);
  if (!destination) {
    return;
  }

  const sine = audio.createOscillator();
  sine.type = "sine";
  sine.frequency.value = frequency;

  const air = audio.createOscillator();
  air.type = "triangle";
  air.frequency.value = frequency * 2.01;

  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3200;
  filter.Q.value = 0.7;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + decay);

  sine.connect(gain);
  air.connect(gain);
  gain.connect(filter);
  filter.connect(destination);

  sine.start(when);
  air.start(when);
  sine.stop(when + decay + 0.05);
  air.stop(when + decay + 0.05);
}

function playWhoosh(when: number, volume = 0.05) {
  const audio = context;
  if (!audio || !master) {
    return;
  }

  const length = Math.floor(audio.sampleRate * 0.45);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(420, when);
  filter.frequency.exponentialRampToValueAtTime(1800, when + 0.35);

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.42);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(when);
  source.stop(when + 0.45);
}

function noiseBuffer(seconds: number) {
  const audio = context;
  if (!audio) {
    return null;
  }
  const length = Math.floor(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playPaperLayer(
  when: number,
  duration: number,
  startHz: number,
  endHz: number,
  volume: number,
  pan: number,
  q = 1.1,
) {
  const audio = context;
  if (!audio || !master) {
    return;
  }
  const buffer = noiseBuffer(Math.max(duration, 0.08));
  if (!buffer) {
    return;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = q;
  filter.frequency.setValueAtTime(Math.max(startHz, 80), when);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(endHz, 80),
    when + duration * 0.85,
  );

  const high = audio.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 380;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  const destination = panNode(pan) ?? master;
  source.connect(filter);
  filter.connect(high);
  high.connect(gain);
  gain.connect(destination);
  source.start(when);
  source.stop(when + duration + 0.04);
}

export async function playPageTurn(direction: 1 | -1 = 1) {
  const audio = await resume();
  if (muted || !audio || !context || !master) {
    return;
  }

  const now = context.currentTime;
  const flutter = 0.9 + Math.random() * 0.2;
  const pan = direction * (0.22 + Math.random() * 0.1);

  playPaperLayer(now, 0.06 * flutter, 3200, 1200, 0.28, pan, 0.55);
  playPaperLayer(
    now + 0.015,
    0.28 * flutter,
    direction > 0 ? 1800 : 700,
    direction > 0 ? 420 : 1900,
    0.22,
    pan * 0.65,
    0.9,
  );
  playPaperLayer(now + 0.04, 0.2 * flutter, 900, 280, 0.12, pan * 0.35, 0.7);
}

export async function unlockMagicAudio() {
  await resume();
  startBackgroundMusic();
}

export function setMagicMuted(next: boolean) {
  muted = next;
  if (master && context) {
    master.gain.setTargetAtTime(muted ? 0 : 0.42, context.currentTime, 0.05);
  }
  if (track) {
    track.muted = next;
    if (next) {
      track.pause();
    } else {
      void track.play().catch(() => undefined);
    }
  } else if (!next) {
    startBackgroundMusic();
  }
}

export function isMagicMuted() {
  return muted;
}

export async function playOpenSpell() {
  if (!(await ready()) || !context) {
    return;
  }
  const now = context.currentTime;
  playWhoosh(now, 0.045);
  FAIRY.forEach((note, index) => {
    playBell(note, now + index * 0.09, 0.09, 1.7, index * 0.12 - 0.3);
  });
}

const MUSIC_SRC = "/musica.mp3";
const MUSIC_LOOP_FROM = 39;
let track: HTMLAudioElement | null = null;

function restartMusicFromLoopPoint() {
  if (!track || muted) {
    return;
  }
  const start =
    Number.isFinite(track.duration) && track.duration > MUSIC_LOOP_FROM
      ? MUSIC_LOOP_FROM
      : 0;
  track.currentTime = start;
  void track.play().catch(() => undefined);
}

function startBackgroundMusic() {
  if (typeof window === "undefined" || muted) {
    return;
  }

  if (!track) {
    track = new Audio(MUSIC_SRC);
    track.loop = false;
    track.preload = "metadata";
    track.volume = 0.42;
    track.addEventListener("timeupdate", () => {
      if (!track || muted || !Number.isFinite(track.duration) || track.duration <= 0) {
        return;
      }
      if (track.currentTime >= track.duration - 0.18) {
        restartMusicFromLoopPoint();
      }
    });
    track.addEventListener("ended", restartMusicFromLoopPoint);
  }

  void track.play().catch(() => undefined);
}
