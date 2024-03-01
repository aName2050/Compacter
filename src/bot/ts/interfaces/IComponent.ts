import { ComponentType } from 'discord.js';

export default interface IComponent {
	type: ComponentType;
	custom_id?: string;
}
