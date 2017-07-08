import '../css/NavBar.scss'
import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { resetImage } from '../actions/image'
import { setTool } from '../actions/doodle'
import { setSliderValue } from '../actions/slider'
import $ from 'jquery'

class NavBar extends Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(evt) {
		this.props.resetImage()
		this.props.setTool('free')
		this.props.setSliderValue(0)
	}

	render() {
		$('.nav-links').hover(function(){
			let $this = $(this)
			let r=Math.floor(Math.random() * 255)
			let g=Math.floor(Math.random() * 255)
			let b=Math.floor(Math.random() * 255)
			let color= `rgb(${r},${g},${b})`
			$this.css("color", color)
		}, function(){
			$(this).css("color", "#000")
		})


		return (
			<div className="navbar clearfix">
				<Link className="nav-links" to="/" onClick={this.handleClick}>New Doodle</Link>
				<Link className="nav-links" to="/images">Latest Doodles</Link>
				{!this.props.token ? <Link id="login" className="nav-links" to="/login">Login</Link> : <Link id="profile" className="nav-links" to="/profile">Profile</Link>}
				{!this.props.token ? <Link id="register" className="nav-links" to="/register">Register</Link> : <Link id="logout" className="nav-links" to='/logout'>Logout</Link>}
				<span className="nav-title">DoodleDocs</span>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	token: state.account.token
})

const mapDispatchToProps = (dispatch) => ({
	resetImage: () => {
		dispatch(resetImage())
	},
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setSliderValue: (value) => {
		dispatch(setSliderValue(value))
	}
})

const ConnectedNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar)

export default ConnectedNavBar
