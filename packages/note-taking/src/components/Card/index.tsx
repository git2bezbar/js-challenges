import type { Note } from "../../services/types";

import { Link } from "@tanstack/react-router";

import { summarizeText } from "../../services/utils";

import styles from "./index.module.css";

interface CardProps {
	note: Note;
}

export default function Card({ note }: CardProps) {
	return (
		<Link to={`/${note.uuid}`} className={styles['card']}>
			<div className={styles['infoContainer']}>
				<h2 className={styles['h2']}>{ summarizeText(note.title, 15) }</h2>
				<p className={styles['p']}>{ summarizeText(note.description, 20) }</p>
			</div>
			{ note.updatedAt && <p className={styles['p']}>Edited { new Date(note.updatedAt).toLocaleDateString() }</p> }
		</Link>
	);
}
