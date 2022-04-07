import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB-savqOpdJJO4AUjBCwMiLCB0LCcOrawM",
    authDomain: "scheduler-react-tutorial-56d72.firebaseapp.com",
    databaseURL: "https://scheduler-react-tutorial-56d72-default-rtdb.firebaseio.com",
    projectId: "scheduler-react-tutorial-56d72",
    storageBucket: "scheduler-react-tutorial-56d72.appspot.com",
    messagingSenderId: "901432419631",
    appId: "1:901432419631:web:3e742c2195aac65061edda",
    measurementId: "G-QLT2SDC5EK"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const setData = (path, value) => (
    set(ref(database, path), value)
);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const dbRef = ref(database, path);
        const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        if (devMode) { console.log(`loading ${path}`); }
        return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) { console.log(val); }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
        }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
        });
    }, [path, transform]);

    return [data, loading, error];
};