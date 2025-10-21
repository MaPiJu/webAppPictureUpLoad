import { useState } from 'react'
import { Header } from "./components/Header"
import { InputTab} from"./components/InputTab"
import { ImageListToAdd } from "./components/ImageListToAdd"
import { UploadPopup } from './components/UploadPopup'
import { ServerButtonsTab } from './components/ServerButtonsTab'
import useImageListManager from './functions/useImageListManager'

// QUAND CECI DISPARAIT ALORS IL Y ICI TOUT CE QU IL FALLAIT POUR FONCTIONNER

function App() {
// Constante pour définir où l'on poste nos images
const RPI_UPLOAD_URL = "http://localhost:3000/upload"

// Constante pour définir où l'on télécharge nos images
const RPI_DOWNLOAD_URL = "http://localhost:3000/images"

// Liste des images à uplaoder
const {
  images: imagesToUpload,
  addImages: addImagesToUpload,
  setImages: setImagesToUpload,
  deleteChecked: deleteUploadImages,
  handleAllSelectDeselect: handleAllSelectDeselectUploadImages,
  toggleImage: toggleUploadImage,
} = useImageListManager()

// Liste des images à récupérer du serveur
const {
  images: imagesFromServer,
  addImages: addImagesFromServer,
  setImages: setImagesFromServer,
  deleteChecked: hideFromServer,
  handleAllSelectDeselect: handleAllSelectDeselectFromServer,
  toggleImage: toggleFromServer,
} = useImageListManager()


// Check si on est en upload
const [isUploading, setIsUploading] = useState(false)

// Check si on a un popup
const [showPopup, setShowPopup] = useState(false)

// Message du popup
const [popupMessage, setPopupMessage] = useState("")



// Fonction asynchrone afin de poster les images
async function sendFormData() {
  const imagesToSend = imagesToUpload.filter(img => img.checked === true)
  if (imagesToSend.length === 0) return

  const controller = new AbortController() // 🧠 permet d’annuler le fetch
  const timeout = setTimeout(() => controller.abort(), 5000) // ⏰ 5s max

  setIsUploading(true)

  const formData = new FormData()
  imagesToSend.forEach(image => {
    formData.append("photo", image.input) // ou "photo[]" selon le backend
  })

  try {
    const res = await fetch(RPI_UPLOAD_URL, { method: "POST", body: formData, signal: controller.signal })

    // Essaie de lire la réponse (même en erreur), mais sans casser si ce n'est pas du JSON
    let data = null
    try { data = await res.json() } catch { /* pas de JSON */ }
    console.log("Réponse du serveur:", data ?? res.statusText)

    if (res.ok) {
      // ⚠️ Ici on enlève du state celles qui ont été envoyées (les cochées)
      setImagesToUpload(prev => prev.filter(img => !img.checked))
      setPopupMessage(`✅ Succès : ${res.status}`)
      setShowPopup(true)
    } 
     else {
      setPopupMessage(`❌ Erreur HTTP ${res.status}`)
      setShowPopup(true)
    }

  } catch (err) {
    if (err.name === "AbortError"){
      setPopupMessage("⏰ Timeout : la requête a été annulée après 5 secondes")
    } else {
    setPopupMessage(`⚠️ Erreur réseau : ${err.message}`)
    }
    setShowPopup(true)
  } finally {
    clearTimeout(timeout)
    setIsUploading(false)
  }
}

// Fonction asynchrone afin de récupérer les images
async function getImagesFromServer(){
  const controller = new AbortController() // 🧠 permet d’annuler le fetch
  const timeout = setTimeout(() => controller.abort(), 5000) // ⏰ 5s max
  setIsUploading(true)

  try {
    // signal -> sert au timer
    const res = await fetch(RPI_DOWNLOAD_URL, {signal: controller.signal })

    // Essaie de lire la réponse (même en erreur), mais sans casser si ce n'est pas du JSON
    let data = null
    try { data = await res.json() } catch { /* pas de JSON */ }
    console.log("Réponse du serveur:", data ?? res.statusText)

    // Teste à la fois le statut HTTP et le champ ok du JSON.
    if (res.ok && data?.ok) {
      // Sauvegarde nos photos récupérées
      const normalized = data.items.map(img => ({
            input: null,
            checked: true,
            id: img.filename,
            url: `http://localhost:3000${img.url}`,
            filename: img.filename,
          }))
      setImagesFromServer(normalized || [])
      setPopupMessage(`✅ Succès, images du serveur récupérées : ${res.status}`)
      setShowPopup(true)
    } 
     else {
      setPopupMessage(`❌ Erreur HTTP ${res.status}`)
      setShowPopup(true)
    }

  } catch (err) {
    if (err.name === "AbortError"){
      setPopupMessage("⏰ Timeout : le téléchargement a été annulée après 5 secondes")
    } else {
    setPopupMessage(`⚠️ Erreur réseau : ${err.message}`)
    }
    setShowPopup(true)
  } finally {
    clearTimeout(timeout)
    setIsUploading(false)
  }
}


// Fonction qui télécharge sur l'ordinateur les photos du serveur:
function downloadImagesFromServer(){
  const toDownload = imagesFromServer.filter(img => img.checked)
  if (toDownload.length === 0) return

  toDownload.forEach(image => {
    var a = document.createElement('a')
    a.href = image.url
    console.log(image)
    a.download = image.id
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  })
}


// Fonction asynchrone qui supprime du serveur les photos sélectionnés avec le ticker
async function delImagesFromServer() {
  const toDelete = imagesFromServer.filter(img => img.checked)
  if (toDelete.length === 0) return

  try {
    // promise.all sert à à exécuter plusieurs promesses en parallèle et attendre qu’elles 
    // soient toutes terminées avant de continuer
    await Promise.all(
      toDelete.map(img =>
        fetch(`http://localhost:3000/images/${img.filename}`, { method: 'DELETE' })
      )
    )
    setPopupMessage(`🗑️ Images supprimées (${toDelete.length})`)
    setShowPopup(true)

    // Mets à jour l'état local
    const remaining = imagesFromServer.filter(img => !img.checked)
    setImagesFromServer(remaining)
  } catch (err) {
    console.error('Erreur de suppression:', err)
    setPopupMessage('❌ Échec de suppression')
    setShowPopup(true)
  }
}


  return (  
    <>
      <Header/>
      <InputTab handleAddImage={addImagesToUpload} imagesToUpload = {imagesToUpload} imagesFromServer = {imagesFromServer} handleDeleteImage = {deleteUploadImages}
      handleAllSelectDeselect = {handleAllSelectDeselectUploadImages} sendFormData = {sendFormData} isUploading = {isUploading}/>
      <ImageListToAdd images={imagesToUpload} toggleImage={toggleUploadImage} setImagesToUpload = { setImagesToUpload }/>
      <h1 className="header-item text-gradient"> Pictures in the server </h1>
      <ServerButtonsTab imagesFromServer = {imagesFromServer} hideImages = {hideFromServer} deleteImages = {delImagesFromServer}
      handleAllSelectDeselect = {handleAllSelectDeselectFromServer} isUploading = {isUploading} getImagesFromServer = {getImagesFromServer}
      downloadImagesFromServer = {downloadImagesFromServer}/>
      <ImageListToAdd images={imagesFromServer} toggleImage={toggleFromServer} setImages={setImagesFromServer} />
      <UploadPopup showPopup = {showPopup} setShowPopup = {setShowPopup} popupMessage = {popupMessage}/>
    </>
  )
}

export default App
