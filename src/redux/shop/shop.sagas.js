import { takeEvery, call, put } from 'redux-saga/effects';
import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils'
import ShopActionTypes from './shop.types';
import { fetchCollectionsSuccess, fetchCollectionsFailure } from './shop.actions';

export function* fetchCollectionsAsync() {
  yield console.log('inside fetchCollectionsAsync');
  try {
    const collectionRef = firestore.collection('collections');
    const snapshot = yield collectionRef.get(); // instead of promise then , same as async await
    const collectionsMap = yield call(convertCollectionsSnapshotToMap, snapshot); // using yield here in case the method call takes more time , call is a saga effect to execute any method takes function name and arguments
    // put is the saga effect to create an action
    yield put(fetchCollectionsSuccess(collectionsMap))
  }
  catch (e) {
    yield put(fetchCollectionsFailure(e.message))

  }
  //    dispatch(fetchCollectionsStart()); // dont need dispatch

  // collectionRef
  //   .get()
  //   .then(snapshot => {
  //     const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
  //     dispatch(fetchCollectionsSuccess(collectionsMap));
  //   })
  //   .catch(error => dispatch(fetchCollectionsFailure(error.message)));
}

// generator function
export function* fetchCollectionsStart() {
  // pause when the takeEveryListener is executed and call another generator  
  yield takeEvery(ShopActionTypes.FETCH_COLLECTIONS_START, fetchCollectionsAsync);
}
