import { h, Component } from 'preact';
import ScrollSprite from "./scroll-sprite"

const EYEROLL_SOURCE = "../assets/images/rock-spritesheet.png";

const EYEROLL_TRIGGERS = [
	{
		timestamp: 0.3,
		name: "peak-eyeroll"
	}
];

const EYEROLL_OPTIONS = {
	width: 200,
	height: 150,
	texture: loadSpriteSheet(),
	tiles: {
		total: 74,
		horizontal: 7,
		vertical: 11
	},
	frameDuration: 5,
	triggers: EYEROLL_TRIGGERS
}

const appStyles = {
	width: "100%",
	height: "100%"
}

function loadSpriteSheet() {
	const spriteSheet = new Image();
	spriteSheet.src = EYEROLL_SOURCE;
	return spriteSheet;
}

export default class App extends Component {

	componentWillMount() {
			this.setState({
				texture: loadSpriteSheet()
			});
	}

	render() {
		const { texture } = this.state;

		const options = { ...EYEROLL_OPTIONS, texture };

		return (
			<div id="app">
				<ScrollSprite options={options}/>
			</div>
		);
	}
}
