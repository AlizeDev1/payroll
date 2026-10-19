import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Smartphone,
  Compass,
  Clock,
  Sparkles,
  Users,
  Navigation,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { MOCK_EMPLOYEES } from '../../data/mockData';

interface GeofencePunchRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  punchType: 'IN' | 'OUT';
  timestamp: string;
  locationName: string;
  coordinates: string;
  distanceMeters: number;
  faceMatchScore: number;
  status: 'VERIFIED' | 'OUTSIDE_GEOFENCE' | 'WFH_APPROVED';
}

const INITIAL_PUNCH_LOGS: GeofencePunchRecord[] = [
  {
    id: 'p-1',
    employeeName: 'Rahul Sharma',
    employeeId: 'EMP-001',
    punchType: 'IN',
    timestamp: '09:04 AM',
    locationName: 'Bellandur HQ - Workstation Bay 4',
    coordinates: '12.9279° N, 77.6271° E',
    distanceMeters: 22,
    faceMatchScore: 99.4,
    status: 'VERIFIED',
  },
  {
    id: 'p-2',
    employeeName: 'Sneha Rao',
    employeeId: 'EMP-002',
    punchType: 'IN',
    timestamp: '09:12 AM',
    locationName: 'Bellandur HQ - Main Reception',
    coordinates: '12.9281° N, 77.6273° E',
    distanceMeters: 45,
    faceMatchScore: 98.8,
    status: 'VERIFIED',
  },
  {
    id: 'p-3',
    employeeName: 'Vikram Patel',
    employeeId: 'EMP-003',
    punchType: 'IN',
    timestamp: '09:28 AM',
    locationName: 'Indiranagar (WFH Authorized)',
    coordinates: '12.9716° N, 77.5946° E',
    distanceMeters: 8400,
    faceMatchScore: 99.1,
    status: 'WFH_APPROVED',
  },
  {
    id: 'p-4',
    employeeName: 'Priya Iyer',
    employeeId: 'EMP-004',
    punchType: 'IN',
    timestamp: '09:45 AM',
    locationName: 'Client Office - Electronic City Phase 1',
    coordinates: '12.8399° N, 77.6770° E',
    distanceMeters: 14200,
    faceMatchScore: 97.6,
    status: 'OUTSIDE_GEOFENCE',
  },
];

interface GeofenceAttendanceViewProps {
  employees?: any[];
}

