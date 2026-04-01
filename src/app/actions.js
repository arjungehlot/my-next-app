"use server";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// User-provided Spreadsheet ID
const SPREADSHEET_ID = '1Rs3oBtF-WDw0vMlYZS8wwWuL79jRJZBHjpqfmwrQI-k';

// ── Lazy credential & doc loader ───────────────────────────────────────────────
// Credentials are loaded on first use rather than at module evaluation
// so a missing file never crashes the entire Next.js server.
// Priority: GOOGLE_CREDENTIALS_JSON env var  →  google-credentials.json file
let _doc = null;

function getCredentials() {
  // 1. Check env variable for full JSON first
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  }

  // 2. Check for individual environment variables (as found in .env)
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      type: process.env.GOOGLE_TYPE || 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    };
  }

  // 3. Fall back to the JSON file on disk
  const filePath = path.join(process.cwd(), 'google-credentials.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(
      'Google credentials not found. Place google-credentials.json in the project root, ' +
      'or set the GOOGLE_CREDENTIALS_JSON environment variable.'
    );
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getDoc() {
  if (_doc) return _doc;
  const creds = getCredentials();
  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  _doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
  return _doc;
}

async function getSheet(name) {
  try {
    const doc = getDoc();
    await doc.loadInfo();

    if (name) {
      const sheet = doc.sheetsByTitle[name];
      if (!sheet) {
        console.warn(`⚠️ Sheet tab "${name}" not found in spreadsheet.`);
        console.info(`Available tabs: ${Object.keys(doc.sheetsByTitle).join(', ')}`);
        return { _mock: true }; // Fallback to mock mode if tab is missing
      }
      return sheet;
    }

    return doc.sheetsByIndex[0];
  } catch (err) {
    if (err.message.includes('Duplicate header detected')) {
      console.error('❌ GOOGLE SHEETS ERROR: Duplicate headers found.');
      console.error(err.message);
      // We can't easily list headers if loadInfo fails, but we've identified the issue.
      return { _mock: true };
    }
    if (err.message.includes('Google credentials not found')) {
      console.warn('⚠️ MOCK MODE ENABLED: Operating without Google Sheets credentials.');
      return { _mock: true }; // Return a mock marker
    }
    throw err;
  }
}

// ── Mock Storage (Ephemeral for demo) ──────────────────────────────────────────
let _mockAttendance = [
  { id: 'm1', date: 'Sat 28 Mar', empId: 'EMP102', name: 'krishna Pawar', email: 'pawarkrishna285@gmail.com', inTime: '09:12:44 AM', outTime: '-', hours: '-', status: 'On Time', location: '19.0760, 72.8777', remark: 'Mock Record' }
];

export async function getAttendanceRecords() {
  try {
    const sheet = await getSheet();
    if (sheet._mock) return [..._mockAttendance].reverse();

    let rows;
    try {
      rows = await sheet.getRows();
    } catch (err) {
      if (err.message.includes('Duplicate header detected')) {
        console.error('❌ ATTENDANCE SHEET ERROR: Duplicate headers found. Column: ' + err.message.split('"')[1]);
        return [..._mockAttendance].reverse(); // Fallback to mock
      }
      throw err;
    }

    const records = rows.map(row => {
      const data = row.toObject();
      return {
        id: data['ID'] || data['Raw In'] || Math.random().toString(),
        date: data['Date'] || '-',
        empId: data['Emp ID'] || '-',
        name: data['Name'] || '-',
        email: data['Email'] || '-',
        inTime: data['In Time'] || '-',
        outTime: data['Out Time'] || '-',
        hours: data['Hours'] || '-',
        status: data['Status'] || '-',
        location: data['Location'] || '-',
        leaveType: data['Leave Type'] || '-',
        remark: data['Remark'] || '-',
        rawIn: data['Raw In'] || '-'
      };
    });
    return records.reverse();
  } catch (err) {
    console.error("Failed to fetch from Google Sheets:", err);
    return [..._mockAttendance].reverse();
  }
}

