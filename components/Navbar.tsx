'use client'

import { useEffect, useState } from 'react'
import { Disclosure} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import logo from '@/assets/logo.png'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useParams } from 'next/navigation'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(false)
  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    setIsDarkMode(prefersDarkMode)
  }, [])

  const params = useParams<{ id: string }>()

  const id: BigInt = BigInt( params?.id as string || "0")
  











  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleColorMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const navigation = [
    { name: 'Home', href:`/${id}`},
    { name: 'About', href: `/${id}/about` },
  ]

  return (
    <div className='bg-gray-300 shadow dark:bg-gray-900'>
      <Disclosure as='nav'>
        {({ open }) => (
          <>
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
              <div className='relative flex h-16 items-center justify-between'>
                <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                  {/* Mobile menu button*/}
                  <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                    <span className='absolute -inset-0.5' />
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
                <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                  <div className='flex flex-shrink-0 items-center'>
                    <Image
                      src={logo}
                      alt='Logo image'
                      onClick={()=>router.push(`/${id}`)}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className='hidden sm:ml-6 sm:block'>
                    <div className='flex space-x-4'>
                      {navigation.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => router.push(item.href)}
                          className={classNames(
                            (item.href === pathname)
                              ? 'bg-gray-900 text-white dark:text-black dark:bg-white'
                              : 'dark:text-gray-300 text-black hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={ (item.href === pathname) ? 'page' : undefined}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'
                  }
                >
                  <button
                    type='button'
                    onClick={toggleColorMode}
                    className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                  >
                    <span className='absolute -inset-1.5' />
                    <span className='sr-only'>Toggle Dark Mode</span>
                    {isDarkMode ? (
                      <SunIcon className='h-6 w-6' />
                    ) : (
                      <MoonIcon className='h-6 w-6' />
                    )}
                  </button>
                </div>

                <div
                  className={classNames(
                 '',
                    'absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'
                  )}
                >
                
                </div>
              </div>
            </div>

            <Disclosure.Panel className='sm:hidden'>
              <div className='space-y-1 px-2 pb-3 pt-2'>
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as='a'
                    onClick={() => router.push(item.href)}
                    className={classNames(
                      (item.href === pathname)
                        ? 'bg-gray-900 text-white dark:text-black dark:bg-white'
                        : 'dark:text-gray-300 text-black hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={ (item.href === pathname) ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
