import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Artwork, LazyTableState } from '../types/artwork';
import { fetchArtworks } from '../services/artworkService';
import { useArtworkSelection } from '../hooks/useArtworkSelection';
import { SelectedRowsPanel } from './SelectedRowsPanel';
import { SelectRowsDropdown } from './SelectRowsDropdown';

export const ArtworkDataTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingRows, setSelectingRows] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState<LazyTableState>({
    first: 0,
    rows: 12,
    page: 1,
  });

  const toast = useRef<Toast>(null);
  
  const {
    add,
    remove,
    selectCount,
    clear,
    isSelected,
    getSelected,
    getCount
  } = useArtworkSelection();

  const loadArtworks = useCallback(async (page: number, rows: number) => {
    setLoading(true);
    try {
      const response = await fetchArtworks(page, rows);
      setArtworks(response.data);
      setTotalRecords(response.pagination.total);
    } catch (error) {
      console.error('Failed to load artworks:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load artworks. Please try again.',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtworks(lazyState.page, lazyState.rows);
  }, [lazyState.page, lazyState.rows, loadArtworks]);

  const selectAcrossPages = useCallback(async (targetCount: number) => {
    setSelectingRows(true);
    let remaining = targetCount;
    let currentPage = lazyState.page;
    let allToSelect: Artwork[] = [];

    try {
      while (remaining > 0) {
        const response = await fetchArtworks(currentPage, lazyState.rows);
        const pageData = response.data;
        
        if (pageData.length === 0) {
          break;
        }

        const fromPage = pageData.slice(0, remaining);
        allToSelect.push(...fromPage);
        remaining -= fromPage.length;
        currentPage++;
      }

      add(allToSelect);

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `Selected ${allToSelect.length} artworks across pages`,
        life: 3000,
      });

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to select rows',
        life: 3000,
      });
    } finally {
      setSelectingRows(false);
    }
  }, [lazyState.page, lazyState.rows, add]);

  const handleSelectRows = useCallback((count: number) => {
    if (count <= artworks.length) {
      selectCount(artworks, count);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `Selected ${Math.min(count, artworks.length)} artworks`,
        life: 3000,
      });
    } else {
      selectAcrossPages(count);
    }
  }, [artworks, selectCount, selectAcrossPages]);

  const onPage = (event: any) => {
    const newPage = event.page + 1;
    setLazyState({
      first: event.first,
      rows: event.rows,
      page: newPage,
    });
  };

  const onSelectionChange = (e: any) => {
    const selectedRows = e.value;
    const pageIds = artworks.map(artwork => artwork.id);
    
    remove(pageIds);
    
    if (selectedRows.length > 0) {
      add(selectedRows);
    }
  };

  const getPageSelection = () => {
    return artworks.filter(artwork => isSelected(artwork.id));
  };

  const handleSubmitSelection = () => {
    const selected = getSelected();
    console.log('Selected Artworks:', selected);
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: `Submitted ${selected.length} artworks to console`,
      life: 3000,
    });
  };

  const handleClearSelection = () => {
    clear();
    toast.current?.show({
      severity: 'info',
      summary: 'Cleared',
      detail: 'Selection cleared',
      life: 3000,
    });
  };

  const headerTemplate = () => (
    <div className="flex items-center gap-1">
      <SelectRowsDropdown 
        onSelectRows={handleSelectRows}
        disabled={loading || selectingRows}
      />
    </div>
  );

  const titleTemplate = (rowData: Artwork) => (
    <div className="max-w-xs">
      <div className="font-medium text-gray-900 line-clamp-2">
        {rowData.title || 'Untitled'}
      </div>
    </div>
  );

  const artistTemplate = (rowData: Artwork) => (
    <div className="max-w-xs">
      <div className="text-gray-700 line-clamp-2">
        {rowData.artist_display || 'Unknown Artist'}
      </div>
    </div>
  );

  const originTemplate = (rowData: Artwork) => (
    <div className="text-gray-600">
      {rowData.place_of_origin || 'Unknown Origin'}
    </div>
  );

  const inscriptionsTemplate = (rowData: Artwork) => (
    <div className="max-w-xs">
      <div className="text-gray-600 text-sm line-clamp-2">
        {rowData.inscriptions || 'No inscriptions'}
      </div>
    </div>
  );

  const dateTemplate = (rowData: Artwork) => {
    const startDate = rowData.date_start;
    const endDate = rowData.date_end;
    
    if (!startDate && !endDate) return <span className="text-gray-400">Unknown</span>;
    if (startDate === endDate) return <span>{startDate}</span>;
    if (startDate && endDate) return <span>{startDate} - {endDate}</span>;
    if (startDate) return <span>c. {startDate}</span>;
    return <span>- {endDate}</span>;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toast ref={toast} />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Art Institute of Chicago Collection
          </h1>
          <p className="text-gray-600">
            Browse and select artworks from the collection. Selection persists across pages.
          </p>
          {getCount() > 0 && (
            <div className="mt-2 text-sm text-blue-600">
              {getCount()} artwork{getCount() !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <div className="relative">
          {(loading || selectingRows) && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                {selectingRows && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selecting rows across pages...
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DataTable
            value={artworks}
            lazy
            paginator
            rows={lazyState.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading || selectingRows}
            first={lazyState.first}
            selection={getPageSelection()}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            rowHover
            stripedRows
            className="w-full"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
            rowsPerPageOptions={[12, 24, 48]}
            emptyMessage="No artworks found"
            size="small"
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{ width: '4rem' }}
              header={headerTemplate}
            />
            
            <Column
              field="title"
              header="Title"
              body={titleTemplate}
              style={{ minWidth: '200px' }}
              sortable={false}
            />
            
            <Column
              field="artist_display"
              header="Artist"
              body={artistTemplate}
              style={{ minWidth: '180px' }}
              sortable={false}
            />
            
            <Column
              field="place_of_origin"
              header="Origin"
              body={originTemplate}
              style={{ minWidth: '120px' }}
              sortable={false}
            />
            
            <Column
              field="inscriptions"
              header="Inscriptions"
              body={inscriptionsTemplate}
              style={{ minWidth: '150px' }}
              sortable={false}
            />
            
            <Column
              header="Date"
              body={dateTemplate}
              style={{ minWidth: '100px' }}
              sortable={false}
            />
          </DataTable>
        </div>
      </div>

      <SelectedRowsPanel
        selectedArtworks={getSelected()}
        onSubmit={handleSubmitSelection}
        onClear={handleClearSelection}
      />
    </div>
  );
};