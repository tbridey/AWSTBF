import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function Signup() {
    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const usersCollection = collection(db, "users")

    const [charData, setCharData] = useState()
    const [badges, setBadges] = useState()
    const [chapter, setChapter] = useState(0)

    const charDataObj = {
        sheild: false,
        bow: false,
        love: false
    }

    const badgesObj = {
        b1: false,
        b2: false,
        b3: false,
        b4: false
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try{
            setCharData(charDataObj)
            setBadges(badgesObj)
            setChapter(1)
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            await addDoc(usersCollection, {username: usernameRef.current.value, charData: charData, badges: badges, chapter: chapter})
            navigate('/')
        }catch(error) {
            console.log(error)
            setError("Failed to create an account")
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert> }
                    <Form onSubmit = {handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" ref={usernameRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button disabled={loading} type="submit" className="w-100 mt-3">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-ceenter mt-2">
                Already have an account? <Link to='/login'>Log in</Link> 
            </div>
        </>
    )
}
