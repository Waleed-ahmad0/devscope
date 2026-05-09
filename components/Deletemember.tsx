'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
interface Userdata {
  firstName: string;
  lastName?: string;
  _id: string;
  email: string;
}
interface Member {
  user: Userdata;
  role: "admin" | "member";
  _id?: string;
}

interface DeleteMemberModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
}

export default function DeleteMemberModal({id, isOpen, onClose, members }: DeleteMemberModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === members.length ? [] : members.map(m => m.user._id));
  };

  const handleDelete = async() => {
    const selected = members.filter(m => selectedIds.includes(m.user._id));
    console.log('Members to delete:', selected);
    const req= await fetch(`/api/teams/${id}`,{
      method:"DELETE",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({selected})   
    })
    const res= await req.json()
    console.log('res',res);
    if(req.ok){
      setSelectedIds([]);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative">

        {/* Close */}
        <button
          onClick={handleCancel}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:text-slate-400 transition-colors"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-900 mb-6">delete member</h1>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-2 mb-6">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-blue-800 text-sm font-medium">You will remain the team admin</p>
        </div>

        {/* Members */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 dark:text-slate-300">Members</span>
            <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedIds.length === members.length && members.length > 0}
                onChange={toggleAll}
                className="accent-blue-600 w-3.5 h-3.5"
              />
              Select all
            </label>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {members.map(member => (
              <label
                key={member._id}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.user._id)}
                  onChange={() => toggleOne(member.user._id)}
                  className="accent-blue-600 w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 dark:text-slate-300 truncate flex-1">{member.user.email}</span>
                <span className="text-xs text-slate-400">{member.role}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <p className="text-xs text-red-500 mt-2 mb-4">{selectedIds.length} member{selectedIds.length > 1 ? 's' : ''} selected</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            delete member{selectedIds.length > 1 ? 's' : ''}
          </button>
        </div>

      </div>
    </div>
  );
}