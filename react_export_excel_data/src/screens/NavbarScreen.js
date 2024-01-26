import React from 'react'
import { Navbar } from 'react-bootstrap'

export default function NavbarScreen() {
    return (
        <div >
            <Navbar bg="info" variabt="dark">
                <Navbar.Brand href="#home">
                    React Excel Data Export
                </Navbar.Brand>
            </Navbar>
        </div>
    )
}
