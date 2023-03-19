import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "../includes/helper";
export default defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    seek: "00:00", // store the current duration and current possition value
    duration: "00:00",
    playerProgress: "0%",
  }),
  actions: {
    async newSong(song) {
      //if the play button on the page gets pressed we want to pause the current audio and destroy the intance (bich manajemch n5adem l8oneya nafsha barcha marrat wra b3adhhom fi nafes lwa9et)
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.current_song = song;
      // this action to playing the audio with Howl
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();

      // update the state properties
      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },
    // this action to possing the video then i call the  toggleAudio fun in the player.vue component
    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }
      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    //we are  create a separate action for everything the progress of the current song
    //one action function for adding a new song to the player and another for updating the progress
    progress() {
      //updating the seek and duration state position
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());

      // update the player progress state property while the audio is playing

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      //we need to make sure that song is currently playing if it is not then there isn't a point in continuously calling the function in the action

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      //document = 2000, timeline = 1000, clientX = 1000, distance = 500
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", this.progress);
    },
  },
  // the getter function najem nesta3melha fi ayy component nheb 3lih
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
});
