import { h, Component } from "preact"

import { formatFloat, checkForNullValues } from "../../utils";

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

  componentDidUpdate = () => {
    if (!this.props.updateValues) {
      return;
    }
    const valueToUpdate = {};
    valueToUpdate[this.props.valueName] = this.state.value;
    this.props.updateValues(valueToUpdate);
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
      return textStyles;
    }

    return { ...textStyles, color: "lime", pointerEvents: "none" };
  }

  render() {
    const { buttonText, labelText, value } = this.props;

    return (
      <div className="controls__group" style={groupStyles}>

        <input type="text" style={this.getValueStyles()} ref={el => this.$input = el}></input>

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

  componentDidUpdate = () => {
    if (!this.props.updateValues) {
      return;
    }
    const valueToUpdate = {};
    valueToUpdate[this.props.valueName] = this.state.value;
    this.props.updateValues(valueToUpdate);
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

  componentDidUpdate = () => {
    if (!this.props.updateValues) {
      return;
    }
    const valueToUpdate = {};
    valueToUpdate[this.props.valueName] = this.state.value;
    this.props.updateValues(valueToUpdate);
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
    const { buttonText, labelText, value, updateValues, valueName } = this.props;

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

  values = {
    top: null,
    left: null,
    size: null
  }

  updateCircleValues = (values) => {
    const newValues = { ...this.values, ...values };
    this.values = newValues;

    this.props.updateValues({
      circle: this.values
    });
  }

  render() {
    const { value } = this.props;

    return (
      <div>

        <div className="controls__header" style={headerStyles}>
          Circle position
        </div>

        <NumberGroup labelText="vertical" valueName="top" updateValues={this.updateCircleValues}/>
        <NumberGroup labelText="horizontal" valueName="left" updateValues={this.updateCircleValues}/>
        <NumberGroup labelText="size" valueName="size" updateValues={this.updateCircleValues}/>

      </div>
    )
  }
}

export default class Controls extends Component {

  state = {
    detailsOpen: false,
    dataComplete: false
  }

  values = {
    timestamp: null,
    duration: null,
    text: null,
    circle: {
      top: null,
      left: null,
      size: null
    }
  }

  componentDidUpdate() {

    // console.log(this.dataComplete);
    // this.setState({
    //   dataComplete
    // })
  }

  toggleControls = () => {
    this.setState({
      detailsOpen: !this.state.detailsOpen
    })
  }

  updateValues = (values) => {
      const newValues = { ...this.values, ...values };
      this.values = newValues;
  }

  publish = () => {
    const valuesAreNull = checkForNullValues(this.values);

    if (!valuesAreNull) {
      this.props.publishTrigger(this.values);
    }
  }

  getPublishButtonStyles() {
    if (this.dataComplete) {
      return publishButtonStyles;
    }

    return { ...publishButtonStyles, opacity: ".25", pointerEvents: "none" };
  }

  render() {
    const { scrubPosition } = this.props;

    this.dataComplete = !checkForNullValues(this.values);

    return (
      <div className="controls" style={controlsStyles}>
        <button className="controls__button" style={addButtonStyles} onClick={this.toggleControls}>
          +
        </button>

        <div className="controls__details" style={detailsStyles} dataOpen={this.state.detailsOpen ? "true" : "false"}>
          <div className="controls__block" style={blockStyles}>
            <ControlGroup labelText="timestamp" valueName="timestamp" value={formatFloat(scrubPosition)} updateValues={this.updateValues}/>
            <NumberGroup labelText="duration" valueName="duration" updateValues={this.updateValues}/>
            <TextGroup labelText="text" valueName="text" value="empty string" updateValues={this.updateValues}/>
          </div>
          <div className="controls__block" style={blockStyles}>
            <CircleGroup value={{ top: 0, left: 0, size: .2 }} valueName="circle" updateValues={this.updateValues}/>
          </div>
        </div>

        <button className="controls__button" style={this.getPublishButtonStyles()} onClick={this.publish} dataOpen={this.state.detailsOpen ? "true" : "false"}>
          publish
        </button>
      </div>
    )
  }
}
