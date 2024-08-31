function soundEffect(sound: string) {
    const audio = new Audio(sound);
    audio.play();
  }

export {soundEffect}
