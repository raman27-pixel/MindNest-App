import React, { useState } from 'react';
import { Bell, Plus, Clock, Droplet, Flower2, PhoneCall, CheckCircle2 } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { ClayInput } from '../../components/ui/ClayInput';
import { db } from '../../services/db';
import { CaregiverReminder } from '../../types';

export const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<CaregiverReminder[]>(db.getReminders());
  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('03:00 PM');
  const [gentleMessage, setGentleMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleToggle = (id: string) => {
    db.toggleReminder(id);
    setReminders(db.getReminders());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    db.addReminder({
      patientId: 'patient-anita-123',
      title,
      category: 'ROUTINE',
      scheduledTime,
      active: true,
      repeatDaily: true,
      iconName: 'Bell',
      gentleMessage: gentleMessage || title
    });

    setReminders(db.getReminders());
    setTitle('');
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
            Gentle Reminders & Check-Ins
          </h1>
          <p className="text-base font-bold text-slate-500 mt-1">
            Configure hydration prompts, garden visits, and family call reminders for Anita.
          </p>
        </div>

        <ClayButton
          variant="primary"
          size="md"
          onClick={() => setShowForm(!showForm)}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Reminder
        </ClayButton>
      </div>

      {/* Add Reminder Form */}
      {showForm && (
        <ClayCard padding="lg" className="flex flex-col gap-4 border-2 border-[#6C63FF]/30">
          <h3 className="text-xl font-black text-slate-800 font-heading">New Gentle Reminder</h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <ClayInput
              label="Reminder Title *"
              placeholder="e.g. Evening Hydration Check"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ClayInput
                label="Scheduled Time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
              <ClayInput
                label="Gentle Patient Message"
                placeholder="e.g. Time for a little water 💧"
                value={gentleMessage}
                onChange={(e) => setGentleMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <ClayButton variant="neutral" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </ClayButton>
              <ClayButton variant="primary" size="sm" type="submit">
                Save Reminder
              </ClayButton>
            </div>
          </form>
        </ClayCard>
      )}

      {/* Reminders List */}
      <div className="flex flex-col gap-4">
        {reminders.map((rem) => (
          <ClayCard key={rem.id} padding="lg" className="flex items-center justify-between gap-4 border-2 border-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bell className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-amber-700">{rem.scheduledTime}</span>
                  <span className="text-xs font-bold text-slate-400">• Daily Repeat</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 font-heading">{rem.title}</h3>
                <p className="text-sm font-semibold text-slate-600 font-mono bg-amber-50 px-2 py-0.5 rounded-lg w-fit mt-1">
                  "{rem.gentleMessage}"
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggle(rem.id)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-colors ${
                rem.active ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {rem.active ? 'ACTIVE' : 'PAUSED'}
            </button>
          </ClayCard>
        ))}
      </div>
    </div>
  );
};
