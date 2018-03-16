import { h, Component } from "preact"

const controlsStyles = {
  marginTop: "10px",
  fontFamily: "Arial"
}

const buttonStyles = {
  background: "rgba(0, 0, 0, .1)",
  width: "auto",
  height: "30px",
  cursor: "pointer",
  padding: "0 4px",
  fontSize: "14px",
  letterSpacing: ".01em",
  textTransform: "uppercase"
}

const addButtonStyles = {
  background: "rgba(0, 0, 0, .1)",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  fontSize: "14px"
}

const detailsStyles = {
  marginTop: "10px"
}

const valueStyles = {
  display: "inline-block",
  margin: "0 10px"
}

const labelStyles = {
  textTransform: "uppercase",
  fontSize: "11px",
  letterSpacing: ".01em",
  opacity: ".25",
  marginTop: "4px"
}

const headerStyles = {
  textTransform: "uppercase",
  fontSize: "11px",
  letterSpacing: ".01em",
  marginBottom: "8px"
}

const groupStyles = {
  marginTop: "10px"
}

const blockStyles = {
  display: "inline-block",
  verticalAlign: "top",
  marginRight: "20px"
}

const publishButtonStyles = {
  marginTop: "10px",
  background: "rgba(0, 0, 0, .1)",
  width: "auto",
  height: "30px",
  cursor: "pointer",
  padding: "0 10px",
  fontSize: "14px",
  letterSpacing: ".01em",
  textTransform: "uppercase"
}

class TextGroup extends Component {

  handleSubmit(e) {
    console.log(e);
  }

  render() {
    const { buttonText, labelText, value } = this.props;

    return (
      <div className="controls__group" style={groupStyles}>

        <div className="controls__value" style={{fontSize: "12px"}}>
          {value}
        </div>

        <form onsubmit={this.handleSubmit}>
          <input type="text" style={{ marginRight: "10px", height: "25px" }}></input>
          <input className="button" type="submit" value="set" style={buttonStyles}></input>
        </form>

        <div className="controls__label" style={labelStyles}>
          {labelText}
        </div>
      </div>
    )
  }
}

class ControlGroup extends Component {
  render() {
    const { buttonText, labelText, value } = this.props;

    return (
      <div className="controls__group" style={groupStyles}>
        <div className="controls__value" style={valueStyles}>
          {value}
        </div>
        <button className="controls__button" style={buttonStyles}>
          {buttonText}
        </button>
        <div className="controls__label" style={labelStyles}>
          {labelText}
        </div>
      </div>
    )
  }
}

class CircleGroup extends Component {
  render() {
    const { value } = this.props;

    return (
      <div>

        <div className="controls__header" style={headerStyles}>
          Circle position
        </div>

        <ControlGroup buttonText="set" labelText="vertical position" value={value.top} />
        <ControlGroup buttonText="set" labelText="horizontal position" value={value.left} />
        <ControlGroup buttonText="set" labelText="size" value={value.size} />

      </div>
    )
  }
}

export default class Controls extends Component {

  state = {
    detailsOpen: false
  }

  toggleControls = () => {
    this.setState({
      detailsOpen: !this.state.detailsOpen
    })
  }

  publish = () => {
    return;
  }

  // dataOpen={this.state.detailsOpen ? "true" : "false"}

  render() {
    return (
      <div className="controls" style={controlsStyles}>
        <button className="controls__button" style={addButtonStyles} onClick={this.toggleControls}>
          +
        </button>

        <div className="controls__details" style={detailsStyles} dataOpen="true">
          <div className="controls__block" style={blockStyles}>
            <ControlGroup buttonText="set" labelText="timestamp" value="0" />
            <ControlGroup buttonText="set" labelText="duration" value="0" />
            <TextGroup labelText="text" value="empty string" />
          </div>
          <div className="controls__block" style={blockStyles}>
            <CircleGroup value={{ top: 0, left: 0, size: .2 }} />
          </div>
        </div>

        <button className="controls__button" style={publishButtonStyles} onClick={this.publish}>
          publish
        </button>
      </div>
    )
  }
}
