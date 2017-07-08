import '../css/Doodle.scss'
import React, {Component} from 'react'
import { setCurrentImage, addImage, setAutoSave, resetImage, updatePreviewForImage } from '../actions/image'
import { setSliderValue } from '../actions/slider'
import { setTool } from '../actions/doodle'
import ConnectedToolBox from './ToolBox'
import { connect } from 'react-redux'
import axios from 'axios'
import DoodleSlider from './DoodleSlider'
import { mouseDownEventListener, mouseMoveEventListener, mouseUpEventListener, keyPressEventListener } from '../helpers/mouseListeners'
import { keyDownEventListener, renderHistory } from '../helpers/history'
import { drawImage } from '../helpers/drawing'

class Doodle extends Component {
	constructor() {
		super()

		this.state = {
			height: 1000,
			width: window.innerWidth,
			history: [],
			redoHistory: [],
			imageTitle: '',
			isPainting: false,
			isDrawingText: false
		}

		this.canvas = null
		this.context = null
		this.autoSave = null

		this.handleAutoSave = this.handleAutoSave.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.updateCanvas = this.updateCanvas.bind(this)
		this.renderHistory = renderHistory.bind(this)
		this.mouseDownEventListener = mouseDownEventListener.bind(this)
		this.mouseUpEventListener = mouseUpEventListener.bind(this)
		this.mouseMoveEventListener = mouseMoveEventListener.bind(this)
		this.keyDownEventListener = keyDownEventListener.bind(this)
		this.keyPressEventListener = keyPressEventListener.bind(this)
		this.onBlurEventListener = this.onBlurEventListener.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
	}

	componentWillMount() {
		this.restoreImage()
	}

	componentDidMount() {
		this.updateCanvas()
		this.context.lineCap = 'round'
		this.context.lineJoin = 'round'

		this.autoSave = setInterval(() => {
			if (this.props.images.autoSave && this.props.slider.value === this.state.history.length)
				this.save('PATCH', `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${this.props.images.current.id}`, this.props.images.current.title)
		}, 3000)

			// event listeners for drawing events
			this.canvas.addEventListener('mousedown', this.mouseDownEventListener)
			this.canvas.addEventListener('mousemove', this.mouseMoveEventListener)
			this.canvas.addEventListener('mouseup', this.mouseUpEventListener)

    	// event listener for undo feature
    	document.addEventListener('keydown', this.keyDownEventListener)
    	document.addEventListener('keypress', this.keyPressEventListener)
    }

    componentDidUpdate(prevProps, prevState) {
    	this.updateCanvas()
    }

    componentWillUnmount() {
    	this.canvas.removeEventListener('mousedown', this.mouseDownEventListener)
    	this.canvas.removeEventListener('mousemove', this.mouseMoveEventListener)
    	this.canvas.removeEventListener('mouseup', this.mouseUpEventListener)
    	document.removeEventListener('keydown', this.keyDownEventListener)
    	document.removeEventListener('keypress', this.keyDownEventListener)
    	clearInterval(this.autoSave)
    	this.props.setAutoSave(false)
    	this.props.setSliderValue(0)
    	this.props.setTool('free')
    	this.props.resetImage()
    }

    onBlurEventListener(event) {
    	debugger
    	this.setState({ isDrawingText: false })
    }

