import Vue from "vue";

export default (ctx, inject) => {
  const player = {
    playTrack(trackId, tracksList, place) {
      tracksList = tracksList.map((_track) => {
        return {
          _id: _track._id,
          src: _track.downloadLink,
          downloadLink: _track.downloadLink,
          title: _track.title,
          pageTitle: _track.pageName,
          pageShortName: _track.pageShortName,
          storageAvatarLink: _track.media.storageAvatarLink,
        };
      });

      const position = tracksList.findIndex((_track) => _track._id == trackId);

      ctx.store.dispatch("audio/playTrack", { place, tracksList, position });
    },
    isPlaying(contentId, place) {
      return place === ctx.store.getters["audio/place"] && contentId === ctx.store.getters["audio/track"]._id ? true : false;
    },
  };

  inject("player", player);
};
