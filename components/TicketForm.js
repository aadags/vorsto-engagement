import { useState } from 'react';

export default function TicketForm({ callId, conversationId }) {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        priority: '',
        description: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/create-ticket', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...formData, callId, conversationId }),
            });
        
            if (response.ok) {
              // Handle success, e.g., show a success message or redirect
              alert("Ticket Created");
            } else {
              // Handle error
              alert("Error creating ticket");
              console.error('Error updating ticket:', response.statusText);
            }
          } catch (error) {
            console.error('Error updating agent:', error);
            alert("Error creating ticket");
          }
    };

    return (
        <form onSubmit={handleTicketSubmit}>
            <div className="form_group">
                <input
                    type="text"
                    id="title"
                    className="full_width"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <br />
            <div className="form_group">
                <select
                    id="category"
                    className="full_width"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Support">Support</option>
                    <option value="Sales">Sales</option>
                </select>
            </div>
            <br />
            <div className="form_group">
                <select
                    id="priority"
                    className="full_width"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <br />
            <div className="form_group">
                <textarea
                    id="description"
                    className="full_width"
                    rows={10}
                    style={{
                        resize: 'vertical',
                        overflow: 'auto',
                    }}
                    placeholder="Ticket Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <br />
            <div className="generate_section">
                <button type="submit" className="techwave_fn_button">
                    <span>Create Ticket</span>
                </button>
            </div>
        </form>
    );
}