function getPunchInStatus(now) {
  // All thresholds in IST (hours and minutes)
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMinutes = h * 60 + m;

  const HALF_DAY = 14 * 60;       // 2:00 PM
  const SHORT_LEAVE = 12 * 60;       // 12:00 PM
  const LATE_MARK = 10 * 60 + 30;  // 10:30 AM

  if (totalMinutes >= HALF_DAY) return 'Half Day';
  if (totalMinutes >= SHORT_LEAVE) return 'Short Leave';
  if (totalMinutes > LATE_MARK) return 'Late Mark';
  return 'On Time';
}

export async function punchIn(data) {
  const sheet = await getSheet();
  const now = new Date();
  const rawIn = now.toISOString();
  const status = getPunchInStatus(now);

  // Read session user so caller doesn't need to pass sensitive data
  const user = await getSessionUser();

  if (sheet._mock) {
    _mockAttendance.push({
      id: rawIn,
      rawIn,
      date: data.date,
      empId: user?.empId || data.empId || 'MOCK-101',
      name: user?.name || data.name || 'Mock User',
      email: user?.email || data.email || 'mock@example.com',
      inTime: data.inTime,
      outTime: '-',
      hours: '-',
      status: status,
      location: data.location,
      leaveType: '-',
      remark: (data.remark || '') + ' (Mock)',
    });
    revalidatePath('/attendance');
    return { id: rawIn, rawIn, status };
  }

  await sheet.addRow({
    'Raw In': rawIn,
    'Date': data.date,
    'Emp ID': user?.empId || data.empId || '-',
    'Name': user?.name || data.name || '-',
    'Email': user?.email || data.email || '-',
    'In Time': data.inTime,
    'Out Time': '-',
    'Hours': '-',
    'Status': status,
    'Location': data.location,
    'Leave Type': '-',
    'Remark': data.remark
  });

  revalidatePath('/attendance');
  return { id: rawIn, rawIn, status };
}

export async function punchOut(activeRecordId, outTime, hours) {
  const sheet = await getSheet();

  if (sheet._mock) {
    const rec = _mockAttendance.find(r => r.id === activeRecordId || r.rawIn === activeRecordId);
    if (rec) {
      rec.outTime = outTime;
      rec.hours = hours;
    }
    revalidatePath('/attendance');
    return { success: true };
  }

  const rows = await sheet.getRows();
  const targetRow = rows.find(r => r.get('ID') === activeRecordId || r.get('Raw In') === activeRecordId);

  if (targetRow) {
    targetRow.assign({
      'Out Time': outTime,
      'Hours': hours
    });
    await targetRow.save();
  }

  revalidatePath('/attendance');
  return { success: true };
}

