import { useState } from 'react'
import { Header } from "./components/Header"
import { InputTab} from"./components/InputTab"
import { ImageListToAdd } from "./components/ImageListToAdd"
import { UploadPopup } from './components/UploadPopup'
import { ImageListDownload } from './components/ImageListDownload'


function App() {
// Constante pour définir où l'on poste nos images
const RPI_UPLOAD_URL = "http://localhost:3000/upload"

// Constante pour définir où l'on télécharge nos images
const RPI_DOWNLOAD_URL = "http://localhost:3000/images"

// Liste des images à uplaoder
const [images, setImages] = useState([])

// Liste des images à télécharger du serveur
const [imagesDownload, setImagesDownload] = useState([])

// Check si on est en upload
const [isUploading, setIsUploading] = useState(false)

// Check si on a un popup
const [showPopup, setShowPopup] = useState(false)

// Message du popup
const [popupMessage, setPopupMessage] = useState("")

function handleAddImage(newImage){
  // On fait passer danns une liste toutes les images avec les attributs: image/checked/id
  const toAdd = newImage.map(f => ({
    input: f,
    checked: true,
    id: crypto.randomUUID(), // utile pour les keys
  }))
  setImages(prev => [...prev, ...toAdd])
}

// Fonction pour modifier le checkerBox
function toggleChecked(id) {
  // On appelle setImages, le setter de notre liste d'images
  setImages(prevImages =>
    // Avec .map on crée une nouvelle liste d'images, où l'image choisie via l'ID en entrée voit sont checked inversé
    // ici le tableau retourné est le même avec l'image du ID en entrée qui voit son checked modifié "{ ...img, checked: !img.checked }"
    // si l'image mappée ne correspond pas à l'id on le laisse inchangé -> ": img"
    prevImages.map(img => img.id === id ? { ...img, checked: !img.checked } : img)
  )
}

// Fonction pour supprimer les images checked
function handleDeleteImage(){
  let newImages = images.filter((img) => img.checked === false)
  setImages(newImages)
}

// Fonction pour tout sélectionner si au moins une image est deselectionnée. Si tout est selectionné
// alors on deselectionne
function handleAllSelectDeselect(){
  let filteredImage = images.filter((img) => img.checked === false)
  let allSame = filteredImage.length === 0 || filteredImage.length === images.length

  let newImages = images.map(img => allSame ? { ...img, checked: !img.checked } : { ...img, checked: true })
  setImages(newImages)
}



// Fonction asynchrone afin de poster les images
async function sendFormData(images) {
  const imagesToSend = images.filter(img => img.checked === true);
  if (imagesToSend.length === 0) return;

  const controller = new AbortController(); // 🧠 permet d’annuler le fetch
  const timeout = setTimeout(() => controller.abort(), 5000); // ⏰ 5s max

  setIsUploading(true)

  const formData = new FormData();
  imagesToSend.forEach(image => {
    formData.append("photo", image.input); // ou "photo[]" selon le backend
  });

  try {
    const res = await fetch(RPI_UPLOAD_URL, { method: "POST", body: formData, signal: controller.signal });

    // Essaie de lire la réponse (même en erreur), mais sans casser si ce n'est pas du JSON
    let data = null;
    try { data = await res.json(); } catch { /* pas de JSON */ }
    console.log("Réponse du serveur:", data ?? res.statusText);

    if (res.ok) {
      // ⚠️ Ici on enlève du state celles qui ont été envoyées (les cochées)
      setImages(prev => prev.filter(img => !img.checked))
      setPopupMessage(`✅ Succès : ${res.status}`);
      setShowPopup(true);
    } 
     else {
      setPopupMessage(`❌ Erreur HTTP ${res.status}`);
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
async function downloadImages(){
  const controller = new AbortController(); // 🧠 permet d’annuler le fetch
  const timeout = setTimeout(() => controller.abort(), 5000); // ⏰ 5s max
  setIsUploading(true)

  try {
    const res = await fetch(RPI_DOWNLOAD_URL, {signal: controller.signal })

    // Essaie de lire la réponse (même en erreur), mais sans casser si ce n'est pas du JSON
    let data = null;
    try { data = await res.json(); } catch { /* pas de JSON */ }
    console.log("Réponse du serveur:", data ?? res.statusText);

    // Teste à la fois le statut HTTP et le champ ok du JSON.
    if (res.ok && data?.ok) {
      // Sauvegarde nos photos récupérées
      setImagesDownload(data.items || [])
      setPopupMessage(`✅ Succès, images du serveur récupérées : ${res.status}`);
      setShowPopup(true);
    } 
     else {
      setPopupMessage(`❌ Erreur HTTP ${res.status}`);
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

  return (  
    <>
      <Header/>
      <InputTab handleAddImage={handleAddImage} images = {images} imagesDownload = {imagesDownload} handleDeleteImage = {handleDeleteImage}
      handleAllSelectDeselect = {handleAllSelectDeselect} sendFormData = {sendFormData} isUploading = {isUploading}
      downloadImages = {downloadImages}/>
      <ImageListToAdd toggleChecked={toggleChecked} images={images} setImages = { setImages }/>
      <h1 className="header-item text-gradient"> Pictures in the server </h1>
      <ImageListDownload imagesDownload = {imagesDownload} setImagesDownload = {setImagesDownload}/>
      <UploadPopup showPopup = {showPopup} setShowPopup = {setShowPopup} popupMessage = {popupMessage}/>
    </>
  )
}

export default App
