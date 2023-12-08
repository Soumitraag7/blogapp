import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Loader from './Loader';

function Protected({ children, authentication = true }) {
	const authStatus = useSelector(state => state.auth.status);

	const navigate = useNavigate();

	const [laoder, setLaoder] = useState(true);

	useEffect(() => {
		if (authentication && authStatus !== authentication) {
			navigate('/login');
		} else if (!authentication && authStatus !== authentication) {
			navigate('/');
		}

		setLaoder(false);
	}, [authStatus, authentication, navigate]);

	return laoder ? <Loader /> : <>{children}</>;
}

export default Protected;
