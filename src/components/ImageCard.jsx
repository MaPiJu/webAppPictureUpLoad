export function ImageCard(props){

    const { toggleChecked, image, imageIndex } = props

    return(
    <div className="card-item"> 
          <input className="checkbox-item" type="checkbox" checked={image.checked} onChange={() => toggleChecked(image.id)}/>
          <img className='img' src={URL.createObjectURL(image.input)} alt={`${image.input.name}-large-img`} />
    </div>
    )


}


