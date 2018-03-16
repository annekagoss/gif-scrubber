import { h, Component } from "preact"

const INTERVAL = 1;

const SCROLL_SPEED = 1;

class Sprite {
    constructor ({ context, width, height, texture, tiles, frameDuration, renderParent, updatePlayHead }) {
        this.context = context;
        this.texture = texture;

        this.tiles = tiles;
        this.frameDuration = frameDuration;

        this.width = width;
        this.height = height;

        this.currentDisplayTime = 0;
        this.currentTile = 0;

        this.offset = {
          x: 0,
          y: 0
        };

        this.renderParent = renderParent;
        this.updatePlayHead = updatePlayHead;
    }

    update = (scrollPosition) => {
        this.currentTile = scrollPosition;

        const currentColumn = this.currentTile % this.tiles.horizontal;
        this.offset.x = (currentColumn / this.tiles.horizontal) * (this.width * this.tiles.horizontal);

        const currentRow = Math.floor(this.currentTile / this.tiles.horizontal);
        this.offset.y = (currentRow / this.tiles.vertical) * (this.height * this.tiles.vertical);

        this.updatePlayHead(this.currentTile, this.tiles.total);
        this.renderToCanvas();
    }

    renderToCanvas = () => {
      this.context.drawImage(
          this.texture,
          this.offset.x,  // First spritesheet x coordinate
          this.offset.y,  // First spritesheet y coordinate
          this.width,     // Second spritesheet x coordinate
          this.height,    // Second spritesheet y coordinate
          0,              // First canvas x coordinate
          0,              // First canvas y coordinate
          this.width,     // Second canvas x coordinate
          this.height     // Second canvas y coordinate
      );
    }
};



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


class Annotations extends Component {

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
          <div className="trigger__label" style={triggerLabelStyles}>PEAK EYEROLL</div>
        </div>
      </div>
    );
  }
}


const timelineStyles = {
  width: "100%",
  height: "40px",
  position: "relative",
  background: "rgba(0, 0, 0, .1)"
}

class Timeline extends Component {
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

const scrollSpriteStyles = {
  width: "100%",
  height: "100%"
}

export default class ScrollSprite extends Component {

  state = {
    sprite: null,
    startTime: Date.now(),
    time: null,
    scrollPosition: 0,
    lastScrollPosition: -1
  }

  componentDidMount() {
      const { sprite } = this.state;

      document.addEventListener("mousewheel", this.updateScrollPosition, { passive: false });

      if (!sprite && this.$canvas) {
        this.initializeSprite();
      }
  }

  componentWillUnmount() {
      document.removeEventListener("mousewheel", this.updateScrollPosition, { passive: false });
  }

  initializeSprite = () => {
      const { width, height, texture, tiles, frameDuration } = this.props.options;

      const context = this.$canvas.getContext("2d");

      const sprite = new Sprite({
          context,
          width,
          height,
          texture,
          tiles,
          frameDuration,
          updatePlayHead: this.updatePlayHead
      });

      this.setState({
        sprite,
        context
      });
  }

  updateScrollPosition = (event) => {
    const { scrollPosition } = this.state;

    const newScrollPosition = scrollPosition + Math.floor(event.deltaY * SCROLL_SPEED);

    this.setState({
      scrollPosition: newScrollPosition,
      lastScrollPosition: scrollPosition
    });
  }

  updatePlayHead = (currentFrame, total) => {
    const { triggers } = this.props.options;

    this.playHead = this.getNewPlayhead(currentFrame, total);

    triggers.forEach((trigger) => {
      if (Math.abs(this.playHead - trigger.timestamp) < .075) {
        this.trigger = trigger;
      } else {
        this.trigger = null;
      }
    });
  }

  getNewPlayhead(currentFrame, total) {
    if (currentFrame < 0) {
      return 0;
    }

    if (currentFrame > total) {
      return 1;
    }

    return currentFrame / total;
  }

  render() {
    const { width, height } = this.props.options;
    const { sprite, scrollPosition } = this.state;

    if (sprite) {
      sprite.update(scrollPosition);
    }

    return (
      <div style={scrollSpriteStyles}>
        <canvas width={width} height={height} style={{ width: "100%" }} ref={el => this.$canvas = el}></canvas>
        <Timeline playHead={this.playHead} />
        <Annotations trigger={this.trigger} canvas={this.$canvas}/>
      </div>
    );
  }
}
