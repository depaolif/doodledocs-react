import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setSliderValue } from '../actions/slider'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import '../css/Slider.css'

class DoodleSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sliding: false
    }
    this.handleChange=this.handleChange.bind(this)
  }

  handleChange(value) {
    this.props.setSliderValue(value)
    this.props.handleSlide(value, value === this.props.max)
  }

  render() {
    return(
      <Slider
        className="slider"
        min={0}
        max={this.props.max}
        disabled={this.props.max === 0}
        defaultValue={0}
        value={this.props.slider.value}
        onChange={this.handleChange}
        minimumTrackStyle={{
          backgroundColor: 'black'
        }}
        handleStyle={{
          borderColor: 'black'
        }}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  slider: state.slider
})

const mapDispatchToProps = (dispatch) => ({
  setSliderValue: (value) => {
    dispatch(setSliderValue(value))
  }
})

const ConnectedSlider = connect(mapStateToProps, mapDispatchToProps)(DoodleSlider)

export default ConnectedSlider
