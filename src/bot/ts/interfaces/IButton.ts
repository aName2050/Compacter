import { ButtonStyle, ComponentType, Emoji } from 'discord.js';
import IComponent from './IComponent';

export default interface IButton extends IComponent {
	type: ComponentType.Button;
	custom_id?: string;
	style: ButtonStyle;
	label?: string;
	emoji?: Emoji;
	url?: string;
	disabled?: boolean;
}
