export function ServerButtonsTab(props) {
    const { imagesFromServer, hideImages, deleteImages, handleAllSelectDeselect, isUploading, getImagesFromServer,
        downloadImagesFromServer } = props
    
    return (
        <div className="input-container">

            
            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont téléchatgées */}
            <button className="input-item" onClick={()=>downloadImagesFromServer(imagesFromServer)} 
            disabled={imagesFromServer.length === 0 || isUploading ? true : false}>
                Download
            </button>

            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont supprimées */}
            <button className="input-item" onClick={()=>deleteImages(imagesFromServer)} 
            disabled={imagesFromServer.length === 0 || isUploading ? true : false}>
                Delete
            </button>

            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont cachées */}
            <button className="input-item" onClick={()=>hideImages(imagesFromServer)} 
            disabled={imagesFromServer.length === 0 || isUploading ? true : false}>
                Hide
            </button>


            {/* Lorsque l'on clique sur le boutton ci-dessous, les images sélectionnées sont supprimées */}
            <button className="input-item" onClick={()=>handleAllSelectDeselect()} 
            disabled={imagesFromServer.length === 0 || isUploading ? true : false}>
                Select/Deselect All
            </button>

            {/* Lorsque l'on clique sur le boutton ci-dessous, les images déjà uploadés sont montrées */}
            <button className="input-item" onClick={()=>getImagesFromServer()} 
            disabled={isUploading}>
                Show Uploaded Pictures
            </button>



        </div>
    )
}