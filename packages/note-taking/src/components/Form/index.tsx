
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react"

import { useNoteStore } from "../../store/notes";

import styles from './index.module.css';

interface FormProps {
	titleValue?: string
	descriptionValue?: string
	isCreating?: boolean
	uuid?: string | undefined
}

export default function Form({
	titleValue = '',
	descriptionValue = '',
	isCreating = true,
	uuid = '',
}: FormProps) {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate({
		from: isCreating ? '/add' : '/$uuid/edit'
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
			const currentNote = getNote(uuid);
			if (!currentNote) {
				return;
			}

			if (currentNote.title.trim() === title.trim()
				&& currentNote.description.trim() === description.trim()) {
					setErrorMessage('No changes detected');
					return;
				}
		}

		const note = { title, description };

		try {
			if (isCreating) {
				addNote(note);
				await navigate({ to: '/' });
				return;
			} else {
				updateNote({...note, uuid});
				await navigate({ to: `/${uuid}` });
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
					data-testid="titleInput"
					value={title}
					onChange={(event) => { setTitle(event.target.value) }}
				/>
			</div>
			<div className={styles["inputGroup"]}>
				<label htmlFor="description">Description</label>
				<textarea
					ref={textAreaRef}
					id="description"
					data-testid="descriptionInput"
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
			<button type="submit" data-testid="submitButton">
				{ isCreating ? 'Add note' : 'Save changes' }
			</button>
			{
				errorMessage &&
					<p className={styles["errorMessage"]}>⚠️ { errorMessage }</p>
			}
		</form>
	)
}