	// gets canvas element and sets context to it
	// checks to see if there's a current image, and creates a blank, 'new' image if not
	updateCanvas() {
		this.canvas = document.getElementById('app-canvas')
		this.context = this.canvas.getContext('2d')
		if (!this.props.images.current) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.setState({ history: [] })
			this.setState({ redohistory: [] })
			this.props.setCurrentImage('new')
		}
	}

	restoreImage() {
		if (this.props.match.path !== '/') {
			let url = `http://localhost:3001/v1/images/${this.props.match.params.imageId}`
			axios({
				method: 'GET',
				url: url
			})
			.then(resp => {
				let imageData = resp.data.image_data
				this.setState({ history: imageData })
				this.props.setSliderValue(imageData.length)
				drawImage(this.context, imageData)
				if (resp.data.account_id === this.props.account.id) {
					this.props.setCurrentImage({id: resp.data.id, title: resp.data.title})
				}
			})
		}
	}

	handleSave(event) {
		event.preventDefault()
		let url = `http://localhost:3001/v1/accounts/${this.props.account.id}/images`
		let title
		let method = 'POST'
		if (event.target[0] && event.target[0].name === "title")
			title = event.target[0].value
		if (this.props.images.current !== 'new') {
			url += `/${this.props.images.current.id}`
			method = 'PATCH'
			title = this.props.images.current.title
		}
		this.save(method, url, title)
	}

	save(method, url, title) {
		let lowQualityImage = this.canvas.toDataURL('image/png', 0.01)
		axios({
			method: method,
			url: url,
			data: JSON.stringify({image: this.state.history, preview: lowQualityImage, title: title})
		})
		.then(resp => {
			window.alert("Successfully saved!")
			if (this.props.images.current.id !== resp.data.id) {
				this.props.setCurrentImage({id: resp.data.id, title: title})
				this.props.addImage({id: resp.data.id, title: title, data_url: lowQualityImage})
			} else if (this.props.images.current.id === resp.data.id) {
				this.props.updatePreviewForImage({id: resp.data.id, preview: lowQualityImage})
			}
		})
	}

	handleAutoSave(event) {
		this.props.setAutoSave(event.target.checked)
	}

	getMousePos(canvas, evt) {
	  let rect = canvas.getBoundingClientRect(), // abs. size of element
	      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
	      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

	  return {
	    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
	    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
	  }
	}

	// handle input change for title of picture before saving
	handleInputChange(event) {
		this.setState({
			imageTitle: event.target.value
		});
	}

	render() {
		let saving
		if (this.props.account.token && this.props.images.current === 'new') {
			const isDisabled = this.state.imageTitle ? null : 'disabled'
			saving =
			<div className="save-box">
				<form onSubmit={this.handleSave}>
				<label className="label">Title:</label><input type="text" name="title" onChange={this.handleInputChange}/>
				<input type="submit" value="Save" disabled={isDisabled} />
				</form>
			</div>
		} else if (this.props.account.token && this.props.images.current && typeof this.props.images.current.id === 'number') {
			saving =
			<div className="save-box">
				{this.props.images.current.title ? <h2>{this.props.images.current.title}</h2> : null}
				<input type="submit" value="Save" onClick={this.handleSave} />
				<div id="auto">
					<label > AutoSave</label>
					<input type="checkbox" name="autosave" onClick={this.handleAutoSave} />
				</div>	
			</div>
		}
		return (
			<div className="doodle">
				{saving}
				<DoodleSlider max={this.state.history.length} handleSlide={this.renderHistory} disabled={this.state.historyLength > 0? false : true}/>
				<ConnectedToolBox className="toolbox" />
				<canvas tabIndex='1' id="app-canvas" width={this.state.width} height={this.state.height} />
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	doodle: state.doodle,
	account: state.account,
	images: state.images,
	slider: state.slider
})

const mapDispatchToProps = (dispatch) => ({
	setCurrentImage: (image) => {
		dispatch(setCurrentImage(image))
	},
	updatePreviewForImage: (image) => {
		dispatch(updatePreviewForImage(image))
	},
	addImage: (image) => {
		dispatch(addImage(image))
	},
	setAutoSave: (bool) => {
		dispatch(setAutoSave(bool))
	},
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setSliderValue: (value) => {
		dispatch(setSliderValue(value))
	},
	resetImage: () => {
		dispatch(resetImage())
	}
})

const ConnectedDoodle = connect(mapStateToProps, mapDispatchToProps)(Doodle)

export default ConnectedDoodle
