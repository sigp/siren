import { useEffect, useState } from 'react'
import { ValAliases } from '../types'
import useLocalStorage from './useLocalStorage'
import { useValidatorAliases } from './useValidatorAliases'

const MIGRATION_KEY = 'aliases-migrated'

export function useAliasMigration() {
  const [isMigrated, setIsMigrated] = useState<boolean | null>(null)
  const { aliases, importAliases, isLoading } = useValidatorAliases()
  const [localAliases] = useLocalStorage<ValAliases>('val-aliases', {})
  const [migrated, setMigrated] = useLocalStorage<boolean>(MIGRATION_KEY, false)

  useEffect(() => {
    const performMigration = async () => {
      if (migrated || isLoading || !localAliases) {
        setIsMigrated(migrated)
        return
      }

      // Check if we have local aliases and no database aliases
      const hasLocalData = Object.keys(localAliases).length > 0
      const hasApiData = aliases && Object.keys(aliases).length > 0

      if (hasLocalData && !hasApiData) {
        try {
          console.log('Migrating validator aliases from localStorage to database...')
          await importAliases(localAliases)

          // Mark as migrated
          setMigrated(true)
          setIsMigrated(true)

          // Optionally clear localStorage data after successful migration
          // setLocalAliases({})

          console.log('Migration completed successfully')
        } catch (error) {
          console.error('Failed to migrate aliases:', error)
          setIsMigrated(false)
        }
      } else {
        // No migration needed
        setMigrated(true)
        setIsMigrated(true)
      }
    }

    performMigration()
  }, [aliases, localAliases, migrated, isLoading, importAliases, setMigrated])

  return {
    isMigrated,
    isLoading: isLoading || isMigrated === null,
  }
}
