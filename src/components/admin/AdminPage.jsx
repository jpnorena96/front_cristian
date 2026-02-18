import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import AdminLayout from './AdminLayout';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import KnowledgeBaseManager from './KnowledgeBaseManager';

export default function AdminPage({ onLogout, onBack }) {
    const [activeTab, setActiveTab] = useState('overview');
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);

    // Initial check for admin rights
    useEffect(() => {
        // Validation logic
        if (currentUser && !currentUser.isAdmin && !currentUser.is_admin) {
            console.warn("AdminPage rendered for a non-admin user.");
        }
    }, [currentUser]);

    const handleLogout = () => {
        dispatch(logout());
        onLogout();
    };

    const handleNavigate = (path) => {
        if (path === 'landing') {
            onBack();
        } else {
            setActiveTab(path);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'users': return <UserManagement />;
            case 'conversations': return <ConversationInspector />;
            case 'knowledge': return <KnowledgeBaseManager />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <AdminLayout
            onLogout={handleLogout} // Pass the internal handler which also calls the prop
            onNavigate={handleNavigate}
            activeTab={activeTab}
        >
            {renderContent()}
        </AdminLayout>
    );
}
