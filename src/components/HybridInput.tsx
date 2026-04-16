import React from 'react';

interface HybridInputProps {
  label: string;
  labelChinese: string;
  fieldName: string;
  fieldData: { type: 'text' | 'image'; value: string };
  onTypeChange: (fieldName: string, type: 'text' | 'image') => void;
  onValueChange: (fieldName: string, value: string) => void;
  onFileChange: (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onChooseFromLibrary?: () => void;
}

const HybridInput: React.FC<HybridInputProps> = ({ 
  label, 
  labelChinese, 
  fieldName, 
  fieldData, 
  onTypeChange, 
  onValueChange, 
  onFileChange,
  onChooseFromLibrary 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}<span className="block text-xs text-gray-500">{labelChinese}</span></label>
      <div className="flex items-center gap-2 mt-1">
        <label className="text-sm">
          <input type="radio" name={`${fieldName}-type`} value="text" checked={fieldData.type === 'text'} onChange={() => onTypeChange(fieldName, 'text')} className="mr-1"/>
          Text
        </label>
        <label className="text-sm">
          <input type="radio" name={`${fieldName}-type`} value="image" checked={fieldData.type === 'image'} onChange={() => onTypeChange(fieldName, 'image')} className="mr-1"/>
          Image
        </label>
      </div>
      {fieldData.type === 'text' ? (
        <input type="text" value={fieldData.value} onChange={(e) => onValueChange(fieldName, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
      ) : (
        <input type="file" onChange={(e) => onFileChange(fieldName, e)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
      )}
      {onChooseFromLibrary && (
        <button onClick={onChooseFromLibrary} className="mt-2 p-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Choose from Library</button>
      )}
    </div>
  );
};

export default HybridInput;
