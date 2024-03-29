import { h, Component } from 'preact';

import { TIMELINE_HEIGHT } from "../../utils";


const triggerCircleStyles = {
  width: "80px",
  height: "80px",
  borderRadius: "1000px",
  border: "solid 5px red",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: "left 0s ease 00s, top 0s ease 0s"
}

const triggerLabelStyles = {
  color: "red",
  fontFamily: "sans-serif",
  fontWeight: "bold",
  fontSize: "30px",
  width: "auto",
  textAlign: "center",
  position: "absolute",
  marginTop: `${TIMELINE_HEIGHT * -2}px`,
  backgroundColor: "white",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "0 10px",
  whiteSpace: "nowrap"
}

const baseTriggerStyles = {
  display: "block",
  opacity: "0"
}

export default class Annotations extends Component {

  getCurrentStyles() {
    const { activeTrigger } = this.props;

    if (!activeTrigger) {
      return {
        base: {},
        circle: {
          left: 0,
          top: 0
        }
      };
    }

    const base = {
      opacity: "1"
    }

    return {
      base,
      circle: activeTrigger.circle
    };
  }

  getTriggerStyles() {
    const currentBaseStyles = this.getCurrentStyles().base;
    return { ...baseTriggerStyles, ...currentBaseStyles };
  }

  getCanvasSize() {
    const { canvas } = this.props;

    if (!canvas) {
      return {
        width: 0,
        height: 0
      };
    }

    const { width, height } = canvas.getBoundingClientRect();

    return { width, height };
  }

  getTriggerCircleStyles() {
    const { width, height} = this.getCanvasSize();
    const { left, top, size } = this.getCurrentStyles().circle;

    const scaledLeft = `${left * width}px`;
    const scaledTop = `${top * height}px`;;
    const scaledSize = `${width * size}px`

    const currentCircleStyles = {
      left: scaledLeft,
      top: scaledTop,
      width: scaledSize,
      height: scaledSize
    }

    return { ...triggerCircleStyles, ...currentCircleStyles }
  }

  render() {
    const { activeTrigger } = this.props;

    if (!activeTrigger) {
      return;
    }

    return (
      <div>
        <div className="trigger" data-name="peak-eyeroll" style={this.getTriggerStyles()}>
          <div className="trigger__circle" style={this.getTriggerCircleStyles()}></div>
          <div className="trigger__label" style={triggerLabelStyles}>{activeTrigger.text}</div>
        </div>
      </div>
    );
  }
}
