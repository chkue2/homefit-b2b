/*
  - css setting -
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
*/
export default {
  setVh100() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  },
}
