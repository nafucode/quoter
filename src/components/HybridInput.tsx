import React from 'react';

interface HybridInputProps {
  label: string;
  labelChinese: string;
  fieldName: string;
  fieldData: { type: 'text' | 'image'; value: string };
  onChange: (fieldName: string, property: 'type' | 'value', value: any) => void;
}

const HybridInput: React.FC<HybridInputProps> = ({ label, labelChinese, fieldName, fieldData, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(fieldName, 'value', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}<span className="block text-xs text-gray-500">{labelChinese}</span></label>
      <div className="flex items-center gap-2 mt-1">
        <label className="text-sm">
          <input
            type="radio"
            name={`${fieldName}-type`}
            value="text"
            checked={fieldData.type === 'text'}
            onChange={() => onChange(fieldName, 'type', 'text')}
            className="mr-1"
          />
          Text
        </label>
        <label className="text-sm">
          <input
            type="radio"
            name={`${fieldName}-type`}
            value="image"
            checked={fieldData.type === 'image'}
            onChange={() => onChange(fieldName, 'type', 'image')}
            className="mr-1"
          />
          Image
        </label>
      </div>
      {fieldData.type === 'text' ? (
        <input
          type="text"
          value={fieldData.value}
          onChange={(e) => onChange(fieldName, 'value', e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      ) : (
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      )}
    </div>
  );
};

export default HybridInput;
