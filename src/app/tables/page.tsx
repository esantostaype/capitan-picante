import { OrderTables } from '../components'
import floorsData from '@/data/floors.json'

export default async function TablesPage() {
  return (
    <OrderTables floors={ floorsData } />
  )
}