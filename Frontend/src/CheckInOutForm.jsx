import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidePopup from "./components/SidePopup"
import './checkinForm.css';

function CheckInOutForm() {
  const [action, setAction] = useState('checkout');
  const [serials, setSerials] = useState('');
  const [damage, setDamage] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);

  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
        setTimeout(() => setError(''), 5000);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data } = await api.get('/equipmentImage', {
          params: {
            page,
            limit: 50,
            fields: 'Serial,Name,Category', // Only fetch needed fields
            sortBy: 'Serial',
            sortOrder: 'asc'
          }
        });
        
        // Ensure data.equipment is an array before setting state
        const equipmentArray = Array.isArray(data.equipment) ? data.equipment : [];
        
        if (page === 1) {
          setEquipmentList(equipmentArray);
        } else {
          setEquipmentList(prev => [...prev, ...equipmentArray]);
        }
        
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
        setEquipmentList([]); // Set empty array on error
      }
    };

    fetchEquipment();
  }, [page]);

  // Handle textarea changes and cursor position
  const handleSerialsChange = (e) => {
    const value = e.target.value;
    setSerials(value);
    updateCurrentLineState(e.target);
  };

  // Handle cursor movement and selection
  const handleKeyUp = (e) => {
    updateCurrentLineState(e.target);
  };


  const updateCurrentLineState = (textarea) => {
    const cursorPosition = textarea.selectionStart;
    const text = textarea.value;
    const textUpToCursor = text.slice(0, cursorPosition);
    const lineIndex = textUpToCursor.split('\n').length - 1;
    const lines = text.split('\n');
    const currentLineText = lines[lineIndex] || '';
    
    setCurrentLineIndex(lineIndex);
    setCurrentInput(currentLineText.trim());
    setShowSuggestions(currentLineText.trim().length > 0);
  };

  
  const handleSuggestionClick = (serial) => {
    const lines = serials.split('\n');
    lines[currentLineIndex] = serial;
    
    // Add new line if we're at the last line
    const newLines = currentLineIndex === lines.length - 1 ? [...lines, ''] : lines;
    
    setSerials(newLines.join('\n'));
    setShowSuggestions(false);
    
    // Move cursor to next line
    setTimeout(() => {
      const textarea = textareaRef.current;
      const newCursorPos = newLines.slice(0, currentLineIndex + 1).join('\n').length + 1;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Filter suggestions based on current line input
  const filteredSuggestions = currentInput && Array.isArray(equipmentList)
    ? equipmentList.filter(equipment => {
        const searchTerm = currentInput.toLowerCase();
        return (
          equipment?.Serial?.toLowerCase().includes(searchTerm) || 
          equipment?.Name?.toLowerCase().includes(searchTerm) || 
          equipment?.Category?.toLowerCase().includes(searchTerm)
        );
      })
    : [];

  const renderSuggestions = () => {
    if (!showSuggestions || !filteredSuggestions.length) return null;

    return (
      <div className="suggestions-dropdown" onScroll={handleScroll}>
        {filteredSuggestions.map(equipment => (
          <div
            key={equipment._id || equipment.Serial}
            className="suggestion-item"
            onClick={() => handleSuggestionClick(equipment.Serial)}
          >
            <strong>{equipment.Serial}</strong>
            <span> - {equipment.Name} ({equipment.Category})</span>
          </div>
        ))}
      </div>
    );
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const serialList = serials
        .split('\n')
        .map(s => s.trim())
        .filter(s => s);

      if (serialList.length === 0) {
        throw new Error('Please enter at least one serial number');
      }

      const { data } = await api.post('/checkinout/bulk', {
        action,
        selectedUser,
        serials: serialList,
        damageDescription: action === 'checkin' ? damage : undefined,
        notes
      });

      // Handle the response
      if (data.summary.successful > 0) {
        const successMessage = `Successfully ${action}ed ${data.summary.successful} items:\n${
          data.results.map(result => result.serial).join('\n')
        }`;
        
        //setSuccess(successMessage);
        setIsSuccessPopupOpen(true);

        // Clear form on success
        setSerials('');
        setDamage('');
        setNotes('');
        setSelectedUser('');
      }

      // Handle errors if any
      if (data.summary.failed > 0) {
        let errorMessage = '';
        const errorsByType = data.errors.reduce((acc, err) => {
          if (!acc[err.error]) {
            acc[err.error] = [];
          }
          acc[err.error].push(err.serial);
          return acc;
        }, {});

        Object.entries(errorsByType).forEach(([type, serials]) => {
          errorMessage += `🔴 ${type}:\n${serials.join(", ")}\n\n`;
        });

        setError(errorMessage.trim());
        setIsErrorPopupOpen(true);
      }

      // Log summary
      console.log('Operation Summary:', {
        total: data.summary.total,
        successful: data.summary.successful,
        failed: data.summary.failed
      });

    } catch (err) {
      setIsErrorPopupOpen(true);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <select 
        className="listViewModalInput2"
        value={action} 
        onChange={(e) => setAction(e.target.value)}
        disabled={loading}
      >
        <option value="checkout">Check Out</option>
        <option value="checkin">Check In</option>
      </select>

      <select
        className="listViewModalInput2"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        disabled={loading}
        required
      >
        <option value="">Select User</option>
        {users
          .filter(user => user.Role !== "student")
          .map((user) => (
            <option key={user._id} value={user._id}>
              {`${user.Title} ${user.FirstName} ${user.LastName} (${user.Role})`}
            </option>
        ))}
      </select>

      <div className="serials-input-container">
        <textarea
          ref={textareaRef}
          className="listViewModalInput2"
          value={serials}
          onChange={handleSerialsChange}
          onKeyUp={handleKeyUp}
          onClick={handleKeyUp}
          placeholder="Enter serial numbers, one per line"
          required
          disabled={loading}
          rows={5}
        />
        {renderSuggestions()}
      </div>


      {action === 'checkin' && (
        <input
          className="listViewModalInput2"
          type="text"
          value={damage}
          onChange={(e) => setDamage(e.target.value)}
          placeholder="Damage description (if any)"
          disabled={loading}
        />
      )}

      <input
        className="listViewModalInput2"
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Additional notes"
        disabled={loading}
      />

      <button className="listViewBtn3" type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      <SidePopup
        type="success"
        title="Operation Complete"
        message={success}
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        duration={5000}
      />

      <SidePopup
        type="error"
        title="Operation Failed"
        message={error}
        isOpen={isErrorPopupOpen}
        onClose={() => setIsErrorPopupOpen(false)}
        duration={10000}
      />
    </form>
  );
}

export default CheckInOutForm;