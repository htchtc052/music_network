<template>
  <div class="audiobox fixed-bottom bg-white container-xl px-2 pl-sm-1 pt-2" v-if="track">
    <div class="d-flex align-items-center">
      <div class="d-flex align-items-center pr-3">
        <span v-if="isFirst" class="mx-2 t-24 d-none d-sm-block link">
          <i class="las la-step-backward text-secondary op-3"></i>
        </span>
        <span title="Prev" v-else class="mx-2 t-24 d-none d-sm-block link" @click="prevClick()">
          <i class="las la-step-backward text-primary"></i>
        </span>
        <div class="text-warning text-decoration-none rounded-5 link d-flex align-items-center miniplayer-small mx-sm-1 justify-content-center border bordeer-light border-dotted">
          <div class="p-1 d-flex align-items-center" @click="unsetPause()" v-if="pause">
            <i class="fas fa-play mx-1"></i>
          </div>
          <div class="p-1 d-flex align-items-center" @click="setPause()" v-else>
            <i class="fas fa-pause mx-1"></i>
          </div>
        </div>
        <span v-if="isLast" class="mx-2 t-24 d-none d-sm-block link">
          <i class="las la-step-forward text-secondary op-3"></i>
        </span>
        <span title="Next" v-else class="mx-2 t-24 d-none d-sm-block link" @click="nextClick()">
          <i class="las la-step-forward text-primary"></i>
        </span>
      </div>
      <div class="mr-3 d-none d-sm-block">
        <img :src="`${track.storageAvatarLink}`" class="rounded-5" height="44" />
      </div>
      <div class="flex-fill mr-3">
        <div class="">
          <div class="text-truncate audiobox__content t-14 lh-12 font-weight-bold">{{ track.title }}</div>
          <div class="text-truncate t-13 audiobox__content mt-sm-1">{{ track.pageTitle }}</div>
          <!-- <div class="text-truncate audiobox__content">{{ track.title }} ({{ track.pageTitle }} {{track.pageShortName}})</div> -->
        </div>
      </div>
      <div class="d-flex align-items-center ml-auto lh-12 border-left pl-2">
        <a class="p-2 t-24 text-primary mr-1" target="_blank" title="Download file" :href="track.src">
          <i class="las la-download"></i>
        </a>
        <span class="link p-2 t-24 text-muted op-7" @click="closePlayer()">
          <i class="las la-times"></i>
        </span>
      </div>
    </div>
    <div class="d-flex lh-12 align-items-center text-muted ml-sm-2">
      <div id="player_progress_wrap" class="link my-0 w-100 mr-2 audiobox__progress">
        <div class="progress" id="player_progress" @click="skipTo">
          <div id="player_progress-inner" class="progress-bar bg-warning" role="progressbar" :style="'width: ' + this.progress + '%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
      <span class="text-secondary op-7 link text-nowrap t-10 lh-11" @click="getTimeDuration = !getTimeDuration">
        <span v-if="getTimeDuration">- {{ this.timerLeft }}</span>
        <span v-if="!getTimeDuration" class="audiobox__left">- {{ this.timerSeek }}</span>
      </span>
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

      //this.$log.debug(`Player computed progress() seek=${this.seek}, duration=${this.duration}, progress=${progress}`);

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
    nowPlaying: function(nowPlaying) {
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
        //this.$log.debug(`Player store mutation close`);
        this.clearPlayerInstanse();
      }

      if (mutation.type == "audio/SET_NEW_TRACK" || mutation.type == "audio/NEXT" || mutation.type == "audio/PREV") {
        //this.$log.debug(`Player store mutation play new track`);
        this.reinitPlayer();
      }

      if (mutation.type == "audio/SET_PAUSE" || mutation.type == "audio/UNSET_PAUSE" || mutation.type == "audio/TOOGLE_PAUSE") {
        // this.$log.debug(`Player store mutation changing pause ${state["audio"]}`);

        if (state["audio"].pause) {
          this.playerInstance.pause();
        } else {
          this.playerInstance.play();
        }
      }
    });
  },
  methods: {
    formatTime(secs) {
      const minutes = Math.floor(secs / 60) || 0;
      const seconds = secs - minutes * 60 || 0;

      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    skipTo: function(event) {
      let seekTo = Math.floor((event.offsetX / event.target.parentElement.clientWidth) * this.duration);

      let seek = clamp(seekTo, 0, this.duration);

      this.playerInstance.seek(seek);
      this.seek = seek;

      // this.$log.debug(`Player method skipTo() seekTo: ${seekTo} seek: ${seek} [element id=${event.target.id} class=${event.target.className}]`);
    },
    createPlayerInstance() {
      const src = this.track && this.track.src ? this.track.src : null;
      const self = this;

      const player = new Howl({
        src: [`${src}`],
        html5: true,
        autoplay: false,
        preload: true,
      });

      const volume = this.volume || 1;
      player.volume(volume);

      player.on("end", function(selected) {
        self.nowPlaying = false;
        self.$log.debug(`Audio pleer on end isLast ${self.isLast}`);
        // console.log("on end", "repeat", self.repeat, "isLast", self.isLast);
        if (!self.isLast) {
          //self.$log.debug("Audio player auto next");

          self.nextClick();
        } else {
          //self.$log.debug("Audio player auto stop");
          self.index = 0;
          self.seek = 0;
          self.playerInstance.seek(self.seek);
          self.setPause();
        }
      });

      player.on("load", function(cb) {
        self.duration = player.duration();
      });

      player.on("play", function() {
        self.nowPlaying = true;
      });

      player.on("pause", function() {
        self.nowPlaying = false;
      });

      player.on("stop", function() {
        self.nowPlaying = false;
      });

      if (self.playerInstance) {
        self.unloadPlayerInstance();
      }

      self.playerInstance = player;
    },
    reinitPlayer: function() {
      if (this.playerInstance) {
        this.unloadPlayerInstance();
      }

      this.startPlayer();
    },
    startPlayer: function() {
      this.createPlayerInstance();
      if (this.pause) {
        this.playerInstance.pause();
      } else {
        this.playerInstance.play();
      }
    },
    clearPlayerInstanse() {
      this.$log.debug(`Player component close player playerInstanse ${this.playerInstance ? true : false}`);

      clearInterval(this.timerId);
      this.unloadPlayerInstance();
    },
    unloadPlayerInstance() {
      //this.$log.debug("player instance unload");
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
