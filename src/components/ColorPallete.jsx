import React from 'react';

const colors = [
  'primary-one',
  'primary-two',
  'neutral-one',
  'neutral-two',
  'accent',
  'copy-primary'
];

const ColorPallete = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {colors.map((color) => (
        <div key={color} 
        className={`p-4 ${color === 'copy-primary' ? 'bg-primary-one' : `bg-${color}`} text-white rounded`}>
          <p className="text-center text-copy-primary">{color}</p>
        </div>
      ))}
    </div>
  )
}

export default ColorPallete;