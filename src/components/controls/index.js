import { h, Component } from "preact"

import { formatFloat } from "../../utils";

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
  margin: "0 10px",
  fontSize: "14px"
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

const textStyles = {
  marginRight: "10px",
  height: "25px",
  borderBottom: "solid 1px black"
}

class TextGroup extends Component {
  state = {
    locked: false,
    value: null
  }

  toggleLockedState = () => {
    const newLockedState = !this.state.locked;
    const newValue = newLockedState ? this.props.value : null;

    this.setState({
      locked: newLockedState,
      value: newValue
    });
  }

  getValueStyles() {
    if (!this.state.locked) {
      return textStyles;
    }

    return { ...textStyles, color: "lime", pointerEvents: "none" };
  }

  handleSubmit(e) {
    console.log(e);
  }

  render() {
    const { buttonText, labelText, value } = this.props;

    return (
      <div className="controls__group" style={groupStyles}>

        <input type="text" style={this.getValueStyles()}></input>

        <button className="controls__button" style={buttonStyles} onClick={this.toggleLockedState}>
          set
        </button>

        <div className="controls__label" style={labelStyles}>
          {labelText}
        </div>
      </div>
    )
  }
}

class NumberGroup extends Component {
  state = {
    locked: false,
    value: null
  }

  toggleLockedState = () => {
    const newLockedState = !this.state.locked;
    const newValue = newLockedState ? this.$input.value : null;

    this.setState({
      locked: newLockedState,
      value: newValue
    });
  }

  getValueStyles() {
    if (!this.state.locked) {
      return valueStyles;
    }

    return { ...valueStyles, color: "lime", pointerEvents: "none" };
  }

  handleSubmit(e) {
    console.log(e);
  }

  render() {
    const { buttonText, labelText } = this.props;

    return (
      <div className="controls__group" style={groupStyles}>


        <input type="number" value={this.state.value} step=".01" style={this.getValueStyles()} ref={el => this.$input = el}></input>

        <button className="controls__button" style={buttonStyles} onClick={this.toggleLockedState}>
          set
        </button>

        <div className="controls__label" style={labelStyles}>
          {labelText}
        </div>
      </div>
    )
  }
}

class ControlGroup extends Component {
  state = {
    locked: false,
    value: null
  }

  toggleLockedState = () => {
    const newLockedState = !this.state.locked;
    const newValue = newLockedState ? this.props.value : null;

    this.setState({
      locked: newLockedState,
      value: newValue
    });
  }

  getValueStyles() {
    if (!this.state.locked) {
      return valueStyles;
    }

    return { ...valueStyles, color: "lime" };
  }

  getValue() {
    if (this.state.locked) {
      return this.state.value;
    }

    return this.props.value;
  }

  render() {
    const { buttonText, labelText, value } = this.props;

    return (
      <div className="controls__group" style={groupStyles}>
        <div className="controls__value" style={this.getValueStyles()}>
          {this.getValue()}
        </div>
        <button className="controls__button" style={buttonStyles} onClick={this.toggleLockedState}>
          set
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

        <NumberGroup labelText="vertical" />
        <NumberGroup labelText="horizontal" />
        <NumberGroup labelText="size" />

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

  // TODO: Add back once finished debugging
  // dataOpen={this.state.detailsOpen ? "true" : "false"}

  render() {
    const { scrubPosition } = this.props;

    return (
      <div className="controls" style={controlsStyles}>
        <button className="controls__button" style={addButtonStyles} onClick={this.toggleControls}>
          +
        </button>

        <div className="controls__details" style={detailsStyles} dataOpen="true">
          <div className="controls__block" style={blockStyles}>
            <ControlGroup labelText="timestamp" value={formatFloat(scrubPosition)} />
            <NumberGroup labelText="duration" />
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
