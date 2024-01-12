<template>
  <div v-if="track" class="audiobox">
    <div
      :class="[$device.isDesktop ? 'container' : '']"
      class="d-flex text-white align-items-center audiobox__inner pr-1"
    >
      <div :class="[$device.isDesktop ? 'mr-2' : '']" class="d-flex">
        <div v-if="pause" class="audiobox__play link" @click="unsetPause()">
          <icon-player-play />
        </div>
        <div
          v-else
          class="audiobox__pause position-relative link"
          @click="setPause()"
        >
          <!-- <div class="spinner-border text-white position-absolute"></div> -->
          <icon-player-pause />
        </div>
      </div>
      <div :class="[$device.isDesktop ? '' : 'pr-2']" class="audiobox__content">
        <div v-if="$device.isDesktop" class="text-truncate">
          <span class="link" title="Go to folder" @click="goTrackFolder()">{{
            track.name
          }}</span>
        </div>
        <div v-else class="marquee">
          <span @click="goTrackFolder()">{{ track.name }}</span>
        </div>
        <div class="d-flex t12 align-items-center text-muted">
          <!-- <span class="audiobox__text" v-if="$device.isDesktop">{{ this.timerSeek }}</span> -->
          <div
            id="player_progress_wrap"
            :class="[$device.isDesktop ? 'mr-2' : 'mt-1']"
            class="audiobox__progress flex-grow-1 link"
          >
            <div id="player_progress" class="progress" @click="skipTo">
              <div
                id="player_progress-inner"
                :style="'width: ' + this.progress + '%'"
                aria-valuemax="100"
                aria-valuemin="0"
                aria-valuenow="25"
                class="progress-bar bg-success"
                role="progressbar"
              ></div>
            </div>
          </div>
          <span
            v-if="$device.isDesktop"
            class="audiobox__text link text-nowrap t12 pt-1"
            @click="getTimeDuration = !getTimeDuration"
          >
            <span v-if="getTimeDuration">{{ this.timerLeft }}</span>
            <span v-if="!getTimeDuration" class="audiobox__left">{{
              this.timerSeek
            }}</span>
          </span>
        </div>
      </div>
      <div
        :class="[$device.isDesktop ? 'ml-4' : 'ml-2']"
        class="d-flex audiobox__tool"
      >
        <span class="d-none d-md-inline">
          <span v-if="isFirst">
            <icon-player-prev icon-color="#8791B1" />
          </span>
          <span v-else class="link" title="Prev" @click="prevClick()">
            <icon-player-prev />
          </span>
        </span>

        <span v-if="isLast">
          <icon-player-next icon-color="#8791B1" />
        </span>
        <span v-else class="link" title="Next" @click="nextClick()">
          <icon-player-next />
        </span>
        <span v-if="$device.isDesktop">
          <a :href="track.src" target="_blank" title="Download file">
            <icon-player-link />
          </a>
        </span>
        <span class="link" @click="closePlayer()">
          <icon-player-close />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { Howl, Howler } from "howler";
import clamp from "math-clamp";
import IconPlayerPlay from "~/components/icons/IconPlayerPlay";
import IconPlayerPause from "~/components/icons/IconPlayerPause";
import IconPlayerClose from "~/components/icons/IconPlayerClose";
import IconPlayerNext from "~/components/icons/IconPlayerNext";
import IconPlayerPrev from "~/components/icons/IconPlayerPrev";
import IconPlayerLink from "~/components/icons/IconPlayerLink";

