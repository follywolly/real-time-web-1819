const helper = {
  formatTime(timestamp) {
    let hours = timestamp.getHours()
    hours = hours < 10 ? `0${hours}` : hours
    let minutes = timestamp.getMinutes()
    minutes = minutes < 10 ? `0${minutes}` : minutes
    let seconds = timestamp.getSeconds()
    seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${hours}:${minutes}:${seconds}`
  }
}
export default helper
