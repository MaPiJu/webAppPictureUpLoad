import { useState } from 'react'
import { Header } from "./components/Header"
import { InputTab} from"./components/InputTab"
import { ImageListToAdd } from "./components/ImageListToAdd"


function App() {

// List of images
const [images, setImages] = useState([])

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
  setImages(prevImages =>
    prevImages.map(img =>
      img.id === id ? { ...img, checked: !img.checked } : img
    )
  );
}




  return (
    <>
      <Header/>
      <InputTab handleAddImage={handleAddImage} images = {images} setImages = { setImages }/>
      <ImageListToAdd toggleChecked={toggleChecked} images={images} />
    </>
  )
}

export default App
