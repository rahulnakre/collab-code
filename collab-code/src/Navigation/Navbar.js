import React from "react";

function Navbar(props) {
	//const navbarLinks = isLogged ? <SignedInLinks /> : <SignedOutLinks />
	return(
		<div>
			<nav className="nav-wrapper grey darken-3">
				<div className="container">
					<h1 className="brand-logo">Collab Text</h1>
					<ul className="right">
						<li>Explore</li>
						<li className="btn btn-floating black lighter-1">RN</li>
					</ul>
				</div>
			</nav>
		
		</div>
	)
}

export default Navbar