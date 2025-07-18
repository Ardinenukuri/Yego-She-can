'use client'

import React from 'react'
import Link from 'next/link'
import '@/styles/mentorship.css'

interface Mentor {
    id: string
    name: string
    expertise: string
    bio: string
}

const dummyMentors: Mentor[] = [
    {
        id: 'mentor1',
        name: 'Jane Doe',
        expertise: 'Business Development',
        bio: 'Experienced entrepreneur and business mentor.',
    },
    {
        id: 'mentor2',
        name: 'John Smith',
        expertise: 'Digital Marketing',
        bio: 'Marketing strategist and branding expert.',
    },
]

export default function MentorshipPage() {
    return (
        <div className="mentorship-container">
            <h1 className="mentorship-title">Available Mentors</h1>
            <div className="mentor-list">
                {dummyMentors.map((mentor) => (
                    <div key={mentor.id} className="mentor-card">
                        <h2>{mentor.name}</h2>
                        <p><strong>Expertise:</strong> {mentor.expertise}</p>
                        <p>{mentor.bio}</p>
                        <Link 
                            href={`/user-dashboard/mentorship/${mentor.id}/availability`} 
                            className="mentor-button"
                        >
                            View Availability
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
