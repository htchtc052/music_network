import Vue from "vue";

export const state = () => ({
  place: null,
  position: null,
  tracksList: [],
  pause: false,
});

export const getters = {
  pause: (state) => state.pause,
  position: (state) => state.position,
  place: (state) => state.place,
  track: (state) => {
    return state.position != null &&
      state.tracksList &&
      state.tracksList[state.position]
      ? state.tracksList[state.position]
      : null;
  },

  isFirst: (state) => {
    return state.position == 0 ? true : false;
  },
  isLast: (state) => {
    return state.tracksList &&
      state.tracksList.length &&
      state.position >= state.tracksList.length - 1
      ? true
      : false;
  },
};

export const mutations = {
  SET_NEW_TRACK(state, { place, tracksList, position }) {
    state.place = place;
    state.tracksList = tracksList;
    state.position = position;
  },
  SET_PAUSE(state) {
    state.pause = true;
  },
  UNSET_PAUSE(state) {
    state.pause = false;
  },
  TOOGLE_PAUSE(state) {
    state.pause = !state.pause;
  },
  PREV(state) {
    state.position--;
  },
  NEXT(state) {
    state.position++;
  },
  CLOSE(state) {
    state.position = null;
    state.place = null;
    state.tracksList = [];
    state.pause = false;
    //state.track = {};
  },
};

export const actions = {
  prev({ commit, getters }) {
    if (getters["isFirst"]) {
      Vue.$log.warn(`Audio player can't prev inFirst`);
    } else {
      commit("PREV");
    }
  },
  next({ commit, getters }) {
    if (getters["isLast"]) {
      Vue.$log.warn(`Audio player can't next inLast`);
    } else {
      commit("NEXT");
    }
  },

  playTrack({ commit, getters }, { place, tracksList, position }) {
    if (getters["place"] == place && getters["position"] == position) {
      //Vue.$log.debug(`Play track method. Click on playing track. Need toogle pause`);
      commit("TOOGLE_PAUSE");
    } else {
      tracksList = Object.entries(tracksList).reduce(function (a, [key, item]) {
        item.position = key;

        a[key] = item;
        return a;
      }, []);

      if (getters["pause"]) {
        commit("UNSET_PAUSE");
      }

      commit("SET_NEW_TRACK", { place, position, tracksList });
    }
  },
};
