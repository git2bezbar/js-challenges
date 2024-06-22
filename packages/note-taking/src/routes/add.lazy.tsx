import { Link, createLazyFileRoute } from '@tanstack/react-router'

import Form from '../components/Form'

export const Route = createLazyFileRoute('/add')({
  component: Add,
})

function Add() {
  return (
    <div className="container">
			<Link to="/">
				<button data-type="secondary">Back to notes</button>
			</Link>
      <h1>Add a note</h1>
			<Form />
    </div>
  )
}
