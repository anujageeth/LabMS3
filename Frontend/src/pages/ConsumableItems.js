import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllConsumables, searchConsumables } from '../services/consumableService';
import ConsumableListView from '../components/consumables/ConsumableListView';
import ConsumableTableView from '../components/consumables/ConsumableTableView';
import UserDetails from '../components/UserDetails';
import SideNavigation from '../components/SideNavigation';
import '../styles/ConsumableItems.css';

const ConsumableItems = ({ refresh, onRefresh }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchItems = async (page = 1, query = '') => {
    try {
      setLoading(true);
      const response = query 
        ? await searchConsumables(query, page)
        : await getAllConsumables(page);
      
      setItems(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch consumable items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(1, searchQuery);
  };

  const handlePageChange = (newPage) => {
    fetchItems(newPage, searchQuery);
  };

  const handleAddConsumable = () => {
    // Navigate to the existing AddItem page with a state parameter to show consumable form
    navigate('/additem', { state: { showConsumableForm: true, fromConsumables: true } });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRefresh = () => {
    fetchItems(currentPage, searchQuery);
    if (onRefresh) onRefresh();
  };

  if (loading) return (
    <div className="rightPanel">
      <UserDetails />
      <div className="loading">Loading consumable items...</div>
    </div>
  );
  
  if (error) return (
    <div className="rightPanel">
      <UserDetails />
      <div className="error">{error}</div>
    </div>
  );

  return (
    <div className="dashPage">
      <div className="gridBox">
        <SideNavigation />
        <div className="rightPanel">
          <UserDetails />
          <div className="dashBoxer">
            <div className="dashName">
              <h1 className="pageTitle">Consumable Items</h1>
              {/*<button className="backButton" onClick={handleBackToDashboard}>Back to Dashboard</button>*/}
            </div>
            
            <div className="consumable-container">
              <div className="consumable-controls">
                <div className="view-controls">
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    List View
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    Table View
                  </button>
                </div>

                <div className="search-bar">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search consumable items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                  </form>
                </div>
              </div>

              {items.length === 0 && !loading ? (
                <div className="no-items-message">
                  No consumable items found. Click the + button to add your first item.
                </div>
              ) : viewMode === 'list' ? (
                <ConsumableListView 
                  items={items} 
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onRefresh={handleRefresh}
                />
              ) : (
                <ConsumableTableView 
                  items={items} 
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onRefresh={handleRefresh}
                />
              )}
              
              <button 
                className="add-consumable-button"
                onClick={handleAddConsumable}
                title="Add new consumable item"
              >
                <span className="plus-icon">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumableItems; 