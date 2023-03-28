import './css/style.css'

setTimeout(() => {
  import('./lazy').then(obj => {
    obj.default()
  })
}, 2000)
