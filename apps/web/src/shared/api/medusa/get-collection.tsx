import React from 'react'

import { sdk } from '@/lib/api/sdk'
import { useQuery } from '@tanstack/react-query'
import { COLLECTIONS_MEDUSA_QUERY_KEY } from '@/shared/utils/query-keys'


const getCollection = async () => {
  const { collections, count, limit, offset } = await sdk.store.collection.list()
  console.log(collections)
  return collections
}


export const useGetCollection = () =>{
  return useQuery({
    queryKey: [COLLECTIONS_MEDUSA_QUERY_KEY],
    queryFn: getCollection,
  });
}


export default getCollection