export const GeofenceAttendanceView: React.FC<GeofenceAttendanceViewProps> = ({ employees }) => {
  const { success, error } = useToast();
  const activeEmployees = employees && employees.length > 0 ? employees : (MOCK_EMPLOYEES || []);
  const initialEmpId = activeEmployees[0]?.employeeId || '';

  const [selectedEmpId, setSelectedEmpId] = useState(initialEmpId);
  const [punchType, setPunchType] = useState<'IN' | 'OUT'>('IN');
  const [locationPreset, setLocationPreset] = useState<'hq' | 'cafe' | 'client' | 'wfh'>('hq');
  const [isPunching, setIsPunching] = useState(false);
  const [punchLogs, setPunchLogs] = useState<GeofencePunchRecord[]>(INITIAL_PUNCH_LOGS);

  const selectedEmp = activeEmployees.find((e) => e.employeeId === (selectedEmpId || initialEmpId)) || activeEmployees[0];

  const getPresetDetails = () => {
    switch (locationPreset) {
      case 'hq':
        return {
          name: 'Bellandur HQ - Desk Floor 3',
          coords: '12.9279° N, 77.6271° E',
          distance: 18,
          status: 'VERIFIED' as const,
        };
      case 'cafe':
        return {
          name: 'HQ Campus - Outer Green Cafeteria',
          coords: '12.9284° N, 77.6276° E',
          distance: 98,
          status: 'VERIFIED' as const,
        };
      case 'client':
        return {
          name: 'Client Site - Electronic City',
          coords: '12.8399° N, 77.6770° E',
          distance: 14800,
          status: 'OUTSIDE_GEOFENCE' as const,
        };
      case 'wfh':
        return {
          name: 'Home Office - Indiranagar',
          coords: '12.9716° N, 77.5946° E',
          distance: 8200,
          status: 'WFH_APPROVED' as const,
        };
    }
  };

  const currentPreset = getPresetDetails();

  const handleExecutePunch = () => {
    if (!selectedEmp) {
      error('No Employee Selected', 'Please register an employee first.');
      return;
    }
    setIsPunching(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newRecord: GeofencePunchRecord = {
        id: `p-${Date.now()}`,
        employeeName: `${selectedEmp.firstName || 'Employee'} ${selectedEmp.lastName || ''}`.trim(),
        employeeId: selectedEmp.employeeId,
        punchType,
        timestamp: timeStr,
        locationName: currentPreset.name,
        coordinates: currentPreset.coords,
        distanceMeters: currentPreset.distance,
        faceMatchScore: 99.2,
        status: currentPreset.status,
      };

      setPunchLogs((prev) => [newRecord, ...prev]);
      setIsPunching(false);

      if (currentPreset.status === 'OUTSIDE_GEOFENCE') {
        error(
          'Geofence Exception Logged',
          `Punch recorded 14.8 km outside boundary. Flagged for Manager Geofence Approval.`
        );
      } else {
        success(
          `Clock-${punchType} Verified`,
          `Facial Match (99.2%) & Geofence (within ${currentPreset.distance}m) verified for ${selectedEmp.firstName}.`
        );
      }
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* Geofence Configuration & KPI Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Geofence Perimeter</span>
            <span className="font-bold text-slate-900 font-heading">150 Meters Radius</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">AI Liveness Check</span>
            <span className="font-bold text-slate-900 font-heading">3D Face Mesh Verified</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Mobile Device Auth</span>
            <span className="font-bold text-slate-900 font-heading">Hardware IMEI Locked</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Punches Captured Today</span>
            <span className="font-bold text-slate-900 font-heading">{punchLogs.length + 42} Mobile Check-ins</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Live Geofence & Facial Punch Simulator */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Navigation className="w-4 h-4 text-purple-600" />
                Mobile Geofence Punch Simulator
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simulate mobile app check-in with GPS bounds & facial recognition.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              GPS Active
            </span>
          </div>

          {/* Employee & Direction Selectors */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Employee</label>
              <select
                value={selectedEmpId || initialEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600"
              >
                {activeEmployees.slice(0, 20).map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.firstName} {emp.lastName} ({emp.employeeId}) — {emp.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Punch Action</label>
                <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-center font-bold">
                  <button
                    type="button"
                    onClick={() => setPunchType('IN')}
                    className={`py-1 rounded-md transition-colors ${
                      punchType === 'IN' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Punch IN
                  </button>
                  <button
                    type="button"
                    onClick={() => setPunchType('OUT')}
                    className={`py-1 rounded-md transition-colors ${
                      punchType === 'OUT' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Punch OUT
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GPS Location Scenario</label>
                <select
                  value={locationPreset}
                  onChange={(e) => setLocationPreset(e.target.value as any)}
                  className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-purple-600 truncate"
                >
                  <option value="hq">📍 Bellandur HQ (18m - PASS)</option>
                  <option value="cafe">📍 Outer Cafeteria (98m - PASS)</option>
                  <option value="client">⚠️ Electronic City (14.8km - OUTSIDE)</option>
                  <option value="wfh">🏠 Home Office (WFH Authorized)</option>
                </select>
              </div>
            </div>

            {/* Facial Liveness Camera Mockup */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-4 text-center text-white">
              <div className="w-24 h-24 mx-auto rounded-full border-2 border-emerald-400 border-dashed p-1 flex items-center justify-center relative">
                <div className="w-full h-full rounded-full bg-purple-900/60 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                  {selectedEmp.avatar ? (
                    <img src={selectedEmp.avatar} alt={selectedEmp.firstName} className="w-full h-full object-cover" />
                  ) : (
                    selectedEmp.firstName.charAt(0)
                  )}
                </div>
                <div className="absolute inset-0 border-2 border-emerald-400 rounded-full animate-ping opacity-25"></div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Facial Landmarks Detected (128 vectors)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Liveness: 99.4% · Anti-Spoofing: PASS · GPS Lat/Lng Locked
                </p>
              </div>
            </div>

            {/* Geofence Status Pill */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              currentPreset.status === 'OUTSIDE_GEOFENCE'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold block">{currentPreset.name}</span>
                  <span className="text-[10px] font-mono opacity-80">{currentPreset.coords} · {currentPreset.distance}m from HQ</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentPreset.status === 'OUTSIDE_GEOFENCE'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}>
                {currentPreset.status === 'OUTSIDE_GEOFENCE' ? 'Out of Bounds' : 'Inside Zone'}
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={handleExecutePunch}
              isLoading={isPunching}
              leftIcon={<Camera className="w-4 h-4" />}
            >
              Punch with Facial & Geo Verification
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Perimeter Map & Audit Trail */}
        <div className="lg:col-span-7 space-y-4">
          {/* Simulated Graphical Map Perimeter Box */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">
                  Real-Time Geofence Radar Mockup (Bangalore HQ)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Outer Ring Road, Bellandur, Bangalore (12.9279° N, 77.6271° E)
                </p>
              </div>
              <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 font-bold">
                Center: 12.9279, 77.6271
              </span>
            </div>

            {/* Stylized Map View */}
            <div className="h-44 rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center p-4">
              {/* Concentric Geofence Rings */}
              <div className="w-40 h-40 rounded-full border-2 border-purple-400/40 bg-purple-100/30 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full border border-purple-500/50 bg-purple-200/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    🏢
                  </div>
                </div>
              </div>

              {/* Plotted Employee Punch Pins */}
              <div className="absolute top-8 left-1/3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> Rahul (22m)
              </div>
              <div className="absolute bottom-10 right-1/3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> Sneha (45m)
              </div>
              <div className="absolute top-4 right-8 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" /> Priya (14.2km)
              </div>

              <span className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-mono bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                150m Radius Geofence Boundary
              </span>
            </div>
          </div>

          {/* Live Mobile Punches Audit Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 font-heading">
                Mobile Check-in Verification Audit Trail
              </h4>
              <span className="text-[11px] text-slate-400">
                Latest {punchLogs.length} Records
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-2">Type & Time</th>
                    <th className="py-2.5 px-3">Location & Distance</th>
                    <th className="py-2.5 px-2 text-center">Face Match</th>
                    <th className="py-2.5 px-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {punchLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {log.employeeName}
                        <span className="block text-[10px] text-slate-400 font-mono">{log.employeeId}</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                          log.punchType === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {log.punchType}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{log.timestamp}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-slate-800 font-medium block truncate max-w-[180px]">
                          {log.locationName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {log.distanceMeters < 1000 ? `${log.distanceMeters}m away` : `${(log.distanceMeters / 1000).toFixed(1)}km away`}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-600">
                        {log.faceMatchScore}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {log.status === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                        {log.status === 'WFH_APPROVED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            WFH Active
                          </span>
                        )}
                        {log.status === 'OUTSIDE_GEOFENCE' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Geo Override
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
