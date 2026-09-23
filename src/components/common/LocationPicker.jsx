import React from 'react';

export const LocationPicker = ({ name, value, onChange }) => {
  const [provinces, setProvinces] = React.useState([]);
  const [regencies, setRegencies] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);

  const [selectedProv, setSelectedProv] = React.useState('');
  const [selectedReg, setSelectedReg] = React.useState('');
  const [selectedDist, setSelectedDist] = React.useState('');

  const [regencyName, setRegencyName] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(!value);

  React.useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(() => {});
  }, []);

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleProvChange = (e) => {
    const provId = e.target.value;
    setSelectedProv(provId);
    setSelectedReg('');
    setSelectedDist('');
    setRegencies([]);
    setDistricts([]);
    onChange('');
    if (provId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`)
        .then(res => res.json())
        .then(data => setRegencies(data));
    }
  };

  const handleRegChange = (e) => {
    const regId = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedReg(regId);
    setRegencyName(name);
    setSelectedDist('');
    setDistricts([]);
    onChange('');
    if (regId) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regId}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data));
    }
  };

  const handleDistChange = (e) => {
    const distId = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedDist(distId);
    
    if (distId) {
      onChange(`${toTitleCase(name)}, ${toTitleCase(regencyName)}`);
      setIsEditing(false);
    } else {
      onChange('');
    }
  };

  if (!isEditing && value) {
    return (
      <>
        {name && <input type="hidden" name={name} value={value || ""} />}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-sm font-medium text-slate-800">{value}</span>
        <button type="button" onClick={() => setIsEditing(true)} className="text-xs font-bold text-blue-600 hover:text-blue-700">Ubah</button>
      </div>
      </>
    );
  }

  return (
    <div className="space-y-2">
      {name && <input type="hidden" name={name} value={value || ""} />}
      <select className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={selectedProv} onChange={handleProvChange}>
        <option value="">-- Pilih Provinsi --</option>
        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      
      {selectedProv && (
        <select className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={selectedReg} onChange={handleRegChange}>
          <option value="">-- Pilih Kota/Kabupaten --</option>
          {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      )}

      {selectedReg && (
        <select className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={selectedDist} onChange={handleDistChange}>
          <option value="">-- Pilih Kecamatan --</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      )}
    </div>
  );
};

export default LocationPicker;
