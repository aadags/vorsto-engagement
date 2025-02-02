'use client'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation';

export default function ManageTicket({ ticketId }) {
  const [ticket, setTicket] = useState();
  const [description, setDescription] = useState();
  const [comment, setComment] = useState();
  const [comments, setComments] = useState();
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async () => {
      const response = await fetch(`/api/get-ticket?ticketId=${ticketId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const res = await response.json();
        setTicket(res.ticket);
        setComments(res.comments);
        setUserId(res.userId);
        setDescription(res.description)
      } 
    };

    fetchTicket();
  }, []);

  const addComment = async (e) => {
    e.preventDefault();
  
    const confirmation = window.confirm("Are you sure you want to add this comment?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: ticket.id, comment }),
      });
  
      if (response.ok) {
        // Handle success, e.g., show a success message or redirect
        setSaved(true);
        router.refresh();

      } else {
        // Handle error
        setError("An error occurred while saving your ticket!");
        console.error('Error updating ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    
    const confirmation = window.confirm("Are you sure you want to delete this comment?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/delete-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });
  
      if (response.ok) {
        router.refresh();
      } 
    } catch (error) {
      console.error('Error closing ticket:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = async (e) => {
    e.preventDefault();
  
    const confirmation = window.confirm("Are you sure you want to re-open this ticket?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/open-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: ticket.id }),
      });
  
      if (response.ok) {
        router.refresh();
      } 
    } catch (error) {
      console.error('Error closing ticket:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async (e) => {
    e.preventDefault();
  
    const confirmation = window.confirm("Are you sure you want to close this ticket?");
  
    if (!confirmation) {
      return; // Exit the function if the user cancels the action
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/close-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: ticket.id }),
      });
  
      if (response.ok) {
        router.refresh();
      } 
    } catch (error) {
      console.error('Error closing ticket:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="techwave_fn_image_generation_page">
        <div className="generation__page">
          {/* Generation Header */}
          {ticket && <div className="generation_header">
            <div className="header_top">
              <h1 className="title">{ticket.title}</h1>
            </div>
            <div className="header_bottom">
              <p>{ticket.description}
              <br/>
              created by {ticket.user.name}
              </p>
              {comments && comments.map((comment) => (
                <p>{comment.body}
                <br/>
                <span style={{ fontSize: "12px" }}>
                  comment by {ticket.user.name+" "} 
                  {comment.user_id===userId && !ticket.is_closed && <a href onClick={() => deleteComment(comment.id)} style={{ textDecorationLine: "underline" }}>delete</a>}
                </span>
                </p>
              ))}
              {ticket.is_closed?

              <div className="generate_section">
                <button type="button" onClick={openTicket} className="techwave_fn_button" aria-readonly={loading}>
                  <span>Re-Open Ticket {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />} {saved && <FontAwesomeIcon icon={faCheckCircle} />}</span>
                </button>
              </div>
              :
              <form onSubmit={addComment}>
                <div className="form_group">
                </div>
                <br/>
                <div className="form_group">
                <textarea
                  id="system_bio"
                  className="full_width"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={10} // Increased height
                  style={{
                    resize: 'vertical', // Allows vertical resizing by user
                    overflow: 'auto', // Adds scroll when content overflows
                  }}
                  placeholder="Add a comment"
                  required
                />
                </div>
                <br/>
                <div className="generate_section">
                  <button type="submit" className="techwave_fn_button" aria-readonly={loading}>
                    <span>Add Comment {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />} {saved && <FontAwesomeIcon icon={faCheckCircle} />}</span>
                  </button>
                  <button type="button" onClick={closeTicket} className="techwave_fn_button" aria-readonly={loading}>
                    <span>Close Ticket {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />} {saved && <FontAwesomeIcon icon={faCheckCircle} />}</span>
                  </button>
                </div>
              </form>
              }
            </div>
          </div>}
          {/* !Generation Header */}
        </div>
      </div>
    </>
  );
}
