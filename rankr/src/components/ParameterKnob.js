'use client';
import { useRef, useState, useEffect } from 'react';

export default function ParameterKnob({ themeColor = 'blue', onChange }) {
  const knobRef = useRef(null);
  const [value, setValue] = useState(0);
  const [angle, setAngle] = useState(-135); // Start angle

  const minAngle = -135;
  const maxAngle = 135;
  const minValue = 0;
  const maxValue = 20;

  const anglePerStep = (maxAngle - minAngle) / (maxValue - minValue);

  const updateValueFromAngle = (newAngle) => {
    const clampedAngle = Math.max(minAngle, Math.min(maxAngle, newAngle));
    const newValue = Math.round((clampedAngle - minAngle) / anglePerStep);
    setValue(newValue);
    setAngle(clampedAngle);
    if (onChange) onChange(newValue);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const center = knobRef.current.getBoundingClientRect();
    const originX = center.left + center.width / 2;
    const originY = center.top + center.height / 2;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - originX;
      const dy = moveEvent.clientY - originY;
      const radians = Math.atan2(dy, dx);
      const deg = radians * (180 / Math.PI);
      updateValueFromAngle(deg);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const rotation = `rotate(${angle}deg)`;

  return (
    <div className="flex flex-col items-center">
      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        className="w-32 h-32 rounded-full border-4 border-gray-300 relative cursor-pointer select-none"
        style={{
          background: `conic-gradient(${themeColor} 0% ${((value / 20) * 100).toFixed(0)}%, #e5e7eb 0%)`,
        }}
      >
        <div
          className={`absolute left-1/2 top-1/2 w-1 h-12 bg-${themeColor}-600 origin-bottom`}
          style={{
            transform: `${rotation} translate(-50%, -100%)`,
            borderRadius: '2px',
          }}
        />
      </div>
      <p className="mt-4 text-xl font-bold text-gray-800">Value: {value}</p>
    </div>
  );
}
