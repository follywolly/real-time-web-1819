const dom = {
  appendElTo(parent, name, options = {}) {
    const el = document.createElement(name)
    if (options.text) {
      el.innerText = options.text
    }
    if (options.class) {
      if (typeof options.class === 'string') {
        el.classList.add(options.class)
      } else {
        options.class.forEach(nodeClass => el.classList.add(nodeClass))
      }
    }
    parent.appendChild(el)

    return el
  }
}
export default dom
