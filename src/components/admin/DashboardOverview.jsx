import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, AlertTriangle, TrendingUp } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await AdminService.getStats();
            setStats(data);
        } catch (error) {
            console.error("Error loading stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando datos...</div>;
    if (!stats) return <div>Error cargando estadísticas</div>;

    // Dummy data for charts (replace with real data if API provides it detailed)
    const chartData = [
        { name: 'Lun', consultas: 12 },
        { name: 'Mar', consultas: 19 },
        { name: 'Mie', consultas: 3 },
        { name: 'Jue', consultas: 5 },
        { name: 'Vie', consultas: 2 },
        { name: 'Sab', consultas: 20 },
        { name: 'Dom', consultas: 10 },
    ];

    const pieData = [
        { name: 'Laboral', value: 400 },
        { name: 'Penal', value: 300 },
        { name: 'Civil', value: 300 },
        { name: 'Admin', value: 200 },
    ];

    return (
        <div className="dashboard-overview">
            <h1 className="admin-title">Resumen General</h1>

            <div className="admin-grid">
                <div className="admin-card stat-card">
                    <div className="stat-label">Usuarios Totales</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <Users className="stat-icon" size={24} color="#0088FE" />
                </div>

                <div className="admin-card stat-card">
                    <div className="stat-label">Conversaciones</div>
                    <div className="stat-value">{stats.totalConversations}</div>
                    <MessageSquare className="stat-icon" size={24} color="#00C49F" />
                </div>

                <div className="admin-card stat-card">
                    <div className="stat-label">Usuarios Activos (24h)</div>
                    <div className="stat-value">{stats.activeUsers24h}</div>
                    <TrendingUp className="stat-icon" size={24} color="#FFBB28" />
                </div>

                <div className="admin-card stat-card">
                    <div className="stat-label">Casos de Riesgo</div>
                    <div className="stat-value">{stats.riskCases}</div>
                    <AlertTriangle className="stat-icon" size={24} color="#FF8042" />
                </div>
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="admin-card">
                    <h3>Consultas Semanales</h3>
                    <div style={{ height: 300, marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="consultas" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-card">
                    <h3>Distribución Temática</h3>
                    <div style={{ height: 300, marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
