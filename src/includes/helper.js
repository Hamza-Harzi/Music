//the purpose of the helper file is to store utility function for assisting us with basic tasks
export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.round(time - minutes * 60 || 0);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  },
};
