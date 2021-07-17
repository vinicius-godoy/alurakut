import React from 'react'
import nookies from 'nookies'
// Hook React do NextJS
import { useRouter } from 'next/router'

export default function LogoutSite() {
    return null
}

export async function getServerSideProps(context) {
    nookies.destroy(null, 'USER_TOKEN')

    return {
        redirect: {
            destination: '/login',
            permanent: false
        }
    }
}