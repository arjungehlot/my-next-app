"use client";
import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, 
  CreditCard, Landmark, FileText, CheckCircle, 
  ArrowRight, ShieldCheck, Plus, Trash2, Edit3, 
  Save, AlertCircle, Building, History, ExternalLink,
  Upload, Eye
} from 'lucide-react';
import { saveProfileData, uploadProfileFile } from '@/app/actions';

const EXPERIENCE_LEVELS = ['Intern', 'Junior', 'Associate', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Director'];
const SAVING_TYPES = ['Savings', 'Current', 'Salary Account', 'Fixed Deposit'];

function ProfileSection({ title, children, icon: Icon, id }) {
  return (
    <div id={id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Icon size={18} />
          </div>
        )}
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

function FormField({ label, name, icon: Icon, type = "text", placeholder, defaultValue, options, required = false }) {
  const inputClass = "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300";

  return (
    <div className="flex flex-col gap-1.5 ring-offset-white">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={12} className={type === 'file' ? 'text-indigo-500' : 'text-slate-400'} />}
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label} {required && <span className="text-rose-500">*</span>}</label>
        </div>
        {type === 'file' && defaultValue && (
          <a href={defaultValue} target="_blank" rel="noreferrer" className="text-[9px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-tighter">
            <Eye size={10} /> View Current
          </a>
        )}
      </div>

      {options ? (
        <select name={name} defaultValue={defaultValue} required={required} className={inputClass}>
          <option value="">Select Option...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} required={required} placeholder={placeholder} className={inputClass + " resize-none"} />
      ) : type === "file" ? (
        <div className="relative group">
          <input 
            name={name} 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={(e) => {
              const fileName = e.target.files[0]?.name;
              if (fileName) e.target.parentElement.querySelector('.file-label').textContent = fileName;
            }}
          />
          <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between group-hover:border-indigo-300 group-hover:bg-indigo-50/30 transition-all">
            <span className="file-label text-[11px] font-bold text-slate-400 truncate max-w-[150px]">
              {defaultValue ? "Replace file..." : "Choose file..."}
            </span>
            <Upload size={14} className="text-slate-400 group-hover:text-indigo-500" />
          </div>
        </div>
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} className={inputClass} />
      )}
    </div>
  );
}

