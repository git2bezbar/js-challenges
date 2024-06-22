import type { Note } from '../../services/types';

import { Link, createLazyFileRoute } from '@tanstack/react-router'

import Form from '../../components/Form'
import { useNoteStore } from '../../store/notes';

export const Route = createLazyFileRoute('/$note_uuid/edit')({
  component: Edit,
})

function Edit() {
	const { note_uuid }: { note_uuid: Note['uuid'] } = Route.useParams();
	const { getNote } = useNoteStore();
	const note = getNote(note_uuid);

	if (!note) {
		return <NotFound />;
	}

  return (
    <div className="container">
			<Link to={`/${note_uuid}`}>
				<button data-type="secondary">Back to note</button>
			</Link>
      <h1>My note</h1>
			<Form
				titleValue={note.title}
				note_uuid={note_uuid}
				descriptionValue={note.description}
				isCreating={false}
			/>
    </div>
  )
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
