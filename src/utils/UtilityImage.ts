import { Platform, Alert } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const checkAndRequestPermission = async (permission: any) => {
  const status = await check(permission);
  if (status === RESULTS.GRANTED) return true;
  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const pickImage = async (): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'Select Image Source',
      'Choose where to get the image from',
      [
        // {
        //   text: 'Camera',
        //   onPress: async () => {
        //     try {
        //       const cameraPermission =
        //         Platform.OS === 'ios'
        //           ? PERMISSIONS.IOS.CAMERA
        //           : PERMISSIONS.ANDROID.CAMERA;
        //       const granted = await checkAndRequestPermission(cameraPermission);
        //       if (!granted) {
        //         reject(new Error('Camera permission denied'));
        //         return;
        //       }

        //       const result = await launchCamera({
        //         mediaType: 'photo',
        //         quality: 0.7,
        //         cameraType: 'back',
        //         includeBase64: false,
        //       } as CameraOptions);

        //       if (result.didCancel || result.errorCode) {
        //         reject(new Error('Image picking cancelled or failed'));
        //       } else {
        //         resolve(result.assets?.[0]?.uri);
        //       }
        //     } catch (err) {
        //       reject(err);
        //     }
        //   },
        // },
        {
          text: 'Gallery',
          onPress: async () => {
            try {
              const galleryPermission =
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.PHOTO_LIBRARY
                  : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

              const granted = await checkAndRequestPermission(
                galleryPermission,
              );
              if (!granted) {
                reject(new Error('Gallery permission denied'));
                return;
              }

              const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.7,
                selectionLimit: 1,
                includeBase64: false,
              } as ImageLibraryOptions);

              if (result.didCancel || result.errorCode) {
                reject(new Error('Image picking cancelled or failed'));
              } else {
                resolve(result.assets?.[0]?.uri);
              }
            } catch (err) {
              reject(err);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => reject(new Error('Image selection cancelled')),
        },
      ],
      { cancelable: true },
    );
  });
};