export default function ProfileView({ initialData, sessionUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasPrevExp, setHasPrevExp] = useState(initialData?.hasPrevExperience || false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const formElement = e.target;
      const formData = new FormData(formElement);
      
      // 1. Identify and upload files
      const fileInputs = formElement.querySelectorAll('input[type="file"]');
      for (const input of fileInputs) {
        const file = input.files[0];
        if (file) {
          const uploadData = new FormData();
          uploadData.append('file', file);
          uploadData.append('category', input.name.toUpperCase());
          
          setError(`Uploading ${input.name}...`);
          const uploadResult = await uploadProfileFile(uploadData);
          
          if (uploadResult.success) {
            formData.set(input.name, uploadResult.url);
          } else {
            throw new Error(`Failed to upload ${input.name}: ${uploadResult.error}`);
          }
        } else {
          // If no new file selected, but we had a defaultValue, keep it
          // FormData normally wouldn't include the value of a file input if no file is chosen
          // But our backend expects the URL string if it exists
          const existingUrl = initialData?.[input.name];
          if (existingUrl) {
            formData.set(input.name, existingUrl);
          }
        }
      }

      setError(''); // Clear upload status
      
      // 2. Save final profile data
      const result = await saveProfileData(formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Optional: window.location.reload() or router.refresh() if needed to show updated "View Document" links
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err) {
      setError(err.message || 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = sessionUser?.name || initialData?.fullName || 'User';
  const role = sessionUser?.role || 'Employee';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-100 uppercase shrink-0">
          {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{displayName}</h1>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 w-fit self-center">
              {role}
            </span>
          </div>
          <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} /> {initialData?.email || 'No email set'}
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
             className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 duration-200">
             Save Profile
           </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Personal Information */}
        <ProfileSection title="1. Personal Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField label="Full Name" name="fullName" defaultValue={initialData?.fullName} required icon={User} />
            <FormField label="Personal Email ID" name="email" defaultValue={initialData?.email} required type="email" icon={Mail} />
            <FormField label="Personal Contact No" name="contactNo" defaultValue={initialData?.contactNo} required type="tel" icon={Phone} />
            <FormField label="Alternate Contact No" name="altContactNo" defaultValue={initialData?.altContactNo} type="tel" icon={Phone} />
            <FormField label="Designation" name="designation" defaultValue={initialData?.designation} required icon={Briefcase} />
            <FormField label="Experience Level" name="experienceLevel" defaultValue={initialData?.experienceLevel} options={EXPERIENCE_LEVELS} required icon={History} />
            <FormField label="Date of Birth" name="dob" type="date" defaultValue={initialData?.dob} icon={Calendar} />
            <FormField label="Date of Joining" name="doj" type="date" defaultValue={initialData?.doj} icon={Calendar} />
            <FormField label="ID Proof (TYPE & NO)" name="idProof" defaultValue={initialData?.idProof} placeholder="e.g. PAN - ABCDE1234F" icon={CreditCard} />
            <div className="md:col-span-2 lg:col-span-3">
              <FormField label="Address" name="address" defaultValue={initialData?.address} type="textarea" placeholder="Enter your full residential address" icon={MapPin} />
            </div>
          </div>
        </ProfileSection>

        {/* Section 2: Employment & Documents */}
        <ProfileSection title="2. Employment & ID Documents" icon={FileText}>
          <p className="text-[10px] text-slate-400 font-bold mb-6 italic tracking-tight">* Select files to upload (Max 5MB each).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField label="Current Offer Letter" name="offerLetter" defaultValue={initialData?.offerLetter} type="file" icon={FileText} />
            <FormField label="PAN CARD" name="panCard" defaultValue={initialData?.panCard} required type="file" icon={ShieldCheck} />
            <FormField label="AADHAR CARD" name="aadharCard" defaultValue={initialData?.aadharCard} required type="file" icon={ShieldCheck} />
            <FormField label="Qualifications" name="qualifications" defaultValue={initialData?.qualifications} type="file" icon={FileText} />
            <FormField label="Joining Letter (HR)" name="joiningLetter" defaultValue={initialData?.joiningLetter} type="file" icon={FileText} />
            <FormField label="Confirmation Letter (HR)" name="confirmationLetter" defaultValue={initialData?.confirmationLetter} type="file" icon={FileText} />
          </div>
        </ProfileSection>

        {/* Section 3: Bank Details */}
        <ProfileSection title="3. Bank Details" icon={Landmark}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField label="Bank Name" name="bankName" defaultValue={initialData?.bankName} icon={Landmark} />
            <FormField label="Account No" name="accountNo" defaultValue={initialData?.accountNo} icon={CreditCard} />
            <FormField label="IFSC Code" name="ifscCode" defaultValue={initialData?.ifscCode} icon={HashIcon} />
            <FormField label="Branch" name="branch" defaultValue={initialData?.branch} icon={Building} />
            <FormField label="Type of Saving" name="typeOfSaving" defaultValue={initialData?.typeOfSaving} options={SAVING_TYPES} icon={CheckCircle} />
            <FormField label="Upload Passbook" name="passbook" defaultValue={initialData?.passbook} type="file" icon={Upload} />
          </div>
        </ProfileSection>

        {/* Section 4: Past Employment */}
        <div className="mb-12">
          <label className="flex items-center gap-3 cursor-pointer group mb-6 px-4">
            <div className="relative w-12 h-6 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors">
              <input 
                type="checkbox" 
                name="hasPrevExperience"
                checked={hasPrevExp} 
                onChange={() => setHasPrevExp(!hasPrevExp)} 
                className="sr-only peer" 
              />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7 peer-checked:bg-indigo-600" />
            </div>
            <span className="text-sm font-black text-slate-700 uppercase tracking-widest">I have Previous Work Experience</span>
          </label>

          {hasPrevExp && (
            <ProfileSection title="Past Employment Details" icon={History}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3">
                  <FormField label="Previous Company Name" name="prevCompany" defaultValue={initialData?.prevCompany} icon={Building} />
                </div>
                <FormField label="Start Date" name="prevStart" type="date" defaultValue={initialData?.prevStart} icon={Calendar} />
                <FormField label="End Date" name="prevEnd" type="date" defaultValue={initialData?.prevEnd} icon={Calendar} />
                <FormField label="Total Experience" name="totalExp" defaultValue={initialData?.totalExp} placeholder="e.g. 2 Years 4 Months" icon={History} />
                <FormField label="Last Designation" name="prevDesignation" defaultValue={initialData?.prevDesignation} icon={Briefcase} />
                <FormField label="Last CTC" name="prevCtc" defaultValue={initialData?.prevCtc} placeholder="e.g. 8.5 LPA" icon={WalletIcon} />
                <FormField label="Reason of Leaving" name="prevReason" defaultValue={initialData?.prevReason} icon={AlertCircle} />
                <FormField label="HR Name" name="hrName" defaultValue={initialData?.hrName} icon={User} />
                <FormField label="HR Contact" name="hrContact" defaultValue={initialData?.hrContact} icon={Phone} />
                <FormField label="Do you have a Relieving Letter?" name="relievingLetter" defaultValue={initialData?.relievingLetter} options={['Yes', 'No']} icon={FileText} />
                <FormField label="Do you have an Exp Certificate?" name="expCertificate" defaultValue={initialData?.expCertificate} options={['Yes', 'No']} icon={FileText} />
                <div className="md:col-span-2 lg:col-span-3">
                  <FormField label="Upload Experience Documents" name="expDocs" defaultValue={initialData?.expDocs} type="file" icon={FolderIcon} />
                </div>
              </div>
            </ProfileSection>
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in-95 pointer-events-none">
          <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl px-1 py-1 rounded-[24px] shadow-2xl pointer-events-auto border border-white/10">
            {error && <span className="text-rose-400 text-xs font-bold px-4">{error}</span>}
            {success && <span className="text-emerald-400 text-xs font-bold px-4 flex items-center gap-2"><CheckCircle size={14} /> Profile Saved!</span>}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-[20px] font-black text-sm transition-all duration-300 ${isLoading ? 'bg-slate-700 text-slate-400' : 'bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white'}`}>
              <Save size={18} />
              {isLoading ? 'SAVING DATA...' : 'SAVE ALL DETAILS'}
            </button>
          </div>
        </div>
      </form>

      {/* Spacing for floating bar */}
      <div className="h-24" />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function HashIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function WalletIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
    </svg>
  );
}

function FolderIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}
