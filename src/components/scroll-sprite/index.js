import { h, Component } from "preact"

import Timeline from "../timeline"
import Annotations from "../annotations"
import Controls from "../controls"

import { getTemporalPadding } from "../../utils"

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
    resizeTimestamp: Date.now(),
    scrolling: false,
    scrubbing: false,
    scrubPosition: null,
    scaledScrubPosition: null
  }

  componentDidMount() {
      const { sprite } = this.state;

      // document.addEventListener("mousewheel", this.updateScrollPosition, { passive: false });
      window.addEventListener("resize", this.updateResizeTimestamp);

      if (!sprite && this.$canvas) {
        this.initializeSprite();
      }
  }

  componentWillUnmount() {
      // document.removeEventListener("mousewheel", this.updateScrollPosition, { passive: false });
      window.removeEventListener("resize", this.updateResizeTimestamp);
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

  // updateScrollPosition = (event) => {
  //   const { scrollPosition } = this.state;
  //
  //   const newScrollPosition = scrollPosition + Math.floor(event.deltaY * SCROLL_SPEED);
  //
  //   this.setState({
  //     scrollPosition: newScrollPosition,
  //     scrolling: true
  //   });
  // }

  initScrub = (event) => {
    const { scrubPosition, scaledScrubPosition } = this.getNewScrubPosition(event);

    this.setState({
      scrubbing: true,
      scrolling: false,
      scrubPosition,
      scaledScrubPosition
    });
  }

  moveScrub = (event) => {
    const { scrubbing } = this.state;

    if (!scrubbing) {
      return;
    }

    const { scrubPosition, scaledScrubPosition } = this.getNewScrubPosition(event);

    this.setState({
       scrubPosition,
       scaledScrubPosition
    });
  }

  getNewScrubPosition(event) {
    const { scrubbing, sprite } = this.state;

    const totalWidth = event.target.getBoundingClientRect().width;
    const scrubPosition = (event.pageX - event.target.offsetLeft) / totalWidth;

    const scaledScrubPosition = this.getScaledScrubPosition(scrubPosition);

    return {
       scrubPosition,
       scaledScrubPosition
    };
  }

  getScaledScrubPosition(scrubPosition) {
    const { sprite } = this.state;

    if (scrubPosition > .99) {
      return sprite.tiles.total;
    }

    return Math.floor(scrubPosition * sprite.tiles.total);
  }

  endScrub = () => {
    this.setState({ scrubbing: false });
  }

  updateResizeTimestamp = () => {
    this.setState({ resizeTimestamp: Date.now() });
  }

  updatePlayHead = (currentFrame, total) => {
    const { triggers } = this.props.options;

    this.playHead = this.getNewPlayhead(currentFrame, total);

    let activeTrigger;

    triggers.forEach((trigger) => {
      const temporalPadding = getTemporalPadding(trigger);
      if (Math.abs(this.playHead - trigger.timestamp) < temporalPadding) {
        activeTrigger = trigger;
      }
    });

    this.activeTrigger = activeTrigger ? activeTrigger : null;
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

  getSpriteFrame() {
      const { scrubbing, scrollPosition, scaledScrubPosition } = this.state;
      return scrubbing ? scaledScrubPosition : scrollPosition;
  }

  render() {
    const { width, height, triggers, src, tiles } = this.props.options;
    const { sprite, scrollPosition, scrubPosition, resizeTimestamp, scrolling, scrubbing } = this.state;

    if (sprite && scrolling || scrubbing) {
      const frame = this.getSpriteFrame();
      sprite.update(frame);
    }

    const timelineData = {
      playHead: this.playHead,
      triggers,
      activeTrigger: this.activeTrigger,
      initScrub: this.initScrub,
      moveScrub: this.moveScrub,
      endScrub: this.endScrub
    }

    // Background image needed because sprite won't be loaded on first render
    const canvasStyles = {
      backgroundImage: `url(${src})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${10 * tiles.total}%`,
      backgroundPosition: "top left",
      width: "100%"
    }

    return (
      <div style={scrollSpriteStyles}>
        <canvas width={width} height={height} style={canvasStyles} ref={el => this.$canvas = el}></canvas>
        <Timeline data={timelineData} />
        <Annotations activeTrigger={this.activeTrigger} canvas={this.$canvas} timestamp={resizeTimestamp} />
        <Controls scrubPosition={scrubPosition} publishTrigger={this.props.publishTrigger}/>
      </div>
    );
  }
}
