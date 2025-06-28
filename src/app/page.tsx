'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Page() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const leadsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || null
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setErrorMessage('All fields are required.');
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    try {
      const q = query(collection(db, 'leads'), orderBy('email'));
      const snapshot = await getDocs(q);
      const exists = snapshot.docs.some(doc => doc.data().email === trimmedEmail);

      if (exists) {
        setErrorMessage('This email has already been submitted.');
        setSubmitting(false);
        return;
      }

      await addDoc(collection(db, 'leads'), {
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        createdAt: serverTimestamp()
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setSuccessMessage('✅ Lead added successfully!');
      fetchLeads();
    } catch (error) {
      console.error('Error adding lead:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '2rem', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2>Leads</h2>
      <h3>Submit</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginRight: '0.5rem' }}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {(successMessage || errorMessage) && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            backgroundColor: successMessage ? '#163c2f' : '#3c1b1b',
            color: successMessage ? '#b7ffe0' : '#ffc4c4',
            border: `1px solid ${successMessage ? '#2bd396' : '#ff6b6b'}`
          }}
        >
          {successMessage || errorMessage}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#222', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #444' }}>First Name</th>
            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #444' }}>Last Name</th>
            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #444' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid #444' }}>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={{ padding: '1rem', color: '#999' }}>Loading leads...</td>
            </tr>
          ) : (
            leads.map((lead, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#121212' }}>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #333' }}>{lead.firstName}</td>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #333' }}>{lead.lastName}</td>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #333' }}>{lead.email}</td>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #333' }}>
                  {lead.createdAt ? lead.createdAt.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
