import React from 'react'
import styles from './Photo.module.css'

type Props = {
  name: string,
  url: string,
}

const Photo = ( { name, url }: Props ) => {
  return (
    <div className={ styles.photo }>
      <img src={ url } alt={ name } />
      <p>{ name }</p>
    </div>
  )
}

export default Photo
