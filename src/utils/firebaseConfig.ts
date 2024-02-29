import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAck_HNSlAkOKZ25rFMuaXYemZmfeIumKg",
    authDomain: "spacewars-6a2e1.firebaseapp.com",
    databaseURL: "https://spacewars-6a2e1-default-rtdb.firebaseio.com",
    projectId: "spacewars-6a2e1",
    storageBucket: "spacewars-6a2e1.appspot.com",
    messagingSenderId: "816823497537",
    appId: "1:816823497537:web:f3fc6b2118c5ebbafde7c0"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);
export const puntajesRef = ref(database, 'puntajes2');

export function agregarPuntaje(nombre: string, puntaje: string) {
    push(puntajesRef, {
        nombre: nombre,
        puntaje: puntaje,
    }
    );
}








