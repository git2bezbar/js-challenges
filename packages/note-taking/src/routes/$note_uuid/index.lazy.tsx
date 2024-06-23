import type { Note } from '../../services/types';

import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useState } from 'react';

import Chip from '../../components/Chip';
import { useNoteStore } from '../../store/notes';
export const Route = createLazyFileRoute('/$note_uuid/')({
  component: Single,
});

function Single() {
	const [isMarkdown, setIsMarkdown] = useState(false);
	const { note_uuid }: { note_uuid: Note['uuid'] } = Route.useParams();
	const { getNote, removeNote } = useNoteStore();
	const note = getNote(note_uuid);
	const navigate = useNavigate({ from: '/$note_uuid' });

	const deleteNote = async () => {
		try {
			removeNote(note_uuid);
			await navigate({ to: '/' });
		} catch (error) {
			console.error(error);
		}
	}

	if (!note) {
		return <NotFound />;
	}

	return (
		<div className='container'>
			<Link to="/">
				<button data-type="secondary">Back to notes</button>
			</Link>
			<h2>{ note.title }</h2>
			<div className="flexContainer">
				{ note.createdAt &&
					<Chip>
						Created { new Date(note.createdAt).toLocaleDateString() }
						&nbsp;at { new Date(note.createdAt).toLocaleTimeString() }
					</Chip> }
				{ note.updatedAt &&
					<Chip>
						Edited { new Date(note.updatedAt).toLocaleDateString() }
						&nbsp;at { new Date(note.updatedAt).toLocaleTimeString() }
					</Chip> }
			</div>
			<div className='flexContainer'>
				<Link to={`/${note_uuid}/edit`}>
					<button>Edit</button>
				</Link>
				<button data-type="danger" onClick={deleteNote}>Delete</button>
			</div>
			<div className="markdownToggle">
				<input
					type="checkbox"
					name="isMarkdown"
					id="isMarkdown"
					checked={isMarkdown}
					onChange={() => setIsMarkdown(!isMarkdown)}
					/>
				<label htmlFor="isMarkdown">
					<span className="toggle" />
					Preview markdown
				</label>
			</div>
			<main className="descriptionContainer">
				{
					isMarkdown
						? <MarkdownPreview source={note.description} />
						: note.description
				}
			</main>
		</div>
	);
}

function NotFound() {
	return (
		<div className='container'>
			<Link to="/">
				<button data-type="secondary">Back to notes</button>
			</Link>
			<h2>Note not found</h2>
		</div>
	);
}
