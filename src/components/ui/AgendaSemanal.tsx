import React, { useState } from 'react';

type UserType = 'professor' | 'atleta' | "gestor";

interface ScheduleProps {
  userType: UserType;
}

interface DayNote {
  day: string;
  note: string;
}

const initialNotes: DayNote[] = [
  { day: 'Segunda', note: '' },
  { day: 'Terça', note: '' },
  { day: 'Quarta', note: '' },
  { day: 'Quinta', note: '' },
  { day: 'Sexta', note: '' },
  { day: 'Sábado', note: '' },
];

const AgendaSemanal: React.FC<ScheduleProps> = ({ userType }) => {
  const [notes, setNotes] = useState<DayNote[]>(initialNotes);

  const handleNoteChange = (index: number, value: string) => {
    if (userType === 'professor' || "gestor") {
      const updatedNotes = [...notes];
      updatedNotes[index].note = value;
      setNotes(updatedNotes);
    }
  };

  return (
    <div className="bg-gray-200 p-3 pt-0 rounded-md">
      <div className="grid grid-cols-6 gap-4">
        {notes.map((dayNote, index) => (
          <div key={index} className="bg-gray-200 p-2 rounded text-center">
            <h3 className="font-semibold">{dayNote.day}</h3>
            {userType === 'professor' ? (
              <textarea
                className="mt-2 w-full p-2 border rounded bg-gray-200"
                value={dayNote.note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                placeholder=""
              />
            ) : (
              <p className="mt-2 text-gray-700">{dayNote.note || ""}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaSemanal;
