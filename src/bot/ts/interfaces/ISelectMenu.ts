import { ChannelType, SelectMenuType } from 'discord.js';
import IComponent from './IComponent';
import ISelectOption from './ISelectOption';
import ISelectDefault from './ISelectDefault';

export default interface ISelectMenu extends IComponent {
	type: SelectMenuType;
	custom_id: string;
	options?: Array<ISelectOption>;
	channel_types?: Array<ChannelType>;
	placeholder?: string;
	default_values?: Array<ISelectDefault>; // TODO:
	min_values?: number;
	max_values?: number;
	disabled?: boolean;
}
