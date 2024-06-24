import type { Note } from "../services/types";

import { Link, createLazyFileRoute } from '@tanstack/react-router';

import Card from "../components/Card";
import { useNoteStore } from "../store/notes";

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { notes } = useNoteStore();
	notes.sort((a: Note, b: Note) =>
		(a.updatedAt && b.updatedAt && a.updatedAt < b.updatedAt) ? 1 : -1);

  return (
    <div className="container">
			<div className="titleWithButtons">
      	<h1>Notes</h1>
				<Link to="/add">
					<button data-type="primary" data-testid="addButton">Add note</button>
				</Link>
			</div>
			<ul>
				{
					notes.length > 0
						? notes.map((note: Note) =>
						<li key={note.uuid}>
							<Card note={note} />
						</li>)
						: <li><p>You currently have no notes</p></li>
				}
			</ul>
    </div>
  )
}
