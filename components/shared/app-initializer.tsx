'use client'
import React, { useEffect, useRef } from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { ClientSetting } from '@/types'

export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      useSettingStore.setState({ setting })
      initialized.current = true
    }
  }, [setting])

  return children
}