import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      volume: 1,
      duration: 0,
      seek: 0,
      timerId: null,
      nowPlaying: false,
      playerInstance: null,
      getTimeDuration: true,
    };
  },
  components: {
    IconPlayerPlay,
    IconPlayerPause,
    IconPlayerClose,
    IconPlayerNext,
    IconPlayerPrev,
    IconPlayerLink,
  },
  computed: {
    progress() {
      let progress;
      if (this.duration === 0) {
        progress = 0;
      } else {
        progress = (this.seek / this.duration) * 100;
      }

      this.$log.debug(
        `Player computed progress() seek=${this.seek}, duration=${this.duration}, progress=${progress}`
      );

      return progress;
    },
    timerSeek() {
      const timerSeek = this.formatTime(Math.round(this.seek));
      //this.$log.debug(`Player computed timerSeek: ${timerSeek}`);

      return timerSeek;
    },
    timerLeft() {
      return this.formatTime(Math.round(this.duration - this.seek));
    },
    timerDuration() {
      return this.formatTime(Math.round(this.duration));
    },
    ...mapGetters({
      position: "audio/position",
      track: "audio/track",
      isFirst: "audio/isFirst",
      isLast: "audio/isLast",
      pause: "audio/pause",
    }),
  },
  watch: {
    nowPlaying: function (nowPlaying) {
      //this.$log.debug("Audio player watch nowPlaying", nowPlaying);
      if (nowPlaying) {
        this.timerId = setInterval(() => {
          this.seek = this.playerInstance.seek() || 0;
        }, 250);
      } else {
        clearInterval(this.timerId);
      }
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type == "audio/CLOSE") {
        this.$log.debug(`Player store mutation close`);
        this.clearPlayerInstanse();
      }

      if (
        mutation.type == "audio/SET_NEW_TRACK" ||
        mutation.type == "audio/NEXT" ||
        mutation.type == "audio/PREV"
      ) {
        this.$log.debug(`Player store mutation play new track`);
        this.reinitPlayer();
      }

      if (
        mutation.type == "audio/SET_PAUSE" ||
        mutation.type == "audio/UNSET_PAUSE" ||
        mutation.type == "audio/TOOGLE_PAUSE"
      ) {
        this.$log.debug(
          `Player store mutation changing pause ${state["audio"]}`
        );

        if (state["audio"].pause) {
          this.playerInstance.pause();
        } else {
          this.playerInstance.play();
        }
      }
    });
  },
  methods: {
    goTrackFolder() {
      //test
      const path = this.$store.getters["audio/folderPath"]
        ? `/home/${this.$store.getters["audio/folderPath"]}`
        : "/home";

      this.$log.debug(
        `Go to track folder path: ${path} current path: ${this.$route.path}`
      );
      if (path == this.$route.path) {
        return;
      }
      this.$router.push({ path });
    },
    formatTime(secs) {
      const minutes = Math.floor(secs / 60) || 0;
      const seconds = secs - minutes * 60 || 0;

      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    skipTo: function (event) {
      let seekTo = Math.floor(
        (event.offsetX / event.target.parentElement.clientWidth) * this.duration
      );

      let seek = clamp(seekTo, 0, this.duration);

      this.playerInstance.seek(seek);
      this.seek = seek;

      this.$log.debug(
        `Player method skipTo() seekTo: ${seekTo} seek: ${seek} [element id=${event.target.id} class=${event.target.className}]`
      );
    },
    createPlayerInstance() {
      const src = this.track && this.track.src ? this.track.src : null;
      const self = this;

      const player = new Howl({
        src: [`${src}?dl=0`],
        html5: true,
        autoplay: false,
        preload: true,
      });

      const volume = this.volume || 1;
      player.volume(volume);

      player.on("end", function (selected) {
        self.nowPlaying = false;
        self.$log.debug(`Audio pleer on end isLast ${self.isLast}`);
        // console.log("on end", "repeat", self.repeat, "isLast", self.isLast);
        if (!self.isLast) {
          self.$log.debug("Audio player auto next");

          self.nextClick();
        } else {
          self.$log.debug("Audio player auto stop");
          self.index = 0;
          self.seek = 0;
          self.playerInstance.seek(self.seek);
          self.setPause();
        }
      });

      player.on("load", function (cb) {
        self.duration = player.duration();
      });

      player.on("play", function () {
        self.nowPlaying = true;
      });

      player.on("pause", function () {
        self.nowPlaying = false;
      });

      player.on("stop", function () {
        self.nowPlaying = false;
      });

      if (self.playerInstance) {
        self.unloadPlayerInstance();
      }

      self.playerInstance = player;
    },
    reinitPlayer: function () {
      if (this.playerInstance) {
        this.unloadPlayerInstance();
      }

      this.startPlayer();
    },
    startPlayer: function () {
      this.createPlayerInstance();
      if (this.pause) {
        this.playerInstance.pause();
      } else {
        this.playerInstance.play();
      }
    },
    clearPlayerInstanse() {
      this.$log.debug(
        `Player component close player playerInstanse ${
          this.playerInstance ? true : false
        }`
      );

      clearInterval(this.timerId);
      this.unloadPlayerInstance();
    },
    unloadPlayerInstance() {
      this.$log.debug("player instance unload");
      this.nowPlaying = false;
      this.seek = 0;
      if (this.playerInstance) {
        this.playerInstance.unload();
      }
      this.playerInstance = null;
    },
    ...mapActions({
      prevClick: "audio/prev",
      nextClick: "audio/next",
    }),
    ...mapMutations({
      setPause: "audio/SET_PAUSE",
      unsetPause: "audio/UNSET_PAUSE",
      closePlayer: "audio/CLOSE",
    }),
  },
};
</script>
