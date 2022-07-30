import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import PhotoItem from './components/Photo/Photo'
import { Photo } from './types/Photo'
import { PHOTO_GET_ALL, PHOTO_POST } from './services/photos'

const App = () => {
  const [ isLoading, setIsLoading ] = React.useState( false )
  const [ photos, setPhotos ]       = React.useState<Photo[]>( [] )
  const [ uploading, setUploading ] = React.useState( false )

  React.useEffect(() => {
    const getPhotos = async () => {
      setIsLoading( true );
      const response = await PHOTO_GET_ALL();
      setPhotos( response )
      setIsLoading( false );
    }

    getPhotos();

  }, [])

  const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    const formData = new FormData( event.currentTarget );
    const file = formData.get('image') as File;

    if( file && file.size > 0 ) {
      setUploading( true );
      const response = await PHOTO_POST( file );
      setUploading( false );

      if( response instanceof Error ) {
        alert(`${ response.name } - ${ response.message }`)
      } else {
        const newPhotoList = [ ...photos ]
        newPhotoList.push( response )
        setPhotos( newPhotoList )
      }
    }
  }

  return (
    <>
      <main className='container'>
        <Header />

        { !isLoading && (
          <form onSubmit={ handleSubmit }>
            <label>
              <input type="file" name="image" id="image" />
            </label>
            { uploading ? <button disabled>Enviando...</button> : <button>Enviar</button> }
          </form>
        ) }

        { isLoading && <div className="carregando"></div> }

        { !isLoading && photos.length > 0 && (
          <div className='photos'>
            { photos.map(({ name, url }, idx) => (
              <PhotoItem key={ idx } name={ name } url={ url } />
            )) }
          </div>
        )}

        { !isLoading && photos.length === 0 &&
          <div className='no-photos'>
            <div className="emoji">😞</div>
            <div>
              <h1>Não há fotos para exibir</h1>
              <button onClick={ () => window.location.reload() }>
                Atualizar
                <i className="fas fa-redo"></i>
              </button>
            </div>
          </div>
        }
      </main>
    </>
  );
}

export default App;
