import { h, Component } from "preact"

import {
  getTemporalPadding,
  getTriggerOffset,
  getTriggerZoneWidth
} from "../../utils"

const timelineStyles = {
  width: "100%",
  height: "40px",
  position: "relative",
  background: "rgba(0, 0, 0, .1)"
}

function getPlayheadColor(activeTrigger) {
  return activeTrigger ? "red" : "black";
}

function getPlayheadWidth(activeTrigger) {
  return activeTrigger ? "3px" : "1px";
}

export default class Timeline extends Component {

  renderTriggerZones() {
    const { triggers } = this.props.data;

    if (!triggers) {
      return;
    }

    const baseStyles = {
      position: "absolute",
      height: "40px",
      backgroundColor: "rgba(0, 0, 0, .25)",
      transform: "translateX(-50%)",
      pointerEvents: "none"
    }

    // Only look at one trigger for now
    // TODO: Add ability to render multiple
    const trigger = triggers[0];

    const offset = getTriggerOffset(trigger);
    const width = getTriggerZoneWidth(trigger);

    const triggerStyles = {
      left: `${offset}%`,
      width: `${width}%`
    }

    const styles = { ...baseStyles, ...triggerStyles };

    return (
      <div className="timeline__trigger-zone" style={styles}></div>
    )
  }

  getPlayheadStyles() {
    const { playHead, activeTrigger } = this.props.data;

    const baseStyles = {
      position: "absolute",
      height: "40px",
      pointerEvents: "none"
    }

    const offset = 100 * playHead;

    const playHeadStyles = {
      left: `${offset}%`,
      width: getPlayheadWidth(activeTrigger),
      backgroundColor: getPlayheadColor(activeTrigger)
    }

    const styles = { ...baseStyles, ...playHeadStyles };

    return styles;
  }

  render() {
    const { initScrub, moveScrub, endScrub } = this.props.data;

    return (
      <div className="timeline" style={timelineStyles} onmousedown={initScrub} onmousemove={moveScrub} onmouseup={endScrub}>
        { this.renderTriggerZones() }
        <div className="timeline__playhead" style={this.getPlayheadStyles()}></div>
      </div>
    );
  }
}
