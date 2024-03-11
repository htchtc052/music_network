import type { Track } from "~/types/types";
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", () => {
  const tracks = ref<Track[]>([]);

  const pause = ref<boolean>(false);

  const position = ref<number | null>(null);

  const setTracks = (data: Track[]) => (tracks.value = data);

  const setPosition = (data: number) => (position.value = data);

  const setPause = (data: boolean) => (pause.value = data);
  const tooglePause = () => (pause.value = !pause.value);

  const track: ComputedRef<Track | null> = computed(() => {
    return position.value != null ? tracks.value[position.value] : null;
  });

  //TODO убрать вычисление пути на бек

  const isFirst: ComputedRef<boolean> = computed(() => {
    return position.value != null && position.value == 0;
  });

  const isLast: ComputedRef<boolean> = computed(() => {
    return !!(
      tracks.value.length &&
      position.value !== null &&
      position.value >= tracks.value.length - 1
    );
  });

  const prevClick = () => {
    if (isFirst.value) {
      console.debug(`Audio player can't prev inFirst`);
    } else {
      if (position.value != null) {
        setPosition(position.value - 1);
      }
    }
  };
  const nextClick = () => {
    console.debug("isLast", isLast.value);
    if (isLast.value) {
      console.debug(`Audio player can't next inLast`);
    } else {
      //console.debug(`Audio player next`);
      if (position.value != null) {
        setPosition(position.value + 1);
      }
    }
  };

  const onEndPlayTrack = () => {
    console.log(`onEndPlayTrack isLast=${isLast.value}`);
    if (isLast.value) {
      setPosition(0);
    } else {
      nextClick();
    }
  };

  const playTrack = (newTracks: Track[], newPosition: number) => {
    if (newPosition == position.value) {
      console.debug(
        `Play track method. Click on playing track. Need toogle pause pause current value=${pause.value}`
      );
      if (pause.value) {
        setPause(false);
      } else {
        setPause(true);
      }
    } else {
      console.debug(`Play track method. Click on new track`);

      if (pause.value) {
        setPause(false);
      }

      setPosition(newPosition);
      setTracks(newTracks);
    }
  };

  return {
    tracks,
    track,
    position,
    pause,
    playTrack,
    prevClick,
    nextClick,
    onEndPlayTrack,
    isFirst,
    isLast,
  };
});
