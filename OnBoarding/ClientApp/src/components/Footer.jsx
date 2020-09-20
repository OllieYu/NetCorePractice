import React from 'react';

export const Footer = () => {
    return(
        <div className='container'>
        <hr />
            <p className='col-sm'>
                &copy;{new Date().getFullYear()}-Ollie Yu
            </p>
        </div>
    )
}