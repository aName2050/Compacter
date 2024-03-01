import { ComponentType, TextInputStyle } from 'discord.js';

export default interface ITextInput {
	type: ComponentType.TextInput;
	custom_id: string;
	style: TextInputStyle;
	label: string;
	min_length?: number;
	max_length?: number;
	required?: boolean;
	value?: string;
	placeholder?: string;
}
