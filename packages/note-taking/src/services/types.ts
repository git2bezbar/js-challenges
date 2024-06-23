export interface Note {
	title: string;
	description: string;
	uuid?: string | undefined;
	createdAt?: Date | undefined;
	updatedAt?: Date | undefined;
}
