'use client'
import { RestaurantTable } from '@/components'
import { useEffect, useState } from 'react'
import { TabPanel, Tabs } from 'react-tabs'
import { useOrderStore } from '@/store/order-store'
import { Floor } from '@/interfaces'

interface Props {
  floors: Floor[]
}

export const OrderTables = ({ floors }: Props) => {

  const [ tabFloorIndex, setTabFloorIndex ] = useState(0)
  const {
    selectedFloorId,
    selectedFloorName,
    setSelectedFloorId,
    setSelectedFloorName,
    selectedTableId,
    setSelectedTableId,
    setSelectedTableNumber
  } = useOrderStore()

  useEffect(() => {
    if ( floors ) {
      setSelectedFloorId( floors[0].id || null )
      setSelectedFloorName( floors[0].name || null )
    }
  }, [ selectedFloorId, setSelectedFloorId, setSelectedFloorName, selectedFloorName, floors ])

  return (
    <div>
      <Tabs selectedIndex={ tabFloorIndex } onSelect={( index ) => {
        setTabFloorIndex( index )
        setSelectedFloorId( floors[index].id || null )
      }}>
        {/* <div className="flex flex-1 flex-col md:flex-initial p-4 md:px-6 md:py-4 md:border-b md:border-b-gray50 sticky md:top-14 z-[999] md:bg-surface">          
          <TabList className="tables-tab md:flex md:flex-wrap md:items-center gap-4 md:gap-3">
            { floors.map(( floor, index ) => (
              <Tab key={ index }>{ floor.name }</Tab>
            ))}
          </TabList>
        </div> */}
        { floors.map(( floor ) => (
          <TabPanel key={ floor.id }>
            <div className="flex flex-1 flex-col p-4 md:p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] md:grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-4 md:gap-6">
                { floor.tables.map(( table ) => (
                  <div
                    key={ table.id }
                    className="flex items-center justify-center aspect-square cursor-pointer"
                    onClick={() => {
                      setSelectedTableId( table.id || '' )
                      setSelectedTableNumber( table.number || '' ) 
                    }}
                  >
                    <div className="relative flex items-center justify-center w-16 h-16 md:h-24 md:w-24">
                      <span className={`relative z-20 text-lg font-bold ${ selectedTableId === table.id ? 'text-gray50' : ' text-gray600'}`}>
                        { table.number }
                      </span>                              
                      <RestaurantTable className={`w-16 h-16 md:w-24 md:h-24 absolute z-10 transition-all ${selectedTableId === table.id ? 'fill-accent' : 'fill-gray100'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}