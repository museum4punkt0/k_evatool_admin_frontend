import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faPlus,
    faEdit,
    faTrash,
    faSync,
    faEye,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)
library.add(faEdit)
library.add(faTrash)
library.add(faSync)
library.add(faEye)
library.add(faTimes)

export default (app) => {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
}
