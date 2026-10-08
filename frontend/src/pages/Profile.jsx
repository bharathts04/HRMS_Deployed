import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Briefcase, Building2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/employees/${user.id}`);
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          phone: res.data.phone || '',
          address: res.data.address || ''
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Employees shouldn't change their department or designation
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        designation: profile.designation,
        departmentId: profile.departmentId || null,
        userId: profile.userId,
        joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
      
      const res = await api.put(`/employees/${user.id}`, payload);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        setProfile(res.data);
        setIsEditing(false);
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      const res = await api.post(`/employees/${user.id}/photo`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        setSuccess('Profile photo updated successfully!');
        setProfile(res.data);
      } else {
        setError(res.message || 'Failed to upload photo');
      }
    } catch (err) {
      setError('Failed to upload photo');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-4 text-center text-red-500">Could not load profile. Make sure you have re-logged in!</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary text-sm">
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100">
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div>
          <div className="glass-card p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {profile.profilePhotoUrl ? (
              <img 
                src={`http://localhost:8081${profile.profilePhotoUrl}`} 
                alt="Profile" 
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }}
              />
            ) : (
              <div 
                className="rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mb-4"
                style={{ width: '100px', height: '100px' }}
              >
                {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
              </div>
            )}
            
            {isEditing && (
              <div style={{ marginBottom: '16px' }}>
                <label className="btn btn-secondary text-sm" style={{ cursor: 'pointer' }}>
                  Upload New Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>
            )}
            <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-500 mb-2">{profile.designation || 'Employee'}</p>
            <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
              <Building2 size={14} />
              {profile.department?.name || 'No Department'}
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="text-lg font-semibold mb-2">Edit Details</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-input w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="form-input w-full" rows="3" />
                </div>
                
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditing(false); setError(''); }} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 h-fit" style={{ display: 'inline-flex' }}>
                      <User size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{profile.email || user.email}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="bg-green-50 p-2 rounded-lg text-green-600 h-fit" style={{ display: 'inline-flex' }}>
                      <Phone size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{profile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600 h-fit" style={{ display: 'inline-flex' }}>
                      <MapPin size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{profile.address || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600 h-fit" style={{ display: 'inline-flex' }}>
                      <Briefcase size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p className="font-medium">{profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
