export function InputTab(props) {
    const { handleAddImage, images, imagesDownload ,handleDeleteImage, 
        handleAllSelectDeselect, sendFormData, isUploading, downloadImages} = props
    
    return (
        <div className="input-container">
            <input className="input-item" type='file'   accept="image/png, image/jpeg" multiple 
            onChange={(e) => { 
                handleAddImage(Array.from(e.target.files))
                }}  />
            
            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont envoyées */}
            <button className="input-item" onClick={()=>sendFormData(images)} 
            disabled={images.length === 0 || isUploading ? true : false}>
                Upload
            </button>

            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont supprimées */}
            <button className="input-item" onClick={()=>handleDeleteImage()} 
            disabled={images.length === 0 || isUploading ? true : false}>
                Delete
            </button>


            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont supprimées */}
            <button className="input-item" onClick={()=>handleAllSelectDeselect()} 
            disabled={images.length === 0 || isUploading ? true : false}>
                Select/Deselect All
            </button>

            {/* Lorsque l'on clique sur le boutton ci-dessous, les images déjà uploadés sont montrées */}
            <button className="input-item" onClick={()=>downloadImages()} 
            disabled={isUploading}>
                Show Uploaded Pictures
            </button>



        </div>
    )
}