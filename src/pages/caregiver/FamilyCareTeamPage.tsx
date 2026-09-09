import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, ShieldAlert, Star, Trash2, CheckCircle2, Edit2, AlertOctagon } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { db } from '../../services/db';
import { FamilyMember } from '../../types';

export const FamilyCareTeamPage: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>(db.getFamilyMembers());
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New member form fields
  const [name, setName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('+91 ');
  const [email, setEmail] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [isEmergency, setIsEmergency] = useState<boolean>(true);
  const [canReceiveAlerts, setCanReceiveAlerts] = useState<boolean>(true);
  const [canReceiveReports, setCanReceiveReports] = useState<boolean>(true);

  useEffect(() => {
    return db.subscribe(() => {
      setMembers(db.getFamilyMembers());
    });
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    db.addFamilyMember({
      patientId: 'patient-anita-123',
      name,
      relationship,
      phoneNumber,
      email: email || undefined,
      priority: isPrimary ? 1 : members.length + 1,
      isPrimaryCaregiver: isPrimary,
      isEmergencyContact: isEmergency,
      canReceiveAlerts,
      canReceiveReports,
      canContactPatient: true,
      photoUrl: '/images/person_daughter_sunita.jpg'
    });

    setIsAdding(false);
    setName('');
    setRelationship('');
    setPhoneNumber('+91 ');
    setEmail('');
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Remove this family member from the care team?')) {
      db.deleteFamilyMember(id);
    }
  };

  const handleToggleEmergency = (id: string, currentVal: boolean) => {
    db.updateFamilyMember(id, { isEmergencyContact: !currentVal });
  };

  const handleTogglePrimary = (id: string) => {
    members.forEach(m => {
      db.updateFamilyMember(m.id, { isPrimaryCaregiver: m.id === id });
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider font-heading">
            Care Network & Safety
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
            Family & Care Team
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Manage authorized family members, emergency calling contacts, and report recipients.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="clay-btn-primary px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-clay-primary self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>{isAdding ? 'Cancel' : 'Add Family Member'}</span>
        </button>
      </div>

      {/* Add Member Form */}
      {isAdding && (
        <ClayCard padding="lg" className="border-2 border-[#6C63FF]/30 shadow-clay-card">
          <form onSubmit={handleAddMember} className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-slate-800 font-heading">
              New Care Team Member
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
                <span>Full Name *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meena Sharma"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
                <span>Relationship to Patient *</span>
                <input
                  type="text"
                  required
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Sister, Granddaughter, Nurse"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
                <span>Phone Number (Indian / International) *</span>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
                <span>Email Address (Optional)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </label>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="rounded text-[#6C63FF] focus:ring-[#6C63FF]"
                />
                <span>Designate as Emergency SOS Contact</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded text-[#6C63FF] focus:ring-[#6C63FF]"
                />
                <span>Set as Primary Family Caregiver</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canReceiveAlerts}
                  onChange={(e) => setCanReceiveAlerts(e.target.checked)}
                  className="rounded text-[#6C63FF] focus:ring-[#6C63FF]"
                />
                <span>Can Receive Meaningful Change Alerts</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canReceiveReports}
                  onChange={(e) => setCanReceiveReports(e.target.checked)}
                  className="rounded text-[#6C63FF] focus:ring-[#6C63FF]"
                />
                <span>Can Receive Weekly Activity Reports</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-btn-primary px-6 py-2.5 rounded-xl text-xs font-black shadow-md"
              >
                Save Member
              </button>
            </div>
          </form>
        </ClayCard>
      )}

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => (
          <ClayCard key={member.id} padding="lg" className="border-2 border-white shadow-clay-card flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.photoUrl || '/images/person_son_gaurav.jpg'}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-black text-slate-800 font-heading">{member.name}</h3>
                      {member.isPrimaryCaregiver && (
                        <span title="Primary Caregiver">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-[#6C63FF]">{member.relationship}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${member.phoneNumber}`} className="hover:text-[#6C63FF] text-slate-800 font-extrabold">
                    {member.phoneNumber}
                  </a>
                </div>
                {member.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
              </div>

              {/* Tags & Roles */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {member.isEmergencyContact && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-rose-600" />
                    SOS Contact
                  </span>
                )}
                {member.isPrimaryCaregiver && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                    Primary Caregiver
                  </span>
                )}
                {member.canReceiveAlerts && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                    Receives Alerts
                  </span>
                )}
              </div>

              {member.notes && (
                <p className="text-[11px] font-bold text-slate-500 italic mt-1">
                  "{member.notes}"
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => handleToggleEmergency(member.id, member.isEmergencyContact)}
                className={`font-extrabold ${member.isEmergencyContact ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {member.isEmergencyContact ? 'Emergency Active' : '+ Set Emergency'}
              </button>

              {!member.isPrimaryCaregiver && (
                <button
                  onClick={() => handleTogglePrimary(member.id)}
                  className="font-extrabold text-[#6C63FF] hover:underline"
                >
                  Make Primary
                </button>
              )}
            </div>
          </ClayCard>
        ))}
      </div>
    </div>
  );
};
