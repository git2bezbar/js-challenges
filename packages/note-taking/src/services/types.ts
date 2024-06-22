export interface Note {
	title: string;
	description: string;
	uuid: string;
	createdAt?: Date | undefined;
	updatedAt?: Date | undefined;
}
