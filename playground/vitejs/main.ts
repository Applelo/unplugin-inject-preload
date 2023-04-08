import './../src/css/style.css'

setTimeout(() => {
  import('./../src/lazy').then((obj) => {
    obj.default()
  })
}, 2000)