// ── Auto Punch-Out at 6 PM ────────────────────────────────────────────────────
// Called by the client at 6 PM if the user still has an open session.
export async function autoPunchOut(activeRecordId, rawInISO) {
  try {
    const now = new Date();

    // Calculate hours worked from rawIn → now
    let hoursString = '00:00';
    if (rawInISO) {
      const start = new Date(rawInISO);
      if (!isNaN(start)) {
        const diffMs = now - start;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        hoursString = `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
      }
    }

    // Format out time  
    const outTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    const sheet = await getSheet();

    if (sheet._mock) {
      const rec = _mockAttendance.find(r => r.id === activeRecordId || r.rawIn === activeRecordId);
      if (rec) {
        rec.outTime = outTime;
        rec.hours = hoursString;
        rec.remark = (rec.remark || '') + ' | Auto Punch-Out (6 PM) (Mock)';
      }
      revalidatePath('/attendance');
      return { success: true, outTime, hours: hoursString };
    }

    const rows = await sheet.getRows();
    const targetRow = rows.find(r => r.get('Raw In') === activeRecordId || r.get('ID') === activeRecordId);

    if (targetRow) {
      targetRow.assign({
        'Out Time': outTime,
        'Hours': hoursString,
        'Remark': (targetRow.get('Remark') || '') + ' | Auto Punch-Out (6 PM)',
      });
      await targetRow.save();
    }

    revalidatePath('/attendance');
    return { success: true, outTime, hours: hoursString };
  } catch (err) {
    console.error('autoPunchOut error:', err);
    return { success: false, error: err.message };
  }
}

// ── Auth Actions ──────────────────────────────────────────────────────────────

export async function loginUser(formData) {
  const name = formData.get('name')?.trim();
  const password = formData.get('password')?.trim();

  if (!name || !password) {
    return { success: false, error: 'Please fill in all fields.' };
  }

  try {
    const sheet = await getSheet('user');

    // ── Mock Login Fallback ──
    if (sheet._mock) {
      const user = {
        empId: 'EMP102',
        name: name || 'krishna Pawar',
        email: 'pawarkrishna285@gmail.com',
        role: 'Employee',
      };
      const cookieStore = await cookies();
      cookieStore.set('hrms_session', JSON.stringify(user), {
        httpOnly: true, path: '/', maxAge: 60 * 60 * 8, sameSite: 'lax',
      });
      return { success: true, user };
    }

    const rows = await sheet.getRows();
    const matched = rows.find(row => {
      const rowName = (row.get('Name') || '').trim();
      const rowPass = (row.get('Password') || '').trim();
      return rowName.toLowerCase() === name.toLowerCase() && rowPass === password;
    });

    if (!matched) {
      return { success: false, error: 'Invalid name or password.' };
    }

    const user = {
      empId: matched.get('Client Id') || '',
      name: matched.get('Name') || '',
      email: matched.get('Email') || '',
      role: matched.get('Role') || 'Employee',
    };

    const cookieStore = await cookies();
    cookieStore.set('hrms_session', JSON.stringify(user), {
      httpOnly: true, path: '/', maxAge: 60 * 60 * 8, sameSite: 'lax',
    });

    return { success: true, user };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Server error. Please try again.' };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('hrms_session');
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('hrms_session')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Mock Leave Storage ──
let _mockLeaves = [
  { empId: 'EMP102', type: 'Sick Leave', start: '2026-03-20', end: '2026-03-21', days: '2', reason: 'Fever', status: 'Approved' }
];

export async function getLeaveHistory() {
  try {
    const user = await getSessionUser();
    if (!user) return { myHistory: [], teamPending: [], teamHistory: [] };

    const sheet = await getSheet('leave');

    // ── Mock Fallback ──
    if (sheet._mock) {
      const myHistory = _mockLeaves
        .filter(r => r.empId === user.empId)
        .map(r => ({
          id: `${r.start}-${r.empId}`,
          type: r.type,
          dates: `${r.start} → ${r.end}`,
          days: r.days,
          reason: r.reason,
          status: r.status,
          notes: r.notes || '',
          applicant: r.name || 'Unknown'
        }))
        .reverse();

      const teamPending = user.role === 'Manager' ? _mockLeaves
        .filter(r => r.status === 'Pending' && r.empId !== user.empId)
        .map(r => ({
          id: `${r.start}-${r.empId}`,
          type: r.type,
          dates: `${r.start} → ${r.end}`,
          days: r.days,
          reason: r.reason,
          status: r.status,
          applicant: r.name || 'User ' + r.empId
        })) : [];

      const teamHistory = user.role === 'Manager' ? _mockLeaves
        .filter(r => r.status !== 'Pending' && r.empId !== user.empId)
        .map(r => ({
          id: `${r.start}-${r.empId}`,
          type: r.type,
          dates: `${r.start} → ${r.end}`,
          days: r.days,
          reason: r.reason,
          status: r.status,
          notes: r.notes || '',
          applicant: r.name || 'User ' + r.empId
        })) : [];

      return { myHistory, teamPending, teamHistory };
    }

    let rows;
    try {
      rows = await sheet.getRows();
    } catch (err) {
      if (err.message.includes('Duplicate header detected')) {
        console.error('❌ LEAVE SHEET ERROR: Duplicate headers found. Column: ' + err.message.split('"')[1]);
        // Re-execute mock block logic manually if getRows fails
        return {
          myHistory: _mockLeaves.filter(r => r.empId === user.empId).reverse(),
          teamPending: [],
          teamHistory: []
        };
      }
      throw err;
    }

    const allRecords = rows.map(r => ({
      id: r.get('Timestamp') || '',
      empId: r.get('Employee ID') || '',
      applicant: r.get('Name') || '',
      type: r.get('Leave Purpose') || '-',
      dates: `${r.get('Start Date') || ''} → ${r.get('End Date') || ''}`,
      days: r.get('Total Days') || '-',
      reason: r.get('Reason for leave') || '-',
      status: r.get('Manager Status') || 'Pending',
      notes: r.get('Manager Notes') || '',
      responsible: r.get('Responsible Person (Inabsence)') || '',
      manager: r.get('Reporting Manager Name') || ''
    }));

    const myHistory = allRecords
      .filter(r => r.empId === user.empId)
      .reverse();

    let teamPending = [];
    let teamHistory = [];

    if (user.role === 'Manager') {
      teamPending = allRecords
        .filter(r => r.manager === user.name && r.status === 'Pending')
        .reverse();
      teamHistory = allRecords
        .filter(r => r.manager === user.name && r.status !== 'Pending')
        .reverse();
    }

    return { myHistory, teamPending, teamHistory };
  } catch (err) {
    console.error('getLeaveHistory error:', err);
    return { myHistory: [], teamPending: [], teamHistory: [] };
  }
}

export async function updateLeaveStatus(leaveId, status, notes, responsiblePerson = '') {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'Manager') {
      return { success: false, error: 'Unauthorized' };
    }

    const sheet = await getSheet('leave');

    if (sheet._mock) {
      const rec = _mockLeaves.find(r => `${r.start}-${r.empId}` === leaveId);
      if (rec) {
        rec.status = status;
        rec.notes = notes;
        rec.responsible = responsiblePerson;
      }
      revalidatePath('/leave');
      return { success: true };
    }

    const rows = await sheet.getRows();
    const targetRow = rows.find(r => r.get('Timestamp') === leaveId);

    if (targetRow) {
      targetRow.assign({
        'Manager Status': status,
        'Responsible Person (Inabsence)': responsiblePerson,
        'Manager Notes': notes
      });
      await targetRow.save();
      revalidatePath('/leave');
      return { success: true };
    }

    return { success: false, error: 'Request not found' };
  } catch (err) {
    console.error('updateLeaveStatus error:', err);
    return { success: false, error: err.message };
  }
}

export async function applyLeave(formData) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Not logged in.' };

    const sheet = await getSheet('leave');

    const startDate = formData.get('startDate') || '';
    const endDate = formData.get('endDate') || '';
    const totalDays = formData.get('totalDays') || '0';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    const declared = formData.get('declaration') === 'on' ? 'Yes' : 'No';

    // ── Mock Fallback ──
    if (sheet._mock) {
      _mockLeaves.push({
        empId: user.empId,
        type: formData.get('leaveType') || '',
        start: startDate,
        end: endDate,
        days: totalDays,
        reason: formData.get('reason') || '',
        status: 'Pending',
      });
      revalidatePath('/leave');
      return { success: true };
    }

    // Columns A → Q  matching the Leave sheet exactly
    await sheet.addRow({
      'Employee ID': user.empId,                              // A
      'Timestamp': timestamp,                               // B
      'Name': user.name,                               // C
      'Designation': formData.get('designation') || '',       // D
      'Leave Purpose': formData.get('leaveType') || '',       // E
      'Department': formData.get('department') || '',       // F
      'Start Date': startDate,                               // G
      'End Date': endDate,                                 // H
      'Total Days': totalDays,                               // I
      'Reason for leave': formData.get('reason') || '',       // J
      'Contact Info during absence': formData.get('emergencyContact') || '',  // K
      'Reporting Manager Name': formData.get('manager') || '',       // L
      'Replacement Person': formData.get('replacementPerson') || '', // M
      'Declaration': declared,                                // N
      'Will you be available for any work related queries during my leave period?':
        formData.get('availability') || '',      // O
      'Status': 'Pending',                               // P
      'Approval': '',                                      // Q
    });

    revalidatePath('/leave');
    return { success: true };
  } catch (err) {
    console.error('applyLeave error:', err);
    return { success: false, error: 'Server error. Please try again.' };
  }
}
// ── Profile Actions ────────────────────────────────────────────────────────────

export async function getProfileData() {
  try {
    const user = await getSessionUser();
    if (!user) return null;

    const sheet = await getSheet('EmployeeDetails');

    // ── Mock Fallback ──
    if (sheet._mock) {
      return {
        fullName: user.name,
        email: user.email,
        empId: user.empId,
        designation: 'Senior Developer', // Mock extra info
        contactNo: '9876543210',
        altContactNo: '',
        experienceLevel: 'Mid Level',
        address: '123 Mock Street, Apt 4B, Silicon Valley',
        dob: '1995-05-15',
        doj: '2022-01-10',
        idProof: 'PAN - ABCDE1234F',
        // Documents
        offerLetter: '', panCard: '', aadharCard: '', qualifications: '', joiningLetter: '', confirmationLetter: '',
        // Bank
        bankName: 'ICICI Bank',
        accountNo: '1234567890',
        ifscCode: 'ICIC0001234',
        branch: 'Mumbai Central',
        typeOfSaving: 'Savings',
        passbook: '',
        // Past Employment
        hasPrevExperience: false,
        prevCompany: '', prevStart: '', prevEnd: '', totalExp: '',
        prevDesignation: '', prevCtc: '', prevReason: '',
        hrName: '', hrContact: '', relievingLetter: 'No', expCertificate: 'No'
      };
    }

    const rows = await sheet.getRows();
    const matched = rows.find(r =>
      (r.get('Personal Email ID') || '').toLowerCase().trim() === user.email.toLowerCase().trim() ||
      (r.get('Employee ID') || '').trim() === user.empId.trim()
    );

    if (!matched) {
      // Return defaults if not found
      return { fullName: user.name, email: user.email, empId: user.empId };
    }

    return {
      fullName: matched.get('Full Name') || '',
      contactNo: matched.get('Personal Contact No') || '',
      altContactNo: matched.get('Alternate Contact No') || '',
      email: matched.get('Personal Email ID') || '',
      designation: matched.get('Designation') || '',
      experienceLevel: matched.get('Experience Level') || '',
      address: matched.get('Address') || '',
      dob: matched.get('Date of Birth') || '',
      doj: matched.get('Date of Joining') || '',
      idProof: matched.get('ID Proof (TYPE & NO)') || '',
      // Documents
      offerLetter: matched.get('Current Offer Letter') || '',
      panCard: matched.get('PAN CARD') || '',
      aadharCard: matched.get('AADHAR CARD') || '',
      qualifications: matched.get('QUALIFICATIONS') || '',
      joiningLetter: matched.get('JOINING LETTER (HR)') || '',
      confirmationLetter: matched.get('CONFIRMATION LETTER (HR)') || '',
      // Bank
      bankName: matched.get('BANK NAME') || '',
      accountNo: matched.get('ACCOUNT NO') || '',
      ifscCode: matched.get('IFSC CODE') || '',
      branch: matched.get('BRANCH') || '',
      typeOfSaving: matched.get('TYPE OF SAVING') || '',
      passbook: matched.get('UPLOAD PASSBOOK') || '',
      // Past Employment
      hasPrevExperience: matched.get('Has Previous Experience') === 'Yes',
      prevCompany: matched.get('PREVIOUS COMPANY NAME') || '',
      prevStart: matched.get('START DATE') || '',
      prevEnd: matched.get('END DATE') || '',
      totalExp: matched.get('TOTAL EXPERIENCE') || '',
      prevDesignation: matched.get('LAST DESIGNATION') || '',
      prevCtc: matched.get('LAST CTC') || '',
      prevReason: matched.get('REASON OF LEAVING') || '',
      hrName: matched.get('HR NAME') || '',
      hrContact: matched.get('HR CONTACT') || '',
      relievingLetter: matched.get('Relieving Letter') || 'No',
      expCertificate: matched.get('Exp Certificate') || 'No'
    };
  } catch (err) {
    console.error('getProfileData error:', err);
    return null;
  }
}

export async function saveProfileData(formData) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Session expired.' };

    const sheet = await getSheet('EmployeeDetails');
    const updates = {
      'Full Name': formData.get('fullName'),
      'Personal Contact No': formData.get('contactNo'),
      'Alternate Contact No': formData.get('altContactNo'),
      'Personal Email ID': formData.get('email'),
      'Designation': formData.get('designation'),
      'Experience Level': formData.get('experienceLevel'),
      'Address': formData.get('address'),
      'Date of Birth': formData.get('dob'),
      'Date of Joining': formData.get('doj'),
      'ID Proof (TYPE & NO)': formData.get('idProof'),
      // Documents
      'Current Offer Letter': formData.get('offerLetter'),
      'PAN CARD': formData.get('panCard'),
      'AADHAR CARD': formData.get('aadharCard'),
      'QUALIFICATIONS': formData.get('qualifications'),
      'JOINING LETTER (HR)': formData.get('joiningLetter'),
      'CONFIRMATION LETTER (HR)': formData.get('confirmationLetter'),
      // Bank
      'BANK NAME': formData.get('bankName'),
      'ACCOUNT NO': formData.get('accountNo'),
      'IFSC CODE': formData.get('ifscCode'),
      'BRANCH': formData.get('branch'),
      'TYPE OF SAVING': formData.get('typeOfSaving'),
      'UPLOAD PASSBOOK': formData.get('passbook'),
      // Past Experience
      'Has Previous Experience': formData.get('hasPrevExperience') === 'on' ? 'Yes' : 'No',
      'PREVIOUS COMPANY NAME': formData.get('prevCompany'),
      'START DATE': formData.get('prevStart'),
      'END DATE': formData.get('prevEnd'),
      'TOTAL EXPERIENCE': formData.get('totalExp'),
      'LAST DESIGNATION': formData.get('prevDesignation'),
      'LAST CTC': formData.get('prevCtc'),
      'REASON OF LEAVING': formData.get('prevReason'),
      'HR NAME': formData.get('hrName'),
      'HR CONTACT': formData.get('hrContact'),
      'Relieving Letter': formData.get('relievingLetter'),
      'Exp Certificate': formData.get('expCertificate'),
      'Employee ID': user.empId // Keep consistent
    };

    if (sheet._mock) {
      console.log('✅ Mock Profile Saved:', updates);
      revalidatePath('/profile');
      return { success: true };
    }

    const rows = await sheet.getRows();
    let targetRow = rows.find(r =>
      (r.get('Personal Email ID') || '').toLowerCase().trim() === user.email.toLowerCase().trim() ||
      (r.get('Employee ID') || '').trim() === user.empId.trim()
    );

    if (targetRow) {
      targetRow.assign(updates);
      await targetRow.save();
    } else {
      // Create new record
      await sheet.addRow(updates);
    }

    revalidatePath('/profile');
    return { success: true };
  } catch (err) {
    console.error('saveProfileData error:', err);
    return { success: false, error: err.message };
  }
}

// ── File Management Actions ────────────────────────────────────────────────────

/**
 * Handle document uploads for user profiles.
 * Saves to public/uploads and returns the relative URL.
 */
export async function uploadProfileFile(formData) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Session expired.' };

    const file = formData.get('file');
    const category = (formData.get('category') || 'document').toUpperCase();

    if (!file || !(file instanceof Blob)) {
      return { success: false, error: 'No file provided or invalid format.' };
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename: EMP102_PANCARD_12345_docs.ext
    const ext = path.extname(file.name) || '.pdf';
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 15);
    const filename = `${user.empId}_${category}_${timestamp}_${safeName}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure directory exists
    try {
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (e) {
      // ignore
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    console.log(`✅ File Uploaded: ${filename}`);
    return { success: true, url: `/uploads/${filename}` };
  } catch (err) {
    console.error('uploadProfileFile error:', err);
    return { success: false, error: err.message };
  }
}

