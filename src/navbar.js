import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";


function Navbar() {

    return (
        <nav>
            <ul>
                <li>
                <Link to="/">Home</Link>
                </li>
                <li>
                <Link to="/Gallery">Gallery</Link>
                </li>
                <li><Link to="/Contact">Contact</Link></li>
            </ul>
        </nav>
    )
};


export default Navbar;