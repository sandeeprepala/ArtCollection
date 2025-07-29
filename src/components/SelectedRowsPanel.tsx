import React from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Artwork } from '../types/artwork';

interface SelectedRowsPanelProps {
  selectedArtworks: Artwork[];
  onSubmit: () => void;
  onClear: () => void;
}

export const SelectedRowsPanel: React.FC<SelectedRowsPanelProps> = ({
  selectedArtworks,
  onSubmit,
  onClear
}) => {
  if (selectedArtworks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in">
      <Panel 
        header={
          <div className="flex items-center gap-2">
            <span>Selected Artworks</span>
            <Badge value={selectedArtworks.length} severity="info" />
          </div>
        }
        className="shadow-lg"
      >
        <div className="flex gap-2">
          <Button
            label="Submit Selection"
            icon="pi pi-check"
            onClick={onSubmit}
            className="flex-1"
            size="small"
          />
          <Button
            label="Clear"
            icon="pi pi-times"
            severity="secondary"
            onClick={onClear}
            size="small"
          />
        </div>
      </Panel>
    </div>
  );
};