'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessLocationPayload {
  name: string;
  address: string;
  business_id: string;
}

export interface UpdateBusinessLocationPayload {
  name?: string;
  address?: string;
}

// --- API Functions ---
const fetchBusinessLocations = async (businessId: string): Promise<BusinessLocation[]> => {
  const res = await customFetch(`/businesses/${businessId}/locations/`);
  if (!res.ok) {
    throw new Error('Failed to fetch business locations');
  }
  return res.json();
};

const fetchBusinessLocation = async (id: string): Promise<BusinessLocation> => {
  const res = await customFetch(`/businesses/locations/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch business location');
  }
  return res.json();
};

const createBusinessLocation = async (payload: CreateBusinessLocationPayload): Promise<BusinessLocation> => {
  const res = await customFetch(`/businesses/${payload.business_id}/locations/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create business location');
  }
  return res.json();
};

const updateBusinessLocation = async ({ id, payload }: { id: string; payload: UpdateBusinessLocationPayload }): Promise<BusinessLocation> => {
  const res = await customFetch(`/businesses/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update business location');
  }
  return res.json();
};

const deleteBusinessLocation = async (id: string): Promise<void> => {
  const res = await customFetch(`/businesses/locations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete business location');
  }
};

// --- Main Hook ---
export function useBusinessLocations(businessId?: string) {
  const queryClient = useQueryClient();

  // Query for business locations
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ['business-locations', businessId],
    queryFn: () => fetchBusinessLocations(businessId!),
    enabled: !!businessId,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for single location
  const useBusinessLocation = (id: string) => {
    return useQuery({
      queryKey: ['business-locations', 'single', id],
      queryFn: () => fetchBusinessLocation(id),
      enabled: !!id,
    });
  };

  // Mutation for creating location
  const { mutate: createLocationMutation, isPending: isCreating } = useMutation({
    mutationFn: createBusinessLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      toast.success('Ubicación creada exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating location
  const { mutate: updateLocationMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateBusinessLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      toast.success('Ubicación actualizada exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting location
  const { mutate: deleteLocationMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteBusinessLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      toast.success('Ubicación eliminada exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get location by ID
  const getLocationById = (id: string) => {
    return locations.find(location => location.id === id);
  };

  return {
    locations,
    isLoading,
    error,
    useBusinessLocation,
    createLocation: createLocationMutation,
    updateLocation: updateLocationMutation,
    deleteLocation: deleteLocationMutation,
    isCreating,
    isUpdating,
    isDeleting,
    getLocationById,
  };
}
