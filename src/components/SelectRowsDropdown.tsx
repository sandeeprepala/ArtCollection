import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';

interface Props {
  onSelectRows: (count: number) => void;
  disabled?: boolean;
}

export const SelectRowsDropdown: React.FC<Props> = ({
  onSelectRows,
  disabled
}) => {
  const [count, setCount] = useState<number | null>(null);
  const overlayRef = useRef<OverlayPanel>(null);

  const handleSubmit = () => {
    if (count && count > 0) {
      onSelectRows(count);
      overlayRef.current?.hide();
      setCount(null);
    }
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div>
      <Button
        icon="pi pi-chevron-down"
        className="p-button-text p-button-sm"
        onClick={(e) => overlayRef.current?.toggle(e)}
        disabled={disabled}
      />
      
      <OverlayPanel ref={overlayRef}>
        <div className="p-3" style={{ width: '200px' }}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">
              Select rows...
            </label>
            <InputNumber
              value={count}
              onValueChange={(e) => setCount(e.value)}
              placeholder="Enter number"
              min={1}
              max={1000}
              className="w-full"
              onKeyPress={onKeyPress}
              autoFocus
            />
          </div>
          <Button
            label="Submit"
            onClick={handleSubmit}
            className="w-full"
            size="small"
            disabled={!count || count <= 0}
          />
        </div>
      </OverlayPanel>
    </div>
  );
};