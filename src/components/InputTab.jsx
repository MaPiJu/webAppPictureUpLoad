export function InputTab(props) {
    const { handleAddImage, images, setImages } = props
    const RPI_UPLOAD_URL = "http://192.168.178.38:3000/upload"

    async function sendFormData(images){

        // Création du formData pour envoyer les photos
        const formData = new FormData()
        images.forEach((image)=>{
            formData.append("photo",image)
        })

        // Début du post
        try{
            const res = await fetch(RPI_UPLOAD_URL, { method: "POST", body: formData })
            const data = await res.json()
            console.log("Réponse du serveur:", data)
        } catch(err){
            console.log(err.message)
        }
        
    }

    return (
        <div className="input-container">
            <input className="input-item" type='file'   accept="image/png, image/jpeg" multiple 
            onChange={(e) => { 
                handleAddImage(Array.from(e.target.files))
                }}  />
            
            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont envoyées */}
            <button className="input-item" onClick={()=>sendFormData(images)} 
            disabled={images.length === 0 ? true : false}>
                Upload
            </button>

            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont supprimées */}
            {/* CHANGER LA FONCTION ONCLICK */}
            <button className="input-item" onClick={()=>sendFormData(images)} 
            disabled={images.length === 0 ? true : false}>
                Delete
            </button>


            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont supprimées */}
            {/* CHANGER LA FONCTION ONCLICK */}
            <button className="input-item" onClick={()=>sendFormData(images)} 
            disabled={images.length === 0 ? true : false}>
                Select/Deselect All
            </button>
        </div>
    )
}