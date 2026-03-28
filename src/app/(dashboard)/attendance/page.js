import PunchSystem from '@/components/PunchSystem';
import AttendanceHistory from '@/components/AttendanceHistory';
import { getAttendanceRecords } from '@/app/actions';

export default async function AttendancePage() {
  const records = await getAttendanceRecords();
  
  // Find active session
  const lastRecord = records.length > 0 ? records[0] : null;
  const isCurrentlyWorking = lastRecord && lastRecord.outTime === '-';
  const activeRecordId = isCurrentlyWorking ? lastRecord.id : null;
  const activeSessionStart = isCurrentlyWorking ? lastRecord.rawIn : null;

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Workspace</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your daily punches and view your attendance history seamlessly.</p>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
         <div className="w-full xl:w-1/3 shrink-0">
           <PunchSystem 
             isInitialWorking={isCurrentlyWorking} 
             activeRecordId={activeRecordId} 
             sessionStart={activeSessionStart} 
           />
         </div>
         
         <div className="w-full xl:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
           <AttendanceHistory records={records} />
         </div>
      </div>
    </div>
  );
}
