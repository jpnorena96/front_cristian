import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import AdminLayout from './AdminLayout';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import ConversationInspector from './ConversationInspector';

export default function AdminPage({ onLogout, onBack }) {
    const [activeTab, setActiveTab] = useState('overview');
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);

    // Initial check for admin rights
    useEffect(() => {
        // Validation logic
        if (currentUser && !currentUser.isAdmin && !currentUser.is_admin) {
            // This component expects the parent to handle access control.
            // If the user is not an admin, the parent should not render this component.
            // However, if for some reason it is rendered, we can log a warning.
            console.warn("AdminPage rendered for a non-admin user.");
            // The onBack prop could be used here if the parent wants to redirect.
            // onBack();
        }
    }, [currentUser]);

    const handleLogout = () => {
        dispatch(logout()); // Still dispatch Redux logout
        onLogout(); // Call the prop to handle navigation/parent state
    };

    const handleNavigate = (path) => {
        if (path === 'landing') {
            onBack(); // Use the prop for navigating back to the landing page
        } else {
            setActiveTab(path);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'users': return <UserManagement />;
            case 'conversations': return <ConversationInspector />;
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
