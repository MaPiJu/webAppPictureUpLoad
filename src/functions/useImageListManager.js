import { useState } from 'react';

export default function useImageListManager(initialImages = []) {

    // Création du UseState pour les images
  const [images, setImages] = useState(initialImages || [])

    // Ajout d'une nouvelle image
  const addImages = (newImages) => {
        const toAdd = newImages.map(f => ({
            input: f,
            checked: true,
            id: crypto.randomUUID(),
        }))
    setImages(prev => [...prev, ...toAdd])
      console.log("Ho")
      console.log(images)
  }


    // Supprime les images qui sont cochées
  const deleteChecked = () => {
    let newImages = images.filter((img) => img.checked === false)
    setImages(newImages)
  }

    // Sélectionne ou déselectionne toutes les images
  const handleAllSelectDeselect = () => {
    let filteredImage = images.filter((img) => img.checked === false)
    let allSame = filteredImage.length === 0 || filteredImage.length === images.length

    let newImages = images.map(img => allSame ? { ...img, checked: !img.checked } : { ...img, checked: true })
    setImages(newImages)
  }

    // Permet de sélectionner les images
  const toggleImage = (id) => {
    setImages(prevImages =>
    // Avec .map on crée une nouvelle liste d'images, où l'image choisie via l'ID en entrée voit sont checked inversé
    // ici le tableau retourné est le même avec l'image du ID en entrée qui voit son checked modifié "{ ...img, checked: !img.checked }"
    // si l'image mappée ne correspond pas à l'id on le laisse inchangé -> ": img"
    prevImages.map(img => img.id === id ? { ...img, checked: !img.checked } : img)
  )
  }

  return {
    images,
    addImages,
    setImages,
    deleteChecked,
    handleAllSelectDeselect,
    toggleImage,
  }
}
