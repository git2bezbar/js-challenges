import type { Note } from "../../services/types";

import { Link } from "@tanstack/react-router";

import styles from "./index.module.css";

interface CardProps {
	note: Note;
}

export default function Card({ note }: CardProps) {
	return (
		<Link to={`/${note.uuid}`} className={styles['card']}>
			<h2 className={styles['h2']}>{ note.title }</h2>
			{ note.updatedAt && <p className={styles['p']}>Modifié le { new Date(note.updatedAt).toLocaleDateString() }</p> }
		</Link>
	);
}
