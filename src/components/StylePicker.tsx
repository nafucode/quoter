import React from 'react';

interface Style {
  id: string;
  name: string;
  previewImage: string;
}

interface StylePickerProps {
  styles: Style[];
  onSelect: (style: Style) => void;
  onClose: () => void;
  title: string;
}

const StylePicker: React.FC<StylePickerProps> = ({ styles, onSelect, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-3/4 max-h-[80vh]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-100px)] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
          {styles.map(style => (
            <div 
              key={style.id} 
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-500 transition-all duration-200 group"
              onClick={() => {
                onSelect(style);
                onClose();
              }}
            >
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <img src={style.previewImage} alt={style.name} className="max-h-full max-w-full object-contain"/>
              </div>
              <div className="p-2 bg-gray-50 group-hover:bg-blue-500 group-hover:text-white">
                <p className="text-sm font-semibold text-center">{style.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StylePicker;
