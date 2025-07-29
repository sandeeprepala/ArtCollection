import { ArtworkResponse } from '../types/artwork';

const API_BASE_URL = 'https://api.artic.edu/api/v1';

export const fetchArtworks = async (page: number, limit: number = 12): Promise<ArtworkResponse> => {
  try {
    const fields = [
      'id',
      'title', 
      'place_of_origin',
      'artist_display',
      'inscriptions',
      'date_start',
      'date_end'
    ].join(',');
    
    const response = await fetch(
      `${API_BASE_URL}/artworks?page=${page}&limit=${limit}&fields=${fields}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};