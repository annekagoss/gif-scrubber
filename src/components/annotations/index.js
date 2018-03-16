import { h, Component } from 'preact';

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
  fontSize: "50px",
  width: "100%",
  textAlign: "center"
}

const baseTriggerStyles = {
  display: "block",
  opacity: "0"
}

const eyerollStyles = {
  base: {
    opacity: "1"
  },
  circle: {
    top: .2,
    left: .59
  }
}

export default class Annotations extends Component {

  getCurrentStyles() {
    const { trigger } = this.props;

    if (!trigger) {
      return {
        base: {},
        circle: {
          left: 0,
          top: 0
        }
      };
    }

    if (trigger.name === "peak-eyeroll") {
      return eyerollStyles;
    }
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
    const { left, top } = this.getCurrentStyles().circle;

    const scaledLeft = `${left * width}px`;
    const scaledTop = `${top * height}px`;;
    const scaledSize = `${width * .2}px`

    const currentCircleStyles = {
      left: scaledLeft,
      top: scaledTop,
      width: scaledSize,
      height: scaledSize
    }

    return { ...triggerCircleStyles, ...currentCircleStyles }
  }

  render() {
    return (
      <div>
        <div className="trigger" data-name="peak-eyeroll" style={this.getTriggerStyles()}>
          <div className="trigger__circle" style={this.getTriggerCircleStyles()}></div>
          <div className="trigger__label" style={triggerLabelStyles}>PEAK EYE ROLL</div>
        </div>
      </div>
    );
  }
}
