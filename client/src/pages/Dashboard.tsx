import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Trash2, LogOut, Settings, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface Report {
  _id: string;
  name: string;
  email: string;
  phone: string;
  abuseType: string;
  description: string;
  sex: string;
  workPosition: string;
  educationLevel: string;
  jobType: string;
  incidentTime: string;
  incidentPlace: string;
  incidentDay: string;
  image?: string;
  createdAt: string;
}

// ✅ Use environment variable for backend API URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDirectorLoggedIn, setIsDirectorLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [brightness, setBrightness] = useState(100);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showForgotEmailInput, setShowForgotEmailInput] = useState(false);

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // ----------------- HELPERS -----------------
  const getAbuseBadgeVariant = (abuseType: string) => {
    switch (abuseType.toLowerCase()) {
      case 'physical': return 'destructive';
      case 'sexual': return 'warning';
      case 'emotional': return 'success';
      case 'financial':
      case 'fin': return 'secondary';
      default: return 'secondary';
    }
  };

  const expandOnce = (id: string) => {
    setExpandedCard(prev => (prev === id ? null : id));
  };

  const downloadReportPDF = (report: Report) => {
    const doc = new jsPDF();
    doc.text(`Report: ${report.name}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      body: [
        ['Name', report.name],
        ['Email', report.email],
        ['Phone', report.phone],
        ['Abuse Type', report.abuseType],
        ['Description', report.description],
        ['Sex', report.sex],
        ['Work Position', report.workPosition],
        ['Education Level', report.educationLevel],
        ['Job Type', report.jobType],
        ['Incident Time', report.incidentTime],
        ['Incident Place', report.incidentPlace],
        ['Incident Day', report.incidentDay],
      ],
    });
    doc.save(`${report.name}_report.pdf`);
  };

  const downloadReportExcel = (report: Report) => {
    const ws = XLSX.utils.json_to_sheet([report]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${report.name}_report.xlsx`);
  };

  // ----------------- EFFECTS -----------------
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedBrightness = Number(localStorage.getItem('brightness')) || 100;
    setDarkMode(savedDarkMode);
    setBrightness(savedBrightness);
    document.documentElement.style.filter = `brightness(${savedBrightness}%)`;
    document.documentElement.classList.toggle('dark', savedDarkMode);

    const token = localStorage.getItem('token');
    if (token) fetchReports(token);
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReports(reports);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredReports(
      reports.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.phone.toLowerCase().includes(term) ||
        r.abuseType.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, reports]);

  // ----------------- API FUNCTIONS -----------------
  const fetchReports = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ Correct endpoint: /api/reports
      const res = await fetch(`${apiUrl}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch reports');
      const finalReports: Report[] = Array.isArray(data) ? data : data?.data || [];
      finalReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReports(finalReports);
      setFilteredReports(finalReports);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reports';
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      return toast({ title: 'Error', description: 'Please enter username/email and password', variant: 'destructive' });
    }
    setLoginLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      localStorage.setItem('token', data.token);
      setIsDirectorLoggedIn(true);
      toast({ title: 'Success', description: 'Logged in successfully', variant: 'default' });
      await fetchReports(data.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsDirectorLoggedIn(false);
    setReports([]);
    setFilteredReports([]);
    navigate('/');
  };

  const deleteReport = async (id: string) => {
    if (!window.confirm('Delete this report?')) return;
    const token = localStorage.getItem('token');
    if (!token) return handleLogout();
    try {
      // ✅ Correct endpoint: /api/reports/:id
      const res = await fetch(`${apiUrl}/api/reports/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error(data?.message || 'Failed to delete report');

      setReports(prev => prev.filter(r => r._id !== id));
      setFilteredReports(prev => prev.filter(r => r._id !== id));
      toast({ title: 'Deleted', description: 'Report deleted successfully', variant: 'default' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete report';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  const handleBrightnessChange = (value: number[]) => {
    const brightnessValue = value[0];
    setBrightness(brightnessValue);
    localStorage.setItem('brightness', String(brightnessValue));
    document.documentElement.style.filter = `brightness(${brightnessValue}%)`;
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return toast({ title: 'Error', description: 'Please fill both fields', variant: 'destructive' });
    }

    const token = localStorage.getItem('token');
    if (!token) return handleLogout();

    setChangingPassword(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/change-password`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error(data?.message || 'Failed to change password');

      toast({ title: 'Success', description: data.message || 'Password changed successfully', variant: 'default' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      return toast({ title: 'Error', description: 'Please enter your email', variant: 'destructive' });
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to send reset link');

      toast({ title: 'Success', description: data.message || 'Reset link sent to your email', variant: 'default' });
      setForgotPasswordEmail('');
      setShowForgotEmailInput(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setForgotLoading(false);
    }
  };

  // ----------------- JSX -----------------
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">{t('dashboard') || 'Dashboard'}</h1>
        {isDirectorLoggedIn && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="icon">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* LOGIN FORM */}
      {!isDirectorLoggedIn && (
        <div className="flex justify-center items-start min-h-screen pt-40">
          <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <Input placeholder="Username or Email" value={identifier} onChange={e => setIdentifier(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button onClick={handleLogin} className="w-full">{loginLoading ? 'Loading...' : 'Login'}</Button>

            {/* Forgot Password */}
            <div className="text-right mt-2">
              {!showForgotEmailInput && (
                <Button variant="link" onClick={() => setShowForgotEmailInput(true)}>Forgot Password?</Button>
              )}
              {showForgotEmailInput && (
                <>
                  <Input
                    type="email"
                    placeholder="Enter email for reset"
                    value={forgotPasswordEmail}
                    onChange={e => setForgotPasswordEmail(e.target.value)}
                    className="mt-2"
                  />
                  <Button onClick={handleForgotPassword} disabled={forgotLoading} className="mt-2 w-full">
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH + REPORTS */}
      {isDirectorLoggedIn && (
        <>
          <Input
            placeholder="Search by name, phone, or abuse type"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />

          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-sm text-gray-500">No reports found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map(report => {
                if (expandedCard && expandedCard !== report._id) return null;

                return (
                  <Card key={report._id} className="touch-manipulation">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{report.name}</span>
                        <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                          getAbuseBadgeVariant(report.abuseType) === 'destructive' ? 'bg-red-600' :
                          getAbuseBadgeVariant(report.abuseType) === 'warning' ? 'bg-yellow-500' :
                          getAbuseBadgeVariant(report.abuseType) === 'success' ? 'bg-green-600' :
                          'bg-gray-400'
                        }`}>
                          {report.abuseType}
                        </span>
                      </CardTitle>
                      <CardDescription>{new Date(report.createdAt).toLocaleString()}</CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 pt-0 text-sm space-y-2">
                      {expandedCard === report._id ? (
                        <>
                          <p><strong>Description:</strong> {report.description || "N/A"}</p>
                          <p><strong>Email:</strong> {report.email || "N/A"}</p>
                          <p><strong>Phone:</strong> {report.phone || "N/A"}</p>
                          <p><strong>Sex:</strong> {report.sex || "N/A"}</p>
                          <p><strong>Work Position:</strong> {report.workPosition || "N/A"}</p>
                          <p><strong>Education Level:</strong> {report.educationLevel || "N/A"}</p>
                          <p><strong>Job Type:</strong> {report.jobType || "N/A"}</p>
                          <p><strong>Incident Time:</strong> {report.incidentTime || "N/A"}</p>
                          <p><strong>Incident Place:</strong> {report.incidentPlace || "N/A"}</p>
                          <p><strong>Incident Day:</strong> {report.incidentDay || "N/A"}</p>

                          {report.image && (
                            <div className="mt-2">
                              <img
                                src={`${apiUrl}/${report.image.replace(/\\/g, '/')}`}
                                alt="Report"
                                className="w-full h-auto rounded object-cover"
                                onError={e => (e.currentTarget.src = '/placeholder.png')}
                              />
                            </div>
                          )}

                          <div className="flex gap-2 mt-3 flex-wrap">
                            <Button variant="destructive" size="sm" onClick={() => deleteReport(report._id)}>
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadReportPDF(report)}>
                              <Download className="w-4 h-4 mr-1" /> PDF
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadReportExcel(report)}>
                              <Download className="w-4 h-4 mr-1" /> Excel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-600 text-sm">
                          <p><strong>Name:</strong> {report.name || "N/A"}</p>
                          <p><strong>Time:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                        </div>
                      )}

                      <div className="mt-3">
                        <Button variant="ghost" size="sm" onClick={() => expandOnce(report._id)}>
                          {expandedCard === report._id ? 'Compact' : 'Expand'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* SETTINGS */}
      {showSettings && (
        <div className="p-4 border rounded-lg space-y-4 w-full max-w-md">
          <div className="flex justify-between items-center">
            <span>Dark mode</span>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
          <div>
            <span>Brightness</span>
            <Slider value={[brightness]} onValueChange={handleBrightnessChange} max={200} />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <Input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
            <Input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <Button onClick={handleChangePassword} disabled={changingPassword} className="w-full">
              {changingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
