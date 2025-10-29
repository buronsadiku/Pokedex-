import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"

export default function Header() {
    return (
        <header className="bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-center mb-10 mt-5">
                <Link to="/" className="flex items-center space-x-3">
                    <img src={logo} alt="Pokémon Browser Logo" className="w-10 h-10 object-contain" />
                    <h1 className="text-2xl font-bold text-gray-800">Pokémon Browser</h1>
                </Link>
            </div>
        </header>
    )
}