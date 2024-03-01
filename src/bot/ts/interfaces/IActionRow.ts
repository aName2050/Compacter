import { ComponentType } from 'discord.js';
import IComponent from './IComponent';

export default interface IActionRow {
	type: ComponentType.ActionRow;
	components: Array<IComponent>;
}
