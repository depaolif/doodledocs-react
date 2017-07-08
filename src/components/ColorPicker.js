import React, {Component} from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

export default class ColorPicker extends Component {
  constructor(){
    super()
    this.state = {
      displayColorPicker: false,
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '0',
      },
    };
  }


  handleClick = () => {
    this.setState({
       displayColorPicker: !this.state.displayColorPicker
     })
  };

  handleClose = () => {
    this.setState({
      displayColorPicker: false
    })
  };

  handleChange = (color) => {
    this.setState({
      color: color.rgb
    })
    this.props.onChangeComplete(color)
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgb(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <span>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange} disableAlpha={true} />
        </div> : null }

      </span>
    )
  }
}
