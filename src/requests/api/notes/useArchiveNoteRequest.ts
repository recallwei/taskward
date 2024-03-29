import { useMutation, useQueryClient } from '@tanstack/react-query'

import { axiosService, NOTES_KEY, ARCHIVE_KEY } from '@/requests'

const useArchiveNoteRequest = () => {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isLoading, isSuccess, isError } = useMutation(
    async (id: number): Promise<any> => {
      const response = await axiosService({
        method: 'PUT',
        url: `notes/${id}/archive`
      })
      return response.data
    },
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries([NOTES_KEY]),
          queryClient.invalidateQueries([ARCHIVE_KEY])
        ])
      }
    }
  )

  return { mutate, mutateAsync, isLoading, isSuccess, isError }
}

export default useArchiveNoteRequest
