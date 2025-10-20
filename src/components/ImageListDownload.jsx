import { ImageCardDownload } from "./ImageCardDownload"

export function ImageListDownload(props){
    const { imagesDownload } = props

    
    return (
        <div className="list-item">
        {/* On loop sur les images uploadé */}
        {imagesDownload?.map((image, imageIndex)=>{
            return (
                // Pour chaque tache on crée ici une ImageCard
                <ImageCardDownload 
                    // On lui donne ici un index unique key qui provient de la liste filtrée
                    key={image?.filename} 

                    // On lui donne toutes les props originales à ImageCard (Image, handleDeleteImage, ImageIndex, handleCompleteImage)
                    {...props}

                    // On passe ici la tâche actuelle (image) à ImageCard, cela permet à la "ImageCard" d'afficher les infos de
                    // cette tâche
                    image={image}/>
            )
        })}
        </div>
    )
}