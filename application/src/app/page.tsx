'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Todo = {
	id: string;
	title: string;
	is_done: boolean;
};

export default function Home() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodo, setNewTodo] = useState('');

	useEffect(() => {
		loadTodos();
	}, []);

	const loadTodos = async () => {
		const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
		if (data) setTodos(data);
	};
	
	const addTodo = async () => {
		if (!newTodo) return;
		await supabase.from('todos').insert({ title: newTodo });
		setNewTodo('');
		loadTodos();
	};

	const toggleTodo = async (id: string, done: boolean) => {
		const { error } = await supabase
			.from('todos')
			.update({ is_done: !done })
			.eq('id', id);
	
		if (error) {
			console.error('更新失敗', error);
		} else {
			loadTodos();
		}
	};

	return (
		<main style={{ padding: 24 }}>
			<h1>Todoアプリ</h1>
			<input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="タスクを入力" />
			<button onClick={addTodo}>追加</button>

			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						<label>
							<input
								type="checkbox"
								checked={todo.is_done}
								onChange={() => toggleTodo(todo.id, todo.is_done)}
							/>
							<span>
								{todo.title}
							</span>
						</label>
					</li>
				))}
			</ul>
		</main>
	);
}
