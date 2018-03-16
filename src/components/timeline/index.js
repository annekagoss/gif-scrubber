import { h, Component } from "preact"

const timelineStyles = {
  width: "100%",
  height: "40px",
  position: "relative",
  background: "rgba(0, 0, 0, .1)"
}

export default class Timeline extends Component {
  getPlayheadStyles() {
    const { playHead } = this.props;

    const baseStyles = {
      position: "absolute",
      width: "1px",
      height: "40px",
      backgroundColor: "black"
    }

    const position = 100 * playHead;

    const styles = { ...baseStyles, left: `${position}%` };

    return styles;
  }

  render() {
    return (
      <div className="timeline" style={timelineStyles}>
        <div className="timeline__playhead" style={this.getPlayheadStyles()}></div>
      </div>
    );
  }
}
