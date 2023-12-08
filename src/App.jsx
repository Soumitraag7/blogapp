import { useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';

function App() {
	return (
		<>
			<div>
				<main>
					<h1 className="text-3xl text-cyan-500">🔥</h1>
					<Outlet />
				</main>
			</div>
		</>
	);
}

export default App;
