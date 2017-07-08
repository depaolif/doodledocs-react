import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setTool, setLineWidth, setImageSrc, setColor } from '../actions/doodle'
import ColorPicker from './ColorPicker'
import '../css/ToolBox.scss'



class ToolBox extends Component {
	constructor() {
		super()

		this.state = {
			showColor: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleImageUpload = this.handleImageUpload.bind(this)
		this.handleChangeComplete = this.handleChangeComplete.bind(this)
		this.showOrHideColor = this.showOrHideColor.bind(this)
	}

	componentDidMount() {
		this.props.setColor('#000')
		this.props.setLineWidth(1)
		this.props.setTool('free')
	}

	handleChangeComplete(color) {
		this.props.setColor(color.hex)
	}

	handleChange(event) {
		this.props.setLineWidth(parseInt(event.target.value, 10))
	}

	handleClick(event) {
		this.props.setTool(event.target.name)
	}

	handleImageUpload(event) {
		this.props.setTool(event.target.name)
	    let reader = new FileReader()
	    reader.onload = (event) => {
	    	this.props.setImageSrc(event.target.result)
	    }
	    reader.readAsDataURL(event.target.files[0]);
	}

	showOrHideColor() {
		const show = this.state.showColor ? false : true
		this.setState({
			showColor: show
		})
	}

	isSelected(name) {
		return name === this.props.doodle.tool ? 'selected' : ''
	}

	render() {
		return (
			<div id="toolbar">
				<ul className="tools">
					<li>
						<ColorPicker onChangeComplete={this.handleChangeComplete}/>
					</li>
					<li className="coupled">
						<img src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493061658/ic_line_weight_black_24dp_1x_a1dquz.png" alt="line width" className="icon" />
					</li>
					<li>
						<select value={this.props.doodle.lineWidth} onChange={this.handleChange} className="tool">
							<option value='1'>1</option>
							<option value='5'>5</option>
							<option value='10'>10</option>
							<option value='20'>20</option>
							<option value='30'>30</option>
							<option value='50'>50</option>
							<option value='100'>100</option>
						</select>
					</li>
					<li className={this.isSelected('free')}>
						<img name="free" src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493061803/ic_gesture_black_24dp_1x_ui9sy3.png" alt="free" className="icon" onClick={this.handleClick} />
					</li>
					<li className={this.isSelected('line')}>
						<img name="line"
						src="http://res.cloudinary.com/dletp3dah/image/upload/a_90/v1493062257/ic_remove_black_24dp_1x_m1b9yy.png" alt="line" className="icon" onClick={this.handleClick}/>
					</li>
					<li className={this.isSelected('circle')}>
						<img name="circle"
						src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493060454/ic_radio_button_unchecked_black_24dp_1x_hekiro.png" alt="circle" className="icon" onClick={this.handleClick}/>
					</li>
					<li className={this.isSelected('rectangle')}>
						<img name="rectangle" src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493058803/ic_crop_din_black_24dp_1x_tmmokd.png" alt="square" className="icon" onClick={this.handleClick} />
					</li>
					<li className={"coupled " + this.isSelected('image')}>
						<img src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493063788/ic_attach_file_black_24dp_1x_fsd4du.png" alt="upload icon" className="icon"/>
					</li>
					<li>
						<input onChange={this.handleImageUpload} type="file" name="image" className="icon" />
					</li>
				</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	doodle: state.doodle
})

const mapDispatchToProps = (dispatch) => ({
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setLineWidth: (width) => {
		dispatch(setLineWidth(width))
	},
	setImageSrc: (src) => {
		dispatch(setImageSrc(src))
	},
	setColor: (color) => {
		dispatch(setColor(color))
	},
})

const ConnectedToolBox = connect(mapStateToProps, mapDispatchToProps)(ToolBox)

export default ConnectedToolBox
