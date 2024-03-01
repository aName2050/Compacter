import { ComponentType } from 'discord.js';
import IActionRow from './IActionRow';
import ITextInput from './ITextInput';

export default interface IModal {
	title: string;
	custom_id: string;
	components: Array<{
		type: ComponentType.ActionRow;
		components: Array<ITextInput>;
	}>;
}
