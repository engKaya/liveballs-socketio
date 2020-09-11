const colors = ['blue','green','red']

const randomcolors=() => {
    return colors[Math.floor(Math.random() * colors.length)]
}

module.exports = randomcolors