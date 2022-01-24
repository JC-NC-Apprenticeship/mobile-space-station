import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import base64 from 'base-64';

// Unicode-safe base64 function, thanks to https://www.w3docs.com/snippets/javascript/how-to-encode-and-decode-strings-with-base64-in-javascript.html
function base64EncodeUnicode(str) {
  // Firstly, escape the string using encodeURIComponent to get the UTF-8 encoding of the characters,
  // Secondly, we convert the percent encodings into raw bytes, and add it to btoa() function.
  const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p1) {
    return String.fromCharCode('0x' + p1);
  });

  return base64.encode(utf8Bytes);
}

/**
 * <CachedImage />
 * Component for displaying remote images with aggressive caching.
 * This component will fetch the image once from the remote URL on first display;
 * on subsequent displays the image will always be fetched from the cache.
 *
 * Adapted from https://dev.to/dmitryame/implementing-fast-image-for-react-native-expo-apps-1dn3
 */
export const CachedImage = ({ source = {}, ...props }) => {
  const { uri } = source;
  const cacheKey = base64EncodeUnicode(source.uri);
  const filesystemURI = `${FileSystem.cacheDirectory}${cacheKey}`;

  const [imgURI, setImgURI] = useState(filesystemURI);

  useEffect(() => {
    let ignore = false;

    const loadImage = async ({ fileURI }) => {
      try {
        // Use the cached image if it exists
        const metadata = await FileSystem.getInfoAsync(fileURI);
        if (metadata.exists) {
          return;
        }
        // download to cache
        if (!ignore) {
          setImgURI(null);
        }

        await FileSystem.downloadAsync(uri, fileURI);

        if (!ignore) {
          setImgURI(fileURI);
        }
      } catch (err) {
        if (!ignore) {
          setImgURI(uri);
        }
      }
    };

    loadImage({ fileURI: filesystemURI });

    return () => {
      ignore = true;
    };
  }, [filesystemURI, uri]);

  return (
    <Image
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      source={{
        uri: imgURI,
      }}
    />
  );
};
