
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react"
import { v4 as uuid } from 'uuid';

import { useNoteStore } from "../../store/notes";

import styles from './index.module.css';

interface FormProps {
	titleValue?: string
	descriptionValue?: string
	isCreating?: boolean
	note_uuid?: string
}

export default function Form({
	titleValue = '',
	descriptionValue = '',
	isCreating = true,
	note_uuid = '',
}: FormProps) {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate({
		from: isCreating ? '/add' : '/$note_uuid/edit'
	});
	const [title, setTitle] = useState(titleValue);
  const [description, setDescription] = useState(descriptionValue);
	const { addNote, updateNote, getNote } = useNoteStore();

	useEffect(() => {
		const messageCleaningTimeout = setTimeout(() => {
			setErrorMessage('');
		}, 3000);

		return () => {
			clearTimeout(messageCleaningTimeout);
		}
	}, [errorMessage]);

	const handleCreateOrUpdate = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (!title || !description) {
			setErrorMessage('Title and description are required');
			return;
		}

		if (!isCreating) {
			const currentNote = getNote(note_uuid);
			if (!currentNote) {
				return;
			}

			if (currentNote.title.trim() === title.trim()
				&& currentNote.description.trim() === description.trim()) {
					setErrorMessage('No changes detected');
					return;
				}
		}

		const note = {
			title,
			description,
			uuid: isCreating ? uuid() : note_uuid,
		};

		try {
			if (isCreating) {
				addNote(note);
				await navigate({ to: '/' });
				return;
			} else {
				updateNote(note);
				await navigate({ to: `/${note_uuid}` });
				return;
			}
		} catch(error) {
			console.error(error);
		}
	}

	return (
		<form onSubmit={handleCreateOrUpdate} className={styles["form"]}>
			<div className={styles["inputGroup"]}>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(event) => { setTitle(event.target.value) }}
				/>
			</div>
			<div className={styles["inputGroup"]}>
				<label htmlFor="description">Description</label>
				<textarea
					ref={textAreaRef}
					id="description"
					value={description}
					onChange={(event) => {
						setDescription(event.target.value)
						if (textAreaRef.current) {
							textAreaRef.current.style.height = '';
							textAreaRef.current.style.height = textAreaRef.current?.scrollHeight + 'px';
						}
					}}
				/>
			</div>
			<button type="submit">
				{ isCreating ? 'Add note' : 'Save changes' }
			</button>
			{
				errorMessage &&
					<p className={styles["errorMessage"]}>⚠️ { errorMessage }</p>
			}
		</form>
	)
}
