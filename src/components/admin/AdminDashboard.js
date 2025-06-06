import React, { useState, useEffect } from 'react';
import { useTherapists } from '../../hooks/useTherapists';
import useAdminBookings from '../../hooks/useAdminBookings';
import {
  getDocuments,
  createDocument,
  updateDocument
} from '../../services/firebase';
import LoadingSpinner from '../LoadingSpinner';

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const AdminDashboard = () => {
  const { therapists, loading: therapistsLoading, loadTherapists } = useTherapists();
  const { bookings, loading: bookingsLoading } = useAdminBookings();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editing, setEditing] = useState(null);
  const [availability, setAvailability] = useState({});

  const loadCategories = async () => {
    try {
      const snap = await getDocuments('therapistCategories');
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error('Error loading categories:', e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async e => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await createDocument('therapistCategories', { name: newCategory.trim() });
    setNewCategory('');
    loadCategories();
  };

  const startEdit = therapist => {
    setEditing(therapist);
    setAvailability(therapist.availability || {});
  };

  const saveTherapist = async () => {
    if (!editing) return;
    await updateDocument('therapists', editing.id, { availability });
    setEditing(null);
    loadTherapists();
  };

  if (therapistsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Categories */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Therapist Categories</h2>
        <form onSubmit={addCategory} className="flex items-center space-x-2 mb-4">
          <input
            className="input-field flex-grow"
            placeholder="New category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
        <ul className="list-disc pl-5 space-y-1">
          {categories.map(c => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </section>

      {/* Therapists */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Therapists</h2>
        {therapists.map(t => (
          <div key={t.id} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-gray-500">{t.type}</p>
              </div>
              <button onClick={() => startEdit(t)} className="btn btn-outline">
                Edit Schedule
              </button>
            </div>
            {editing?.id === t.id && (
              <div className="mt-4 space-y-2">
                {daysOfWeek.map(day => (
                  <div key={day}>
                    <label className="block text-sm font-medium capitalize">
                      {day}
                    </label>
                    <input
                      className="input-field"
                      type="text"
                      value={(availability[day] || []).join(',')}
                      onChange={e => {
                        const value = e.target.value
                          .split(',')
                          .map(s => s.trim())
                          .filter(Boolean);
                        setAvailability(prev => ({ ...prev, [day]: value }));
                      }}
                    />
                  </div>
                ))}
                <button onClick={saveTherapist} className="btn btn-primary mt-2">
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Booked Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left font-medium text-gray-600">User</th>
                <th className="px-2 py-1 text-left font-medium text-gray-600">Therapist</th>
                <th className="px-2 py-1 text-left font-medium text-gray-600">Date</th>
                <th className="px-2 py-1 text-left font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="px-2 py-1">{b.userEmail || b.userName}</td>
                  <td className="px-2 py-1">{b.therapistName}</td>
                  <td className="px-2 py-1">{b.date}</td>
                  <td className="px-2 py-1">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
