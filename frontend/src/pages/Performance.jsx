import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Star, Plus, Trash2 } from 'lucide-react';
import AddReviewModal from '../components/AddReviewModal';

const Performance = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const isAdminOrHR = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR';

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const endpoint = isAdminOrHR ? '/performance/all' : `/performance/employee/${user.id}`;
      const res = await api.get(endpoint);
      if (res.success) {
        setReviews(res.data.content || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this performance review?")) {
      try {
        const res = await api.delete(`/performance/${id}`);
        if (res.success) {
          fetchReviews();
        } else {
          alert(res.message || "Failed to delete review");
        }
      } catch (err) {
        alert("Error occurred while deleting review");
      }
    }
  };

  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= Math.round(score) ? "#f59e0b" : "none"} 
          color={i <= Math.round(score) ? "#f59e0b" : "#d1d5db"} 
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{isAdminOrHR ? 'Company Performance Reviews' : 'My Performance Reviews'}</h1>
        {isAdminOrHR && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} className="mr-2" /> Add Review
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="p-4 text-center">Loading reviews...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="glass-card">
                <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      {isAdminOrHR ? review.employeeName : 'Review Date'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {isAdminOrHR ? `Reviewed on ${review.reviewDate}` : review.reviewDate}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Overall Rating</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {review.overallRating?.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 5.0</span>
                      </div>
                    </div>
                    {isAdminOrHR && (
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="btn btn-danger"
                        style={{ padding: '6px', borderRadius: '50%' }}
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Communication</span>
                    {renderStars(review.communicationScore)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Productivity</span>
                    {renderStars(review.productivityScore)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Teamwork</span>
                    {renderStars(review.teamworkScore)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Leadership</span>
                    {renderStars(review.leadershipScore)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Reviewer Comments</div>
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>"{review.comments}"</p>
                  <div className="mt-2 text-right" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    - {review.reviewerName}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
              <p className="text-center text-secondary py-4">No performance reviews found.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <AddReviewModal 
          onClose={() => setShowModal(false)} 
          onReviewAdded={() => {
            setShowModal(false);
            fetchReviews();
          }} 
        />
      )}
    </div>
  );
};

export default Performance;
