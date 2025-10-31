import React, { Fragment } from 'react'
import { Container } from 'react-bootstrap'
import { ReactSVG } from 'react-svg'
import useHostname from '../Provider/HostnameProvider';

const SecTop = ({ title = "Dashboard", subtitle = "Monitor your store's progress to increase your sales.", children }) => {
    const originalUrl = useHostname();
    return (
        <Fragment>
            <section className='py-4'>
                <Container>
                    <div className="flex items-center justify-between ss:flex-nowrap flex-wrap gap-y-3">
                        <div className="ss:w-auto w-full">
                            <h2 className='font-semibold text__32 mb-1'>{title}</h2>
                            <p className='text__16 text-Mtexttextsecondary'>{subtitle}</p>
                        </div>
                        {
                            children
                        }
                    </div>
                </Container>
            </section>
        </Fragment>
    )
}

export default SecTop
