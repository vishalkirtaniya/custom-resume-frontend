// components/ProfileForm.tsx
import { useState } from 'react';

export default function ProfileForm({ session }: { session: any }) {
  const [loading, setLoading] = useState(false);
  
  // Updated state to include Experience and Skills
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    location: '',
    summary: '',
    experience: [
      { company: 'Totality Corp', role: 'Software Engineer I', location: 'Mumbai', start_date: 'April 2025', end_date: 'Feb 2026', stack: ['Python'], highlights: ['Built trading system'] }
    ],
    skills: {
        "Languages": ["Python", "JavaScript"],
        "Backend": ["FastAPI", "Node.js"]
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Retrieve the Supabase JWT token from the session
    const token = session?.access_token; 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sync-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // This is key for your backend auth
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to sync with backend');
      
      alert('Data synced via FastAPI successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep your JSX return, but add inputs for experience later)
}