import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../css/ImageItem.scss'

class ImageItem extends Component {
	constructor() {
		super()

		this.handleDelete = this.handleDelete.bind(this)
	}

	handleDelete(event) {
		event.preventDefault()
		this.props.onDelete(this.props.id)
	}

	render() {
		let {id, title, preview} = this.props
		let url = `/images/${id}`
		const titleLink = title ? title : "Untitled"
		return (
			<div className='image-item'>
				<Link to={url}><img className="image" alt={title} src={preview} width='300' height='300' /></Link>
				<Link className="image-item-link" to={url}>{titleLink}</Link>
				<br></br>
				{this.props.onDelete ? <img src="http://res.cloudinary.com/dletp3dah/image/upload/v1493061698/ic_delete_black_24dp_1x_qsiksm.png"
				onClick={this.handleDelete} className="delete" alt="trash button"/> : false}
			</div>
		)
	}
}

export default ImageItem
