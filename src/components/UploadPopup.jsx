import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

export function UploadPopup(props) {
    const { showPopup, setShowPopup, popupMessage } = props

    return (
        // "modal" -> sert à overlay plein écran
        // "nested" -> permet d’avoir plusieurs popups ouverts en même temps (imbriqués)
    <Popup className="upload-popup" open={showPopup} onClose={() => setShowPopup(false)} modal nested>
        <h1>{popupMessage}</h1>
        <button onClick={() => setShowPopup(false)}>
            Close
        </button>
    </Popup>
    )
}