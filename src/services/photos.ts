import { Photo } from '../types/Photo'
import { storage } from '../libs/firebase'
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage'
import { v4 as creatID } from 'uuid'


export const PHOTO_GET_ALL = async () => {
  let list: Photo[] = [];

  const imagesFolder = ref( storage, 'images' );
  const photoList = await listAll( imagesFolder );

  for( let i in photoList.items ) {
    let photoUrl = await getDownloadURL( photoList.items[i])

    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    })
  }

  return list;
}

export const PHOTO_POST = async ( file: File ) => {
  if([ 'image/jpg', 'image/jpeg', 'image/png' ].includes( file.type )) {
    let randomName = creatID();
    let newFile = ref( storage, `images/${ randomName }` )
    let upload = await uploadBytes( newFile, file );
    let photoUrl = await getDownloadURL( upload.ref );

    return {
      name: upload.ref.name,
      url: photoUrl
    } as Photo

  } else {
    return new Error('Tipo de arquivo não permitido!')
  }

}
